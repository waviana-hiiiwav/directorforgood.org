import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getArtifact } from '@/lib/conversations-server'

// GET /api/artifacts/:id — artifact with full version history + current version
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const artifact = await getArtifact(parseInt(id, 10), authed.orgSlug)
    if (!artifact) {
      return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
    }
    return NextResponse.json({ artifact })
  } catch (error) {
    console.error('Error fetching artifact:', error)
    return NextResponse.json({ error: 'Failed to fetch artifact' }, { status: 500 })
  }
}
