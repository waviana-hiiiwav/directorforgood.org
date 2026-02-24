import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directors, directorGoals, directorTasks } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /api/directors/[slug] - Get single director with full details
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

    // Get all goals
    const goals = await db.query.directorGoals.findMany({
      where: eq(directorGoals.directorId, director.id),
    })

    // Get all tasks
    const tasks = await db.query.directorTasks.findMany({
      where: eq(directorTasks.directorId, director.id),
      orderBy: (t, { desc, asc }) => [
        asc(t.status),
        desc(sql`CASE WHEN ${t.priority} = 'high' THEN 1 WHEN ${t.priority} = 'medium' THEN 2 ELSE 3 END`),
        desc(t.createdAt),
      ],
    })

    // Get task counts by status
    const taskCounts = await db
      .select({
        status: directorTasks.status,
        count: sql<number>`count(*)::int`,
      })
      .from(directorTasks)
      .where(eq(directorTasks.directorId, director.id))
      .groupBy(directorTasks.status)

    const taskStats = {
      pending: 0,
      in_progress: 0,
      blocked: 0,
      completed: 0,
    }
    taskCounts.forEach((tc) => {
      if (tc.status && tc.status in taskStats) {
        taskStats[tc.status as keyof typeof taskStats] = tc.count
      }
    })

    // Calculate health
    const goalStatuses = goals.map((g) => g.status)
    let health: 'green' | 'yellow' | 'red' = 'green'
    if (goalStatuses.includes('behind')) {
      health = 'red'
    } else if (goalStatuses.includes('at_risk')) {
      health = 'yellow'
    }

    return NextResponse.json({
      ...director,
      goals,
      tasks,
      taskStats,
      health,
    })
  } catch (error) {
    console.error('Error fetching director:', error)
    return NextResponse.json({ error: 'Failed to fetch director' }, { status: 500 })
  }
}





