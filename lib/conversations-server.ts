/**
 * Server logic for the conversation + artifact engine.
 *
 * A conversation holds the message stream (the instruction trail). Artifacts
 * are versioned documents attached to a conversation; each edit appends a new
 * artifact_version and advances the artifact's currentVersionId pointer, so the
 * document can be iterated across many turns while every prior version stays
 * available (the Claude-Artifacts model, persisted in the canonical store).
 *
 * Mirrors the tenancy pattern in lib/entities-server.ts. Tables carry orgSlug,
 * so every read/write is filtered by tenant here.
 */
import { eq, and, desc, max } from 'drizzle-orm'
import {
  conversations,
  messages,
  artifacts,
  artifactVersions,
  type NewConversation,
  type NewMessage,
  type NewArtifact,
  type NewArtifactVersion,
} from '@/db/schema'
import { getDbForTenant } from '@/db/tenanted'

// ---------------------------------------------------------------------------
// Conversations + messages
// ---------------------------------------------------------------------------

export async function createConversation(
  data: {
    userId?: number
    partyId?: number
    title?: string
    source?: string
    metadata?: Record<string, unknown>
  },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)
  const values: NewConversation = {
    orgSlug,
    userId: data.userId ?? null,
    partyId: data.partyId ?? null,
    title: data.title ?? null,
    source: data.source ?? 'web',
    metadata: data.metadata ?? null,
  }
  const [row] = await db.insert(conversations).values(values).returning()
  return row
}

export async function appendMessage(
  conversationId: number,
  data: { role: string; content: string; metadata?: Record<string, unknown> },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)

  // Ensure the conversation exists and belongs to this tenant before writing.
  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.orgSlug, orgSlug)))
    .limit(1)
  if (!conv) throw new Error('Conversation not found')

  const values: NewMessage = {
    conversationId,
    role: data.role,
    content: data.content,
    metadata: data.metadata ?? null,
  }
  const [row] = await db.insert(messages).values(values).returning()
  await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, conversationId))
  return row
}

export async function getConversation(id: number, orgSlug: string) {
  const db = getDbForTenant(orgSlug)
  const [conv] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.orgSlug, orgSlug)))
    .limit(1)
  if (!conv) return null

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt, messages.id)

  const arts = await db
    .select()
    .from(artifacts)
    .where(eq(artifacts.conversationId, id))
    .orderBy(artifacts.createdAt)

  // Attach the live version content to each artifact for one-shot rendering.
  const artifactsWithCurrent = await Promise.all(
    arts.map(async (a) => {
      let currentVersion = null
      if (a.currentVersionId) {
        const [v] = await db
          .select()
          .from(artifactVersions)
          .where(eq(artifactVersions.id, a.currentVersionId))
          .limit(1)
        currentVersion = v ?? null
      }
      return { ...a, currentVersion }
    }),
  )

  return { ...conv, messages: msgs, artifacts: artifactsWithCurrent }
}

export async function listConversations(
  orgSlug: string,
  opts: { userId?: number; limit?: number } = {},
) {
  const db = getDbForTenant(orgSlug)
  const conds = [eq(conversations.orgSlug, orgSlug)]
  if (opts.userId != null) conds.push(eq(conversations.userId, opts.userId))
  return await db
    .select()
    .from(conversations)
    .where(and(...conds))
    .orderBy(desc(conversations.updatedAt))
    .limit(opts.limit ?? 50)
}

// ---------------------------------------------------------------------------
// Artifacts (versioned documents)
// ---------------------------------------------------------------------------

export async function createArtifact(
  data: {
    conversationId?: number
    partyId?: number
    kind: string
    title: string
    content: string
    changeSummary?: string
    createdByMessageId?: number
  },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)
  const artValues: NewArtifact = {
    orgSlug,
    conversationId: data.conversationId ?? null,
    partyId: data.partyId ?? null,
    kind: data.kind,
    title: data.title,
  }
  const [art] = await db.insert(artifacts).values(artValues).returning()

  const verValues: NewArtifactVersion = {
    artifactId: art.id,
    versionNumber: 1,
    content: data.content,
    changeSummary: data.changeSummary ?? 'Initial version',
    createdByMessageId: data.createdByMessageId ?? null,
  }
  const [ver] = await db.insert(artifactVersions).values(verValues).returning()

  await db
    .update(artifacts)
    .set({ currentVersionId: ver.id, updatedAt: new Date() })
    .where(eq(artifacts.id, art.id))

  return { ...art, currentVersionId: ver.id, currentVersion: ver, versions: [ver] }
}

/** Append a new version to an artifact and make it current. */
export async function updateArtifact(
  artifactId: number,
  data: { content: string; changeSummary?: string; createdByMessageId?: number },
  orgSlug: string,
) {
  const db = getDbForTenant(orgSlug)
  const [art] = await db
    .select()
    .from(artifacts)
    .where(and(eq(artifacts.id, artifactId), eq(artifacts.orgSlug, orgSlug)))
    .limit(1)
  if (!art) throw new Error('Artifact not found')

  const [{ value: maxVer }] = await db
    .select({ value: max(artifactVersions.versionNumber) })
    .from(artifactVersions)
    .where(eq(artifactVersions.artifactId, artifactId))
  const nextNumber = Number(maxVer ?? 0) + 1

  const verValues: NewArtifactVersion = {
    artifactId,
    versionNumber: nextNumber,
    content: data.content,
    changeSummary: data.changeSummary ?? null,
    createdByMessageId: data.createdByMessageId ?? null,
  }
  const [ver] = await db.insert(artifactVersions).values(verValues).returning()

  await db
    .update(artifacts)
    .set({ currentVersionId: ver.id, updatedAt: new Date() })
    .where(eq(artifacts.id, artifactId))

  return ver
}

export async function getArtifact(id: number, orgSlug: string) {
  const db = getDbForTenant(orgSlug)
  const [art] = await db
    .select()
    .from(artifacts)
    .where(and(eq(artifacts.id, id), eq(artifacts.orgSlug, orgSlug)))
    .limit(1)
  if (!art) return null

  const versions = await db
    .select()
    .from(artifactVersions)
    .where(eq(artifactVersions.artifactId, id))
    .orderBy(artifactVersions.versionNumber)

  const currentVersion =
    versions.find((v) => v.id === art.currentVersionId) ?? versions[versions.length - 1] ?? null

  return { ...art, versions, currentVersion }
}

/** Restore an older version by appending a copy as a new current version (keeps history linear). */
export async function restoreArtifactVersion(artifactId: number, versionId: number, orgSlug: string) {
  const db = getDbForTenant(orgSlug)
  const [art] = await db
    .select()
    .from(artifacts)
    .where(and(eq(artifacts.id, artifactId), eq(artifacts.orgSlug, orgSlug)))
    .limit(1)
  if (!art) throw new Error('Artifact not found')

  const [old] = await db
    .select()
    .from(artifactVersions)
    .where(and(eq(artifactVersions.id, versionId), eq(artifactVersions.artifactId, artifactId)))
    .limit(1)
  if (!old) throw new Error('Version not found')

  return await updateArtifact(
    artifactId,
    { content: old.content, changeSummary: `Restored v${old.versionNumber}` },
    orgSlug,
  )
}
