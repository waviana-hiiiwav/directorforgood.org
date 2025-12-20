// Shared content for both web and PDF pitch deck
// Edit via the admin interface at /admin/deck

export interface SlideImage {
  url?: string;  // Image URL (uploaded or external)
  placeholder?: string;  // Description for AI generation or placeholder text
  type: 'icon' | 'chart' | 'mockup' | 'infographic' | 'photo' | 'diagram';
}

export interface TeamMemberInfo {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface SlideContent {
  id: string;
  title: string;
  subtitle?: string;
  sections?: {
    heading?: string;
    items?: string[];
    text?: string;
  }[];
  teamMembers?: TeamMemberInfo[];
  highlight?: string;
  callout?: string;
  footnote?: string;
  image?: SlideImage;
}

export interface DeckContent {
  cover: {
    title: string;
    tagline: string;
    subtagline: string;
    oneliner?: string;
    url: string;
  };
  slides: SlideContent[];
  slideOrder?: string[]; // Array of slide IDs in display order
  ask: {
    amount: string;
    items: string[];
  };
}

// Default slide order with market moved after economics for better narrative flow
export const defaultSlideOrder: string[] = [
  'problem-founders',
  'problem-downshifted',
  'customer-foundations',
  'broken-options',
  'what-we-are',
  'fundraising-philosophy',
  'director-pod',
  'director-os',
  'ai-agents',
  'economics',
  'market',           // Moved here from position 4 - show market after explaining the solution
  'why-now',
  'go-to-market',
  'business-model',
  'strategic-partners',
  'team',
  'current-customers',
  'roadmap',
];

export const defaultDeckContent: DeckContent = {
  cover: {
    title: "Director",
    tagline: "The AI-native operating system and forward-deployed backbone for nonprofits",
    subtagline: "Turning under-resourced founders into fundable, operationally tight organizations",
    url: "directorforgood.org",
  },
  slides: [
    {
      id: "problem-founders",
      title: "Problem – Founders Are the Whole Leadership Team",
      subtitle: "Nonprofit founders are carrying 5 jobs on 1 salary.",
      sections: [
        {
          heading: "They're expected to:",
          items: [
            "Lead programs and vision",
            "Raise money (major gifts, grants, events)",
            "Run operations and finance",
            "Own communications and storytelling",
            "Manage staff, boards, and compliance",
          ],
        },
      ],
      highlight: "Promising orgs plateau at $300–600k or quietly shut down — not for lack of impact, but for lack of backbone.",
      footnote: "When funding tightens and staff are cut, all of this collapses back onto one person.",
      image: {
        type: 'infographic',
        placeholder: 'Infographic showing one person juggling 5 different roles/hats',
      },
    },
    {
      id: "problem-downshifted",
      title: "Problem – Downshifted Orgs (Beachhead)",
      subtitle: "Our initial focus: orgs that already proved they can raise $400k–$1M.",
      sections: [
        {
          heading: "These orgs:",
          items: [
            "Have real donor and community relationships",
            "Have a history of 7-figure budgets or close",
          ],
        },
        {
          heading: "But in the current funding environment:",
          items: [
            "They've laid off staff",
            "The founder is back to doing everything",
            "Many are considering shutting down despite strong demand",
          ],
        },
      ],
      highlight: "These leaders don't need another tool. They need a backbone.",
      footnote: "This hits founders of color especially hard, as equity-era funding retrenches.",
      image: {
        type: 'chart',
        placeholder: 'Chart showing org budget trajectory: growth to $1M, then decline/plateau',
      },
    },
    {
      id: "customer-foundations",
      title: "Ideal Customer – Foundations as Buyers",
      subtitle: "Foundations can sponsor multiple orgs at once.",
      sections: [
        {
          heading: "The opportunity:",
          items: [
            "Foundations already fund capacity-building for grantees",
            "They can purchase Director packages for 5–10 orgs",
            "One contract, multiple organizations transformed",
          ],
        },
        {
          heading: "Why this works:",
          items: [
            "Foundations get measurable capacity ROI across portfolio",
            "Orgs get backbone support they couldn't afford alone",
            "Director gets predictable, larger contracts",
          ],
        },
      ],
      highlight: "A single foundation can unlock Director for an entire cohort of grantees.",
      image: {
        type: 'diagram',
        placeholder: 'Foundation at center connected to 5-10 nonprofit orgs, each with Director backbone',
      },
    },
    {
      id: "market",
      title: "Market Opportunity",
      subtitle: "A massive, underserved market ready for AI-native solutions.",
      sections: [
        {
          heading: "TAM: $164B – Total US Nonprofit Administrative Spending",
          items: [
            "1.8M nonprofits in the US (1.5M are 501(c)(3)s)",
            "Nonprofit sector contributes $1.4 trillion to GDP",
            "Administrative overhead averages 11.7% = $164B annually",
            "This spending is ripe for AI automation",
          ],
        },
        {
          heading: "SAM: $3.5B – Small/Mid Nonprofits ($250k–$2M budgets)",
          items: [
            "~108,000 organizations in our target segment",
            "92% of nonprofits operate under $1M/year",
            "Current back-office spend: $32k–$200k per org",
            "Existing solutions: $5.5B nonprofit software + $6.7B consulting market",
          ],
        },
        {
          heading: "SOM: $50M – 5-Year Obtainable Market",
          items: [
            "500 organizations at ~$100k/year",
            "30–50 pods at 10–16 orgs each",
            "Represents <2% of SAM (credible capture rate)",
          ],
        },
      ],
      highlight: "68% of nonprofits now use AI (up from 58% in 2023). The market is ready for an AI-native backbone.",
      footnote: "Sources: Independent Sector, Statista, NCCS, Google for Nonprofits Survey 2025, Intent Market Research",
      image: {
        type: 'chart',
        placeholder: 'TAM/SAM/SOM concentric circles: $164B → $3.5B → $50M',
      },
    },
    {
      id: "broken-options",
      title: "Broken Options",
      subtitle: "Existing solutions don't fit this stage.",
      sections: [
        {
          heading: "DIY SaaS stack",
          text: "CRMs, grant tools, accounting, email… Founders don't have time to integrate and maintain them.",
        },
        {
          heading: "Consultants & agencies",
          text: "Project-based, expensive, seen as \"overhead.\" Advice without ongoing responsibility.",
        },
        {
          heading: "Rebuilding staff",
          items: [
            "ED: $100–150k",
            "Ops/Finance: ~$100k",
            "Development: ~$100k",
            "Comms/Program ops: $60–100k",
          ],
        },
      ],
      highlight: "There is no integrated, AI-native backbone designed for $400k–$1M orgs that have real relationships but no team.",
      footnote: "$360–450k/year for the backbone on a fragile budget.",
      image: {
        type: 'diagram',
        placeholder: 'Comparison diagram: scattered SaaS logos vs consultant icons vs expensive staff org chart',
      },
    },
    {
      id: "what-we-are",
      title: "Director – What We Are",
      subtitle: "Director is an AI-native backbone and forward-deployed team for nonprofits.",
      sections: [
        {
          heading: "Director OS – a vertical operating system for:",
          items: [
            "Revenue & relationships",
            "Runway & finance",
            "Ops & compliance",
            "Board & funder narratives",
          ],
        },
        {
          heading: "Director Pod – shared leadership capacity:",
          items: [
            "Forward-Deployed Director (FDD)",
            "Finance/ops leadership",
            "Dedicated dev & ops roles as we scale",
          ],
        },
      ],
      highlight: "We plug into an existing org and donor base and give them the leadership bench they can't afford to rebuild alone.",
      image: {
        type: 'diagram',
        placeholder: 'Two-part diagram: Director OS (software icon) + Director Pod (team icon) = Complete Backbone',
      },
    },
    {
      id: "fundraising-philosophy",
      title: "Fundraising Philosophy – Relationships First",
      subtitle: "Director is built around major gifts and real relationships, not grant roulette.",
      sections: [
        {
          heading: "Durable funding comes from:",
          items: [
            "Major donors",
            "Anchor institutions",
            "Long-term partners",
          ],
        },
        {
          heading: "Grants are part of the picture, but:",
          items: [
            "They are downstream of relationships",
            "\"Open call\" grant-chasing is mostly a distraction for this segment",
          ],
        },
        {
          heading: "Director's focus:",
          items: [
            "Map and grow the major gifts pipeline",
            "Prepare founders for high-stakes meetings",
            "Use grants strategically once relationships exist",
          ],
        },
      ],
      highlight: "Director is a relationship and revenue engine, not a shot-in-the-dark grant factory.",
      image: {
        type: 'diagram',
        placeholder: 'Funnel diagram: Relationships → Major Gifts → Grants (showing priority order)',
      },
    },
    {
      id: "director-pod",
      title: "The Director Pod – Capacity Ramp",
      subtitle: "Pods scale from 4 → 8 → 16 orgs as the OS and agents mature.",
      sections: [
        {
          heading: "Year 1 – Proto-Pod Team:",
          items: [
            "Founder/CEO",
            "1 Forward-Deployed Director",
            "1 Finance Director",
            "1 Founding Engineer",
          ],
        },
        {
          heading: "Phase 2 – 8 orgs",
          text: "Mature core agents handle repetitive tasks. Same structure supports more orgs.",
        },
        {
          heading: "Phase 3 – 16 orgs",
          text: "2+ FDDs. Standardized playbooks. Agents do recurring work.",
        },
      ],
      image: {
        type: 'infographic',
        placeholder: 'Scaling diagram: 4 orgs → 8 orgs → 16 orgs with team growth visualization',
      },
    },
    {
      id: "director-os",
      title: "Director OS – Product Overview",
      subtitle: "One pane of glass for an org's backbone.",
      sections: [
        {
          heading: "Revenue & Relationships",
          text: "Major gifts map, warm pipeline, next-best actions",
        },
        {
          heading: "Runway & Finance",
          text: "Live cash forecasts, budget vs actuals visibility",
        },
        {
          heading: "Ops & Compliance",
          text: "Recurring task engine, checklists, playbooks",
        },
        {
          heading: "Narratives & Reporting",
          text: "Board decks, funder reports, impact one-pagers",
        },
      ],
      footnote: "Data flows in from email, calendar, finance systems, docs, and existing CRMs.",
      image: {
        type: 'mockup',
        placeholder: 'Dashboard mockup showing 4 quadrants: Revenue, Runway, Ops, Narratives',
      },
    },
    {
      id: "ai-agents",
      title: "AI Agents – How We 2–4x Human Capacity",
      subtitle: "Specialized agents do the repetitive work; humans do the judgment.",
      sections: [
        {
          heading: "Major Gifts Agent",
          items: [
            "Scans email, calendar, CRM",
            "Maintains relationship maps",
            "Drafts donor emails & briefs",
          ],
        },
        {
          heading: "Finance & Runway Agent",
          items: [
            "Pulls accounting data",
            "Proposes categorizations",
            "Raises runway alerts",
          ],
        },
        {
          heading: "Ops & Compliance Agent",
          items: [
            "Runs recurring checklists",
            "Generates reminders",
            "Manages task lists",
          ],
        },
        {
          heading: "Board & Reporting Agent",
          items: [
            "Assembles board decks",
            "Creates funder reports",
            "Keeps board-ready view",
          ],
        },
      ],
      highlight: "Agents explore, compile, and draft. FDDs and Directors review, edit, and decide.",
      image: {
        type: 'diagram',
        placeholder: '4 AI agent icons with workflow arrows showing data flow between them',
      },
    },
    {
      id: "economics",
      title: "Economics – Why This Makes Sense",
      subtitle: "Director makes a serious backbone affordable and scalable.",
      sections: [
        {
          heading: "Traditional backbone costs ($500-700k org):",
          items: [
            "ED: $100–150k",
            "Ops/Finance: ~$100k",
            "Dev: ~$100k",
            "Comms/Program ops: $60–100k",
            "Total: $360–450k/year",
          ],
        },
        {
          heading: "With Director:",
          items: [
            "ED/founder: $100–150k",
            "Director Pod: ~$80–120k/year",
            "Total backbone: $180–270k/year",
          ],
        },
      ],
      highlight: "Save $100-180k/year in backbone costs",
      footnote: "As Pods scale, pod-level gross margins expand while keeping human leadership involvement high.",
      image: {
        type: 'chart',
        placeholder: 'Side-by-side bar chart: Traditional ($360-450k) vs Director ($180-270k)',
      },
    },
    {
      id: "why-now",
      title: "Why Now – AI Agents + Nonprofit Pressure",
      subtitle: "Two timing curves are intersecting.",
      sections: [
        {
          heading: "Agentic AI is production-ready:",
          items: [
            "\"AI coworkers\" already shipping in engineering, finance, and customer ops",
            "Small human teams can manage far more complexity with agents",
          ],
        },
        {
          heading: "Nonprofits are under structural pressure:",
          items: [
            "Orgs with $1M+ budgets are losing staff",
            "Funders want grantees with credible backbones and visibility",
          ],
        },
      ],
      highlight: "Director sits at this intersection: an AI-native backbone delivered by a lean, forward-deployed team to orgs that cannot justify rebuilding full in-house leadership.",
      image: {
        type: 'chart',
        placeholder: 'Two intersecting trend lines: AI capability (rising) meets nonprofit need (rising)',
      },
    },
    {
      id: "go-to-market",
      title: "Go-to-Market",
      subtitle: "We start where we already have pull.",
      sections: [
        {
          heading: "Existing relationships",
          text: "First 2–4 orgs from founders you're already effectively \"directing.\"",
        },
        {
          heading: "Downshifted $1M orgs",
          text: "Target leaders who proved they can raise $400k–$1M but had to cut staff.",
        },
        {
          heading: "Funder collaborations",
          text: "Position Director as capacity-building that makes grantees more investable.",
        },
        {
          heading: "Sales motion:",
          items: [
            "Short diagnostic: map \"today vs with Director\"",
            "Demo Director OS + agents",
            "Show what gets taken off the founder's plate",
            "Close annual retainers",
            "Expand scope over time",
          ],
        },
      ],
      image: {
        type: 'diagram',
        placeholder: 'Concentric circles: Inner (existing relationships) → Middle (downshifted orgs) → Outer (funder partnerships)',
      },
    },
    {
      id: "business-model",
      title: "Business Model & QSBS-Friendly Structure",
      subtitle: "AI-native vertical SaaS with embedded forward-deployed team.",
      sections: [
        {
          heading: "Revenue model",
          items: [
            "Annual retainers per org",
            "Tied to budget band and complexity",
            "Goal: multiple Pods, each supporting up to 16 orgs",
          ],
        },
        {
          heading: "Cost structure",
          items: [
            "Lean Pods (FDD + Finance Director)",
            "Supported by agents and product",
            "Engineering compounds across all clients",
          ],
        },
        {
          heading: "QSBS-aware design",
          items: [
            "U.S. C-corp",
            "Product-centric operating business",
            "Software & data model assets",
          ],
        },
      ],
      image: {
        type: 'diagram',
        placeholder: 'Business model flywheel: Retainers → Pod capacity → AI leverage → More orgs',
      },
    },
    {
      id: "team",
      title: "Team – Lean Year-1 Plan",
      subtitle: "Small, high-leverage founding team with 12 months of runway.",
      sections: [
        {
          heading: "Founder & CEO",
          text: "Vision, sales, fundraising, relationships",
        },
        {
          heading: "Founding Engineer (hire #1)",
          text: "Director OS + first wave of agents",
        },
        {
          heading: "Forward-Deployed Director (hire #2)",
          text: "Nonprofit ops + fundraising, embedded across first ~4 orgs",
        },
        {
          heading: "Finance Director (hire #3)",
          text: "Finance + ops across pod, designs playbooks",
        },
      ],
      footnote: "Target raise: ~$800k–$1M for 12 months runway. Early org retainers reduce net burn.",
      image: {
        type: 'photo',
        placeholder: 'Team headshots or org chart showing 4 founding roles',
      },
    },
    {
      id: "roadmap",
      title: "Roadmap & Ask",
      subtitle: "",
      sections: [
        {
          heading: "0–12 months (this raise):",
          items: [
            "Hire FDD, Finance Director, Founding Engineer",
            "Onboard 2–4 orgs",
            "Ship v1 Director OS and core agents",
            "Prove: 4-org pod delivers revenue and stability lift",
          ],
        },
        {
          heading: "12–24 months:",
          items: [
            "Scale pod to 8 orgs",
            "Harden agents and playbooks",
            "Add additional FDD/finance/ops capacity",
          ],
        },
        {
          heading: "24+ months:",
          items: [
            "16-org pods on mature OS",
            "Multiple pods focused on key verticals",
          ],
        },
      ],
      image: {
        type: 'infographic',
        placeholder: 'Timeline roadmap: Year 1 (4 orgs) → Year 2 (8 orgs) → Year 3+ (16 orgs per pod)',
      },
    },
  ],
  slideOrder: defaultSlideOrder,
  ask: {
    amount: "$800k–$1.0M",
    items: [
      "Fund 12+ months of lean team and product development",
      "Prove the 4 → 8 → 16 org capacity story with real customers",
      "Build Director into the AI-native backbone for the orgs that can least afford to lose theirs",
    ],
  },
};

// Helper to get slides in the specified order
export function getOrderedSlides(content: DeckContent): SlideContent[] {
  const order = content.slideOrder || defaultSlideOrder;
  const slideMap = new Map(content.slides.map(s => [s.id, s]));
  
  // Get slides in order, filtering out any IDs that don't have matching slides
  const orderedSlides = order
    .map(id => slideMap.get(id))
    .filter((s): s is SlideContent => s !== undefined);
  
  // Append any slides not in the order array (so nothing gets lost)
  const orderedIds = new Set(order);
  const remainingSlides = content.slides.filter(s => !orderedIds.has(s.id));
  
  return [...orderedSlides, ...remainingSlides];
}
