// Brand Kit Registry
// Central registry mapping company slugs to their brand kits

import { hiiiwavBrandKit } from '@/clients/hiiiwav/brandkit/tokens'
import { otwBrandKit } from '@/clients/otw/brandkit/tokens'
import type { BrandKit } from './types'

const brandKits: Record<string, BrandKit> = {
  hiiiwav: hiiiwavBrandKit,
  otw: otwBrandKit,
}

/**
 * Get a brand kit by slug
 */
export function getBrandKit(slug: string): BrandKit | undefined {
  return brandKits[slug]
}

/**
 * Get all registered brand kit slugs
 */
export function getBrandKitSlugs(): string[] {
  return Object.keys(brandKits)
}

/**
 * Register a new brand kit
 */
export function registerBrandKit(kit: BrandKit): void {
  brandKits[kit.slug] = kit
}

export default brandKits



