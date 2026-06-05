import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { restoreArtifactVersion } from '@/lib/conversations-server'

// POST /api/artifacts/:id/restore — restore an older version as a new current version
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const body = await req.json()
    if (!body.versionId) {
      return NextResponse.json({ error: 'versionId is required' }, { status: 400 })
    }
    const version = await restoreArtifactVersion(parseInt(id, 10), Number(body.versionId), authed.orgSlug)
    return NextResponse.json({ version })
  } catch (error) {
    console.error('Error restoring artifact version:', error)
    const status = error instanceof Error && /not found/.test(error.message) ? 404 : 500
    return NextResponse.json({ error: 'Failed to restore artifact version' }, { status })
  }
}
