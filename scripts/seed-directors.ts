import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '../db'
import { directors, directorGoals, directorTasks, directorMetrics } from '../db/schema'

const DIRECTORS_DATA = [
  {
    slug: 'finance',
    name: 'Finance Director',
    mission: 'Keep runway above 6 months and books clean and current.',
    color: 'green',
    icon: 'DollarSign',
    order: 1,
  },
  {
    slug: 'development',
    name: 'Development Director',
    mission: 'Grow the major gifts pipeline and maintain donor relationships.',
    color: 'blue',
    icon: 'Heart',
    order: 2,
  },
  {
    slug: 'ops',
    name: 'Ops Director',
    mission: 'Run recurring operations flawlessly and maintain compliance.',
    color: 'orange',
    icon: 'Settings',
    order: 3,
  },
  {
    slug: 'comms',
    name: 'Comms Director',
    mission: 'Keep stakeholders informed and engaged with compelling narratives.',
    color: 'purple',
    icon: 'MessageSquare',
    order: 4,
  },
  {
    slug: 'executive',
    name: 'Executive Director',
    mission: 'Protect founder time, coordinate directors, and drive strategy.',
    color: 'amber',
    icon: 'Crown',
    order: 5,
  },
]

const GOALS_DATA: Record<string, Array<{
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  period: string
  status: string
}>> = {
  finance: [
    {
      title: 'Runway Months',
      description: 'Maintain at least 6 months of operating runway',
      targetValue: 6,
      currentValue: 8,
      unit: 'months',
      period: 'quarterly',
      status: 'on_track',
    },
    {
      title: 'Days to Close Books',
      description: 'Close monthly books within 10 days',
      targetValue: 10,
      currentValue: 7,
      unit: 'days',
      period: 'monthly',
      status: 'on_track',
    },
    {
      title: 'Transactions Categorized',
      description: 'Ensure 95% of transactions are properly categorized',
      targetValue: 95,
      currentValue: 88,
      unit: 'percent',
      period: 'monthly',
      status: 'at_risk',
    },
  ],
  development: [
    {
      title: 'Donor Renewal Rate',
      description: 'Retain 80% of major donors year over year',
      targetValue: 80,
      currentValue: 72,
      unit: 'percent',
      period: 'annual',
      status: 'at_risk',
    },
    {
      title: 'Pipeline Value',
      description: 'Maintain $500k in qualified pipeline',
      targetValue: 500000,
      currentValue: 385000,
      unit: 'dollars',
      period: 'quarterly',
      status: 'at_risk',
    },
    {
      title: 'Monthly Donor Touches',
      description: 'Make 50 meaningful donor touches per month',
      targetValue: 50,
      currentValue: 42,
      unit: 'count',
      period: 'monthly',
      status: 'on_track',
    },
  ],
  ops: [
    {
      title: 'Tasks Completed',
      description: 'Complete 90% of planned tasks on time',
      targetValue: 90,
      currentValue: 85,
      unit: 'percent',
      period: 'weekly',
      status: 'on_track',
    },
    {
      title: 'Compliance Rate',
      description: 'Maintain 100% compliance with regulatory deadlines',
      targetValue: 100,
      currentValue: 100,
      unit: 'percent',
      period: 'quarterly',
      status: 'on_track',
    },
    {
      title: 'Deadlines Met',
      description: 'Hit all critical operational deadlines',
      targetValue: 100,
      currentValue: 95,
      unit: 'percent',
      period: 'monthly',
      status: 'on_track',
    },
  ],
  comms: [
    {
      title: 'Content Published',
      description: 'Publish 8 pieces of content per month',
      targetValue: 8,
      currentValue: 6,
      unit: 'count',
      period: 'monthly',
      status: 'at_risk',
    },
    {
      title: 'Board Deck Ready',
      description: 'Have board deck ready 5 days before meeting',
      targetValue: 5,
      currentValue: 5,
      unit: 'days',
      period: 'quarterly',
      status: 'on_track',
    },
    {
      title: 'Social Engagement Rate',
      description: 'Maintain 4% engagement rate on social posts',
      targetValue: 4,
      currentValue: 3,
      unit: 'percent',
      period: 'monthly',
      status: 'at_risk',
    },
  ],
  executive: [
    {
      title: 'Time on Fundraising',
      description: 'Founder spends 40% of time on fundraising',
      targetValue: 40,
      currentValue: 32,
      unit: 'percent',
      period: 'weekly',
      status: 'behind',
    },
    {
      title: 'Decisions Logged',
      description: 'Document 100% of strategic decisions',
      targetValue: 100,
      currentValue: 78,
      unit: 'percent',
      period: 'monthly',
      status: 'at_risk',
    },
    {
      title: 'Blocked Items Resolved',
      description: 'Resolve blocked items within 48 hours',
      targetValue: 48,
      currentValue: 36,
      unit: 'hours',
      period: 'weekly',
      status: 'on_track',
    },
  ],
}

const TASKS_DATA: Record<string, Array<{
  title: string
  description: string
  priority: string
  status: string
  blockedReason?: string
}>> = {
  finance: [
    { title: 'Reconcile Q4 bank statements', description: 'Match all transactions with accounting records', priority: 'high', status: 'in_progress' },
    { title: 'Categorize November expenses', description: 'Review and categorize all uncategorized transactions', priority: 'high', status: 'pending' },
    { title: 'Update cash flow forecast', description: 'Project next 6 months based on current commitments', priority: 'medium', status: 'pending' },
    { title: 'Prepare budget variance report', description: 'Compare actuals to budget for board review', priority: 'medium', status: 'completed' },
    { title: 'Review vendor contracts', description: 'Check for renewal dates and renegotiation opportunities', priority: 'low', status: 'pending' },
  ],
  development: [
    { title: 'Draft year-end appeal letter', description: 'Create compelling case for year-end giving', priority: 'high', status: 'in_progress' },
    { title: 'Update donor CRM records', description: 'Ensure all recent touches are logged', priority: 'high', status: 'blocked', blockedReason: 'Waiting for meeting notes from founder' },
    { title: 'Schedule Q1 major donor meetings', description: 'Book meetings with top 10 prospects', priority: 'high', status: 'pending' },
    { title: 'Research new foundation prospects', description: 'Identify 5 new aligned foundations', priority: 'medium', status: 'completed' },
    { title: 'Create donor impact report', description: 'Compile stories and metrics for top donors', priority: 'medium', status: 'pending' },
  ],
  ops: [
    { title: 'File Q4 state compliance reports', description: 'Submit required state filings before deadline', priority: 'high', status: 'in_progress' },
    { title: 'Update employee handbook', description: 'Review and refresh policies for new year', priority: 'medium', status: 'pending' },
    { title: 'Audit software subscriptions', description: 'Review all active subscriptions for ROI', priority: 'low', status: 'pending' },
    { title: 'Schedule annual insurance review', description: 'Book meeting with broker for policy review', priority: 'medium', status: 'completed' },
    { title: 'Update disaster recovery plan', description: 'Review and test backup procedures', priority: 'low', status: 'blocked', blockedReason: 'Need IT consultant availability' },
  ],
  comms: [
    { title: 'Draft Q4 board presentation', description: 'Create compelling narrative for board meeting', priority: 'high', status: 'in_progress' },
    { title: 'Write December newsletter', description: 'Highlight year-end achievements and outlook', priority: 'high', status: 'pending' },
    { title: 'Update website impact metrics', description: 'Refresh homepage with latest numbers', priority: 'medium', status: 'completed' },
    { title: 'Create social media calendar', description: 'Plan January content calendar', priority: 'medium', status: 'pending' },
    { title: 'Compile annual report content', description: 'Gather stories, photos, and data for annual report', priority: 'high', status: 'blocked', blockedReason: 'Waiting for final financials from Finance' },
  ],
  executive: [
    { title: 'Review director weekly reports', description: 'Analyze progress across all directors', priority: 'high', status: 'in_progress' },
    { title: 'Prepare board meeting agenda', description: 'Set priorities for upcoming board discussion', priority: 'high', status: 'completed' },
    { title: 'Conduct strategy alignment check', description: 'Ensure all directors are aligned with Q1 priorities', priority: 'medium', status: 'pending' },
    { title: 'Unblock comms annual report', description: 'Prioritize financials completion to unblock comms', priority: 'high', status: 'pending' },
    { title: 'Draft Q1 OKRs', description: 'Set measurable goals for next quarter', priority: 'medium', status: 'pending' },
  ],
}

// Generate sample metrics for the last 12 weeks
function generateMetrics(directorId: number, metricKeys: string[]) {
  const metrics: Array<{
    directorId: number
    metricKey: string
    value: number
    recordedAt: Date
  }> = []
  
  const now = new Date()
  
  for (const key of metricKeys) {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - (i * 7)) // Weekly data points
      
      // Generate realistic trending data
      let baseValue: number
      let variance: number
      
      switch (key) {
        case 'runway_months':
          baseValue = 6 + Math.sin(i / 3) * 2
          variance = 0.5
          break
        case 'pipeline_value':
          baseValue = 350000 + (i * 5000) + Math.random() * 20000
          variance = 10000
          break
        case 'donor_touches':
          baseValue = 35 + (i * 1)
          variance = 5
          break
        case 'tasks_completed':
          baseValue = 80 + (i * 0.5)
          variance = 5
          break
        case 'content_published':
          baseValue = 5 + Math.floor(i / 3)
          variance = 1
          break
        default:
          baseValue = 50 + (i * 2)
          variance = 10
      }
      
      metrics.push({
        directorId,
        metricKey: key,
        value: Math.round(baseValue + (Math.random() - 0.5) * variance * 2),
        recordedAt: date,
      })
    }
  }
  
  return metrics
}

const METRIC_KEYS: Record<string, string[]> = {
  finance: ['runway_months', 'days_to_close', 'pct_categorized'],
  development: ['donor_renewals', 'pipeline_value', 'donor_touches'],
  ops: ['tasks_completed', 'compliance_rate', 'deadlines_met'],
  comms: ['content_published', 'engagement_rate', 'board_deck_status'],
  executive: ['time_on_fundraising', 'decisions_logged', 'blocked_items'],
}

async function seedDirectors() {
  console.log('Seeding directors...\n')

  const createdDirectors: Record<string, number> = {}

  // Seed directors
  for (const director of DIRECTORS_DATA) {
    try {
      const [created] = await db.insert(directors).values(director).returning()
      createdDirectors[director.slug] = created.id
      console.log(`✓ Created director: ${created.name} (ID: ${created.id})`)
    } catch (error: any) {
      if (error.code === '23505') {
        // Get existing director ID
        const existing = await db.query.directors.findFirst({
          where: (d, { eq }) => eq(d.slug, director.slug),
        })
        if (existing) {
          createdDirectors[director.slug] = existing.id
          console.log(`- Skipped ${director.name} (already exists, ID: ${existing.id})`)
        }
      } else {
        throw error
      }
    }
  }

  console.log('\nSeeding goals...\n')

  // Seed goals for each director
  for (const [slug, goals] of Object.entries(GOALS_DATA)) {
    const directorId = createdDirectors[slug]
    if (!directorId) continue

    for (const goal of goals) {
      try {
        const [created] = await db.insert(directorGoals).values({
          directorId,
          ...goal,
        }).returning()
        console.log(`  ✓ Goal: ${created.title} for ${slug}`)
      } catch (error: any) {
        if (error.code === '23505') {
          console.log(`  - Skipped goal: ${goal.title} (already exists)`)
        } else {
          throw error
        }
      }
    }
  }

  console.log('\nSeeding tasks...\n')

  // Seed tasks for each director
  for (const [slug, tasks] of Object.entries(TASKS_DATA)) {
    const directorId = createdDirectors[slug]
    if (!directorId) continue

    for (const task of tasks) {
      try {
        const [created] = await db.insert(directorTasks).values({
          directorId,
          ...task,
          completedAt: task.status === 'completed' ? new Date() : null,
        }).returning()
        console.log(`  ✓ Task: ${created.title} for ${slug}`)
      } catch (error: any) {
        if (error.code === '23505') {
          console.log(`  - Skipped task: ${task.title} (already exists)`)
        } else {
          throw error
        }
      }
    }
  }

  console.log('\nSeeding metrics...\n')

  // Seed metrics for each director
  for (const [slug, metricKeys] of Object.entries(METRIC_KEYS)) {
    const directorId = createdDirectors[slug]
    if (!directorId) continue

    const metrics = generateMetrics(directorId, metricKeys)
    
    for (const metric of metrics) {
      try {
        await db.insert(directorMetrics).values(metric)
      } catch (error: any) {
        // Ignore duplicate errors for metrics
        if (error.code !== '23505') {
          throw error
        }
      }
    }
    console.log(`  ✓ Added ${metrics.length} metrics for ${slug}`)
  }

  console.log('\n✓ Done seeding directors!')
  process.exit(0)
}

seedDirectors().catch((err) => {
  console.error('Error seeding directors:', err)
  process.exit(1)
})





