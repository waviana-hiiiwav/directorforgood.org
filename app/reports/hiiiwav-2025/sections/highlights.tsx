// HiiiLIGHTS Section
// Purple page with key milestones

import { logos, colorVars, fontVars } from '../brand'

const milestones = [
  { title: "Multi-Year Funding Secured", detail: "$450,000 anonymous commitment" },
  { title: "Kapor Foundation Partnership", detail: "Multi-year collaboration" },
  { title: "Oakland Tech Week Launch", detail: "Inaugural ecosystem convening" },
  { title: "Full Spectrum Capital Accelerator", detail: "New capital pathways" },
  { title: "New Fiscal Sponsorships", detail: "Alphabet Rockers, Ryan Nicole" },
  { title: "Director Launch", detail: "directorforgood.org" },
  { title: "Studio Upgrades", detail: "New resident Clay Xavier, tenant Precious Stroud" },
  { title: "HiiiWAV 50 Fund", detail: "Investing in Oakland creators" },
]

export function Highlights() {
  return (
    <section 
      className="page" 
      style={{ backgroundColor: colorVars.purple, color: colorVars.white }}
    >
      <header className="page-header">
        <img 
          src={logos.light} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 04</div>
      </header>

      <h2 className="section-title" style={{ color: colorVars.green }}>HiiiLIGHTS</h2>

      <div className="two-column">
        {/* Left Column - About + Quote */}
        <div>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: colorVars.green }}>HiiiWAV</strong> is a visionary Black-led 
            organization innovating at the intersection of art and technology to confront 
            the systemic exclusion and exploitation that have long shaped the entertainment 
            and media industries.
          </p>
          
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            In cultural hubs like Oakland—where rising costs, lack of access to capital, 
            and now AI-driven disruption threaten the survival of independent creators—we 
            exist to dismantle these barriers and build new pathways to ownership and sustainability.
          </p>

          {/* Quote Block */}
          <div style={{ padding: '30px 20px', margin: '30px 0' }}>
            <div style={{ 
              fontFamily: fontVars.heading,
              fontSize: 80,
              color: colorVars.green,
              lineHeight: 1,
              opacity: 0.5,
            }}>
              &ldquo;
            </div>
            <div style={{ 
              fontSize: 16, 
              fontStyle: 'italic', 
              fontWeight: 600, 
              margin: '10px 0',
              fontFamily: fontVars.italicAccent,
            }}>
              &ldquo;We do this because too many artists are forced to choose between their 
              craft and financial stability—HiiiWAV exists to change that narrative.&rdquo;
            </div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              – Executive Director, Bosko Kante
            </div>
            <div style={{ 
              fontFamily: fontVars.heading,
              fontSize: 80,
              color: colorVars.green,
              lineHeight: 1,
              opacity: 0.5,
              textAlign: 'right',
            }}>
              &rdquo;
            </div>
          </div>
        </div>

        {/* Right Column - Milestones */}
        <div>
          <p style={{ marginBottom: 16 }}>
            <strong>Key milestones for 2024-2025 include:</strong>
          </p>
          <ul style={{ listStyle: 'none', margin: '20px 0' }}>
            {milestones.map((item) => (
              <li 
                key={item.title}
                style={{ 
                  position: 'relative',
                  paddingLeft: 20,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                <span style={{ 
                  position: 'absolute', 
                  left: 0, 
                  color: colorVars.green, 
                  fontWeight: 'bold' 
                }}>
                  •
                </span>
                <strong style={{ color: colorVars.green }}>{item.title}:</strong>{' '}
                {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}


