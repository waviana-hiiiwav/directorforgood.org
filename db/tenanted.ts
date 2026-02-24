/**
 * Tenanted database access (Industry-standard single-database approach)
 * 
 * Uses a single database with org_slug filtering for multi-tenancy.
 * This is how Stripe, Linear, Notion, and most SaaS apps handle multi-tenancy.
 * 
 * Benefits:
 * - One database to manage
 * - One set of env vars
 * - Scales to many orgs
 * - Easier migrations
 * - Cost-effective
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { resolveTenant, type TenantInfo } from '@/lib/tenant'

// Single cached database connection
let cachedDb: ReturnType<typeof drizzle> | null = null
let cachedClient: ReturnType<typeof postgres> | null = null

/**
 * Get the shared database connection
 * All orgs use the same database, filtered by org_slug
 */
function getDb() {
  if (cachedDb) {
    return cachedDb
  }
  
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set. Please add it to .env.local')
  }
  
  // Create postgres client with connection pooling settings
  cachedClient = postgres(dbUrl, {
    connect_timeout: 60,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    max: 10, // Max connections per pool
  })
  
  // Create drizzle instance
  cachedDb = drizzle(cachedClient, { schema })
  
  return cachedDb
}

/**
 * Get database connection for a specific tenant
 * Note: This now returns the same DB for all tenants (single-database approach)
 * The org_slug is used for filtering, not DB selection
 */
export function getDbForTenant(orgSlug: string) {
  return getDb()
}

/**
 * Get database connection from request headers/URL
 * 
 * Usage in API routes:
 * ```ts
 * export async function GET(req: Request) {
 *   const db = getDbForRequest(req)
 *   // ... use db
 * }
 * ```
 * 
 * Usage in server components:
 * ```ts
 * export default async function Page({ params }: PageProps) {
 *   const db = getDbForRequest({ headers: headers() })
 *   // ... use db
 * }
 * ```
 */
export function getDbForRequest(
  request: Request | { headers: Headers | Record<string, string>; url?: string; pathname?: string }
): ReturnType<typeof drizzle> {
  let tenantInfo: TenantInfo
  
  if (request instanceof Request) {
    tenantInfo = resolveTenant({
      headers: request.headers,
      url: request.url,
    })
  } else {
    tenantInfo = resolveTenant(request)
  }
  
  return getDbForTenant(tenantInfo.orgSlug)
}

/**
 * Get tenant info from request (useful for logging, etc.)
 */
export function getTenantFromRequest(
  request: Request | { headers: Headers | Record<string, string>; url?: string; pathname?: string }
): TenantInfo {
  if (request instanceof Request) {
    return resolveTenant({
      headers: request.headers,
      url: request.url,
    })
  } else {
    return resolveTenant(request)
  }
}

/**
 * Cleanup function (useful for testing or graceful shutdown)
 */
export function closeAllConnections() {
  if (cachedClient) {
    cachedClient.end()
    cachedClient = null
    cachedDb = null
  }
}

/**
 * Get the shared database instance (alias for simpler imports)
 */
export { getDb as db }


