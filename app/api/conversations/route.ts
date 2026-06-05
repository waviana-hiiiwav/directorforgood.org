import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createConversation, listConversations } from '@/lib/conversations-server'

// GET /api/conversations — list conversations for the tenant (team-wide, shared)
export async function GET(req: Request) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const url = new URL(req.url)
    const limit = url.searchParams.get('limit')
    const conversations = await listConversations(authed.orgSlug, {
      limit: limit ? parseInt(limit, 10) : undefined,
    })
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error listing conversations:', error)
    return NextResponse.json({ error: 'Failed to list conversations' }, { status: 500 })
  }
}

// POST /api/conversations — create a new conversation
export async function POST(req: Request) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const body = await req.json()
    const conversation = await createConversation(
      {
        userId: body.userId ?? authed.userId,
        partyId: body.partyId,
        title: body.title,
        source: body.source,
        metadata: body.metadata,
      },
      authed.orgSlug,
    )
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
