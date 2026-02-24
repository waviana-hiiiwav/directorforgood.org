// Founder's Note
// The personal message from Bosko - update content directly here

import { logos, colorVars, fontVars } from '../brand'

export function FoundersNote() {
  return (
    <section className="page" style={{ backgroundColor: colorVars.white }}>
      <header className="page-header">
        <img 
          src={logos.dark} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 02</div>
      </header>

      <h2 className="section-title">
        <span style={{ color: colorVars.purple, fontStyle: 'italic' }}>Founder&apos;s</span>
        <br />Note
      </h2>
      <span className="arrow">↘</span>

      <div className="two-column mt-4" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        {/* Content Column */}
        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>
            2024 was supposed to be a year of consolidation. Instead, it became a year of{' '}
            <strong>audacious expansion</strong>.
          </p>
          
          <p style={{ marginBottom: 16 }}>
            We secured{' '}
            <span className="highlight-purple">$450,000 in multi-year funding</span>
            —anonymous backing that signals deep trust in our mission. We launched{' '}
            <strong>Oakland Tech Week</strong>, bringing together the ecosystem we&apos;ve 
            been building for years. We partnered with <strong>Kapor Foundation</strong> on 
            a multi-year commitment that positions HiiiWAV as a cornerstone of Oakland&apos;s 
            creative tech infrastructure.
          </p>
          
          <p style={{ marginBottom: 16 }}>
            At Hiero Day and Hella Juneteenth, our community showed up in force. At Meta AI 
            conferences from the Bay to Chicago, we proved that{' '}
            <strong>Oakland&apos;s voice belongs at every table where AI&apos;s future is being decided</strong>.
          </p>
          
          <p style={{ marginBottom: 16 }}>
            We invested in our people—Kev Choice&apos;s continued innovation, E-40&apos;s historic 
            Tiny Desk, the next generation of creators at our summer internship program with 
            EOYDC and Represented.
          </p>

          <div className="callout-box">
            But at HiiiWAV, we don&apos;t wait for permission. We build. We own. We lead.
          </div>

          <p style={{ marginBottom: 16 }}>
            This year, we&apos;re launching <strong>Director</strong>—our fractional nonprofit 
            leadership service at directorforgood.org. It&apos;s what we&apos;ve been doing 
            informally for years, now available to organizations that need backbone support 
            to scale their impact.
          </p>
          
          <p style={{ marginBottom: 16 }}>
            The HiiiWAV 50 Fund. New studio upgrades. New residents. New partnerships with 
            Good Trouble VC. <strong>This isn&apos;t just growth—it&apos;s proof of concept.</strong>
          </p>
          
          <p style={{ fontWeight: 700, color: colorVars.purple }}>
            The danger is real. But so is our power.
          </p>

          {/* Signature */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>In Solidarity,</div>
            <div style={{ 
              fontFamily: fontVars.italicAccent, 
              fontSize: 36 
            }}>
              Bosko Kante
            </div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Cofounder & President, HiiiWAV
            </div>
          </div>
        </div>

        {/* Photo Column */}
        <div>
          <div style={{ width: '100%', maxWidth: 300 }}>
            <div 
              className="placeholder-image" 
              style={{ 
                height: 400, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
              }}
            >
              [Bosko Kante Photo]
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


