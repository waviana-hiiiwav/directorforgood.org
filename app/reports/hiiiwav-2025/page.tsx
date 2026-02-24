import { Metadata } from 'next'
import localFont from 'next/font/local'
import { globalStyles } from './styles'
import {
  Cover,
  TableOfContents,
  FoundersNote,
  Introduction,
  Highlights,
  MajorWins,
  OaklandTechWeek,
  TheFuture,
  ThankYou,
} from './sections'

// Load HiiiWAV brand fonts
// NOTE: All font loader values MUST be literal strings (Next.js requirement)
const headingFont = localFont({
  src: '../../../clients/hiiiwav/brandkit/fonts/PPNeueMontreal-Bold.otf',
  weight: '700',
  style: 'normal',
  variable: '--font-hiiiwav-heading',
  display: 'swap',
})

const bodyFont = localFont({
  src: '../../../clients/hiiiwav/brandkit/fonts/PPNeueMontreal-Book.otf',
  weight: '400',
  style: 'normal',
  variable: '--font-hiiiwav-body',
  display: 'swap',
})

const italicAccentFont = localFont({
  src: '../../../clients/hiiiwav/brandkit/fonts/PPEditorialNew-Italic.otf',
  weight: '400',
  style: 'italic',
  variable: '--font-hiiiwav-italic-accent',
  display: 'swap',
})

const fontClasses = `${headingFont.variable} ${bodyFont.variable} ${italicAccentFont.variable}`

export const metadata: Metadata = {
  title: '2025 HiiiWAV Impact Report',
  description: 'HiiiWAV 2025 Annual Impact Report - Oakland Tech Week, Multi-Year Funding, Community Impact',
}

// =============================================================================
// 2025 HiiiWAV Impact Report
// =============================================================================
// 
// Structure:
//   /sections/         - Individual page components (edit content here)
//   /styles.ts         - Shared design tokens and CSS
//   /page.tsx          - This file (composition only)
//
// To update content: Edit the section files directly
// To add a section:  Create in /sections/, add to index.ts, import here
// To change design:  Edit styles.ts for global, or section file for specific
//
// =============================================================================

export default function HiiiWAV2025Report() {
  return (
    <div className={`hiiiwav-report ${fontClasses}`}>
      {/* Global Styles */}
      <style>{globalStyles}</style>

      {/* Report Sections - Edit each in /sections/ folder */}
      <Cover />
      <TableOfContents />
      <FoundersNote />
      <Introduction />
      <Highlights />
      <MajorWins />
      <OaklandTechWeek />
      <TheFuture />
      <ThankYou />
    </div>
  )
}


