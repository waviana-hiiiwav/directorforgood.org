import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { updateArtifact } from '@/lib/conversations-server'

// POST /api/artifacts/:id/versions — append a new version (the edit) and make it current
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const body = await req.json()
    if (typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }
    const version = await updateArtifact(
      parseInt(id, 10),
      {
        content: body.content,
        changeSummary: body.changeSummary,
        createdByMessageId: body.createdByMessageId,
      },
      authed.orgSlug,
    )
    return NextResponse.json({ version })
  } catch (error) {
    console.error('Error updating artifact:', error)
    const status = error instanceof Error && error.message === 'Artifact not found' ? 404 : 500
    return NextResponse.json({ error: 'Failed to update artifact' }, { status })
  }
}
