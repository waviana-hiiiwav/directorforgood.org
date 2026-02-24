import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { entities } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const allEntities = await db
      .select()
      .from(entities)
      .where(eq(entities.orgSlug, tenant.orgSlug))
      .orderBy(desc(entities.createdAt))
    return NextResponse.json(allEntities)
  } catch (error) {
    console.error('Error fetching entities:', error)
    return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const body = await req.json()
    
    const [entity] = await db.insert(entities).values({
      orgSlug: tenant.orgSlug,
      slug: body.slug,
      name: body.name,
      type: body.type,
      bio: body.bio || null,
      shortBio: body.shortBio || null,
      image: body.image || null,
      website: body.website || null,
      socialLinks: body.socialLinks || null,
      genre: body.genre || null,
      role: body.role || null,
      active: body.active ?? true,
    }).returning()
    
    return NextResponse.json(entity)
  } catch (error) {
    console.error('Error creating entity:', error)
    return NextResponse.json({ error: 'Failed to create entity' }, { status: 500 })
  }
}

