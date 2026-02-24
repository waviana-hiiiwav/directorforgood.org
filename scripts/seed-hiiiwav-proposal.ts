import { config } from 'dotenv'
import { resolve } from 'path'

// 1. Load config synchronously first
config({ path: resolve(process.cwd(), '.env.local') })

async function seed() {
  console.log('Seeding HiiiWAV proposal...')

  // 2. Use dynamic import to ensure DB is loaded AFTER config
  const { db } = await import('../db')
  const { proposals, proposalItems } = await import('../db/schema')

  const HIIIWAV_PROPOSAL = {
    slug: 'app-pitch-coaching-2025',
    title: 'A.P.P. Finalist Pitch Coaching, Demo Day Production & Media Capture',
    client: 'Cofounders',
    status: 'draft',
    tier: 'primary', // $25,000
    brandingIncluded: true,
    executiveSummary: `HiiiWAV will serve as an official presenting partner for the A.P.P. Finalist Pitch Coaching and Demo Day preparation, delivering a focused, high-impact program designed to elevate already-strong teams into polished, stage-ready performers.

This engagement is built around the belief that Demo Day success is driven less by slides and more by clarity of story, confidence of delivery, demo execution, and stage presence. HiiiWAV's role is to take finalist teams that are already operating at a high level and build on that foundation—tightening narrative, sharpening performance, and ensuring seamless execution on stage.`,
    teamReadinessNotes: `The readiness of the finalist teams is critical. This program is designed for teams that:
• Already have a compelling product or company story
• Have existing pitch decks (not starting from zero)
• Are capable of executing feedback quickly

HiiiWAV's work assumes strong baseline teams and focuses on amplification, refinement, and performance excellence.`,
    internalNotes: 'First major accelerator partnership. Key test case for proposal tool.',
  }

  // Rates in cents
  const RATES = {
    lead: 15000,     // $150/hr - Maya/Bosko lead coaching
    production: 12500, // $125/hr - Production/PM
    support: 10000,   // $100/hr - Support/coordination
  }

  const ITEMS = [
    // Core Services
    {
      category: 'core',
      title: 'Project Management & Producer Coordination',
      description: 'Weekly planning calls, scheduling mentorship, filming and rehearsal windows, partner coordination.',
      hours: 24,
      rate: RATES.production,
      included: true,
    },
    {
      category: 'core',
      title: 'Curriculum & Materials Development',
      description: 'Create workshop materials, pitch blueprint templates, slide templates, mentor brief, and participant pre-work packet.',
      hours: 15,
      rate: RATES.production,
      included: true,
    },
    {
      category: 'core',
      title: 'Workshop-based Pitch & Performance Coaching',
      description: 'Structured workshop series: narrative clarity, stage presence, demo flow, pacing, transitions, and audience engagement. Group instruction with targeted feedback.',
      hours: 60,
      rate: RATES.lead,
      included: true,
    },
    {
      category: 'core',
      title: 'Pitch Blueprint & 30-Second Opener (per team)',
      description: '1-page Pitch Blueprint outlining story beats, timing, and call-to-action. Scripted 30-second opening designed for memorized, high-impact delivery.',
      hours: 12,
      rate: RATES.lead,
      included: true,
    },
    {
      category: 'core',
      title: 'Light Pitch Deck Editing & Refinement',
      description: 'Tighten structure and flow, improve clarity and emphasis, ensure alignment between spoken pitch, slides, and demo. Not ground-up deck creation.',
      hours: 18,
      rate: RATES.support,
      included: true,
    },
    {
      category: 'core',
      title: 'Demo Readiness & Rehearsal Support',
      description: 'Demo choreography coaching, contingency planning for technical issues, full recorded run-throughs, final polish sessions.',
      hours: 20,
      rate: RATES.lead,
      included: true,
    },
    {
      category: 'core',
      title: 'Demo Day Stage & Production Integration',
      description: 'Run-of-show and cue coordination, stage timing, transitions, tech alignment, on-site Demo Day support.',
      hours: 36,
      rate: RATES.production,
      included: true,
    },
    {
      category: 'core',
      title: 'Post-Event Deliverables & Sponsor Reporting',
      description: 'Deliver highlight clips, attendee/press notes, assist with sponsor deliverables.',
      hours: 8,
      rate: RATES.support,
      included: true,
    },

    // Optional Services
    {
      category: 'optional',
      title: 'Video Capture & Before/After Documentation',
      description: 'Recording early and late-stage pitch performances to create before/after comparisons. Coordinating filming logistics with CF video team.',
      hours: 12,
      rate: RATES.support,
      included: true,
      requiresCollaboration: 'CF',
    },
    {
      category: 'optional',
      title: 'Mentor & Volunteer Sourcing',
      description: 'Identify and recruit potential mentors and volunteers aligned with pitch coaching, storytelling, and demo readiness. Shared outreach and introductions.',
      hours: 15,
      rate: RATES.support,
      included: true,
      requiresCollaboration: 'CF',
    },
    {
      category: 'optional',
      title: 'Finalist Onboarding & Pre-work',
      description: 'Send pre-work packet, collect logos, taglines, bios, confirm technical needs.',
      hours: 6,
      rate: RATES.support,
      included: true,
    },

    // Add-ons (not included by default in base price)
    {
      category: 'add_on',
      title: 'Full Sizzle Reel Production',
      description: 'HiiiWAV handles camera crew hire and editing (shoot + edit). Quoted separately from base engagement.',
      hours: 50,
      rate: RATES.production,
      included: false,
    },
    {
      category: 'add_on',
      title: 'Venue Sourcing & Negotiation',
      description: 'Research, site visits, cost negotiation, logistics for rehearsal/filming space or alternate mentorship venue if HiiiWAV space not used.',
      hours: 15,
      rate: RATES.support,
      included: false,
    },
    {
      category: 'add_on',
      title: 'Extended 1:1 Coaching Sessions',
      description: 'Additional individual coaching time per team beyond standard program. Priced per hour per founder.',
      hours: 10,
      rate: RATES.lead,
      included: false,
    },
  ]

  try {
    // Create proposal
    const [proposal] = await db.insert(proposals).values(HIIIWAV_PROPOSAL).returning()
    console.log(`Created proposal: ${proposal.title} (ID: ${proposal.id})`)

    // Create items
    const itemsWithProposalId = ITEMS.map((item, index) => ({
      ...item,
      proposalId: proposal.id,
      sortOrder: index,
    }))

    await db.insert(proposalItems).values(itemsWithProposalId)
    console.log(`Created ${ITEMS.length} line items`)

    // Calculate totals
    const includedItems = ITEMS.filter(item => item.included)
    const totalHours = includedItems.reduce((sum, item) => sum + item.hours, 0)
    const totalCost = includedItems.reduce((sum, item) => sum + (item.hours * item.rate), 0)

    console.log('\n--- Summary ---')
    console.log(`Total included items: ${includedItems.length}`)
    console.log(`Total hours: ${totalHours}`)
    console.log(`Total cost: $${(totalCost / 100).toLocaleString()}`)
    console.log(`Target price: $25,000`)
    console.log(`Profit: $${((2500000 - totalCost) / 100).toLocaleString()}`)
    console.log(`Profit margin: ${(((2500000 - totalCost) / 2500000) * 100).toFixed(1)}%`)

    console.log('\nDone! View at /admin/proposals')
  } catch (error) {
    console.error('Seed failed:', error)
    throw error
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    process.exit(1)
  })



