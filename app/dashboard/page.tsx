'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Demo data for when database isn't seeded
const DEMO_DIRECTORS = [
  {
    id: 1,
    slug: 'finance',
    name: 'Finance Director',
    mission: 'Keep runway above 6 months and books clean and current.',
    color: 'green',
    icon: 'DollarSign',
    health: 'green' as const,
    goals: [
      { id: 1, title: 'Runway Months', targetValue: 6, currentValue: 8, unit: 'months', status: 'on_track' },
      { id: 2, title: 'Days to Close Books', targetValue: 10, currentValue: 7, unit: 'days', status: 'on_track' },
      { id: 3, title: 'Transactions Categorized', targetValue: 95, currentValue: 88, unit: 'percent', status: 'at_risk' },
    ],
    taskStats: { pending: 2, in_progress: 1, blocked: 0, completed: 2 },
  },
  {
    id: 2,
    slug: 'development',
    name: 'Development Director',
    mission: 'Grow the major gifts pipeline and maintain donor relationships.',
    color: 'blue',
    icon: 'Heart',
    health: 'yellow' as const,
    goals: [
      { id: 4, title: 'Donor Renewal Rate', targetValue: 80, currentValue: 72, unit: 'percent', status: 'at_risk' },
      { id: 5, title: 'Pipeline Value', targetValue: 500000, currentValue: 385000, unit: 'dollars', status: 'at_risk' },
      { id: 6, title: 'Monthly Donor Touches', targetValue: 50, currentValue: 42, unit: 'count', status: 'on_track' },
    ],
    taskStats: { pending: 2, in_progress: 1, blocked: 1, completed: 1 },
  },
  {
    id: 3,
    slug: 'ops',
    name: 'Ops Director',
    mission: 'Run recurring operations flawlessly and maintain compliance.',
    color: 'orange',
    icon: 'Settings',
    health: 'green' as const,
    goals: [
      { id: 7, title: 'Tasks Completed', targetValue: 90, currentValue: 85, unit: 'percent', status: 'on_track' },
      { id: 8, title: 'Compliance Rate', targetValue: 100, currentValue: 100, unit: 'percent', status: 'on_track' },
      { id: 9, title: 'Deadlines Met', targetValue: 100, currentValue: 95, unit: 'percent', status: 'on_track' },
    ],
    taskStats: { pending: 2, in_progress: 1, blocked: 1, completed: 1 },
  },
  {
    id: 4,
    slug: 'comms',
    name: 'Comms Director',
    mission: 'Keep stakeholders informed and engaged with compelling narratives.',
    color: 'purple',
    icon: 'MessageSquare',
    health: 'yellow' as const,
    goals: [
      { id: 10, title: 'Content Published', targetValue: 8, currentValue: 6, unit: 'count', status: 'at_risk' },
      { id: 11, title: 'Board Deck Ready', targetValue: 5, currentValue: 5, unit: 'days', status: 'on_track' },
      { id: 12, title: 'Social Engagement Rate', targetValue: 4, currentValue: 3, unit: 'percent', status: 'at_risk' },
    ],
    taskStats: { pending: 2, in_progress: 1, blocked: 1, completed: 1 },
  },
  {
    id: 5,
    slug: 'executive',
    name: 'Executive Director',
    mission: 'Protect founder time, coordinate directors, and drive strategy.',
    color: 'amber',
    icon: 'Crown',
    health: 'yellow' as const,
    goals: [
      { id: 13, title: 'Time on Fundraising', targetValue: 40, currentValue: 32, unit: 'percent', status: 'behind' },
      { id: 14, title: 'Decisions Logged', targetValue: 100, currentValue: 78, unit: 'percent', status: 'at_risk' },
      { id: 15, title: 'Blocked Items Resolved', targetValue: 48, currentValue: 36, unit: 'hours', status: 'on_track' },
    ],
    taskStats: { pending: 3, in_progress: 1, blocked: 0, completed: 1 },
  },
  {
    id: 6,
    slug: 'program',
    name: 'Program Director',
    mission: 'Deliver program outcomes and ensure grant compliance.',
    color: 'teal',
    icon: 'Target',
    health: 'green' as const,
    goals: [
      { id: 16, title: 'Participants Served', targetValue: 500, currentValue: 485, unit: 'count', status: 'on_track' },
      { id: 17, title: 'Grant Deliverables', targetValue: 100, currentValue: 92, unit: 'percent', status: 'on_track' },
      { id: 18, title: 'Program Budget Utilized', targetValue: 85, currentValue: 78, unit: 'percent', status: 'on_track' },
    ],
    taskStats: { pending: 1, in_progress: 2, blocked: 0, completed: 3 },
  },
]

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

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  green: { bg: 'bg-green-950/50', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
  blue: { bg: 'bg-blue-950/50', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  orange: { bg: 'bg-orange-950/50', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  purple: { bg: 'bg-purple-950/50', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  amber: { bg: 'bg-amber-950/50', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
  teal: { bg: 'bg-teal-950/50', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
}

const iconMap: Record<string, string> = {
  DollarSign: '💰',
  Heart: '❤️',
  Settings: '⚙️',
  MessageSquare: '💬',
  Crown: '👑',
  Target: '🎯',
}

const healthConfig = {
  green: { label: 'On Track', color: 'bg-green-500', textColor: 'text-green-400' },
  yellow: { label: 'At Risk', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  red: { label: 'Behind', color: 'bg-red-500', textColor: 'text-red-400' },
}

function formatValue(value: number, unit: string): string {
  if (unit === 'dollars') return `$${(value / 1000).toFixed(0)}k`
  if (unit === 'percent') return `${value}%`
  if (unit === 'months') return `${value} mo`
  if (unit === 'days') return `${value}d`
  if (unit === 'hours') return `${value}h`
  return value.toString()
}

function ProgressBar({ current, target, status }: { current: number; target: number; status: string }) {
  const percentage = Math.min(100, Math.round((current / target) * 100))
  const barColor = status === 'on_track' ? 'bg-green-500' : status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
  
  return (
    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
    </div>
  )
}

function DirectorCard({ director }: { director: Director }) {
  const colors = colorClasses[director.color] || colorClasses.blue
  const health = healthConfig[director.health]
  const totalTasks = director.taskStats.pending + director.taskStats.in_progress + director.taskStats.blocked + director.taskStats.completed

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 hover:shadow-lg hover:${colors.glow} transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{iconMap[director.icon] || '📋'}</span>
          <div>
            <h3 className={`font-bold text-lg ${colors.text}`}>{director.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${health.color} animate-pulse`} />
              <span className={`text-xs font-medium ${health.textColor}`}>{health.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission */}
      <p className="text-sm text-gray-400 mb-5 line-clamp-2">{director.mission}</p>

      {/* Goals */}
      <div className="space-y-3 mb-5">
        {director.goals.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{goal.title}</span>
              <span className={`font-medium ${goal.status === 'on_track' ? 'text-green-400' : goal.status === 'at_risk' ? 'text-yellow-400' : 'text-red-400'}`}>
                {formatValue(goal.currentValue, goal.unit)} / {formatValue(goal.targetValue, goal.unit)}
              </span>
            </div>
            <ProgressBar current={goal.currentValue} target={goal.targetValue} status={goal.status} />
          </div>
        ))}
      </div>

      {/* Task Stats */}
      <div className="pt-4 border-t border-gray-700/50">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500">Tasks</span>
          <span className="text-gray-400">{totalTasks} total</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {director.taskStats.in_progress > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {director.taskStats.in_progress} active
            </span>
          )}
          {director.taskStats.blocked > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
              {director.taskStats.blocked} blocked
            </span>
          )}
          {director.taskStats.pending > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
              {director.taskStats.pending} pending
            </span>
          )}
          {director.taskStats.completed > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              {director.taskStats.completed} done
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardDemoPage() {
  const [directors, setDirectors] = useState<Director[]>(DEMO_DIRECTORS)
  const [loading, setLoading] = useState(true)
  const [usingLiveData, setUsingLiveData] = useState(false)

  useEffect(() => {
    async function fetchDirectors() {
      try {
        const res = await fetch('/api/directors')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setDirectors(data)
            setUsingLiveData(true)
          }
        }
      } catch (err) {
        // Use demo data on error
        console.log('Using demo data')
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
  const activeTasks = directors.reduce((sum, d) => sum + d.taskStats.in_progress, 0)
  const completedTasks = directors.reduce((sum, d) => sum + d.taskStats.completed, 0)
  const onTrackDirectors = directors.filter((d) => d.health === 'green').length
  const atRiskDirectors = directors.filter((d) => d.health === 'yellow').length
  const behindDirectors = directors.filter((d) => d.health === 'red').length

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-gray-900 via-black to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <div className="relative z-10 container px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">
                {usingLiveData ? 'Live Data' : 'Demo Mode'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI Director Dashboard
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              See how Director&apos;s six AI agents work together to run your nonprofit&apos;s back office
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-12">
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">Directors</div>
              <div className="text-2xl font-bold">{directors.length}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">On Track</div>
              <div className="text-2xl font-bold text-green-400">{onTrackDirectors}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">At Risk</div>
              <div className="text-2xl font-bold text-yellow-400">{atRiskDirectors}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">Active Tasks</div>
              <div className="text-2xl font-bold text-blue-400">{activeTasks}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">Blocked</div>
              <div className={`text-2xl font-bold ${blockedTasks > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {blockedTasks}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Directors Grid */}
      <section className="py-12 bg-black">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Your AI Leadership Team</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-gray-900/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {directors.map((director) => (
                  <DirectorCard key={director.id} director={director} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-900/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How Director Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-semibold mb-2">Continuous Loop</h3>
                <p className="text-sm text-gray-400">
                  Each Director runs an Observe → Compare → Act → Report cycle, never stopping until goals are met.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Real-time Metrics</h3>
                <p className="text-sm text-gray-400">
                  Track KPIs across finance, development, ops, comms, program, and executive functions with live dashboards.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Human-in-the-Loop</h3>
                <p className="text-sm text-gray-400">
                  Directors flag blockers and questions. You make decisions; they handle execution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your AI Leadership Team?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Let Director handle the back office so you can focus on what matters most.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:bosko@directorforgood.org"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Started
            </a>
            <Link
              href="/#solution"
              className="inline-flex items-center px-8 py-4 border border-white/20 font-semibold rounded-lg hover:bg-white/5 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}





