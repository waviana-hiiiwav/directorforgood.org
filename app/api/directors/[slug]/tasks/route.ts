import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directors, directorTasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/directors/[slug]/tasks - Get tasks for a director
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const director = await db.query.directors.findFirst({
      where: eq(directors.slug, slug),
    })

    if (!director) {
      return NextResponse.json({ error: 'Director not found' }, { status: 404 })
    }

    const tasks = await db.query.directorTasks.findMany({
      where: eq(directorTasks.directorId, director.id),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/directors/[slug]/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const director = await db.query.directors.findFirst({
      where: eq(directors.slug, slug),
    })

    if (!director) {
      return NextResponse.json({ error: 'Director not found' }, { status: 404 })
    }

    const [task] = await db
      .insert(directorTasks)
      .values({
        directorId: director.id,
        title: body.title,
        description: body.description,
        priority: body.priority ?? 'medium',
        status: body.status ?? 'pending',
        blockedReason: body.blockedReason,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      })
      .returning()

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}





