import { NextResponse } from 'next/server'
import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, parseInt(id)))
    
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }
    
    // Get items
    const items = await db
      .select()
      .from(proposalItems)
      .where(eq(proposalItems.proposalId, proposal.id))
      .orderBy(asc(proposalItems.sortOrder))
    
    // Calculate totals
    const includedItems = items.filter(item => item.included)
    const totalHours = includedItems.reduce((sum, item) => sum + (item.hours || 0), 0)
    const totalCost = includedItems.reduce((sum, item) => sum + ((item.hours || 0) * (item.rate || 0)), 0)
    
    return NextResponse.json({
      ...proposal,
      items,
      totalHours,
      totalCost,
    })
  } catch (error) {
    console.error('Error fetching proposal:', error)
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const [proposal] = await db.update(proposals)
      .set({
        title: body.title,
        client: body.client,
        status: body.status,
        tier: body.tier,
        executiveSummary: body.executiveSummary,
        brandingIncluded: body.brandingIncluded,
        teamReadinessNotes: body.teamReadinessNotes,
        internalNotes: body.internalNotes,
        targetProfit: body.targetProfit,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, parseInt(id)))
      .returning()
    
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }
    
    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error updating proposal:', error)
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Items will be cascade deleted due to FK constraint
    await db.delete(proposals).where(eq(proposals.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting proposal:', error)
    return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 })
  }
}



