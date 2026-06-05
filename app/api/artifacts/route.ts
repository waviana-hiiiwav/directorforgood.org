import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createArtifact } from '@/lib/conversations-server'

// POST /api/artifacts — create a new artifact (version 1)
export async function POST(req: Request) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const body = await req.json()
    if (!body.kind || !body.title || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'kind, title, and content are required' }, { status: 400 })
    }
    const artifact = await createArtifact(
      {
        conversationId: body.conversationId,
        partyId: body.partyId,
        kind: body.kind,
        title: body.title,
        content: body.content,
        changeSummary: body.changeSummary,
        createdByMessageId: body.createdByMessageId,
      },
      authed.orgSlug,
    )
    return NextResponse.json({ artifact })
  } catch (error) {
    console.error('Error creating artifact:', error)
    return NextResponse.json({ error: 'Failed to create artifact' }, { status: 500 })
  }
}
