/**
 * Director Knowledge Base for AI Chatbot
 * 
 * This file contains structured information about Director
 * that the chatbot uses to answer visitor questions.
 * 
 * The pitch deck content is dynamically loaded from deck-content.json
 * so the chatbot always has the latest information.
 */

import { getDeckContent } from './deck-content-server';
import { FDD_TOOLS_PROMPT, getQuickReferenceText } from './fdd-tools';

/**
 * Convert deck-content.json to readable text for the chatbot
 */
export function getDeckContentAsText(): string {
  const deck = getDeckContent();
  
  let text = `================================================================================
DIRECTOR PITCH DECK
================================================================================

TITLE: ${deck.cover.title}
TAGLINE: ${deck.cover.tagline}
SUBTAGLINE: ${deck.cover.subtagline}
${deck.cover.oneliner ? `ONE-LINER: ${deck.cover.oneliner}\n` : ''}WEBSITE: ${deck.cover.url}

`;

  // Convert each slide in order
  const slideOrder = deck.slideOrder || deck.slides.map((s: { id: string }) => s.id);
  let slideNum = 1;
  
  for (const slideId of slideOrder) {
    const slide = deck.slides.find((s: { id: string }) => s.id === slideId);
    if (!slide) continue;
    
    text += `================================================================================
SLIDE ${slideNum}: ${slide.title}
================================================================================

`;
    
    if (slide.subtitle) {
      text += `${slide.subtitle}\n\n`;
    }
    
    // Handle sections
    if (slide.sections) {
      for (const section of slide.sections) {
        if (section.heading) {
          text += `${section.heading}\n`;
        }
        if (section.text) {
          text += `${section.text}\n`;
        }
        if (section.items) {
          for (const item of section.items) {
            text += `• ${item}\n`;
          }
        }
        text += '\n';
      }
    }
    
    // Handle team members (for team slide)
    if (slide.teamMembers) {
      text += `TEAM:\n`;
      for (const member of slide.teamMembers) {
        text += `${member.name} – ${member.role}\n`;
        if (member.bio) {
          text += `${member.bio}\n`;
        }
        text += '\n';
      }
    }
    
    if (slide.highlight) {
      text += `HIGHLIGHT: ${slide.highlight}\n\n`;
    }
    
    if (slide.callout) {
      text += `CALLOUT: ${slide.callout}\n\n`;
    }
    
    if (slide.footnote) {
      text += `NOTE: ${slide.footnote}\n\n`;
    }
    
    slideNum++;
  }
  
  // Add the ask
  if (deck.ask) {
    text += `================================================================================
THE ASK: ${deck.ask.amount}
================================================================================

`;
    for (const item of deck.ask.items) {
      text += `• ${item}\n`;
    }
  }
  
  return text;
}

export const DIRECTOR_FAQ = `
# Director Knowledge Base

## About Director

**What is Director?**
Director is an AI-native operating system and forward-deployed backbone for nonprofits. We help under-resourced nonprofit founders become fundable, operationally tight organizations by providing the leadership capacity they can't afford to rebuild alone.

**Who is Director for?**
Director serves nonprofit founders who are carrying 5 jobs on 1 salary - leading programs, raising money, running operations, managing communications, and handling compliance. Our initial focus is on "downshifted orgs" - organizations that previously had $400K-$1M budgets but have had to lay off staff due to funding pressures.

**How does Director work?**
Director combines two components:
1. **Director OS** - A vertical operating system covering revenue & relationships, runway & finance, ops & compliance, and board & funder narratives
2. **Director Pod** - Shared leadership capacity including a Forward-Deployed Director (FDD), finance/ops leadership, and dedicated support roles

**What problem does Director solve?**
Promising nonprofits plateau at $300-600K or quietly shut down - not for lack of impact, but for lack of backbone. When funding tightens and staff are cut, all leadership responsibilities collapse back onto one person. Director provides the integrated, AI-native backbone these organizations need.

## How Director Helps

**What does Director OS include?**
- Revenue & Relationships: Major gifts map, warm pipeline, next-best actions
- Runway & Finance: Live cash forecasts, budget vs actuals visibility
- Ops & Compliance: Recurring task engine, checklists, playbooks
- Narratives & Reporting: Board decks, funder reports, impact one-pagers

**What are AI Agents?**
Director uses specialized AI agents that handle repetitive work while humans focus on judgment:
- Major Gifts Agent: Scans email, calendar, CRM; maintains relationship maps; drafts donor communications
- Finance & Runway Agent: Pulls accounting data, proposes categorizations, raises runway alerts
- Ops & Compliance Agent: Runs checklists, generates reminders, manages task lists
- Board & Reporting Agent: Assembles board decks, creates funder reports

**What is a Director Pod?**
A Director Pod is a shared leadership team that serves multiple nonprofit organizations. Year 1 structure includes:
- Founder/CEO
- 1 Forward-Deployed Director (FDD)
- 1 Finance Director
- 1 Founding Engineer

Pods scale from 4 → 8 → 16 orgs as the OS and agents mature.

## Economics & Pricing

**How much does Director cost?**
Director Pod services cost approximately $80-120K/year per organization, compared to $360-450K/year for traditional backbone staffing (ED, Ops/Finance, Development, Comms roles).

**What's the savings?**
Organizations can save $100-180K/year in backbone costs while getting better coverage through AI-augmented human leadership.

## For Foundations

**Can foundations sponsor multiple organizations?**
Yes! Foundations are an ideal customer segment. A single foundation can purchase Director packages for 5-10 grantees at once, providing:
- Measurable capacity ROI across their portfolio
- Backbone support that individual orgs couldn't afford alone
- One contract covering multiple organizations

**How do foundation partnerships work?**
Contact us to discuss capacity-building investments in your grantee portfolio. Director can be positioned as capacity-building that makes grantees more investable.

## Getting Started

**How do I learn more about Director?**
- Visit directorforgood.org
- View our pitch deck at directorforgood.org/deck
- Contact us at info@directorforgood.org

**How can my organization become a Director client?**
We start with a short diagnostic that maps your "today vs with Director" - showing what gets taken off the founder's plate. Contact us to schedule.

## Investment

**Is Director raising funding?**
Yes, Director is raising $1M to fund 12+ months of lean team and product development. The goal is to prove the 4 → 8 → 16 org capacity story with real customers.

**What will the funding support?**
- Hire FDD, Finance Director, Founding Engineer
- Onboard 2-4 initial organizations
- Ship v1 Director OS and core agents
- Prove that a 4-org pod delivers revenue and stability lift

## Contact

**How can I reach Director?**
- Website: directorforgood.org
- Email: info@directorforgood.org
- Pitch deck: directorforgood.org/deck
`;

/**
 * Build the chatbot system prompt dynamically
 * This reads from deck-content.json so changes are automatically reflected
 */
export function getChatbotSystemPrompt(): string {
  const pitchDeckContent = getDeckContentAsText();
  
  return `You are Director's helpful AI assistant. Your job is to help visitors learn about Director, our AI-native backbone service for nonprofits, and how they can work with us.

PERSONALITY:
- Be professional, knowledgeable, and helpful
- Keep responses concise but informative
- Focus on the value Director provides to nonprofit founders
- When appropriate, encourage visitors to view the pitch deck or get in touch

GUIDELINES:
- Always provide accurate information based on the knowledge base below
- If you don't know something specific, say so and direct them to info@directorforgood.org
- For partnership discussions or investment inquiries, direct people to contact us directly
- Don't make up information that isn't in the knowledge base
- When mentioning links, use directorforgood.org paths

${DIRECTOR_FAQ}

## Full Pitch Deck Reference

${pitchDeckContent}

## FDD Tools Database

When asked about tools, software recommendations, or how to set up operations for a nonprofit, use this tools database:

${getQuickReferenceText()}

For detailed tool information, refer to the full tools database:

${FDD_TOOLS_PROMPT}

If someone asks about something not covered here, kindly let them know and suggest they email info@directorforgood.org for more information.`;
}

// Keep backward compatibility - export a static version for any code that imports CHATBOT_SYSTEM_PROMPT directly
// Note: This will be evaluated once at module load time, so prefer using getChatbotSystemPrompt() for dynamic content
export const CHATBOT_SYSTEM_PROMPT = getChatbotSystemPrompt();





