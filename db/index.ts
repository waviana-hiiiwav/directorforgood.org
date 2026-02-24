/**
 * @deprecated Use getDbForRequest() or getDbForTenant() from '@/db/tenanted' instead.
 * This singleton export is kept for backward compatibility but will use the default DATABASE_URL.
 * For multi-tenant support, always use the tenanted DB functions.
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please add it to .env.local')
  }
  const client = postgres(process.env.DATABASE_URL, {
    connect_timeout: 60,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  })
  return drizzle(client, { schema })
}

export const db = getDb()

// Re-export tenanted functions for convenience
export { getDbForRequest, getDbForTenant, getTenantFromRequest } from './tenanted'

