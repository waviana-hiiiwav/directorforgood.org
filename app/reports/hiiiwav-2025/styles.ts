// HiiiWAV 2025 Impact Report - Design Tokens & Shared Styles
// Brand values from clients/hiiiwav/brandkit/tokens.ts

// HiiiWAV Brand Colors (from brand kit - using RGB for accurate color matching)
// Green: RGB(153, 255, 105) = HEX #99FF69, PMS 7487C
export const colors = {
  purple: 'rgb(163, 77, 255)', // #A34DFF
  orange: 'rgb(255, 77, 22)',  // #FF4D16
  green: 'rgb(153, 255, 105)', // #99FF69 - exact RGB from brand kit
  black: '#000000',
  white: '#FFFFFF',
} as const

// Font CSS variable names (loaded in page.tsx via next/font/local)
export const fonts = {
  heading: "var(--font-hiiiwav-heading), 'PP Neue Montreal', sans-serif",
  body: "var(--font-hiiiwav-body), 'PP Neue Montreal', sans-serif",
  italicAccent: "var(--font-hiiiwav-italic-accent), 'PP Editorial New', serif",
} as const

// Shared CSS that applies to all sections
export const globalStyles = `
  .hiiiwav-report {
    --purple: ${colors.purple};
    --orange: ${colors.orange};
    --green: ${colors.green};
    --black: ${colors.black};
    --white: ${colors.white};
    font-family: ${fonts.body};
    line-height: 1.6;
    color: var(--black);
  }

  .hiiiwav-report * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .hiiiwav-report h1,
  .hiiiwav-report h2,
  .hiiiwav-report h3,
  .hiiiwav-report h4 {
    font-family: ${fonts.heading};
    font-weight: 400;
    letter-spacing: 1px;
  }

  /* Page Layout */
  .hiiiwav-report .page {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    padding: 40px;
  }

  @media (max-width: 768px) {
    .hiiiwav-report .page {
      padding: 24px;
    }
  }

  /* Header */
  .hiiiwav-report .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .hiiiwav-report .logo {
    width: 150px;
    height: auto;
    object-fit: contain;
  }

  .hiiiwav-report .logo-small {
    width: 80px;
    height: auto;
    object-fit: contain;
  }

  .hiiiwav-report .logo-large {
    width: clamp(700px, 90vw, 1200px);
    height: auto;
    object-fit: contain;
    display: block;
  }

  .hiiiwav-report .page-number {
    font-size: 14px;
    opacity: 0.7;
  }

  /* Typography */
  .hiiiwav-report .section-title {
    font-size: clamp(48px, 10vw, 80px);
    line-height: 0.95;
    margin-bottom: 20px;
  }

  .hiiiwav-report .arrow {
    font-size: 48px;
    display: inline-block;
    margin-left: 10px;
  }

  .hiiiwav-report .subtitle {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  /* Color Modifiers */
  .hiiiwav-report .green-accent {
    color: var(--green);
  }

  .hiiiwav-report .dark-page {
    background-color: var(--black);
    color: var(--white);
  }

  .hiiiwav-report .dark-page .page-number {
    color: var(--white);
  }

  /* Components */
  .hiiiwav-report .highlight-purple {
    background-color: var(--purple);
    color: var(--white);
    padding: 2px 6px;
    font-weight: 700;
  }

  .hiiiwav-report .callout-box {
    background-color: var(--purple);
    color: var(--white);
    padding: 20px;
    margin: 24px 0;
    font-weight: 600;
    font-style: italic;
  }

  .hiiiwav-report .tag {
    display: inline-block;
    background-color: var(--green);
    color: var(--black);
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .hiiiwav-report .placeholder-image {
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    text-align: center;
    padding: 20px;
  }

  /* Layouts */
  .hiiiwav-report .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 768px) {
    .hiiiwav-report .two-column {
      grid-template-columns: 1fr;
    }
  }

  /* Utilities */
  .hiiiwav-report .mt-4 { margin-top: 40px; }
  .hiiiwav-report .mb-4 { margin-bottom: 40px; }
  .hiiiwav-report .text-center { text-align: center; }
`


