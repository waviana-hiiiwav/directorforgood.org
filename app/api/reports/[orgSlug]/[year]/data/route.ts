import { NextResponse } from 'next/server'
import { getDbForTenant } from '@/db/tenanted'
import { 
  parties, 
  partyRoles, 
  events, 
  eventParticipants,
  awards,
  awardRecipients,
  entities,
} from '@/db/schema'
import { eq, and, gte, lte, or, isNull, desc } from 'drizzle-orm'

/**
 * Impact Report Data API
 * 
 * Provides aggregated data for impact report generation.
 * Endpoint: /api/reports/[orgSlug]/[year]/data
 * 
 * Returns:
 * - events: Events in the year with participants
 * - awards: Awards received in the year
 * - teamMembers: Staff/team members active during the year
 * - partners: Partners active during the year
 * - sponsors: Sponsors active during the year
 * - donors: Donors active during the year
 * - participants: Program participants active during the year
 * - venues: Venues used during the year
 * - performers: Performers who performed during the year
 * - vendors: Vendors who provided services during the year
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ orgSlug: string; year: string }> }
) {
  try {
    const { orgSlug, year } = await params
    const yearNum = parseInt(year)
    
    if (isNaN(yearNum)) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 })
    }
    
    const db = getDbForTenant(orgSlug)
    const yearStart = new Date(yearNum, 0, 1)
    const yearEnd = new Date(yearNum, 11, 31, 23, 59, 59)
    
    // Events in the year (filtered by org)
    const eventsInYear = await db
      .select({
        event: events,
        participants: eventParticipants,
        party: parties,
      })
      .from(events)
      .leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
      .leftJoin(parties, eq(eventParticipants.partyId, parties.id))
      .where(
        and(
          eq(events.orgSlug, orgSlug),
          gte(events.eventDate, yearStart),
          lte(events.eventDate, yearEnd)
        )
      )
      .orderBy(desc(events.eventDate))
    
    // Group events with their participants
    const eventsMap = new Map()
    for (const row of eventsInYear) {
      if (!eventsMap.has(row.event.id)) {
        eventsMap.set(row.event.id, {
          ...row.event,
          participants: [],
        })
      }
      if (row.participants && row.party) {
        eventsMap.get(row.event.id).participants.push({
          ...row.participants,
          party: row.party,
        })
      }
    }
    const eventsList = Array.from(eventsMap.values())
    
    // Awards in the year (filtered by org, still using entities table for backward compatibility)
    const awardsInYear = await db
      .select({
        award: awards,
        recipient: entities,
        recipientRole: awardRecipients.recipientRole,
      })
      .from(awards)
      .leftJoin(awardRecipients, eq(awards.id, awardRecipients.awardId))
      .leftJoin(entities, eq(awardRecipients.entityId, entities.id))
      .where(
        and(
          eq(awards.orgSlug, orgSlug),
          eq(awards.year, yearNum)
        )
      )
      .orderBy(desc(awards.year), desc(awards.awardDate))
    
    // Group awards with recipients
    const awardsMap = new Map()
    for (const row of awardsInYear) {
      if (!awardsMap.has(row.award.id)) {
        awardsMap.set(row.award.id, {
          ...row.award,
          recipients: [],
        })
      }
      if (row.recipient) {
        awardsMap.get(row.award.id).recipients.push({
          ...row.recipient,
          recipientRole: row.recipientRole,
        })
      }
    }
    const awardsList = Array.from(awardsMap.values())
    
    // Team members active during the year
    const teamMembers = await db
      .select({
        party: parties,
        role: partyRoles,
      })
      .from(parties)
      .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .where(
        and(
          eq(partyRoles.orgContextSlug, orgSlug),
          eq(partyRoles.roleType, 'staff'),
          or(
            and(
              lte(partyRoles.startAt, yearEnd),
              or(
                isNull(partyRoles.endAt),
                gte(partyRoles.endAt, yearStart)
              )
            )
          )
        )
      )
    
    // Partners active during the year
    const partners = await db
      .select({
        party: parties,
        role: partyRoles,
      })
      .from(parties)
      .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .where(
        and(
          eq(partyRoles.orgContextSlug, orgSlug),
          eq(partyRoles.roleType, 'partner'),
          or(
            and(
              lte(partyRoles.startAt, yearEnd),
              or(
                isNull(partyRoles.endAt),
                gte(partyRoles.endAt, yearStart)
              )
            )
          )
        )
      )
    
    // Sponsors active during the year
    const sponsors = await db
      .select({
        party: parties,
        role: partyRoles,
      })
      .from(parties)
      .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .where(
        and(
          eq(partyRoles.orgContextSlug, orgSlug),
          eq(partyRoles.roleType, 'sponsor'),
          or(
            and(
              lte(partyRoles.startAt, yearEnd),
              or(
                isNull(partyRoles.endAt),
                gte(partyRoles.endAt, yearStart)
              )
            )
          )
        )
      )
    
    // Donors active during the year
    const donors = await db
      .select({
        party: parties,
        role: partyRoles,
      })
      .from(parties)
      .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .where(
        and(
          eq(partyRoles.orgContextSlug, orgSlug),
          eq(partyRoles.roleType, 'donor'),
          or(
            and(
              lte(partyRoles.startAt, yearEnd),
              or(
                isNull(partyRoles.endAt),
                gte(partyRoles.endAt, yearStart)
              )
            )
          )
        )
      )
    
    // Participants (program participants)
    const participants = await db
      .select({
        party: parties,
        role: partyRoles,
      })
      .from(parties)
      .innerJoin(partyRoles, eq(parties.id, partyRoles.partyId))
      .where(
        and(
          eq(partyRoles.orgContextSlug, orgSlug),
          eq(partyRoles.roleType, 'participant'),
          or(
            and(
              lte(partyRoles.startAt, yearEnd),
              or(
                isNull(partyRoles.endAt),
                gte(partyRoles.endAt, yearStart)
              )
            )
          )
        )
      )
    
    // Venues used during the year (from events, filtered by org)
    const venuesData = await db
      .select({
        party: parties,
      })
      .from(parties)
      .innerJoin(eventParticipants, eq(parties.id, eventParticipants.partyId))
      .innerJoin(events, eq(eventParticipants.eventId, events.id))
      .where(
        and(
          eq(events.orgSlug, orgSlug),
          eq(eventParticipants.eventRole, 'venue'),
          gte(events.eventDate, yearStart),
          lte(events.eventDate, yearEnd)
        )
      )
    // Deduplicate by party ID
    const venuesMap = new Map()
    for (const row of venuesData) {
      if (!venuesMap.has(row.party.id)) {
        venuesMap.set(row.party.id, row.party)
      }
    }
    const venues = Array.from(venuesMap.values())
    
    // Performers who performed during the year (filtered by org)
    const performersData = await db
      .select({
        party: parties,
      })
      .from(parties)
      .innerJoin(eventParticipants, eq(parties.id, eventParticipants.partyId))
      .innerJoin(events, eq(eventParticipants.eventId, events.id))
      .where(
        and(
          eq(events.orgSlug, orgSlug),
          eq(eventParticipants.eventRole, 'performer'),
          gte(events.eventDate, yearStart),
          lte(events.eventDate, yearEnd)
        )
      )
    // Deduplicate by party ID
    const performersMap = new Map()
    for (const row of performersData) {
      if (!performersMap.has(row.party.id)) {
        performersMap.set(row.party.id, row.party)
      }
    }
    const performers = Array.from(performersMap.values())
    
    // Vendors who provided services during the year (filtered by org)
    const vendorsData = await db
      .select({
        party: parties,
      })
      .from(parties)
      .innerJoin(eventParticipants, eq(parties.id, eventParticipants.partyId))
      .innerJoin(events, eq(eventParticipants.eventId, events.id))
      .where(
        and(
          eq(events.orgSlug, orgSlug),
          eq(eventParticipants.eventRole, 'vendor'),
          gte(events.eventDate, yearStart),
          lte(events.eventDate, yearEnd)
        )
      )
    // Deduplicate by party ID
    const vendorsMap = new Map()
    for (const row of vendorsData) {
      if (!vendorsMap.has(row.party.id)) {
        vendorsMap.set(row.party.id, row.party)
      }
    }
    const vendors = Array.from(vendorsMap.values())
    
    return NextResponse.json({
      year: yearNum,
      orgSlug,
      events: eventsList,
      awards: awardsList,
      teamMembers: teamMembers.map(r => ({ ...r.party, role: r.role })),
      partners: partners.map(r => ({ ...r.party, role: r.role })),
      sponsors: sponsors.map(r => ({ ...r.party, role: r.role })),
      donors: donors.map(r => ({ ...r.party, role: r.role })),
      participants: participants.map(r => ({ ...r.party, role: r.role })),
      venues: venues,
      performers: performers,
      vendors: vendors,
      summary: {
        eventCount: eventsList.length,
        awardCount: awardsList.length,
        teamMemberCount: teamMembers.length,
        partnerCount: partners.length,
        sponsorCount: sponsors.length,
        donorCount: donors.length,
        participantCount: participants.length,
        venueCount: venues.length,
        performerCount: performers.length,
        vendorCount: vendors.length,
      },
    })
  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 })
  }
}


