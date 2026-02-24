// Oakland Tech Week Section
// Orange page with event highlights

import { logos, colorVars, fontVars } from '../brand'

const outcomes = [
  "Multiple ecosystem convenings throughout the year",
  "Connections between Oakland founders and Bay Area investors",
  "Showcased local innovation to national audiences",
  "Platform for AFRO AI graduates to present their work",
  "Foundation for annual Oakland Tech Week tradition",
]

export function OaklandTechWeek() {
  return (
    <section 
      className="page" 
      style={{ backgroundColor: colorVars.orange, color: colorVars.white }}
    >
      <header className="page-header">
        <img 
          src={logos.dark} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 06</div>
      </header>

      <h2 className="section-title">OAKLAND<br />TECH WEEK</h2>
      <p style={{ fontStyle: 'italic', fontSize: 18, marginBottom: 30 }}>
        Building the Ecosystem Oakland Deserves
      </p>

      {/* Event Photo */}
      <div 
        className="placeholder-image" 
        style={{ height: 250, margin: '30px 0', background: 'rgba(0,0,0,0.2)' }}
      >
        [Oakland Tech Week Event Photo]
      </div>

      <div className="two-column">
        {/* Description */}
        <div>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            <strong>Oakland Tech Week</strong> launched as HiiiWAV&apos;s flagship ecosystem 
            convening—bringing together founders, investors, artists, and technologists for 
            collaboration, learning, and community building.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 16 }}>
            The event showcased Oakland&apos;s unique position at the intersection of culture 
            and technology, featuring panels, workshops, pitch sessions, and networking events.
          </p>
        </div>

        {/* Outcomes */}
        <div>
          <h4 style={{ 
            fontFamily: fontVars.heading,
            fontSize: 24,
            color: colorVars.white,
            marginBottom: 12,
          }}>
            Key Outcomes:
          </h4>
          <ul style={{ listStyle: 'none', fontSize: 14, lineHeight: 2 }}>
            {outcomes.map((outcome) => (
              <li key={outcome}>• {outcome}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}


