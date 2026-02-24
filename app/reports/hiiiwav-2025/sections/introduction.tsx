// Introduction Section
// Dark page with green accents

import { logos, colorVars } from '../brand'

export function Introduction() {
  return (
    <section className="page dark-page">
      <header className="page-header">
        <img 
          src={logos.light} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div className="page-number">page 03</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 60 }}>
        <div>
          <h2 className="section-title green-accent">Intro</h2>
          <span className="arrow green-accent">↘</span>
        </div>

        <div style={{ maxWidth: 500, marginLeft: 'auto' }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            As we reflect on the past year at{' '}
            <strong className="green-accent">HiiiWAV</strong>, we recognize the accelerating 
            pace of change in technology, culture, and community. The landscape for artists, 
            creators, and technologists has never been more dynamic—or more urgent.
          </p>
          
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            2024-2025 marked a turning point. While others debated the future of AI, we built 
            infrastructure. While others worried about displacement, we created pathways to 
            ownership. While others talked about community, we invested in it—with capital, 
            space, and unwavering commitment.
          </p>
          
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            HiiiWAV has always stood at the intersection of culture, technology, and economic 
            opportunity. This year proved that intersection is exactly where transformation happens.
          </p>

          <div style={{ 
            color: colorVars.green,
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 16,
            margin: '24px 0',
          }}>
            This is our moment to double down, to innovate where the system falls short, 
            and to continue building an ecosystem where creativity is not just valued but sustained.
          </div>
        </div>
      </div>

      {/* Full Width Image */}
      <div style={{ 
        width: 'calc(100% + 80px)',
        marginLeft: -40,
        marginRight: -40,
        marginTop: 40,
      }}>
        <div className="placeholder-image" style={{ height: 300 }}>
          [Community Event Photo - Full Width]
        </div>
        <div style={{ 
          fontSize: 12, 
          padding: '10px 40px', 
          opacity: 0.8 
        }}>
          ✳ Oakland Tech Week brought together innovators from across the Bay
        </div>
      </div>
    </section>
  )
}


