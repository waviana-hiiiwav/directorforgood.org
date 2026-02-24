import { NextResponse } from 'next/server'
import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { awards, awardRecipients, entities } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    const [award] = await db
      .select()
      .from(awards)
      .where(and(eq(awards.id, parseInt(id)), eq(awards.orgSlug, tenant.orgSlug)))
    
    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }
    
    // Get recipients
    const recipients = await db
      .select({
        entity: entities,
        recipientRole: awardRecipients.recipientRole,
      })
      .from(awardRecipients)
      .innerJoin(entities, eq(awardRecipients.entityId, entities.id))
      .where(eq(awardRecipients.awardId, award.id))
    
    return NextResponse.json({
      ...award,
      recipients: recipients.map(r => ({ ...r.entity, recipientRole: r.recipientRole })),
    })
  } catch (error) {
    console.error('Error fetching award:', error)
    return NextResponse.json({ error: 'Failed to fetch award' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    const body = await req.json()
    
    const [award] = await db.update(awards)
      .set({
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
        updatedAt: new Date(),
      })
      .where(and(eq(awards.id, parseInt(id)), eq(awards.orgSlug, tenant.orgSlug)))
      .returning()
    
    if (!award) {
      return NextResponse.json({ error: 'Award not found' }, { status: 404 })
    }
    
    // Update recipients if provided
    if (body.recipientIds) {
      // Remove existing recipients
      await db.delete(awardRecipients).where(eq(awardRecipients.awardId, award.id))
      
      // Add new recipients
      if (body.recipientIds.length > 0) {
        const recipientValues = body.recipientIds.map((entityId: number, index: number) => ({
          awardId: award.id,
          entityId,
          recipientRole: index === 0 ? 'primary' : 'collaborator',
        }))
        
        await db.insert(awardRecipients).values(recipientValues)
      }
    }
    
    return NextResponse.json(award)
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDbForRequest(req)
    const tenant = getTenantFromRequest(req)
    const { id } = await params
    // Recipients will be cascade deleted due to FK constraint
    await db.delete(awards).where(and(eq(awards.id, parseInt(id)), eq(awards.orgSlug, tenant.orgSlug)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting award:', error)
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 })
  }
}

