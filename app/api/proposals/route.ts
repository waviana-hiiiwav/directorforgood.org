import { NextResponse } from 'next/server'
import { db } from '@/db'
import { proposals, proposalItems } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allProposals = await db
      .select()
      .from(proposals)
      .orderBy(desc(proposals.updatedAt))
    
    // Get items for each proposal to calculate totals
    const proposalsWithTotals = await Promise.all(
      allProposals.map(async (proposal) => {
        const items = await db
          .select()
          .from(proposalItems)
          .where(eq(proposalItems.proposalId, proposal.id))
        
        const includedItems = items.filter(item => item.included)
        const totalHours = includedItems.reduce((sum, item) => sum + (item.hours || 0), 0)
        const totalCost = includedItems.reduce((sum, item) => sum + ((item.hours || 0) * (item.rate || 0)), 0)
        
        return {
          ...proposal,
          totalHours,
          totalCost,
          itemCount: items.length,
          includedItemCount: includedItems.length,
        }
      })
    )
    
    return NextResponse.json(proposalsWithTotals)
  } catch (error) {
    console.error('Error fetching proposals:', error)
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Generate slug from title if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const [proposal] = await db.insert(proposals).values({
      slug,
      title: body.title,
      client: body.client,
      status: body.status || 'draft',
      tier: body.tier || 'primary',
      executiveSummary: body.executiveSummary || null,
      brandingIncluded: body.brandingIncluded || false,
      teamReadinessNotes: body.teamReadinessNotes || null,
      internalNotes: body.internalNotes || null,
      targetProfit: body.targetProfit || null,
      createdBy: body.createdBy || null,
    }).returning()
    
    // Add items if provided
    if (body.items && body.items.length > 0) {
      const itemValues = body.items.map((item: Record<string, unknown>, index: number) => ({
        proposalId: proposal.id,
        category: item.category || 'core',
        title: item.title,
        description: item.description || null,
        hours: item.hours || 0,
        rate: item.rate || 0,
        included: item.included !== false,
        requiresCollaboration: item.requiresCollaboration || null,
        sortOrder: item.sortOrder ?? index,
        internalNotes: item.internalNotes || null,
      }))
      
      await db.insert(proposalItems).values(itemValues)
    }
    
    return NextResponse.json(proposal)
  } catch (error) {
    console.error('Error creating proposal:', error)
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}



