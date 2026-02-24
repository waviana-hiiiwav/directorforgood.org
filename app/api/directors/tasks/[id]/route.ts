import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directorTasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/directors/tasks/[id] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const taskId = parseInt(id)
    const body = await request.json()

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const existing = await db.query.directorTasks.findFirst({
      where: eq(directorTasks.id, taskId),
    })

    if (!existing) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Handle completion timestamp
    let completedAt = existing.completedAt
    if (body.status === 'completed' && existing.status !== 'completed') {
      completedAt = new Date()
    } else if (body.status && body.status !== 'completed') {
      completedAt = null
    }

    const [updated] = await db
      .update(directorTasks)
      .set({
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        priority: body.priority ?? existing.priority,
        status: body.status ?? existing.status,
        blockedReason: body.blockedReason ?? existing.blockedReason,
        dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
        completedAt,
        updatedAt: new Date(),
      })
      .where(eq(directorTasks.id, taskId))
      .returning()

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/directors/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    await db.delete(directorTasks).where(eq(directorTasks.id, taskId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}





