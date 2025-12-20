// Brand Kit PDF Adapter
// Converts BrandKit to PDF-compatible theme objects

import type { BrandKit, PdfTheme } from './types'
import { getBrandKit } from './index'

/**
 * Convert a BrandKit to a PDF theme
 * This is already implemented in the BrandKit interface, but we provide
 * a standalone function for convenience
 */
export function toPdfTheme(kit: BrandKit): PdfTheme {
  return kit.pdfTheme()
}

/**
 * Get PDF theme for a brand by slug
 */
export function getPdfTheme(slug: string): PdfTheme | undefined {
  const kit = getBrandKit(slug)
  return kit ? kit.pdfTheme() : undefined
}


