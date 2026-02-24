#!/usr/bin/env tsx
/**
 * Push schema to database
 * 
 * This is now a simple wrapper around `npm run db:push` since we use
 * single-database multi-tenancy (industry standard approach).
 * 
 * All orgs share one database, filtered by org_slug column.
 */

import { execSync } from 'child_process'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local')
  process.exit(1)
}

console.log('📦 Pushing schema to database...\n')
console.log('ℹ️  Using single-database multi-tenancy (industry standard)')
console.log('   All orgs share one database, filtered by org_slug column.\n')

try {
  execSync('npm run db:push', {
    stdio: 'inherit',
    cwd: process.cwd(),
  })
  console.log('\n✅ Schema pushed successfully!')
} catch (error) {
  console.error('❌ Failed to push schema:', error)
  process.exit(1)
}


