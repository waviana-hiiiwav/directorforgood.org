import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directors, directorGoals } from '@/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/directors/[slug]/goals - Get goals for a director
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

    const goals = await db.query.directorGoals.findMany({
      where: eq(directorGoals.directorId, director.id),
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
  }
}

// POST /api/directors/[slug]/goals - Create a new goal
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

    const [goal] = await db
      .insert(directorGoals)
      .values({
        directorId: director.id,
        title: body.title,
        description: body.description,
        targetValue: body.targetValue,
        currentValue: body.currentValue ?? 0,
        unit: body.unit,
        period: body.period ?? 'quarterly',
        status: body.status ?? 'on_track',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      })
      .returning()

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}





