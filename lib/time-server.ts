/**
 * Server logic for the time clock (e.g. Maya's hourly tracking).
 *
 * start → open entry (endedAt null). stop → set endedAt + computed
 * durationSeconds. Tracked time later feeds invoice generation in FOS; this
 * store keeps only the operational time data (see the FOS security boundary).
 */
import { eq, and, desc, isNull } from 'drizzle-orm'
import { timeEntries, type NewTimeEntry } from '@/db/schema'
import { getDbForTenant } from '@/db/tenanted'

export async function startTimeEntry(
  data: {
    userId: number
    partyId?: number
    projectTag?: string
    description?: string
    rateCents?: number
    startedAt?: Date
  },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)
  const values: NewTimeEntry = {
    orgSlug,
    userId: data.userId,
    partyId: data.partyId ?? null,
    projectTag: data.projectTag ?? null,
    description: data.description ?? null,
    startedAt: data.startedAt ?? new Date(),
    rateCents: data.rateCents ?? null,
    status: 'open',
  }
  const [row] = await db.insert(timeEntries).values(values).returning()
  return row
}

export async function stopTimeEntry(
  id: number,
  data: { endedAt?: Date; description?: string },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)
  const [entry] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.id, id), eq(timeEntries.orgSlug, orgSlug)))
    .limit(1)
  if (!entry) throw new Error('Time entry not found')

  const endedAt = data.endedAt ?? new Date()
  const durationSeconds = Math.max(
    0,
    Math.round((endedAt.getTime() - new Date(entry.startedAt).getTime()) / 1000),
  )

  const [row] = await db
    .update(timeEntries)
    .set({
      endedAt,
      durationSeconds,
      description: data.description ?? entry.description,
      status: 'stopped',
      updatedAt: new Date(),
    })
    .where(eq(timeEntries.id, id))
    .returning()
  return row
}

export async function listTimeEntries(
  orgSlug: string,
  opts: { userId?: number; status?: string; limit?: number } = {},
) {
  const db = getDbForTenant(orgSlug)
  const conds = [eq(timeEntries.orgSlug, orgSlug)]
  if (opts.userId != null) conds.push(eq(timeEntries.userId, opts.userId))
  if (opts.status) conds.push(eq(timeEntries.status, opts.status))
  return await db
    .select()
    .from(timeEntries)
    .where(and(...conds))
    .orderBy(desc(timeEntries.startedAt))
    .limit(opts.limit ?? 100)
}

/** The user's currently-running entry, if any. */
export async function getActiveTimeEntry(userId: number, orgSlug: string) {
  const db = getDbForTenant(orgSlug)
  const [row] = await db
    .select()
    .from(timeEntries)
    .where(
      and(
        eq(timeEntries.orgSlug, orgSlug),
        eq(timeEntries.userId, userId),
        isNull(timeEntries.endedAt),
      ),
    )
    .orderBy(desc(timeEntries.startedAt))
    .limit(1)
  return row ?? null
}
