import { NextResponse } from 'next/server'
import { db } from '@/db'
import { proposalItems } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const items = await db
      .select()
      .from(proposalItems)
      .where(eq(proposalItems.proposalId, parseInt(id)))
      .orderBy(asc(proposalItems.sortOrder))
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching proposal items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    // Get current max sortOrder
    const existingItems = await db
      .select()
      .from(proposalItems)
      .where(eq(proposalItems.proposalId, parseInt(id)))
    const maxSortOrder = existingItems.reduce((max, item) => Math.max(max, item.sortOrder || 0), -1)
    
    const [item] = await db.insert(proposalItems).values({
      proposalId: parseInt(id),
      category: body.category || 'core',
      title: body.title,
      description: body.description || null,
      hours: body.hours || 0,
      rate: body.rate || 0,
      included: body.included !== false,
      requiresCollaboration: body.requiresCollaboration || null,
      sortOrder: body.sortOrder ?? (maxSortOrder + 1),
      internalNotes: body.internalNotes || null,
    }).returning()
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating proposal item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

// Bulk update items (for reordering, batch include/exclude)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    if (body.items && Array.isArray(body.items)) {
      // Bulk update
      await Promise.all(
        body.items.map(async (item: { id: number; [key: string]: unknown }) => {
          await db.update(proposalItems)
            .set({
              category: item.category as string | undefined,
              title: item.title as string | undefined,
              description: item.description as string | undefined,
              hours: item.hours as number | undefined,
              rate: item.rate as number | undefined,
              included: item.included as boolean | undefined,
              requiresCollaboration: item.requiresCollaboration as string | undefined,
              sortOrder: item.sortOrder as number | undefined,
              internalNotes: item.internalNotes as string | undefined,
              updatedAt: new Date(),
            })
            .where(eq(proposalItems.id, item.id))
        })
      )
    }
    
    // Return updated items
    const items = await db
      .select()
      .from(proposalItems)
      .where(eq(proposalItems.proposalId, parseInt(id)))
      .orderBy(asc(proposalItems.sortOrder))
    
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error updating proposal items:', error)
    return NextResponse.json({ error: 'Failed to update items' }, { status: 500 })
  }
}



