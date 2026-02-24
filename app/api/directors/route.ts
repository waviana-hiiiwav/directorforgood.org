import { NextResponse } from 'next/server'
import { db } from '@/db'
import { directors, directorGoals, directorTasks } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /api/directors - List all directors with stats
export async function GET() {
  try {
    const allDirectors = await db.query.directors.findMany({
      orderBy: (d, { asc }) => [asc(d.order)],
    })

    // Return empty array if no directors (instead of erroring)
    if (allDirectors.length === 0) {
      return NextResponse.json([])
    }

    // Get stats for each director
    const directorsWithStats = await Promise.all(
      allDirectors.map(async (director) => {
        // Get goals
        const goals = await db.query.directorGoals.findMany({
          where: eq(directorGoals.directorId, director.id),
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

        // Calculate health based on goals
        const goalStatuses = goals.map((g) => g.status)
        let health: 'green' | 'yellow' | 'red' = 'green'
        if (goalStatuses.includes('behind')) {
          health = 'red'
        } else if (goalStatuses.includes('at_risk')) {
          health = 'yellow'
        }

        return {
          ...director,
          goals: goals.slice(0, 3), // Top 3 goals
          taskStats,
          health,
        }
      })
    )

    return NextResponse.json(directorsWithStats)
  } catch (error: any) {
    console.error('Error fetching directors:', error)
    
    // Check if it's a table doesn't exist error
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database tables not found. Please run: npm run db:push && npx tsx scripts/seed-directors.ts' 
        }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch directors',
        details: error?.message || 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}





