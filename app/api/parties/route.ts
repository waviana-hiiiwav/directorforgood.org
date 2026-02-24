import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { parties, partyRoles } from '@/db/schema'
import { desc, eq, and, or, isNull, gte, lte } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { searchParams } = new URL(req.url)
    
    const roleType = searchParams.get('roleType')
    const partyType = searchParams.get('partyType') // 'person' | 'organization'
    const activeOnly = searchParams.get('activeOnly') !== 'false' // Default true
    
    let query = db.select().from(parties)
    
    // If filtering by role, join with partyRoles
    if (roleType) {
      const now = new Date()
      query = db
        .select({
          party: parties,
        })
        .from(parties)
        .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
        .where(
          and(
            eq(partyRoles.orgContextSlug, tenant.orgSlug),
            eq(partyRoles.roleType, roleType),
            activeOnly 
              ? or(
                  isNull(partyRoles.endAt),
                  gte(partyRoles.endAt, now)
                )
              : undefined
          )
        )
        .groupBy(parties.id)
    } else {
      // When not filtering by role, we still need to filter by org context
      // Only return parties that have at least one role in this org
      query = db
        .select({
          party: parties,
        })
        .from(parties)
        .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
        .where(
          and(
            eq(partyRoles.orgContextSlug, tenant.orgSlug),
            partyType ? eq(parties.partyType, partyType) : undefined
          )
        )
        .groupBy(parties.id)
    }
    
    const result = await query.orderBy(desc(parties.createdAt))
    
    // If we joined with roles, extract the party objects
    const allParties = result.map((r: any) => r.party || r)
    
    // Optionally include roles for each party
    const includeRoles = searchParams.get('includeRoles') === 'true'
    if (includeRoles) {
      const partiesWithRoles = await Promise.all(
        allParties.map(async (party) => {
          const roles = await db
            .select()
            .from(partyRoles)
            .where(
              and(
                eq(partyRoles.partyId, party.id),
                eq(partyRoles.orgContextSlug, tenant.orgSlug)
              )
            )
          return { ...party, roles }
        })
      )
      return NextResponse.json(partiesWithRoles)
    }
    
    return NextResponse.json(allParties)
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const body = await req.json()
    
    const [party] = await db.insert(parties).values({
      partyType: body.partyType, // 'person' | 'organization'
      displayName: body.displayName,
      legalName: body.legalName || null,
      slug: body.slug || null,
      bio: body.bio || null,
      shortBio: body.shortBio || null,
      image: body.image || null,
      website: body.website || null,
      email: body.email || null,
      phone: body.phone || null,
      socialLinks: body.socialLinks || null,
      pronouns: body.pronouns || null,
      ein: body.ein || null,
      metadata: body.metadata || null,
    }).returning()
    
    // If roles are provided, create them
    if (body.roles && Array.isArray(body.roles)) {
      const roleValues = body.roles.map((role: any) => ({
        partyId: party.id,
        orgContextSlug: tenant.orgSlug,
        roleType: role.roleType,
        roleTitle: role.roleTitle || null,
        startAt: role.startAt ? new Date(role.startAt) : null,
        endAt: role.endAt ? new Date(role.endAt) : null,
        metadata: role.metadata || null,
      }))
      
      await db.insert(partyRoles).values(roleValues)
    }
    
    return NextResponse.json(party)
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 })
  }
}


