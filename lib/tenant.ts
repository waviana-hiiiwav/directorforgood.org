/**
 * Tenant resolution for multi-org support
 * 
 * Resolves which organization/tenant a request belongs to based on:
 * 1. Hostname (primary) - e.g., hiiiwav.org, oaklandtechweek.com
 * 2. Path prefix (fallback for dev) - e.g., /hiiiwav/*, /otw/*
 */

export interface TenantInfo {
  orgSlug: string
  dbKey: string // Environment variable key for DATABASE_URL_*
}

// Map hostnames to org slugs
const HOSTNAME_TO_ORG: Record<string, string> = {
  'hiiiwav.org': 'hiiiwav',
  'www.hiiiwav.org': 'hiiiwav',
  'oaklandtechweek.com': 'otw',
  'www.oaklandtechweek.com': 'otw',
  'directorforgood.org': 'hiiiwav', // Default platform org
  'www.directorforgood.org': 'hiiiwav',
  'localhost': 'hiiiwav', // Dev default
}

// Map path prefixes to org slugs (for dev/testing)
const PATH_TO_ORG: Record<string, string> = {
  '/hiiiwav': 'hiiiwav',
  '/otw': 'otw',
}

/**
 * Resolve tenant from request headers (hostname)
 */
export function resolveTenantFromHeaders(headers: Headers | Record<string, string>): TenantInfo {
  const host = headers instanceof Headers 
    ? headers.get('host') || headers.get('x-forwarded-host') || ''
    : headers['host'] || headers['x-forwarded-host'] || ''
  
  // Extract hostname (remove port)
  const hostname = host.split(':')[0].toLowerCase()
  
  // Check hostname mapping
  if (hostname in HOSTNAME_TO_ORG) {
    const orgSlug = HOSTNAME_TO_ORG[hostname]
    return {
      orgSlug,
      dbKey: `DATABASE_URL_${orgSlug.toUpperCase()}`,
    }
  }
  
  // Check subdomain patterns
  if (hostname.endsWith('.hiiiwav.org') || hostname.endsWith('.directorforgood.org')) {
    return {
      orgSlug: 'hiiiwav',
      dbKey: 'DATABASE_URL_HIIIWAV',
    }
  }
  
  if (hostname.endsWith('.oaklandtechweek.com')) {
    return {
      orgSlug: 'otw',
      dbKey: 'DATABASE_URL_OTW',
    }
  }
  
  // Default fallback
  return {
    orgSlug: 'hiiiwav',
    dbKey: 'DATABASE_URL_HIIIWAV',
  }
}

/**
 * Resolve tenant from URL path (for dev/testing)
 */
export function resolveTenantFromPath(pathname: string): TenantInfo | null {
  for (const [prefix, orgSlug] of Object.entries(PATH_TO_ORG)) {
    if (pathname.startsWith(prefix)) {
      return {
        orgSlug,
        dbKey: `DATABASE_URL_${orgSlug.toUpperCase()}`,
      }
    }
  }
  return null
}

/**
 * Resolve tenant from Next.js request (headers + pathname)
 * Uses hostname first, falls back to path for dev
 */
export function resolveTenant(request: {
  headers: Headers | Record<string, string>
  url?: string
  pathname?: string
}): TenantInfo {
  // Try path first (for explicit dev routing)
  if (request.pathname) {
    const pathTenant = resolveTenantFromPath(request.pathname)
    if (pathTenant) return pathTenant
  }
  
  if (request.url) {
    try {
      const url = new URL(request.url)
      const pathTenant = resolveTenantFromPath(url.pathname)
      if (pathTenant) return pathTenant
    } catch {
      // Invalid URL, continue to headers
    }
  }
  
  // Fall back to hostname
  return resolveTenantFromHeaders(request.headers)
}

/**
 * Get all known org slugs
 */
export function getAllOrgSlugs(): string[] {
  return Array.from(new Set(Object.values(HOSTNAME_TO_ORG)))
}


