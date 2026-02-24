// Table of Contents
// Easy to update: just edit the tocItems array

import { logos, colorVars } from '../brand'

const tocItems = [
  ["Founder's Note", "2"],
  ["Introduction", "3"],
  ["HiiiLIGHTS", "4"],
  ["Major Wins", "5"],
  ["Oakland Tech Week", "6"],
  ["Oakland Ecosystem", "8"],
  ["Community Events", "10"],
  ["AFRO AI Updates", "12"],
  ["Partnerships", "14"],
  ["Impact Metrics", "16"],
  ["The Future", "18"],
  ["Financials", "20"],
]

const supporters = [
  "Kapor Foundation",
  "Meta", 
  "Good Trouble VC",
  "Akonadi Foundation",
  "Alameda County",
  "Full Spectrum Capital",
]

export function TableOfContents() {
  return (
    <section className="page" style={{ backgroundColor: colorVars.white }}>
      <header className="page-header">
        <img 
          src={logos.dark} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 01</div>
      </header>

      <h2 className="section-title">TABLE OF<br />CONTENTS</h2>
      <span className="arrow">↘</span>

      <div className="two-column mt-4" style={{ alignItems: 'start', gap: 60 }}>
        {/* Featured Image */}
        <div>
          <div className="placeholder-image" style={{ height: 350 }}>
            [Featured Artist Photo - B&W]
          </div>
          <div style={{ 
            fontSize: 12, 
            fontStyle: 'italic', 
            marginTop: 8, 
            opacity: 0.7 
          }}>
            Artist @ HiiiWAV Event 2025
          </div>
        </div>

        {/* TOC List */}
        <div>
          <ul style={{ listStyle: 'none' }}>
            {tocItems.map(([title, page]) => (
              <li 
                key={title} 
                style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #eee',
                  fontSize: 16,
                }}
              >
                <span style={{ fontWeight: 500 }}>{title}</span>
                <span style={{ color: colorVars.purple, fontWeight: 700 }}>{page}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Thank You Banner */}
      <div style={{ 
        marginTop: 40,
        padding: 20,
        background: `linear-gradient(90deg, ${colorVars.purple}, ${colorVars.green})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
      }}>
        Thank you to our incredible supporters: {supporters.join(", ")}, 
        and our growing community of champions!
      </div>
    </section>
  )
}


