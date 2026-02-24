import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { eventParticipants, parties } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const roleFilter = searchParams.get('role') // Filter by eventRole
    
    const whereCondition = roleFilter
      ? and(eq(eventParticipants.eventId, parseInt(id)), eq(eventParticipants.eventRole, roleFilter))
      : eq(eventParticipants.eventId, parseInt(id))
    
    const result = await db
      .select({
        participant: eventParticipants,
        party: parties,
      })
      .from(eventParticipants)
      .innerJoin(parties, eq(eventParticipants.partyId, parties.id))
      .where(whereCondition)
    
    return NextResponse.json(result.map(r => ({
      ...r.participant,
      party: r.party,
    })))
  } catch (error) {
    console.error('Error fetching event participants:', error)
    return NextResponse.json({ error: 'Failed to fetch event participants' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const { id } = await params
    const body = await req.json()
    
    const [participant] = await db.insert(eventParticipants).values({
      eventId: parseInt(id),
      partyId: body.partyId,
      eventRole: body.eventRole, // 'host', 'venue', 'performer', 'vendor', etc.
      metadata: body.metadata || null,
    }).returning()
    
    return NextResponse.json(participant)
  } catch (error) {
    console.error('Error creating event participant:', error)
    return NextResponse.json({ error: 'Failed to create event participant' }, { status: 500 })
  }
}


