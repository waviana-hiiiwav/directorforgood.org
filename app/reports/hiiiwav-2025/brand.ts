// Brand Kit Helper for Report Sections
// Static values for HiiiWAV brand (from clients/hiiiwav/brandkit/tokens.ts)

// Logo paths (in public/brands/hiiiwav/)
export const logos = {
  dark: '/brands/hiiiwav/logo-black.png',
  light: '/brands/hiiiwav/logo-white.png',
}

// Brand colors - RGB values from brand kit for accurate color matching
// Green: RGB(153, 255, 105) = HEX #99FF69, PMS 7487C
// Purple: RGB(163, 77, 255) = HEX #A34DFF, PMS 265C  
// Orange: RGB(255, 77, 22) = HEX #FF4D16, PMS Orange 021C
export const colors = {
  green: 'rgb(153, 255, 105)', // #99FF69 - exact RGB from brand kit
  purple: 'rgb(163, 77, 255)', // #A34DFF
  orange: 'rgb(255, 77, 22)',  // #FF4D16
  black: '#000000',
  white: '#FFFFFF',
} as const

// Color CSS variables (use these in className or style={{ color: 'var(--green)' }})
export const colorVars = {
  green: 'var(--green)',
  purple: 'var(--purple)',
  orange: 'var(--orange)',
  black: 'var(--black)',
  white: 'var(--white)',
} as const

// Font CSS variables
export const fontVars = {
  heading: "var(--font-hiiiwav-heading), 'PP Neue Montreal', sans-serif",
  body: "var(--font-hiiiwav-body), 'PP Neue Montreal', sans-serif",
  italicAccent: "var(--font-hiiiwav-italic-accent), 'PP Editorial New', serif",
} as const


