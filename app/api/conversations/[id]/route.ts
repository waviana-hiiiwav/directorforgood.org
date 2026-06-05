import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getConversation } from '@/lib/conversations-server'

// GET /api/conversations/:id — full conversation with messages + artifacts (current versions)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const conversation = await getConversation(parseInt(id, 10), authed.orgSlug)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}
