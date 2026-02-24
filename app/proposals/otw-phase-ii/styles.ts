import { colorVars } from './brand'

export const globalStyles = `
  .otw-proposal {
    --purple: ${colorVars.purple};
    --orange: ${colorVars.orange};
    --green: ${colorVars.green};
    --white: ${colorVars.white};
    --black: ${colorVars.black};
    
    background-color: var(--black);
    color: var(--white);
    font-family: var(--font-hiiiwav-body), sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    padding-top: 60px; /* Space for the fixed header */
  }

  .otw-proposal .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #1A1A1A;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }

  .otw-proposal .nav-logo-text {
    font-family: var(--font-hiiiwav-heading);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--white);
  }

  .otw-proposal .nav-button {
    background: var(--purple);
    color: var(--white);
    padding: 8px 20px;
    border-radius: 0; /* Match deck's sharper aesthetic */
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .otw-proposal .nav-button:hover {
    background: var(--green);
    color: var(--black);
    border-color: var(--green);
  }

  .otw-proposal section {
    min-height: calc(100vh - 60px);
    padding: 100px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .otw-proposal .container {
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .otw-proposal h1, .otw-proposal h2 {
    font-family: var(--font-hiiiwav-heading), sans-serif;
    text-transform: uppercase;
    line-height: 0.9;
    letter-spacing: -0.02em;
  }

  .otw-proposal h1 {
    font-size: clamp(4rem, 12vw, 9rem);
    font-weight: 900;
  }

  .otw-proposal h2 {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    margin-bottom: 2.5rem;
  }

  .otw-proposal .text-lime { color: var(--green); }
  .otw-proposal .text-orange { color: var(--orange); }
  .otw-proposal .text-purple { color: var(--purple); }

  .otw-proposal .bg-silk {
    background-color: #1A0033;
    background-image: url('/images/otwvortex.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
  }

  .otw-proposal .bg-silk::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
    z-index: 1;
  }

  .otw-proposal .bg-silk::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(26, 0, 51, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
    z-index: 1;
  }

  .otw-proposal .bg-silk .container {
    position: relative;
    z-index: 2;
  }

  .otw-proposal .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
  }

  @media (max-width: 768px) {
    .otw-proposal .grid-2 {
      grid-template-columns: 1fr;
    }
    .otw-proposal section {
      padding: 80px 24px;
    }
    .otw-proposal .nav-logo-text {
      display: none;
    }
  }

  .otw-proposal .bullet-list {
    list-style: none;
    padding: 0;
  }

  .otw-proposal .bullet-list li {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    line-height: 1.3;
  }

  .otw-proposal .bullet-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--green);
    font-weight: 900;
  }
`
