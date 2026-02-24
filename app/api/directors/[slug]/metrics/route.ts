import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { directors, directorMetrics } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// GET /api/directors/[slug]/metrics - Get metrics time-series for a director
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const metricKey = searchParams.get('metric')
    const limit = parseInt(searchParams.get('limit') ?? '12')

    const director = await db.query.directors.findFirst({
      where: eq(directors.slug, slug),
    })

    if (!director) {
      return NextResponse.json({ error: 'Director not found' }, { status: 404 })
    }

    let query = db.query.directorMetrics.findMany({
      where: eq(directorMetrics.directorId, director.id),
      orderBy: [desc(directorMetrics.recordedAt)],
      limit: limit * 5, // Get more to allow grouping by metric
    })

    const metrics = await query

    // Group by metric key
    const grouped: Record<string, typeof metrics> = {}
    for (const m of metrics) {
      if (metricKey && m.metricKey !== metricKey) continue
      if (!grouped[m.metricKey]) {
        grouped[m.metricKey] = []
      }
      if (grouped[m.metricKey].length < limit) {
        grouped[m.metricKey].push(m)
      }
    }

    // Reverse to get chronological order
    for (const key of Object.keys(grouped)) {
      grouped[key] = grouped[key].reverse()
    }

    return NextResponse.json(grouped)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}





