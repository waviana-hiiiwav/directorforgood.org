import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directorGoals } from '@/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/directors/goals/[id] - Update a goal
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goalId = parseInt(id)
    const body = await request.json()

    if (isNaN(goalId)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 })
    }

    const existing = await db.query.directorGoals.findFirst({
      where: eq(directorGoals.id, goalId),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const [updated] = await db
      .update(directorGoals)
      .set({
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        targetValue: body.targetValue ?? existing.targetValue,
        currentValue: body.currentValue ?? existing.currentValue,
        unit: body.unit ?? existing.unit,
        period: body.period ?? existing.period,
        status: body.status ?? existing.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
        updatedAt: new Date(),
      })
      .where(eq(directorGoals.id, goalId))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}

// DELETE /api/directors/goals/[id] - Delete a goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const goalId = parseInt(id)

    if (isNaN(goalId)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 })
    }

    await db.delete(directorGoals).where(eq(directorGoals.id, goalId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 })
  }
}





