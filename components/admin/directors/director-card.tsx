'use client'

import Link from 'next/link'
import { DirectorHealth } from './director-health'
import { GoalProgress } from './goal-progress'

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

interface DirectorCardProps {
  slug: string
  name: string
  mission: string
  color: string
  icon: string
  goals: Goal[]
  taskStats: TaskStats
  health: 'green' | 'yellow' | 'red'
}

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
}

const iconMap: Record<string, string> = {
  DollarSign: '$',
  Heart: '♥',
  Settings: '⚙',
  MessageSquare: '💬',
  Crown: '👑',
}

export function DirectorCard({
  slug,
  name,
  mission,
  color,
  icon,
  goals,
  taskStats,
  health,
}: DirectorCardProps) {
  const colors = colorClasses[color] || colorClasses.blue
  const totalTasks = taskStats.pending + taskStats.in_progress + taskStats.blocked + taskStats.completed

  return (
    <Link href={`/admin/directors/${slug}`}>
      <div
        className={`rounded-lg border-2 ${colors.border} ${colors.bg} p-5 hover:shadow-lg transition-shadow cursor-pointer h-full`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${colors.text}`}>{iconMap[icon] || '📋'}</span>
            <div>
              <h3 className={`font-semibold ${colors.text}`}>{name}</h3>
              <DirectorHealth health={health} size="sm" />
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mission}</p>

        {/* Goals Preview */}
        <div className="space-y-3 mb-4">
          {goals.map((goal) => (
            <GoalProgress
              key={goal.id}
              title={goal.title}
              current={goal.currentValue}
              target={goal.targetValue}
              unit={goal.unit}
              status={goal.status}
              compact
            />
          ))}
        </div>

        {/* Task Summary */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tasks</span>
            <span className="font-medium">{totalTasks} total</span>
          </div>
          <div className="flex gap-2 mt-2">
            {taskStats.in_progress > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {taskStats.in_progress} active
              </span>
            )}
            {taskStats.blocked > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {taskStats.blocked} blocked
              </span>
            )}
            {taskStats.pending > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {taskStats.pending} pending
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}





