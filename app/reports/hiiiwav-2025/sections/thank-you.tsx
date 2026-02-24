// Thank You - Final Page
// Dark page with gratitude message

import { logos, colorVars } from '../brand'

export function ThankYou() {
  return (
    <section 
      className="page dark-page text-center" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <h2 
        className="section-title green-accent" 
        style={{ fontSize: 'clamp(48px, 12vw, 100px)' }}
      >
        THANK<br />YOU
      </h2>
      
      <p style={{ 
        fontSize: 18, 
        maxWidth: 600, 
        margin: '40px auto', 
        lineHeight: 1.8 
      }}>
        To our donors, partners, artists, and community—you make this work possible. 
        Together, we&apos;re building an Oakland where creativity thrives and ownership 
        is the norm.
      </p>

      <div style={{ marginTop: 40 }}>
        <img 
          src={logos.light} 
          alt="HiiiWAV" 
          className="logo-large" 
        />
        <p style={{ marginTop: 20, opacity: 0.7 }}>www.hiiiwav.org</p>
      </div>
    </section>
  )
}


