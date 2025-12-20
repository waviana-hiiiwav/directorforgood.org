// Oakland Tech Week Brand Kit Tokens
// Source of truth for all OTW brand assets and design tokens

import type { BrandKit } from '@/lib/brandkit/types'
import { createCssVars, createPdfTheme } from '@/lib/brandkit/types'

export const otwBrandKit: BrandKit = {
  slug: 'otw',
  displayName: 'Oakland Tech Week',
  website: 'https://oaklandtechweek.com',
  
  colors: {
    orange: {
      hex: '#FF4D16', // Same as HiiiWAV primary orange
      rgb: [255, 77, 22],
      cmyk: [0, 65, 100, 0],
      pantone: 'Orange 021C',
    },
    black: {
      hex: '#000000',
      rgb: [0, 0, 0],
      cmyk: [0, 0, 0, 100],
      pantone: 'Process Black',
    },
    white: {
      hex: '#FFFFFF',
      rgb: [255, 255, 255],
      cmyk: [0, 0, 0, 0],
    },
  },
  
  typography: {
    heading: {
      name: 'PP Neue Montreal',
      fontFile: 'clients/hiiiwav/brandkit/fonts/PPNeueMontreal-Bold.otf', // Reusing fonts
      weight: 700,
      style: 'normal',
    },
    body: {
      name: 'PP Neue Montreal',
      fontFile: 'clients/hiiiwav/brandkit/fonts/PPNeueMontreal-Book.otf',
      weight: 400,
      style: 'normal',
    },
    italicAccent: {
      name: 'PP Editorial New',
      fontFile: 'clients/hiiiwav/brandkit/fonts/PPEditorialNew-Italic.otf',
      weight: 400,
      style: 'italic',
    },
  },
  
  logos: {
    wordmarkDark: '/brands/otw/logo-black.png',
    wordmarkLight: '/brands/otw/logo-white.png',
  },
  
  cssVars: (prefix = 'otw') => createCssVars(otwBrandKit.colors, prefix),
  
  pdfTheme: () => createPdfTheme(otwBrandKit),
}

export default otwBrandKit

