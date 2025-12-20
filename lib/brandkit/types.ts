// BrandKit Type Definitions
// Central schema for all brand assets, tokens, and design system values

export interface ColorSwatch {
  /** Hex color code (e.g., "#A34DFF") */
  hex: string
  /** RGB values as array [r, g, b] */
  rgb: [number, number, number]
  /** CMYK values as array [c, m, y, k] */
  cmyk: [number, number, number, number]
  /** Pantone/PMS code if applicable */
  pantone?: string
}

export interface TypographyFamily {
  /** Font family name (e.g., "PP Neue Montreal") */
  name: string
  /** Path to font file for next/font/local (relative to project root) */
  fontFile: string
  /** Font weight (400, 700, etc.) */
  weight: number
  /** Font style (normal, italic) */
  style?: 'normal' | 'italic'
}

export interface TypographyRoles {
  /** Font family for headings (short headlines) */
  heading: TypographyFamily
  /** Font family for body text */
  body: TypographyFamily
  /** Font family for italic accents/emphasis (optional) */
  italicAccent?: TypographyFamily
}

export interface Logos {
  /** Wordmark for dark backgrounds */
  wordmarkDark: string
  /** Wordmark for light backgrounds */
  wordmarkLight: string
  /** Optional: transparent/PNG version */
  wordmarkTransparent?: string
  /** Optional: icon mark */
  iconMark?: string
}

export interface BrandKit {
  /** URL-friendly slug (e.g., "hiiiwav") */
  slug: string
  /** Display name (e.g., "HiiiWAV") */
  displayName: string
  /** Website URL */
  website?: string
  
  /** Color palette - named swatches */
  colors: {
    [key: string]: ColorSwatch
  }
  
  /** Typography system */
  typography: TypographyRoles
  
  /** Logo variants */
  logos: Logos
  
  /** Generate CSS variables string for web use */
  cssVars: (prefix?: string) => string
  
  /** Generate PDF theme object */
  pdfTheme: () => PdfTheme
}

export interface PdfTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    black: string
    white: string
    [key: string]: string
  }
  fonts: {
    heading: string
    body: string
    italicAccent?: string
  }
  logoPaths: {
    dark: string
    light: string
  }
}

/**
 * Helper to create CSS variables from a brand kit
 */
export function createCssVars(
  colors: BrandKit['colors'],
  prefix = 'brand'
): string {
  const vars: string[] = []
  
  for (const [name, swatch] of Object.entries(colors)) {
    const varName = prefix ? `--${prefix}-${name}` : `--${name}`
    vars.push(`  ${varName}: ${swatch.hex};`)
  }
  
  return vars.join('\n')
}

/**
 * Helper to convert BrandKit to PDF theme
 */
export function createPdfTheme(kit: BrandKit): PdfTheme {
  const colorKeys = Object.keys(kit.colors)
  const primary = kit.colors[colorKeys[0]]?.hex || '#000000'
  const secondary = kit.colors[colorKeys[1]]?.hex || '#000000'
  const accent = kit.colors[colorKeys[2]]?.hex || '#000000'
  const black = kit.colors.black?.hex || kit.colors.Black?.hex || '#000000'
  const white = kit.colors.white?.hex || kit.colors.White?.hex || '#FFFFFF'
  
  const pdfColors: PdfTheme['colors'] = {
    primary,
    secondary,
    accent,
    black,
    white,
  }
  
  // Add all named colors
  for (const [name, swatch] of Object.entries(kit.colors)) {
    pdfColors[name.toLowerCase()] = swatch.hex
  }
  
  return {
    colors: pdfColors,
    fonts: {
      heading: kit.typography.heading.name,
      body: kit.typography.body.name,
      italicAccent: kit.typography.italicAccent?.name,
    },
    logoPaths: {
      dark: kit.logos.wordmarkDark,
      light: kit.logos.wordmarkLight,
    },
  }
}


