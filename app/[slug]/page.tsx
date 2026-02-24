import { getDbForRequest, getTenantFromRequest } from '@/db/tenanted'
import { redirects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  // Skip empty slugs (homepage should be handled by app/page.tsx)
  if (!slug || slug.trim() === '') {
    notFound()
  }
  
  const path = `/${slug}`
  const reqHeaders = await headers()
  const db = getDbForRequest({ headers: reqHeaders })
  const tenant = getTenantFromRequest({ headers: reqHeaders })

  // Check for redirect (filtered by org)
  const [redirectRule] = await db
    .select()
    .from(redirects)
    .where(and(
      eq(redirects.sourceUrl, path),
      eq(redirects.enabled, true),
      eq(redirects.orgSlug, tenant.orgSlug)
    ))
    .limit(1)

  if (redirectRule) {
    // Update hit count (fire and forget)
    db.update(redirects)
      .set({
        hitCount: (redirectRule.hitCount || 0) + 1,
        lastHitAt: new Date(),
      })
      .where(eq(redirects.id, redirectRule.id))
      .catch(() => {})

    redirect(redirectRule.destinationUrl)
  }

  // No page found
  notFound()
}
