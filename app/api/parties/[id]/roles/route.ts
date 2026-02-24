import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { partyRoles } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    
    const roles = await db
      .select()
      .from(partyRoles)
      .where(
        and(
          eq(partyRoles.partyId, parseInt(id)),
          eq(partyRoles.orgContextSlug, tenant.orgSlug)
        )
      )
    
    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching party roles:', error)
    return NextResponse.json({ error: 'Failed to fetch party roles' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    const body = await req.json()
    
    const [role] = await db.insert(partyRoles).values({
      partyId: parseInt(id),
      orgContextSlug: tenant.orgSlug,
      roleType: body.roleType,
      roleTitle: body.roleTitle || null,
      startAt: body.startAt ? new Date(body.startAt) : null,
      endAt: body.endAt ? new Date(body.endAt) : null,
      metadata: body.metadata || null,
    }).returning()
    
    return NextResponse.json(role)
  } catch (error) {
    console.error('Error creating party role:', error)
    return NextResponse.json({ error: 'Failed to create party role' }, { status: 500 })
  }
}


