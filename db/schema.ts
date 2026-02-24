import { pgTable, text, timestamp, boolean, serial, jsonb, integer, date } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('user'),
  image: text('image'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  mimeType: text('mime_type'),
  size: integer('size'),
  altText: text('alt_text'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Entities: HiiiWAV org, participant artists, and staff members
export const entities = pgTable('entities', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'organization', 'participant', 'staff'
  bio: text('bio'),
  shortBio: text('short_bio'),
  image: text('image'),
  website: text('website'),
  socialLinks: jsonb('social_links').$type<{
    instagram?: string
    twitter?: string
    spotify?: string
    youtube?: string
    facebook?: string
    tiktok?: string
    soundcloud?: string
    bandcamp?: string
    linkedin?: string
  }>(),
  genre: text('genre'), // For artists
  role: text('role'), // For staff (e.g., "Executive Director")
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Awards, grants, and recognitions
export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  awardingEntity: text('awarding_entity').notNull(), // Organization that gave the award
  awardDate: date('award_date'),
  year: integer('year'), // Fallback when exact date unknown
  category: text('category'), // 'grant', 'award', 'fellowship', 'recognition', 'nomination'
  status: text('status').default('won'), // 'won', 'nominated', 'finalist', 'honorable_mention'
  prizeAmount: integer('prize_amount'), // In cents for precision
  prizeDescription: text('prize_description'), // Non-monetary prize details
  description: text('description'),
  notableFacts: text('notable_facts'),
  awardingOrgUrl: text('awarding_org_url'),
  awardPageUrl: text('award_page_url'),
  pressUrl: text('press_url'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Junction table: links awards to entities (many-to-many)
export const awardRecipients = pgTable('award_recipients', {
  id: serial('id').primaryKey(),
  awardId: integer('award_id').notNull().references(() => awards.id, { onDelete: 'cascade' }),
  entityId: integer('entity_id').notNull().references(() => entities.id, { onDelete: 'cascade' }),
  recipientRole: text('recipient_role'), // 'primary', 'collaborator', 'featured'
})

export type User = typeof users.$inferSelect
export type Media = typeof media.$inferSelect
export type Entity = typeof entities.$inferSelect
export type NewEntity = typeof entities.$inferInsert
export type Award = typeof awards.$inferSelect
export type NewAward = typeof awards.$inferInsert
export type AwardRecipient = typeof awardRecipients.$inferSelect
export type NewAwardRecipient = typeof awardRecipients.$inferInsert

// Redirects for SEO preservation
export const redirects = pgTable('redirects', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  sourceUrl: text('source_url').notNull(), // The old URL path (e.g., /old-page)
  destinationUrl: text('destination_url').notNull(), // Where to redirect to (e.g., /new-page)
  statusCode: integer('status_code').default(301), // 301 permanent, 302 temporary, 307, 308
  enabled: boolean('enabled').default(true),
  hitCount: integer('hit_count').default(0), // Track how often this redirect is used
  lastHitAt: timestamp('last_hit_at'),
  notes: text('notes'), // Admin notes about this redirect
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Redirect = typeof redirects.$inferSelect
export type NewRedirect = typeof redirects.$inferInsert

// Oakland Tech Week Venue Host Applications
export const venueHosts = pgTable('venue_hosts', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('otw'), // Multi-tenant: which org this belongs to
  // Contact info
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  // Venue info
  venueName: text('venue_name').notNull(),
  address: text('address').notNull(),
  city: text('city').default('Oakland'),
  neighborhood: text('neighborhood'), // e.g., "Downtown", "Temescal", "West Oakland"
  capacity: integer('capacity'), // Max number of people
  spaceType: text('space_type'), // 'gallery', 'office', 'warehouse', 'restaurant', 'outdoor', 'studio', 'other'
  // Availability & amenities
  availability: text('availability'), // Free-form text about when space is available
  amenities: jsonb('amenities').$type<string[]>().default([]), // ['wifi', 'av_equipment', 'parking', 'accessible', 'kitchen', 'outdoor_space']
  // Additional info
  website: text('website'),
  instagramHandle: text('instagram_handle'),
  notes: text('notes'), // Any additional info from the host
  // Admin fields
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected', 'contacted'
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type VenueHost = typeof venueHosts.$inferSelect
export type NewVenueHost = typeof venueHosts.$inferInsert

// Events (HiiiWAV Fest, Demo Days, community gatherings, etc.)
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'), // Full markdown content for event page
  coverImage: text('cover_image'),
  eventDate: timestamp('event_date').notNull(), // When the event takes place
  endDate: timestamp('end_date'), // Optional end date for multi-day events
  location: text('location'), // Venue name
  address: text('address'), // Full address
  eventType: text('event_type'), // 'fest', 'demo_day', 'workshop', 'community', 'panel', 'networking'
  registrationUrl: text('registration_url'), // External registration link
  featured: boolean('featured').default(false), // Highlight on homepage
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

// HiiiLIGHTS Newsletter Archive
export const newsletters = pgTable('newsletters', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'), // Optional subtitle/tagline
  excerpt: text('excerpt'), // Short preview text
  foundersNote: text('founders_note'), // Letter from the founder at the top of each issue
  content: text('content').notNull(), // Full HTML/markdown content
  coverImage: text('cover_image'),
  issueNumber: integer('issue_number'), // e.g., Issue #1, #2
  publishedAt: timestamp('published_at').notNull(), // When the newsletter was originally sent
  published: boolean('published').default(true),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Newsletter = typeof newsletters.$inferSelect
export type NewNewsletter = typeof newsletters.$inferInsert

// Deck content version history
export const deckVersions = pgTable('deck_versions', {
  id: serial('id').primaryKey(),
  content: jsonb('content').notNull(), // Full deck content snapshot
  description: text('description'), // "Added foundation slide" or auto-generated
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type DeckVersion = typeof deckVersions.$inferSelect
export type NewDeckVersion = typeof deckVersions.$inferInsert

// AI Directors - the five virtual directors that manage nonprofit operations
export const directors = pgTable('directors', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  mission: text('mission').notNull(),
  color: text('color').notNull(), // Tailwind color class (e.g., 'green', 'blue')
  icon: text('icon').notNull(), // Icon name for display
  order: integer('order').default(0), // Display order
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Director = typeof directors.$inferSelect
export type NewDirector = typeof directors.$inferInsert

// Director Goals/OKRs - measurable targets for each director
export const directorGoals = pgTable('director_goals', {
  id: serial('id').primaryKey(),
  directorId: integer('director_id').notNull().references(() => directors.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  targetValue: integer('target_value').notNull(),
  currentValue: integer('current_value').default(0).notNull(),
  unit: text('unit').notNull(), // 'percent', 'count', 'days', 'dollars', 'months'
  period: text('period').default('quarterly'), // 'weekly', 'monthly', 'quarterly', 'annual'
  status: text('status').default('on_track'), // 'on_track', 'at_risk', 'behind', 'completed'
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type DirectorGoal = typeof directorGoals.$inferSelect
export type NewDirectorGoal = typeof directorGoals.$inferInsert

// Director Tasks - backlog items and work in progress
export const directorTasks = pgTable('director_tasks', {
  id: serial('id').primaryKey(),
  directorId: integer('director_id').notNull().references(() => directors.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority').default('medium'), // 'high', 'medium', 'low'
  status: text('status').default('pending'), // 'pending', 'in_progress', 'blocked', 'completed'
  blockedReason: text('blocked_reason'), // Why task is blocked (if applicable)
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type DirectorTask = typeof directorTasks.$inferSelect
export type NewDirectorTask = typeof directorTasks.$inferInsert

// Director Metrics - time-series data for tracking KPIs over time
export const directorMetrics = pgTable('director_metrics', {
  id: serial('id').primaryKey(),
  directorId: integer('director_id').notNull().references(() => directors.id, { onDelete: 'cascade' }),
  metricKey: text('metric_key').notNull(), // e.g., 'runway_months', 'donor_touches', 'tasks_completed'
  value: integer('value').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
})

export type DirectorMetric = typeof directorMetrics.$inferSelect
export type NewDirectorMetric = typeof directorMetrics.$inferInsert

// Debrief calls - track calendar events that have triggered debrief calls
export const debriefCalls = pgTable('debrief_calls', {
  id: serial('id').primaryKey(),
  calendarEventId: text('calendar_event_id').notNull().unique(), // Google Calendar event ID
  meetingTitle: text('meeting_title').notNull(),
  meetingDate: timestamp('meeting_date').notNull(),
  callId: text('call_id'), // Retell call ID (set after call is triggered)
  status: text('status').default('pending'), // 'pending', 'triggered', 'completed', 'failed'
  retellCallId: text('retell_call_id'), // Retell API call ID
  transcript: text('transcript'), // Full call transcript
  callAnalysis: jsonb('call_analysis').$type<{
    call_summary?: string
    user_sentiment?: string
    call_successful?: boolean
    call_duration_seconds?: number
  }>(), // Call analysis data from Retell
  errorMessage: text('error_message'), // If call failed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type DebriefCall = typeof debriefCalls.$inferSelect
export type NewDebriefCall = typeof debriefCalls.$inferInsert

// Pages - legacy WordPress migration content
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  canonical: text('canonical'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

// Posts - legacy WordPress migration content
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  orgSlug: text('org_slug').notNull().default('hiiiwav'), // Multi-tenant: which org this belongs to
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  tags: jsonb('tags').$type<string[]>().default([]),
  published: boolean('published').default(false),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  canonical: text('canonical'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

// Proposals - project proposals for director services
export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  client: text('client').notNull(), // Partner/client name
  status: text('status').default('draft'), // 'draft', 'sent', 'accepted', 'rejected'
  tier: text('tier').default('primary'), // 'primary' ($25k), 'lower' ($20k)
  executiveSummary: text('executive_summary'),
  // Branding options
  brandingIncluded: boolean('branding_included').default(false), // HiiiWAV branding for exposure
  // Team requirements
  teamReadinessNotes: text('team_readiness_notes'), // Notes about team readiness criteria
  // Internal analysis fields (not shown in partner view)
  internalNotes: text('internal_notes'),
  targetProfit: integer('target_profit'), // Target profit margin in cents
  // Metadata
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Proposal = typeof proposals.$inferSelect
export type NewProposal = typeof proposals.$inferInsert

// Proposal line items - individual services/deliverables
export const proposalItems = pgTable('proposal_items', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id').notNull().references(() => proposals.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), // 'core', 'optional', 'add_on'
  title: text('title').notNull(),
  description: text('description'),
  hours: integer('hours').default(0), // Estimated hours
  rate: integer('rate').default(0), // Rate in cents per hour
  included: boolean('included').default(true), // Whether this item is included in the proposal
  requiresCollaboration: text('requires_collaboration'), // e.g., 'CF' if requires partner collaboration
  sortOrder: integer('sort_order').default(0), // For ordering items
  // Internal notes (not shown in partner view)
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type ProposalItem = typeof proposalItems.$inferSelect
export type NewProposalItem = typeof proposalItems.$inferInsert

// Relations
export const proposalsRelations = relations(proposals, ({ many }) => ({
  items: many(proposalItems),
}))

export const proposalItemsRelations = relations(proposalItems, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalItems.proposalId],
    references: [proposals.id],
  }),
}))

// ============================================================================
// MULTI-ORG TENANCY
// ============================================================================

// Organizations (tenants) - each org gets its own database
export const orgs = pgTable('orgs', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(), // 'hiiiwav', 'otw'
  name: text('name').notNull(),
  domains: jsonb('domains').$type<string[]>().default([]), // ['hiiiwav.org', 'www.hiiiwav.org']
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Org = typeof orgs.$inferSelect
export type NewOrg = typeof orgs.$inferInsert

// ============================================================================
// PARTY MODEL - Unified person/organization with role-based relationships
// ============================================================================

// Parties: unified model for people and organizations
// A party can be a person OR an organization, and can have multiple roles over time
export const parties = pgTable('parties', {
  id: serial('id').primaryKey(),
  partyType: text('party_type').notNull(), // 'person' | 'organization'
  displayName: text('display_name').notNull(), // Primary name
  legalName: text('legal_name'), // For orgs: legal entity name
  slug: text('slug'), // URL-friendly identifier
  // Profile fields
  bio: text('bio'),
  shortBio: text('short_bio'),
  image: text('image'), // URL or asset ID
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  // Social links (same structure as entities had)
  socialLinks: jsonb('social_links').$type<{
    instagram?: string
    twitter?: string
    spotify?: string
    youtube?: string
    facebook?: string
    tiktok?: string
    soundcloud?: string
    bandcamp?: string
    linkedin?: string
  }>(),
  // Person-specific fields
  pronouns: text('pronouns'),
  // Organization-specific fields
  ein: text('ein'), // Tax ID
  // Metadata
  metadata: jsonb('metadata').$type<Record<string, unknown>>(), // Flexible JSON for org-specific fields
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Party Roles: time-bound roles that parties have in different contexts
// Allows same person/org to be staff, donor, sponsor, partner, etc. at different times
export const partyRoles = pgTable('party_roles', {
  id: serial('id').primaryKey(),
  partyId: integer('party_id').notNull().references(() => parties.id, { onDelete: 'cascade' }),
  orgContextSlug: text('org_context_slug'), // Which org context this role is for (null = global)
  roleType: text('role_type').notNull(), // 'staff', 'participant', 'donor', 'sponsor', 'partner', 'host', 'venue', 'performer', 'vendor', 'board', 'advisor', 'press', 'volunteer', etc.
  roleTitle: text('role_title'), // e.g., "Executive Director", "Board Chair", "Lead Performer"
  // Time bounds
  startAt: timestamp('start_at'),
  endAt: timestamp('end_at'), // null = currently active
  // Role-specific metadata
  metadata: jsonb('metadata').$type<{
    department?: string
    fte?: number // Full-time equivalent
    genre?: string // For artists/performers
    capacity?: number // For venues
    status?: string // 'active', 'inactive', 'pending', etc.
    [key: string]: unknown
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relationships: explicit relationships between parties
// Useful for modeling complex networks (e.g., "Alphabet Rockers sponsors Prospect Band")
export const relationships = pgTable('relationships', {
  id: serial('id').primaryKey(),
  fromPartyId: integer('from_party_id').notNull().references(() => parties.id, { onDelete: 'cascade' }),
  toPartyId: integer('to_party_id').notNull().references(() => parties.id, { onDelete: 'cascade' }),
  relationshipType: text('relationship_type').notNull(), // 'employs', 'sponsors', 'partnersWith', 'hosts', 'donatedTo', 'performedAt', 'vendorFor', 'fiscalSponsor', etc.
  orgContextSlug: text('org_context_slug'), // Which org context this relationship is relevant to
  // Time bounds
  startAt: timestamp('start_at'),
  endAt: timestamp('end_at'),
  // Relationship metadata
  metadata: jsonb('metadata').$type<{
    amount?: number // For financial relationships (in cents)
    description?: string
    [key: string]: unknown
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Party = typeof parties.$inferSelect
export type NewParty = typeof parties.$inferInsert
export type PartyRole = typeof partyRoles.$inferSelect
export type NewPartyRole = typeof partyRoles.$inferInsert
export type Relationship = typeof relationships.$inferSelect
export type NewRelationship = typeof relationships.$inferInsert

// ============================================================================
// EVENT PARTICIPANTS - For OTW and other events
// ============================================================================

// Event participants: links parties to events with specific roles
export const eventParticipants = pgTable('event_participants', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  partyId: integer('party_id').notNull().references(() => parties.id, { onDelete: 'cascade' }),
  eventRole: text('event_role').notNull(), // 'host', 'venue', 'performer', 'vendor', 'sponsor', 'attendee', 'speaker', 'organizer'
  // Role-specific metadata
  metadata: jsonb('metadata').$type<{
    performanceTime?: string
    vendorBooth?: string
    sponsorTier?: string
    [key: string]: unknown
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type EventParticipant = typeof eventParticipants.$inferSelect
export type NewEventParticipant = typeof eventParticipants.$inferInsert
