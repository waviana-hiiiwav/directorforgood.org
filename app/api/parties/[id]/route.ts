import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { parties, partyRoles } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    
    const [party] = await db.select().from(parties).where(eq(parties.id, parseInt(id)))
    
    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }
    
    // Include roles for this org context
    const roles = await db
      .select()
      .from(partyRoles)
      .where(
        and(
          eq(partyRoles.partyId, party.id),
          eq(partyRoles.orgContextSlug, tenant.orgSlug)
        )
      )
    
    return NextResponse.json({ ...party, roles })
  } catch (error) {
    console.error('Error fetching party:', error)
    return NextResponse.json({ error: 'Failed to fetch party' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const { id } = await params
    const body = await req.json()
    
    const [party] = await db.update(parties)
      .set({
        displayName: body.displayName,
        legalName: body.legalName ?? undefined,
        slug: body.slug ?? undefined,
        bio: body.bio ?? undefined,
        shortBio: body.shortBio ?? undefined,
        image: body.image ?? undefined,
        website: body.website ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        socialLinks: body.socialLinks ?? undefined,
        pronouns: body.pronouns ?? undefined,
        ein: body.ein ?? undefined,
        metadata: body.metadata ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(parties.id, parseInt(id)))
      .returning()
    
    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }
    
    return NextResponse.json(party)
  } catch (error) {
    console.error('Error updating party:', error)
    return NextResponse.json({ error: 'Failed to update party' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const { id } = await params
    
    // Roles will be cascade deleted due to FK constraint
    await db.delete(parties).where(eq(parties.id, parseInt(id)))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting party:', error)
    return NextResponse.json({ error: 'Failed to delete party' }, { status: 500 })
  }
}


