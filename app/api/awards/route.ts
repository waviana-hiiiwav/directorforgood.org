import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { awards, awardRecipients, entities } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const db = getDbForRequest(req)
    const { searchParams } = new URL(req.url)
    const entityId = searchParams.get('entityId')
    
    if (entityId) {
      // Get awards for a specific entity
      const entityAwards = await db
        .select({
          award: awards,
          recipientRole: awardRecipients.recipientRole,
        })
        .from(awards)
        .innerJoin(awardRecipients, eq(awards.id, awardRecipients.awardId))
        .where(eq(awardRecipients.entityId, parseInt(entityId)))
        .orderBy(desc(awards.year), desc(awards.awardDate))
      
      return NextResponse.json(entityAwards.map(r => ({ ...r.award, recipientRole: r.recipientRole })))
    }
    
    // Get all awards with their recipients
    const allAwards = await db.select().from(awards).orderBy(desc(awards.year), desc(awards.awardDate))
    
    // Get recipients for each award
    const awardsWithRecipients = await Promise.all(
      allAwards.map(async (award) => {
        const recipients = await db
          .select({
            entity: entities,
            recipientRole: awardRecipients.recipientRole,
          })
          .from(awardRecipients)
          .innerJoin(entities, eq(awardRecipients.entityId, entities.id))
          .where(eq(awardRecipients.awardId, award.id))
        
        return {
          ...award,
          recipients: recipients.map(r => ({ ...r.entity, recipientRole: r.recipientRole })),
        }
      })
    )
    
    return NextResponse.json(awardsWithRecipients)
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const body = await req.json()
    
    // Create the award
    const [award] = await db.insert(awards).values({
      orgSlug: tenant.orgSlug,
      slug: body.slug,
      name: body.name,
      awardingEntity: body.awardingEntity || 'Unknown',
      awardDate: body.awardDate || null,
      year: body.year || null,
      category: body.category || null,
      status: body.status || 'won',
      prizeAmount: body.prizeAmount || null,
      prizeDescription: body.prizeDescription || null,
      description: body.description || null,
      notableFacts: body.notableFacts || null,
      awardingOrgUrl: body.awardingOrgUrl || null,
      awardPageUrl: body.awardPageUrl || null,
      pressUrl: body.pressUrl || null,
      image: body.image || null,
    }).returning()
    
    // Link recipients if provided
    if (body.recipientIds && body.recipientIds.length > 0) {
      const recipientValues = body.recipientIds.map((entityId: number, index: number) => ({
        awardId: award.id,
        entityId,
        recipientRole: index === 0 ? 'primary' : 'collaborator',
      }))
      
      await db.insert(awardRecipients).values(recipientValues)
    }
    
    return NextResponse.json(award)
  } catch (error) {
    console.error('Error creating award:', error)
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 })
  }
}

