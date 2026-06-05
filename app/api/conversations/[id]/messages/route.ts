import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { appendMessage } from '@/lib/conversations-server'

// POST /api/conversations/:id/messages — append a message to the thread
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const body = await req.json()
    if (!body.role || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'role and content are required' }, { status: 400 })
    }
    const message = await appendMessage(
      parseInt(id, 10),
      { role: body.role, content: body.content, metadata: body.metadata },
      authed.orgSlug,
    )
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error appending message:', error)
    const status = error instanceof Error && error.message === 'Conversation not found' ? 404 : 500
    return NextResponse.json({ error: 'Failed to append message' }, { status })
  }
}
