export interface SlideData {
  id: string;
  type: 'cover' | 'toc' | 'intro' | 'stats' | 'content' | 'highlight' | 'about' | 'leaders' | 'moments' | 'initiatives' | 'budget' | 'funding' | 'cta' | 'quote' | 'appendix' | 'story' | 'startups' | 'coalition' | 'outcomes' | 'vision' | 'commitment' | 'positioning' | 'goals-results' | 'exec-summary';
  theme: 'purple-silk' | 'black' | 'orange' | 'purple-solid' | 'lime' | 'white';
  content: Record<string, unknown>;
}

export const initialSlides: SlideData[] = [
  {
    "content": {
      "year": "2025-2026",
      "title": "PHASE II",
      "titleLine2": "PROPOSAL",
      "eventName": "Oakland",
      "eventTagline": "TECH WEEK",
      "organization": "HiiiWAV",
      "website": "www.hiiiwav.org",
      "address": "2781 Telegraph Ave,\nOakland, CA 94612",
      "email": "bosko@hiiiwav.org",
      "phone": "323-481-7372",
      "tagline": "*HiiiWAV Is A 501(C)3 Nonprofit Corporation"
    },
    "id": "cover",
    "type": "cover",
    "theme": "purple-silk"
  },
  {
    "content": {
      "title": "Executive Summary",
      "paragraphs": [
        "Oakland Tech Week proved that Oakland can lead the Bay Area in responsible, community-rooted innovation—when the right partners build together. In 2025, HiiiWAV, the Kapor Foundation, Northeastern University Oakland, and the City of Oakland launched a seven-day, citywide convening that surpassed every target: 40+ events, 4,200+ participants, 30+ coalition organizations, and 14 Oakland-aligned startups showcased directly to active investors. It wasn’t a conference—it was the public debut of a durable platform now known as City of Belonging, designed to ensure technology is built with communities, not on top of them.",
        "Phase II (2025–2026) is the scale plan. With a $1.25M two-year budget and $1.05M remaining to raise, we will expand Oakland Tech Week into a year-round ecosystem that strengthens founder pipelines, workforce pathways, and civic-ready responsible AI. Phase II includes: production of Oakland Tech Week 2026 (Nov 15–22, 2026) targeting 60+ events and 6,000+ participants; a year-round accelerator supporting 50 founders; and a $100K prize pool to unlock pilots, customers, and investment. We will also resource coalition backbone capacity and expand initiatives already launched—CR4AI (Community Research Center for Reliable AI), Town Alive activation zones, Laney College’s AI Center of Excellence, A.P.P. Accelerator, and Code Vibes AI certification.",
        "SF Foundation’s investment is catalytic because it strengthens the connective tissue: coalition capacity, neighborhood activations, and an equitable innovation narrative grounded in economic justice. Together, we can turn a remarkable launch into a 5-year, $5M platform that keeps Oakland’s culture, talent, and wealth-building at the center of the AI era."
      ]
    },
    "id": "exec-summary",
    "type": "exec-summary",
    "theme": "white"
  },
  {
    "content": {
      "title": "TABLE OF\nCONTENTS",
      "image": "/images/networking-event.png",
      "imageCaption": "Dame Drummer @ HiiiWAV FEST",
      "donors": "Oakland Tech Week was made possible through a grant from the Kapor Foundation and foundational partnerships with Northeastern University and the City of Oakland.",
      "items": [
        {
          "title": "Oakland organizations committed to building",
          "page": "3"
        },
        {
          "title": "Why this coalition, why now?",
          "page": "4"
        },
        {
          "title": "We said it. We did it.",
          "page": "5"
        },
        {
          "title": "City of Belonging x Oakland Tech Week",
          "page": "6"
        },
        {
          "title": "Successful Launch: What We Did Together",
          "page": "7"
        },
        {
          "title": "Who Showed Up: Leaders Across the Town",
          "page": "8"
        },
        {
          "title": "Moments That Defined the Week",
          "page": "9"
        },
        {
          "title": "HiiiWAV Fest & The Voice Pitch",
          "page": "10"
        },
        {
          "title": "Story: Kev Choice & Choice Scores",
          "page": "11"
        },
        {
          "title": "The Funding Coalition",
          "page": "12"
        },
        {
          "title": "Who's in the Oakland Innovation Coalition",
          "page": "13"
        },
        {
          "title": "Kapor's Anchor Role:",
          "page": "14"
        },
        {
          "title": "The 5-Year Vision: $5M Platform",
          "page": "15"
        },
        {
          "title": "Closing: From Launch to Legacy",
          "page": "16"
        },
        {
          "title": "Events and Hosts",
          "page": "17"
        }
      ]
    },
    "id": "toc",
    "type": "toc",
    "theme": "white"
  },
  {
    "content": {
      "title": "50+ Oakland organizations\ncommitted to building",
      "subtitle": "A cross-sector table of civic leaders, technologists, investors, and community builders",
      "partners": [
        {
          "name": "HiiiWAV",
          "domain": "hiiiwav.org"
        },
        {
          "name": "Kapor Foundation",
          "domain": "kaporfoundation.org"
        },
        {
          "name": "Northeastern Oakland",
          "domain": ""
        },
        {
          "name": "City of Oakland",
          "domain": "oaklandca.gov"
        },
        {
          "name": "Hidden Genius Project",
          "domain": "hiddengeniusproject.org"
        },
        {
          "name": "Black Girls Code",
          "domain": ""
        },
        {
          "name": "BLCKVC",
          "domain": ""
        },
        {
          "name": "Good Trouble Ventures",
          "domain": "goodtrouble.vc"
        },
        {
          "name": "Laney College",
          "domain": ""
        },
        {
          "name": "Hack the Hood",
          "domain": "hackthehood.org"
        },
        {
          "name": "Block",
          "domain": "block.xyz"
        },
        {
          "name": "/dev/color",
          "domain": "devcolor.org"
        },
        {
          "name": "Adaelo",
          "domain": "adaelo.com"
        },
        {
          "name": "AGOG",
          "domain": "agog.org"
        },
        {
          "name": "Black at Meta",
          "domain": "meta.com"
        },
        {
          "name": "Black in AI",
          "domain": "blackinai.github.io"
        },
        {
          "name": "Black Innovation Alliance",
          "domain": "blackinnovationalliance.com"
        },
        {
          "name": "BlackOps VC",
          "domain": "blackops.vc"
        },
        {
          "name": "Campground",
          "domain": "campground.co"
        },
        {
          "name": "Capital Grains",
          "domain": "capitalgrains.com"
        },
        {
          "name": "Change Consulting",
          "domain": "change-consulting.com"
        },
        {
          "name": "Circuit Launch",
          "domain": "circuitlaunch.com"
        },
        {
          "name": "Collide Capital",
          "domain": "collidecap.com"
        },
        {
          "name": "Cultural Power",
          "domain": "culturalpower.org"
        },
        {
          "name": "East Bay EDA",
          "domain": "eastbayeda.org"
        },
        {
          "name": "EOYDC",
          "domain": "eoydc.org"
        },
        {
          "name": "Gameheads",
          "domain": "gameheadsoakland.org"
        },
        {
          "name": "GILS",
          "domain": "gils.org"
        },
        {
          "name": "ICA Fund Good Jobs",
          "domain": "ica.fund"
        },
        {
          "name": "Kai XR",
          "domain": "kaixr.com"
        },
        {
          "name": "Kapor Capital",
          "domain": "kaporcapital.com"
        },
        {
          "name": "Kinfolx",
          "domain": "kinfolx.com"
        },
        {
          "name": "Kingmakers of Oakland",
          "domain": "kingmakersofoakland.org"
        },
        {
          "name": "LANDBACK Tech",
          "domain": ""
        },
        {
          "name": "Launch Darkly",
          "domain": "launchdarkly.com"
        },
        {
          "name": "Make It Bay",
          "domain": "makeitbay.com"
        },
        {
          "name": "National Society of Black Engineers",
          "domain": "nsbe.org"
        },
        {
          "name": "New Media Ventures",
          "domain": "newmediaventures.org"
        },
        {
          "name": "Oakland Fund for Public Innovation",
          "domain": "oaklandfund.org"
        },
        {
          "name": "Oakland Undivided",
          "domain": "oaklandundivided.org"
        },
        {
          "name": "Occur",
          "domain": "occuroakland.org"
        },
        {
          "name": "Omidyar Network",
          "domain": "omidyar.com"
        },
        {
          "name": "PosterChild",
          "domain": "posterchild.co"
        },
        {
          "name": "Proximity AI Lab",
          "domain": "proximitylab.com"
        },
        {
          "name": "Self-Esteem",
          "domain": "selfesteem.org"
        },
        {
          "name": "SFBU",
          "domain": "sfbu.edu"
        },
        {
          "name": "SomosVC",
          "domain": "somos.vc"
        },
        {
          "name": "Streetcode",
          "domain": "streetcode.org"
        },
        {
          "name": "Syntex[data]",
          "domain": "syntex.data"
        },
        {
          "name": "Take-Two Interactive",
          "domain": "take2games.com"
        },
        {
          "name": "TechEquity Collaborative",
          "domain": "techequitycollaborative.org"
        },
        {
          "name": "TerminusAR",
          "domain": "terminusar.com"
        },
        {
          "name": "The Town Experience",
          "domain": "thetownexperience.com"
        },
        {
          "name": "Think Common",
          "domain": "thinkcommon.com"
        }
      ],
      "footer": "United by a shared vision: technology built with communities, not on top of them."
    },
    "id": "coalition-commitment",
    "type": "commitment",
    "theme": "purple-silk"
  },
  {
    "content": {
      "title": "Why This Coalition, Why Now",
      "context": "Oakland sits in a $40.7B East Bay innovation economy supporting 150,000+ jobs—yet local talent remains underinvested. The city can't do this alone. It needs a dedicated backbone organization with cross-sector trust and proven execution.",
      "reasons": [
        {
          "title": "Deep Community Trust",
          "description": "HiiiWAV + coalition partners have 50+ years combined experience in Oakland workforce, arts, and tech ecosystems."
        },
        {
          "title": "Anchor Institution Backing",
          "description": "Kapor Foundation, Northeastern Oakland, and City of Oakland are publicly committed as founding partners."
        },
        {
          "title": "Existing Infrastructure",
          "description": "We already built the coalition, launched 6 new initiatives, and proved the model with 4,200+ participants."
        },
        {
          "title": "Unique Positioning",
          "description": "No other group has this blend of culture, tech, civic, and capital relationships rooted in Oakland."
        }
      ],
      "footer": "We're not proposing an experiment—we're scaling a proven model with institutional backing."
    },
    "id": "why-us",
    "type": "positioning",
    "theme": "black"
  },
  {
    "content": {
      "title": "We Said It. We Did It.",
      "subtitle": "Year 1 goals vs. actual results",
      "items": [
        {
          "goal": "3,000 participants",
          "result": "4,200+ participants",
          "percentage": "140%"
        },
        {
          "goal": "25+ events",
          "result": "40+ events",
          "percentage": "160%"
        },
        {
          "goal": "Build coalition of orgs",
          "result": "30+ organizations joined"
        },
        {
          "goal": "Launch responsible AI programming",
          "result": "CR4AI, Town on AI, AI Summit delivered"
        },
        {
          "goal": "Showcase local founders",
          "result": "14 startups pitched to active investors"
        },
        {
          "goal": "Launch new initiatives",
          "result": "6 new programs (BAAICoE, Code Vibes, etc.)"
        }
      ],
      "footer": "These proof points show we're already on the path to our 5-year vision."
    },
    "id": "goals-vs-results",
    "type": "goals-results",
    "theme": "orange"
  },
  {
    "content": {
      "title": "City of Belonging x\nOakland Tech Week",
      "subtitle": "From Successful Launch to a $5M Platform for Oakland",
      "bullets": [
        "A multi-year effort to make Oakland a national model for community-rooted innovation",
        "Anchored by Oakland Tech Week, the Oakland Innovation Coalition, and a responsible AI hub",
        "Phase I (2025–2026): $1.25M two-year initiative",
        "5-Year Vision: Grow into a $5M platform for Oakland's creative and tech future"
      ]
    },
    "id": "city-of-belonging",
    "type": "intro",
    "theme": "black"
  },
  {
    "content": {
      "title": "Successful Launch:\nWhat We Did Together",
      "subtitle": "Oakland Tech Week 2025: A Movement Launch, Not Just a Week",
      "bullets": [
        "7 days, 40+ events, 4,200+ participants across downtown, neighborhood venues, campuses, and community spaces",
        "30+ organizations stepping into the Oakland Innovation Coalition",
        "Theme: \"Community, Culture, & Code: Where Innovation Meets Purpose\" — tech built with communities, not on top of them",
        "Powered by HiiiWAV, Kapor Foundation, Northeastern University Oakland, and the City of Oakland"
      ]
    },
    "id": "successful-launch",
    "type": "highlight",
    "theme": "orange"
  },
  {
    "content": {
      "title": "WHO SHOWED UP:\nLeaders Across the Town",
      "subtitle": "A cross-sector table, in one week",
      "categories": [
        {
          "name": "City & County Leadership",
          "items": [
            "Mayor Barbara Lee",
            "Councilmembers Rowena Brown & Carroll Fife",
            "Stephen Baiter (East Bay EDA)",
            "City Council Member Rowena Brown",
            "Alameda County tech leaders"
          ]
        },
        {
          "name": "Philanthropy & Capital",
          "items": [
            "Allison Scott & Lili Gangas (Kapor)",
            "Nate Jones (Kapor Investments)",
            "Aniyia Williams (Omidyar Network)",
            "Fred Blackwell (SF Foundation)",
            "Phil Sanders (New Media Ventures)",
            "Good Trouble Ventures",
            "BLCKVC"
          ]
        },
        {
          "name": "Industry & Research",
          "items": [
            "Leaders from Mozilla",
            "Salesforce",
            "and the Global Institute for the Learning Society",
            "plus 70+ speakers at Northeastern's CR4AI launch"
          ]
        },
        {
          "name": "Artists & Creatives",
          "items": [
            "Cordae",
            "Baron Davis",
            "Bosko",
            "Alphabet Rockers",
            "The Soul Slappers",
            "and more — blending music",
            "sports",
            "kids' content",
            "and AI-powered creativity"
          ]
        }
      ]
    },
    "id": "who-showed-up",
    "type": "leaders",
    "theme": "black"
  },
  {
    "content": {
      "title": "Moments That Defined the Week",
      "subtitle": "Key convenings that made this feel real",
      "events": [
        {
          "name": "\"Rise, Reset & Reimagine\" + \"The Town on AI\" at Kapor Center",
          "description": "Cross-sector conversations on responsible AI grounded in racial and economic justice"
        },
        {
          "name": "\"From Campus to Career\" AI Summit + Clinics at Northeastern",
          "description": "1,200+ attendees across four days, 300-person hackathon, 70 speakers — students, small business owners, and talent getting hands-on with AI"
        },
        {
          "name": "\"Fueling Oakland's Innovation Ecosystem\" Fireside Chat",
          "description": "Mayor Barbara Lee with Mitch Kapor and Dr. Freada Kapor Klein, moderated by Dan Sachs, connecting AI, entrepreneurship, and workforce pathways"
        },
        {
          "name": "Town Alive: Responsible AI Activation Zones at City Hall",
          "description": "Aligning new tech development with economic activation zones and civic strategies"
        }
      ]
    },
    "id": "moments",
    "type": "moments",
    "theme": "black"
  },
  {
    "content": {
      "title": "Culture x Tech:\nHiiiWAV Fest & The Voice Pitch",
      "subtitle": "When the festival became the finale",
      "bullets": [
        "HiiiWAV Fest & The Voice Pitch Finale closed OTW with a street-level mash-up of live music, AI demos, and founder pitches",
        "Performances by Bosko, The Soul Slappers (from E-40's Tiny Desk), Cofounders The Musical, and HiiiWAV's artist-entrepreneurs",
        "Workshops in Coding AI music & Video production and 3D Modeling led by Bosko Kante, Lance Coleman and Jabari Ali",
        "Supported by Hidden Genius, Kingmakers, & HiiiWAV"
      ]
    },
    "id": "culture-tech",
    "type": "highlight",
    "theme": "orange"
  },
  {
    "content": {
      "title": "Story: Kev Choice & Choice Scores",
      "subtitle": "From anxiety about AI to winning an AI innovation prize",
      "paragraphs": [
        "Oakland pianist and rapper Kev Choice entered HiiiWAV's AFRO AI accelerator concerned about what AI would do to musicians.",
        "Through AFRO AI, he and co-founders Sam Wilkins and Jorge Hernandez built Choice Scores, an AI tool that turns songs into orchestral scores—turning 40-hour tasks into minutes.",
        "At Oakland Tech Week, Choice Scores presented their product to a room full of investors and potential customers, giving an artist-led creative tech company capital, visibility, and investor connections.",
        "Today, Choice Scores is positioned to help music educators perform independent composers' work live at scale—a concrete example of AI amplifying culture instead of extracting it."
      ]
    },
    "id": "story-kev-choice",
    "type": "story",
    "theme": "black"
  },
  {
    "content": {
      "title": "Story: Youth, Skills &\n\"You Can't Put a Price on This\"",
      "subtitle": "Young people building their own creative tech futures",
      "paragraphs": [
        "In HiiiWAV's youth and AFRO AI programs, dozens of young innovators built projects ranging from AI chatbots to AI-prototyped community spaces.",
        "One AFRO AI summer graduate, Chris, described the experience as gaining skills—from building a chatbot to collaborating in teams—and connections with professionals that \"you can't put a price on.\"",
        "These same youth and early-career creatives showed up at OTW: volunteering, performing, and testing their ideas in front of real investors and city leaders."
      ]
    },
    "id": "story-youth",
    "type": "story",
    "theme": "purple-solid"
  },
  {
    "content": {
      "title": "Story: Leveling Up Local\nCompanies with AI",
      "subtitle": "Grand Nationxl / The Sauce Agency: workforce development in real time",
      "paragraphs": [
        "To produce HiiiWAV Fest and OTW, HiiiWAV ran a four-month AI workforce development lab with event partners Grand Nationxl / The Sauce Agency.",
        "They learned to use large language models for vendor communication, budgeting, and marketing copy; advanced Google Sheets for real-time financials; and AI-powered image/video tools for festival content.",
        "Result: local, Black-led companies are now using AI to run more efficient, higher-margin events, not just as a concept—but as part of their day-to-day operations.",
        "This is the kind of skills transfer and economic mobility City of Belonging is designed to scale."
      ]
    },
    "id": "story-grand-nationxl",
    "type": "story",
    "theme": "black"
  },
  {
    "content": {
      "title": "Founder & Startup Pipeline",
      "subtitle": "14 Oakland-aligned startups on stage, not just in a spreadsheet",
      "startups": [
        "SpaceTime Robotics",
        "Udu Technologies",
        "Kini",
        "Wicked Saints Studios",
        "Starchild Music",
        "Adaelo",
        "CBHQ.io",
        "Str3amcore Labs",
        "Biotwin",
        "Karibu AI",
        "Offyo.ai",
        "Brainvoy AI",
        "Progressive Ventures",
        "Suncoast Ventures",
        "Choice Scores"
      ],
      "outcomes": [
        "Startups built direct relationships with investors like Good Trouble Ventures, New Media Ventures, and BLCKVC",
        "Several founders are now in conversation around term sheets, pilot projects, or partnerships with city and anchor institutions"
      ]
    },
    "id": "founder-pipeline",
    "type": "startups",
    "theme": "black"
  },
  {
    "content": {
      "title": "The Coalition:\nOakland Innovation Coalition",
      "subtitle": "A real table of organizations, not just logos",
      "categories": [
        {
          "name": "Innovation & Technology",
          "items": []
        },
        {
          "name": "Innovation & Technology",
          "items": [
            "Mills College at Northeastern (Responsible AI hub)",
            "University of California",
            "Block"
          ]
        },
        {
          "name": "Capital & Investment",
          "items": [
            "Transparent Collective",
            "BlackOps VC",
            "Somos VC",
            "Capital Grains"
          ]
        },
        {
          "name": "Community & Pipeline",
          "items": [
            "Hidden Genius Project",
            "Black Girls Code",
            "Make It Bay",
            "EOYDC",
            "Hack the Hood",
            "AI Collective",
            "Kingmakers"
          ]
        },
        {
          "name": "Public Sector & Anchor Institutions",
          "items": [
            "City of Oakland",
            "Alameda County",
            "Oakland Fund for Public Innovation",
            "Laney College's BAAICoE",
            "Northeastern's CR4AI & Social Innovation Launchpad"
          ]
        }
      ],
      "footer": "This is the backbone we're now resourcing over 2 and then 5 years."
    },
    "id": "coalition-members",
    "type": "coalition",
    "theme": "purple-solid"
  },
  {
    "content": {
      "title": "Early Outcomes for Oakland",
      "subtitle": "What changed because OTW and City of Belonging launched",
      "outcomes": [
        "Stronger collaboration among community-based tech nonprofits",
        "New responsible AI pilots and a community-driven AI research hub (CR4AI)",
        "Founder–investor pipelines strengthened via OTW showcases and AFRO AI cohorts",
        "Increased foot traffic & spending at local businesses during OTW and HiiiWAV Fest",
        "New workforce and talent programs, including Code Vibes, AFRO AI, and youth labs",
        "A growing cross-sector coalition aligned around equitable innovation and narrative change"
      ],
      "footer": "These are exactly the outcomes the original City of Belonging proposal predicted—now we have proof points on the ground."
    },
    "id": "early-outcomes",
    "type": "outcomes",
    "theme": "black"
  },
  {
    "content": {
      "title": "Year 1: By The Numbers",
      "stats": [
        {
          "label": "Participants",
          "value": "4,200+"
        },
        {
          "label": "Events",
          "value": "40+"
        },
        {
          "label": "Days",
          "value": "7"
        },
        {
          "label": "Coalition Orgs",
          "value": "30+"
        },
        {
          "label": "Startups Showcased",
          "value": "14"
        },
        {
          "label": "AI Summit Attendees",
          "value": "1,200+"
        }
      ]
    },
    "id": "stats",
    "type": "stats",
    "theme": "black"
  },
  {
    "content": {
      "title": "What We Built",
      "subtitle": "6 new initiatives launched — infrastructure that outlasts any single event",
      "initiatives": [
        {
          "name": "Laney College Bay Area AI Center of Excellence",
          "description": "Workforce development and AI training"
        },
        {
          "name": "Town Alive Initiative",
          "description": "Economic & AI Activation Zones"
        },
        {
          "name": "Northeastern Social Innovation Launchpad",
          "description": "Founder development pipeline"
        },
        {
          "name": "CoFounders Oakland Pitch Competition",
          "description": "Spring 2026 launch"
        },
        {
          "name": "CR4AI",
          "description": "Community Research Center for Reliable AI"
        },
        {
          "name": "Code Vibes",
          "description": "AI certification program"
        }
      ]
    },
    "id": "initiatives",
    "type": "initiatives",
    "theme": "black"
  },
  {
    "content": {
      "title": "The Two-Year Vision",
      "rows": [
        {
          "label": "Year 2025",
          "value": "$500K total ($200K in, $300K raising)"
        },
        {
          "label": "Year 2026",
          "value": "$750K (Scale: OTW 2026, accelerator, $100K prizes)"
        },
        {
          "label": "Total",
          "value": "$1.25M"
        }
      ],
      "details": [
        "Oakland Tech Week 2026: November 15-22, 2026",
        "60+ events • 6,000+ participants • $100K prize pool",
        "Year-round accelerator with 50 founders"
      ]
    },
    "id": "two-year-vision",
    "type": "budget",
    "theme": "black"
  },
  {
    "content": {
      "title": "The Investment",
      "subtitle": "$1.05M remaining to complete the vision",
      "rows": [
        {
          "label": "Year 1 Continuation (coalition, narrative, AI hub)",
          "value": "$300K"
        },
        {
          "label": "OTW 2026 Production + HiiiWAV Programming",
          "value": "$225K"
        },
        {
          "label": "Convenings, Meetups & Newsletter",
          "value": "$125K"
        },
        {
          "label": "Accelerator + $100K Prize Pool",
          "value": "$175K"
        },
        {
          "label": "Coalition Backbone",
          "value": "$125K"
        },
        {
          "label": "Core Ops & Reserves",
          "value": "$100K"
        },
        {
          "label": "Total Remaining",
          "value": "$1.05M"
        }
      ]
    },
    "id": "investment",
    "type": "budget",
    "theme": "purple-solid"
  },
  {
    "content": {
      "title": "Kapor's Anchor Role:\n$450K of the $1.25M",
      "subtitle": "Kapor as founding partner of the platform, not just an event sponsor",
      "rows": [
        {
          "label": "Total 2-year initiative (2025–26)",
          "value": "$1.25M"
        },
        {
          "label": "Kapor's leadership",
          "value": "$450K"
        },
        {
          "label": "Already invested in 2025 launch",
          "value": "$200K"
        },
        {
          "label": "Recommended for 2026",
          "value": "$250K"
        }
      ],
      "details": [
        "The fireside chats where Mayor Lee and Mitch Kapor are shaping an inclusive tech narrative",
        "The Town on AI and CR4AI work that keeps Oakland at the forefront of responsible AI",
        "The Kev Choice / Choice Scores-type outcomes—Oakland creators winning capital and building tools that amplify Black culture",
        "Sets the table so other funders are joining an already-working platform, not taking a risk on a hypothetical"
      ]
    },
    "id": "kapor-anchor",
    "type": "budget",
    "theme": "orange"
  },
  {
    "content": {
      "title": "The Rest of the Table:\n$800K from Co-Funders",
      "subtitle": "Inviting peers into a proven initiative",
      "bullets": [
        "Community foundations: SF Foundation, EBCF, SVCF → host support, coalition capacity, neighborhood activations",
        "Thematic funders: Omidyar Network, Akonadi, New Media Ventures → narrative, responsible AI, civic innovation pilots",
        "Corporate partners: Block → prize pool, workforce pathways, internships, sponsor-branded OTW days"
      ]
    },
    "id": "cofunders-table",
    "type": "content",
    "theme": "black"
  },
  {
    "content": {
      "title": "The 5-Year Vision:\n$5M Platform",
      "subtitle": "From a 2-year initiative to a durable City of Belonging",
      "intro": "HiiiWAV's broader plan already calls for $5M over 5 years to scale creative tech and AFRO AI; City of Belonging aligns that vision with a full city ecosystem.",
      "outcomes": [
        "5+ OTWs drawing 15,000+ annual attendees, with national and global visitors",
        "100+ founders/teams supported through accelerators and prizes",
        "1,000+ artists & youth trained through workshops and residencies",
        "A recognized \"City of Belonging\" brand that stands for responsible AI, community wealth-building, and Black creativity leading innovation"
      ],
      "footer": "The two-year, $1.25M phase is how we go from a remarkably successful launch to a durable, 5-year platform for Oakland."
    },
    "id": "five-year-vision",
    "type": "vision",
    "theme": "purple-solid"
  },
  {
    "content": {
      "title": "The Funding Coalition",
      "funders": [
        {
          "name": "Kapor Foundation",
          "ask": "$450K",
          "status": "$200K in, +$250K"
        },
        {
          "name": "SF Foundation",
          "ask": "$150K",
          "status": "Verbal ✓"
        },
        {
          "name": "Block",
          "ask": "$100K",
          "status": "Verbal ✓"
        },
        {
          "name": "Omidyar Network",
          "ask": "$150K",
          "status": "Verbal ✓"
        },
        {
          "name": "New Media Ventures",
          "ask": "$75K",
          "status": "Verbal ✓"
        },
        {
          "name": "University of California",
          "ask": "$25K",
          "status": "In conversation"
        },
        {
          "name": "Oakland Roots and Soul Foundation",
          "ask": "$25K",
          "status": "In conversation"
        },
        {
          "name": "Commercial Bank of California",
          "ask": "$20K",
          "status": "In conversation"
        },
        {
          "name": "East Bay Community Foundation",
          "ask": "$100K",
          "status": "In conversation"
        },
        {
          "name": "SVCF",
          "ask": "$50K",
          "status": "In conversation"
        },
        {
          "name": "Akonadi Foundation",
          "ask": "$30K",
          "status": "In conversation"
        }
      ],
      "total": "$1.25M"
    },
    "id": "funding-coalition",
    "type": "funding",
    "theme": "black"
  },
  {
    "content": {
      "title": "5-Year Budget Trajectory",
      "subtitle": "$5M Over 5 Years",
      "rows": [
        {
          "label": "Year 1",
          "value": "$500K"
        },
        {
          "label": "Year 2",
          "value": "$750K"
        },
        {
          "label": "Year 3",
          "value": "$1M"
        },
        {
          "label": "Year 4",
          "value": "$1.25M"
        },
        {
          "label": "Year 5",
          "value": "$1.5M"
        },
        {
          "label": "TOTAL",
          "value": "$5M"
        }
      ]
    },
    "id": "budget-plan",
    "type": "budget",
    "theme": "black"
  },
  {
    "content": {
      "title": "Year 1 Budget Breakdown",
      "subtitle": "$500K Initial Launch Phase",
      "rows": [
        {
          "label": "Personnel / HiiiWAV",
          "value": "$224K (45%)"
        },
        {
          "label": "Oakland Tech Week Event",
          "value": "$110K (22%)"
        },
        {
          "label": "Activations & Workshops",
          "value": "$70K (14%)"
        },
        {
          "label": "PSA / Commercial",
          "value": "$43K (9%)"
        },
        {
          "label": "Data, Reporting & Research",
          "value": "$25K (5%)"
        },
        {
          "label": "Partner Development",
          "value": "$15K (3%)"
        },
        {
          "label": "Operations",
          "value": "$13K (2%)"
        },
        {
          "label": "TOTAL",
          "value": "$500K (100%)"
        }
      ]
    },
    "id": "budget-breakdown",
    "type": "budget",
    "theme": "black"
  },
  {
    "content": {
      "title": "Funding Coalition",
      "rows": [
        {
          "label": "Kapor Foundation",
          "value": "$450K ($200K received, $250K Y2 committed)"
        },
        {
          "label": "SF Foundation",
          "value": "$150K (Verbal)"
        },
        {
          "label": "Omidyar Network",
          "value": "$100K (Verbal)"
        },
        {
          "label": "Block",
          "value": "$100K (Verbal)"
        },
        {
          "label": "New Media Ventures",
          "value": "$75K (Verbal)"
        },
        {
          "label": "Others (UC, Oakland Roots, etc.)",
          "value": "$325K (In conversation)"
        },
        {
          "label": "TOTAL PIPELINE",
          "value": "$1.25M"
        }
      ]
    },
    "id": "funding-coalition-detailed",
    "type": "budget",
    "theme": "white"
  },
  {
    "content": {
      "title": "5-Year Roadmap",
      "stats": [
        {
          "label": "Startups Supported",
          "value": "200"
        },
        {
          "label": "Deals Facilitated",
          "value": "20"
        },
        {
          "label": "Capital Mobilized",
          "value": "$15M"
        },
        {
          "label": "People Trained",
          "value": "1,000"
        },
        {
          "label": "Job Placements",
          "value": "250"
        },
        {
          "label": "VCs Engaged",
          "value": "35"
        }
      ]
    },
    "id": "five-year-roadmap",
    "type": "stats",
    "theme": "black"
  },
  {
    "content": {
      "title": "Why Now",
      "bullets": [
        "Proven model — Year 1 exceeded all targets",
        "Coalition ready — 30+ orgs aligned and eager to scale",
        "City backing — Mayor Barbara Lee publicly champions the initiative",
        "AI moment — Oakland positioned as responsible AI alternative",
        "Momentum — Now is the time to complete the funding coalition"
      ]
    },
    "id": "why-now",
    "type": "content",
    "theme": "black"
  },
  {
    "content": {
      "title": "EVENT COMMITTEE",
      "team": [
        {
          "name": "Bosko Kante",
          "role": "Executive Director",
          "image": "/images/bosko-kante-headshot.png"
        },
        {
          "name": "Miles Dotson",
          "role": "City of Belonging Lead",
          "image": "/images/miles-dotson-headshot.png"
        },
        {
          "name": "Maya Kante",
          "role": "Cultural Affairs Manager",
          "image": "/images/maya-kante-headshot.png"
        }
      ]
    },
    "id": "team",
    "type": "team",
    "theme": "white"
  },
  {
    "content": {
      "title": "Call to Action",
      "subtitle": "Complete Year 1. Scale Year 2.",
      "body": "Kapor's anchor gave us the launchpad. Now we bring together the full coalition to complete the two-year vision.",
      "nextSteps": [
        "Schedule follow-up conversation",
        "Review detailed budget",
        "Confirm partnership by Q1 2026"
      ],
      "contact": {
        "name": "Bosko Kante",
        "role": "CEO, HiiiWAV",
        "email": "bosko@hiiiwav.com"
      }
    },
    "id": "cta",
    "type": "cta",
    "theme": "purple-silk"
  },
  {
    "content": {
      "quote": "\"We had six weeks to vibe-code an entire conference tech stack and stand up a full festival. Imagine what we can do with the full coalition behind us.\"",
      "attribution": "— Bosko Kante, CEO, HiiiWAV"
    },
    "id": "closing-quote",
    "type": "quote",
    "theme": "black"
  },
  {
    "content": {
      "title": "HiiiLIGHTS",
      "intro": "HiiiWAV is a visionary Black-led organization innovating at the intersection of art and technology to confront the systemic exclusion and exploitation that have long shaped the entertainment and media industries. In cultural hubs like Oakland — where rising costs, lack of access to capital, and now AI-driven disparities threaten the survival of independent creators — we exist to dismantle these barriers. Our mission: to empower historically marginalized artists to reclaim ownership of their craft, amplify their voices, and thrive as builders of a new creative economy.",
      "quote": "\"We do this because too many artists are forced to choose between their craft and financial stability — HiiiWAV exists to change that narrative.\"",
      "quoteAttribution": "- Executive Director, Bosko Kante",
      "milestones": [
        "Securing a permanent home for creatives in Oakland: We purchased our building, establishing a dynamic hub for collaboration, creation, and community power-building.",
        "Debuting HiiiWAV FEST: A boundary-breaking fusion of music, tech, and activism that drew national acclaim.",
        "Launching AFRO AI: The nation's first creative AI accelerator, equipping artists with tools to ethically harness and build new tech.",
        "Nurturing our youth, through three STEAM-focused programs, bridging gaps in access to creative technology.",
        "Earning National Recognition from media (CBS, ABC, KQED, & KMEL) and institutions (Urban League, East Bay Economic Development Alliance, & YBCA)."
      ],
      "team": [
        {
          "name": "Bosko Kante (Executive Director, Grammy-winner, award-winning inventor), Maya Kante, Miles Dotson"
        }
      ],
      "closingQuestion": "What becomes possible when underestimated creatives are given the tools, space, and autonomy to redefine the future?"
    },
    "id": "hiiilights",
    "type": "about",
    "theme": "purple-solid"
  },
  {
    "content": {
      "title": "Appendix",
      "subtitle": "Supporting Documents",
      "documents": [
        {
          "title": "Oakland's First Tech Week Signals a Movement: Building Technology With Communities, Not On Top of Them",
          "id": "oakland-s-first-tech-week-signals-a-movement-building-technology-with-communities-not-on-top-of-them",
          "date": "November 25, 2025",
          "source": "Mayor's Office - Mayor Barbara Lee",
          "type": "announcement",
          "content": "OAKLAND, CA – Mayor Barbara Lee today announced the successful completion of its inaugural Oakland Tech Week (OTW), a landmark seven-day celebration demonstrating that the future of technology and AI can be built with communities, not on top of them, while surfacing concrete economic development opportunities for Oakland's neighborhoods.\n\nOrganized in partnership with HiiiWAV, Kapor Foundation, and Northeastern University Oakland, the week convened more than 4,200 participants across 40+ events, marking the official launch of a new cross-sector movement to position Oakland as a national hub for inclusive, community-driven innovation. OTW's coalition of 30+ organizations (the Oakland Innovation Coalition) is developing/interrogating responsible AI approaches, tools, and applications for local wealth-building, civic innovation, and cultural expression, offering a counter-narrative to displacement-driven tech booms.\n\n\"Oakland Tech Week is setting the standard for what an inclusive technology future should look like,\" said Mayor Barbara Lee. \"We are demonstrating that responsible AI development must increase access and work against systemic bias from the beginning. When done right, technology innovation can expand opportunity while safeguarding equity, accountability, and the cultural richness that defines Oakland.\"\n\nWith the theme \"Community, Culture, & Code: Where Innovation Meets Purpose,\" OTW brought together founders, educators, researchers, investors, artists, students, non-profit and public-sector leaders to showcase how an equity-centered tech ecosystem can be rooted in Oakland's neighborhoods, rather than removed from them.\n\nKey Highlights:\n• \"Rise, Reset and Reimagine\" & \"The Town on AI\" at Kapor Center framed a responsible AI ecosystem\n• AI Summit \"From Campus to Career\" + AI Clinics at Northeastern University Oakland (1,200+ attendees)\n• \"Fueling Oakland's Innovation Ecosystem\" fireside chat with Mayor Barbara Lee, Mitch Kapor, and Dr. Freada Kapor Klein\n• \"Town Alive: Responsible AI Activation Zones\" at Oakland City Hall\n• HiiiWAV Fest & The Voice Pitch Finale featuring The Soul Slappers\n• 14 tech-enabled startups showcased across key regional growth sectors\n\nNew Initiatives Announced:\n• Laney College's Bay Area AI Center of Excellence (BAAICoE)\n• Town Alive Initiative: Economic & AI Zones\n• Northeastern University Oakland Social Innovation Launchpad\n• CoFounders Oakland Pitch Competition for Start-Ups in Spring 2026\n• CR4AI: Community Research Center for Reliable AI at Northeastern\n• HiiiWAV's Code Vibes AI vibe-coding league and certification program\n\nContact: Justin Phillips, Mayor's Office - jbphillips@oaklandca.gov"
        }
      ]
    },
    "id": "appendix",
    "type": "appendix",
    "theme": "black"
  }
];
