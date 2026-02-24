'use client'

import { useEffect, useState } from 'react'
import { DirectorCard } from '@/components/admin/directors'

interface Goal {
  id: number
  title: string
  targetValue: number
  currentValue: number
  unit: string
  status: string
}

interface TaskStats {
  pending: number
  in_progress: number
  blocked: number
  completed: number
}

interface Director {
  id: number
  slug: string
  name: string
  mission: string
  color: string
  icon: string
  goals: Goal[]
  taskStats: TaskStats
  health: 'green' | 'yellow' | 'red'
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDirectors() {
      try {
        const res = await fetch('/api/directors')
        const data = await res.json()
        
        if (!res.ok) {
          // If API returns error object, use its message
          throw new Error(data.error || data.details || 'Failed to fetch directors')
        }
        
        // Handle both array and error object responses
        if (Array.isArray(data)) {
          setDirectors(data)
        } else if (data.error) {
          throw new Error(data.error)
        } else {
          setDirectors([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDirectors()
  }, [])

  // Calculate overall stats
  const totalTasks = directors.reduce(
    (sum, d) => sum + d.taskStats.pending + d.taskStats.in_progress + d.taskStats.blocked + d.taskStats.completed,
    0
  )
  const blockedTasks = directors.reduce((sum, d) => sum + d.taskStats.blocked, 0)
  const atRiskDirectors = directors.filter((d) => d.health === 'yellow' || d.health === 'red').length

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Directors</h2>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Make sure to run the database migration and seed script first.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Directors</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your virtual leadership team
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Directors</div>
          <div className="text-2xl font-bold">{directors.length}</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Tasks</div>
          <div className="text-2xl font-bold">{totalTasks}</div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Blocked Items</div>
          <div className={`text-2xl font-bold ${blockedTasks > 0 ? 'text-red-600' : ''}`}>
            {blockedTasks}
          </div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Directors At Risk</div>
          <div className={`text-2xl font-bold ${atRiskDirectors > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
            {atRiskDirectors}
          </div>
        </div>
      </div>

      {/* Director Cards Grid */}
      {directors.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Directors Found</h2>
          <p className="text-muted-foreground mb-4">
            Run the seed script to populate the directors:
          </p>
          <code className="bg-black text-green-400 px-4 py-2 rounded font-mono text-sm block">
            npm run seed:directors
          </code>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directors.map((director) => (
            <DirectorCard
              key={director.id}
              slug={director.slug}
              name={director.name}
              mission={director.mission}
              color={director.color}
              icon={director.icon}
              goals={director.goals}
              taskStats={director.taskStats}
              health={director.health}
            />
          ))}
        </div>
      )}

      {/* Quick Legend */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Health Status Legend</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">On Track - All goals progressing well</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">At Risk - Some goals need attention</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Behind - Goals significantly off track</span>
          </div>
        </div>
      </div>
    </div>
  )
}





