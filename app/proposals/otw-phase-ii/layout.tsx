import { Metadata } from 'next'
import localFont from 'next/font/local'

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

export const metadata: Metadata = {
  title: 'OTW Phase II Proposal',
  description: 'Building the Ecosystem Oakland Deserves - Phase II (2025-2026)',
}

export default function OTWProposalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} ${italicAccentFont.variable}`}>
      {children}
    </div>
  )
}

