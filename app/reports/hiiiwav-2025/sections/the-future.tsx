// The Future Section
// Green page with what's next

import { logos, colors, colorVars, fontVars } from '../brand'

const whatsNext = [
  "HiiiWAV 50 Fund: Investing in 50 Oakland creators",
  "Oakland Tech Week 2025: Bigger, bolder ecosystem convening",
  "AFRO AI Expansion: New cohorts, new partnerships",
  "Studio Development: More space for more creators",
  "Community Wins: Kev Choice, GNXL, Prospect, Sol Development",
]

export function TheFuture() {
  return (
    <section className="page" style={{ backgroundColor: colors.green }}>
      <header className="page-header">
        <img 
          src={logos.dark} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 07</div>
      </header>

      <h2 className="section-title">THE<br />FUTURE</h2>
      <span className="arrow">↘</span>

      <div style={{ maxWidth: 700, marginTop: 40 }}>
        <h3 style={{ 
          fontFamily: fontVars.heading, 
          fontSize: 36, 
          marginBottom: 20 
        }}>
          Launching Director for Good
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
          After years of informally supporting fellow nonprofits with operational guidance, 
          HiiiWAV is formalizing this work through <strong>Director</strong>—a fractional 
          nonprofit leadership service available at <strong>directorforgood.org</strong>.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.8, fontWeight: 700 }}>
          Because when one organization succeeds, the whole ecosystem rises.
        </p>
      </div>

      {/* What's Next Box */}
      <div style={{ 
        marginTop: 60, 
        padding: 30, 
        background: colorVars.black, 
        color: colorVars.white 
      }}>
        <h4 style={{ 
          fontFamily: fontVars.heading, 
          fontSize: 28, 
          marginBottom: 20 
        }}>
          What&apos;s Next for HiiiWAV
        </h4>
        <ul style={{ listStyle: 'none', fontSize: 16, lineHeight: 2.2 }}>
          {whatsNext.map((item) => (
            <li key={item}>→ {item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}


