// Major Wins Section
// Dark page showcasing key achievements

import { logos, colorVars, fontVars } from '../brand'

const wins = [
  {
    tag: "Funding Milestone",
    title: "$450K Multi-Year Commitment",
    description: "An anonymous donor made a transformative multi-year commitment of $450,000—the largest single gift in HiiiWAV history. This investment enables long-term planning and sustained impact.",
  },
  {
    tag: "Partnership",
    title: "Kapor Foundation Multi-Year",
    description: "The Kapor Foundation deepened their commitment with a multi-year partnership, recognizing HiiiWAV as essential infrastructure for Oakland's creative economy.",
  },
  {
    tag: "New Initiative",
    title: "Good Trouble VC Partnership",
    description: "Opening new pathways for HiiiWAV entrepreneurs to access venture capital and scale their innovations.",
  },
  {
    tag: "Investment",
    title: "Kev Choice Investment",
    description: "Continued investment in Kev Choice's groundbreaking work—culminating in Choice Scores and expanded reach for artist-owned tools.",
  },
  {
    tag: "Milestone",
    title: "E-40 Tiny Desk Concert",
    description: "Supporting E-40's historic NPR Tiny Desk performance—showcasing Bay Area hip-hop excellence globally.",
  },
  {
    tag: "Launch",
    title: "Director for Good",
    description: "Launching directorforgood.org—fractional nonprofit leadership bringing HiiiWAV's operational excellence to organizations that need backbone support.",
  },
]

export function MajorWins() {
  return (
    <section className="page dark-page">
      <header className="page-header">
        <img 
          src={logos.light} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 05</div>
      </header>

      <h2 className="section-title green-accent">MAJOR<br />WINS</h2>
      <p className="subtitle">A year of strategic partnerships and community milestones</p>

      <div className="two-column">
        {/* Split wins into two columns */}
        <div>
          {wins.slice(0, 3).map((win) => (
            <div key={win.title} style={{ marginBottom: 30 }}>
              <span className="tag">{win.tag}</span>
              <h3 style={{ 
                fontFamily: fontVars.heading,
                fontSize: 24,
                color: colorVars.green,
                marginBottom: 12,
              }}>
                {win.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                {win.description}
              </p>
            </div>
          ))}
        </div>
        
        <div>
          {wins.slice(3, 6).map((win) => (
            <div key={win.title} style={{ marginBottom: 30 }}>
              <span className="tag">{win.tag}</span>
              <h3 style={{ 
                fontFamily: fontVars.heading,
                fontSize: 24,
                color: colorVars.green,
                marginBottom: 12,
              }}>
                {win.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                {win.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


