'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DirectorHealth, GoalProgress, TaskBoard, MetricChart } from '@/components/admin/directors'

interface Goal {
  id: number
  title: string
  description?: string | null
  targetValue: number
  currentValue: number
  unit: string
  period: string
  status: string
}

interface Task {
  id: number
  title: string
  description?: string | null
  priority: string | null
  status: string | null
  blockedReason?: string | null
}

interface TaskStats {
  pending: number
  in_progress: number
  blocked: number
  completed: number
}

interface MetricPoint {
  value: number
  recordedAt: string
}

interface Director {
  id: number
  slug: string
  name: string
  mission: string
  color: string
  icon: string
  goals: Goal[]
  tasks: Task[]
  taskStats: TaskStats
  health: 'green' | 'yellow' | 'red'
}

const colorClasses: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'green' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'blue' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'orange' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'purple' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'amber' },
}

const iconMap: Record<string, string> = {
  DollarSign: '$',
  Heart: '♥',
  Settings: '⚙',
  MessageSquare: '💬',
  Crown: '👑',
}

export default function DirectorDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [director, setDirector] = useState<Director | null>(null)
  const [metrics, setMetrics] = useState<Record<string, MetricPoint[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDirector = useCallback(async () => {
    try {
      const res = await fetch(`/api/directors/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch director')
      const data = await res.json()
      setDirector(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`/api/directors/${slug}/metrics`)
      if (res.ok) {
        const data = await res.json()
        setMetrics(data)
      }
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    }
  }, [slug])

  useEffect(() => {
    fetchDirector()
    fetchMetrics()
  }, [fetchDirector, fetchMetrics])

  const handleUpdateGoal = async (id: number, currentValue: number, status: string) => {
    try {
      const res = await fetch(`/api/directors/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentValue, status }),
      })
      if (res.ok) {
        fetchDirector()
      }
    } catch (err) {
      console.error('Failed to update goal:', err)
    }
  }

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/directors/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchDirector()
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  const handleCreateTask = async (task: { title: string; description?: string; priority: string }) => {
    try {
      const res = await fetch(`/api/directors/${slug}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (res.ok) {
        fetchDirector()
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !director) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error || 'Director not found'}</p>
        <Link href="/admin/directors" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Directors
        </Link>
      </div>
    )
  }

  const colors = colorClasses[director.color] || colorClasses.blue

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/directors" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Directors
        </Link>
        <div className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className={`text-4xl ${colors.text}`}>{iconMap[director.icon] || '📋'}</span>
              <div>
                <h1 className={`text-2xl font-bold ${colors.text}`}>{director.name}</h1>
                <p className="text-muted-foreground mt-1">{director.mission}</p>
              </div>
            </div>
            <DirectorHealth health={director.health} size="lg" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
              <div className="text-xl font-bold">{director.goals.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
              <div className="text-xl font-bold">{director.taskStats.in_progress}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Blocked</div>
              <div className={`text-xl font-bold ${director.taskStats.blocked > 0 ? 'text-red-600' : ''}`}>
                {director.taskStats.blocked}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-xl font-bold text-green-600">{director.taskStats.completed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Goals & OKRs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {director.goals.map((goal) => (
            <GoalProgress
              key={goal.id}
              id={goal.id}
              title={goal.title}
              current={goal.currentValue}
              target={goal.targetValue}
              unit={goal.unit}
              status={goal.status}
              editable
              onUpdate={handleUpdateGoal}
            />
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      {Object.keys(metrics).length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([key, data]) => (
              <MetricChart
                key={key}
                title={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                data={data}
                color={colors.accent}
                unit={key.includes('dollar') || key.includes('pipeline') ? 'dollars' : key.includes('pct') || key.includes('rate') ? 'percent' : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <TaskBoard
        tasks={director.tasks}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}





