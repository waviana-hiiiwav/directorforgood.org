import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { stopTimeEntry } from '@/lib/time-server'

// PATCH /api/time-entries/:id — stop (clock out); computes durationSeconds
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const entry = await stopTimeEntry(
      parseInt(id, 10),
      {
        endedAt: body.endedAt ? new Date(body.endedAt) : undefined,
        description: body.description,
      },
      authed.orgSlug,
    )
    return NextResponse.json({ timeEntry: entry })
  } catch (error) {
    console.error('Error stopping time entry:', error)
    const status = error instanceof Error && error.message === 'Time entry not found' ? 404 : 500
    return NextResponse.json({ error: 'Failed to stop time entry' }, { status })
  }
}
