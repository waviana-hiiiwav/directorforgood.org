// Cover Page - The first thing visitors see
// Mobile-first: starts with mobile styles, scales up

import { logos, colors, colorVars, fontVars } from '../brand'

export function Cover() {
  return (
    <section 
      className="page" 
      style={{ 
        backgroundColor: colors.green,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 60,
      }}
    >
      <header className="page-header">
        <img 
          src={logos.dark} 
          alt="HiiiWAV" 
          className="logo" 
        />
        <div>www.hiiiwav.org</div>
      </header>

      <div>
        <div style={{ 
          fontFamily: fontVars.heading,
          fontSize: 'clamp(32px, 5vw, 48px)',
          marginBottom: 10,
        }}>
          2025
        </div>
        <h1 style={{ 
          fontFamily: fontVars.heading,
          fontSize: 'clamp(64px, 15vw, 120px)',
          lineHeight: 0.9,
          marginBottom: 30,
        }}>
          iMPACT<br />REPORT
        </h1>
      </div>

      {/* Hero Image - Oakland Tech Week Cover */}
      <div style={{ width: '100%', maxWidth: 600, margin: '20px 0' }}>
        <img 
          src="/reports/hiiiwav-2025/images/cover-hero.png"
          alt="Oakland Tech Week 2025 - Mayor Lee, Kapor Foundation, and HiiiWAV community"
          style={{ 
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: 4,
          }}
        />
      </div>

      <img 
        src={logos.dark} 
        alt="HiiiWAV" 
        className="logo-large" 
      />

      <footer style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 20,
        fontSize: 12,
        marginTop: 'auto',
        paddingTop: 40,
      }}>
        <div style={{ minWidth: 150 }}>
          <img 
            src={logos.dark} 
            alt="HiiiWAV" 
            className="logo-small" 
          />
          <div>2181 Telegraph Ave.</div>
          <div>Oakland, CA 94612</div>
        </div>
        <div style={{ minWidth: 150 }}>
          <div>bosko@hiiiwav.org</div>
          <div>323-481-7372</div>
        </div>
        <div style={{ minWidth: 150 }}>
          <div>*HiiiWAV is A 501(c)3</div>
          <div>Nonprofit Corporation</div>
        </div>
      </footer>
    </section>
  )
}


