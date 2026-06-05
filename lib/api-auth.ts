/**
 * API authentication guard for the canonical-store service routes
 * (conversations, artifacts, time entries — and, in future, entities).
 *
 * Accepts EITHER of two caller types:
 *  1. Service callers (iOS app, OpenClaw agents): `Authorization: Bearer <ENTITY_SERVICE_API_KEY>`.
 *     Service callers may target a specific org via the `X-Org-Slug` header.
 *  2. Human web users: a valid NextAuth session (cookie-based).
 *
 * If `ENTITY_SERVICE_API_KEY` is not configured, bearer auth is disabled and
 * only session callers are accepted. This closes the "unauthenticated entity
 * API" gap for the new routes without breaking the existing browser-driven ones.
 */
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTenantFromRequest } from '@/db/tenanted'

export interface ApiAuthContext {
  orgSlug: string
  userId?: number
  caller: 'session' | 'service'
}

export async function requireApiAuth(req: Request): Promise<ApiAuthContext | Response> {
  const hostTenant = getTenantFromRequest(req)

  // 1. Service-to-service: Authorization: Bearer <ENTITY_SERVICE_API_KEY>
  const authHeader = req.headers.get('authorization') || ''
  const serviceKey = process.env.ENTITY_SERVICE_API_KEY
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim()
    if (serviceKey && token && token === serviceKey) {
      // Honor X-Org-Slug for authenticated service callers (e.g. iOS targeting an org)
      const orgOverride = req.headers.get('x-org-slug')?.trim()
      return { orgSlug: orgOverride || hostTenant.orgSlug, caller: 'service' }
    }
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // 2. Human web session (NextAuth)
  const session = await auth()
  if (session?.user) {
    const rawId = (session.user as { id?: string | number }).id
    const parsed = rawId != null ? parseInt(String(rawId), 10) : NaN
    return {
      orgSlug: hostTenant.orgSlug,
      userId: Number.isNaN(parsed) ? undefined : parsed,
      caller: 'session',
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
