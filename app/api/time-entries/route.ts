import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { listTimeEntries, startTimeEntry } from '@/lib/time-server'

// GET /api/time-entries — list entries (optionally ?userId= &status= &limit=)
export async function GET(req: Request) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') || undefined
    const userIdParam = url.searchParams.get('userId')
    const limitParam = url.searchParams.get('limit')
    const entries = await listTimeEntries(authed.orgSlug, {
      userId: userIdParam
        ? parseInt(userIdParam, 10)
        : authed.caller === 'session'
          ? authed.userId
          : undefined,
      status,
      limit: limitParam ? parseInt(limitParam, 10) : undefined,
    })
    return NextResponse.json({ timeEntries: entries })
  } catch (error) {
    console.error('Error listing time entries:', error)
    return NextResponse.json({ error: 'Failed to list time entries' }, { status: 500 })
  }
}

// POST /api/time-entries — start (clock in)
export async function POST(req: Request) {
  const authed = await requireApiAuth(req)
  if (authed instanceof Response) return authed
  try {
    const body = await req.json()
    const userId = body.userId ?? authed.userId
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }
    const entry = await startTimeEntry(
      {
        userId,
        partyId: body.partyId,
        projectTag: body.projectTag,
        description: body.description,
        rateCents: body.rateCents,
        startedAt: body.startedAt ? new Date(body.startedAt) : undefined,
      },
      authed.orgSlug,
    )
    return NextResponse.json({ timeEntry: entry })
  } catch (error) {
    console.error('Error starting time entry:', error)
    return NextResponse.json({ error: 'Failed to start time entry' }, { status: 500 })
  }
}
