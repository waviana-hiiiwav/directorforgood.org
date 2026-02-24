import { NextResponse } from 'next/server'
import { db } from '@/db'
import { proposalItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params
    const body = await req.json()
    
    const [item] = await db.update(proposalItems)
      .set({
        category: body.category,
        title: body.title,
        description: body.description,
        hours: body.hours,
        rate: body.rate,
        included: body.included,
        requiresCollaboration: body.requiresCollaboration,
        sortOrder: body.sortOrder,
        internalNotes: body.internalNotes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(proposalItems.id, parseInt(itemId)),
          eq(proposalItems.proposalId, parseInt(id))
        )
      )
      .returning()
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating proposal item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id, itemId } = await params
    
    await db.delete(proposalItems)
      .where(
        and(
          eq(proposalItems.id, parseInt(itemId)),
          eq(proposalItems.proposalId, parseInt(id))
        )
      )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting proposal item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}



