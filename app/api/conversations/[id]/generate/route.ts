import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createArtifact, getArtifact, getConversation, updateArtifact } from '@/lib/conversations-server'

const SUPPORTED_KINDS = new Set(['summary', 'action_items'])

type ConversationWithDetails = NonNullable<Awaited<ReturnType<typeof getConversation>>>
type ConversationMessage = ConversationWithDetails['messages'][number]
type ConversationArtifact = ConversationWithDetails['artifacts'][number]

// POST /api/conversations/:id/generate — generate or iterate a saved artifact from the message stream.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed

  try {
    const { id } = await params
    const conversationId = parseInt(id, 10)
    if (Number.isNaN(conversationId)) {
      return NextResponse.json({ error: 'Invalid conversation id' }, { status: 400 })
    }

    const body = await req.json()
    const kind = typeof body.kind === 'string' ? body.kind : ''
    if (!SUPPORTED_KINDS.has(kind)) {
      return NextResponse.json({ error: 'kind must be summary or action_items' }, { status: 400 })
    }

    const conversation = await getConversation(conversationId, authed.orgSlug)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const sourceMessages = conversation.messages
      .filter((message: ConversationMessage) => message.role !== 'system' && message.content.trim().length > 0)
      .map((message: ConversationMessage) => `${message.role}: ${message.content.trim()}`)
      .join('\n\n')

    if (!sourceMessages.trim()) {
      return NextResponse.json({ error: 'Conversation has no messages to generate from' }, { status: 400 })
    }

    const prompt = artifactPrompt(kind, sourceMessages)
    const { text } = await generateText({
      model: openai(process.env.OPENAI_ARTIFACT_MODEL || 'gpt-4o'),
      system:
        'You are Director for Good, a practical nonprofit development assistant. Write concise, useful markdown. Do not invent facts that are not in the conversation.',
      prompt,
      temperature: 0.2,
    })

    const content = text.trim()
    if (!content) {
      return NextResponse.json({ error: 'Generation returned empty content' }, { status: 502 })
    }

    const existing = conversation.artifacts.find((artifact: ConversationArtifact) => artifact.kind === kind)
    if (existing) {
      const version = await updateArtifact(
        existing.id,
        {
          content,
          changeSummary: `${artifactTitle(kind)} regenerated from conversation`,
          createdByMessageId: lastUserMessageId(conversation.messages),
        },
        authed.orgSlug,
      )
      const artifact = await getArtifact(existing.id, authed.orgSlug)
      return NextResponse.json({ artifact, version })
    }

    const artifact = await createArtifact(
      {
        conversationId,
        partyId: conversation.partyId ?? undefined,
        kind,
        title: artifactTitle(kind),
        content,
        changeSummary: `${artifactTitle(kind)} generated from conversation`,
        createdByMessageId: lastUserMessageId(conversation.messages),
      },
      authed.orgSlug,
    )
    return NextResponse.json({ artifact, version: artifact.currentVersion })
  } catch (error) {
    console.error('Error generating conversation artifact:', error)
    return NextResponse.json({ error: 'Failed to generate artifact' }, { status: 500 })
  }
}

function artifactPrompt(kind: string, sourceMessages: string) {
  if (kind === 'action_items') {
    return `Extract action items from this conversation.

Return markdown with:
- A "# Action Items" heading.
- Bullets that start with an action verb.
- Owner, due date, and context when the conversation provides them.
- No filler bullets.

Conversation:

${sourceMessages}`
  }

  return `Summarize this conversation for a nonprofit development director.

Return markdown with:
- A "# Summary" heading.
- A short executive summary.
- "## Key Points" bullets.
- "## Follow-Up" bullets when next steps are present.
- No invented details.

Conversation:

${sourceMessages}`
}

function artifactTitle(kind: string) {
  return kind === 'action_items' ? 'Action items' : 'Summary'
}

function lastUserMessageId(messages: { id: number; role: string }[]) {
  return [...messages].reverse().find((message) => message.role === 'user')?.id
}
