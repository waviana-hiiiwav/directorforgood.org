/**
 * Sync PITCH_DECK.txt with deck-content.json
 * 
 * This script generates a human-readable text version of the pitch deck
 * from the JSON source of truth. It should be run:
 * - Manually via: npx tsx scripts/sync-pitch-deck.ts
 * - Automatically when deck content is saved via admin interface
 * 
 * Usage:
 *   npx tsx scripts/sync-pitch-deck.ts
 */

import fs from 'fs';
import path from 'path';

// Types (duplicated here to avoid import issues with ES modules)
interface SlideImage {
  url?: string;
  placeholder?: string;
  type: 'icon' | 'chart' | 'mockup' | 'infographic' | 'photo' | 'diagram';
}

interface TeamMemberInfo {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface SlideSection {
  heading?: string;
  items?: string[];
  text?: string;
}

interface SlideContent {
  id: string;
  title: string;
  subtitle?: string;
  sections?: SlideSection[];
  teamMembers?: TeamMemberInfo[];
  highlight?: string;
  callout?: string;
  footnote?: string;
  image?: SlideImage;
}

interface DeckContent {
  cover: {
    title: string;
    tagline: string;
    subtagline: string;
    oneliner?: string;
    url: string;
  };
  slides: SlideContent[];
  slideOrder?: string[];
  ask: {
    amount: string;
    items: string[];
  };
}

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'deck-content.json');
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'PITCH_DECK.txt');

const SEPARATOR = '='.repeat(80);

function getOrderedSlides(content: DeckContent): SlideContent[] {
  const order = content.slideOrder || [];
  const slideMap = new Map(content.slides.map(s => [s.id, s]));
  
  const orderedSlides = order
    .map(id => slideMap.get(id))
    .filter((s): s is SlideContent => s !== undefined);
  
  // Append any slides not in the order array
  const orderedIds = new Set(order);
  const remainingSlides = content.slides.filter(s => !orderedIds.has(s.id));
  
  return [...orderedSlides, ...remainingSlides];
}

function formatSection(section: SlideSection): string {
  const lines: string[] = [];
  
  if (section.heading) {
    lines.push(section.heading);
  }
  
  if (section.items && section.items.length > 0) {
    section.items.forEach(item => {
      lines.push(`• ${item}`);
    });
  }
  
  if (section.text) {
    lines.push(section.text);
  }
  
  return lines.join('\n');
}

function formatSlide(slide: SlideContent, slideNumber: number): string {
  const lines: string[] = [];
  
  lines.push(SEPARATOR);
  lines.push(`SLIDE ${slideNumber}: ${slide.title}`);
  lines.push(SEPARATOR);
  lines.push('');
  
  if (slide.subtitle) {
    lines.push(slide.subtitle);
    lines.push('');
  }
  
  // Team members (for team slide)
  if (slide.teamMembers && slide.teamMembers.length > 0) {
    lines.push('TEAM:');
    slide.teamMembers.forEach(member => {
      lines.push(`${member.name} – ${member.role}`);
      lines.push(member.bio);
      lines.push('');
    });
  }
  
  // Sections
  if (slide.sections && slide.sections.length > 0) {
    slide.sections.forEach(section => {
      lines.push(formatSection(section));
      lines.push('');
    });
  }
  
  // Highlight
  if (slide.highlight) {
    lines.push(`HIGHLIGHT: ${slide.highlight}`);
    lines.push('');
  }
  
  // Callout
  if (slide.callout) {
    lines.push(`CALLOUT: ${slide.callout}`);
    lines.push('');
  }
  
  // Footnote/Note
  if (slide.footnote) {
    lines.push(`NOTE: ${slide.footnote}`);
    lines.push('');
  }
  
  // Image placeholder
  if (slide.image?.placeholder) {
    lines.push(`IMAGE: ${slide.image.placeholder}`);
    lines.push('');
  }
  
  return lines.join('\n');
}

function formatDeck(content: DeckContent): string {
  const lines: string[] = [];
  
  // Header
  lines.push(SEPARATOR);
  lines.push('DIRECTOR PITCH DECK');
  lines.push(SEPARATOR);
  lines.push('');
  lines.push(`TITLE: ${content.cover.title}`);
  lines.push(`TAGLINE: ${content.cover.tagline}`);
  lines.push(`SUBTAGLINE: ${content.cover.subtagline}`);
  if (content.cover.oneliner) {
    lines.push(`ONE-LINER: ${content.cover.oneliner}`);
  }
  lines.push(`WEBSITE: ${content.cover.url}`);
  lines.push('');
  
  // Slides in order
  const orderedSlides = getOrderedSlides(content);
  orderedSlides.forEach((slide, index) => {
    lines.push(formatSlide(slide, index + 1));
  });
  
  // The Ask
  lines.push(SEPARATOR);
  lines.push(`THE ASK: ${content.ask.amount}`);
  lines.push(SEPARATOR);
  lines.push('');
  content.ask.items.forEach(item => {
    lines.push(`• ${item}`);
  });
  lines.push('');
  lines.push(SEPARATOR);
  lines.push('');
  
  return lines.join('\n');
}

export function syncPitchDeckFile(content?: DeckContent): void {
  try {
    // Load content if not provided
    let deckContent = content;
    if (!deckContent) {
      if (!fs.existsSync(CONTENT_FILE_PATH)) {
        console.error('deck-content.json not found');
        return;
      }
      const fileContent = fs.readFileSync(CONTENT_FILE_PATH, 'utf-8');
      deckContent = JSON.parse(fileContent) as DeckContent;
    }
    
    // Generate and write
    const output = formatDeck(deckContent);
    fs.writeFileSync(OUTPUT_FILE_PATH, output, 'utf-8');
    
    const slideCount = getOrderedSlides(deckContent).length;
    console.log(`✓ Synced PITCH_DECK.txt (${slideCount} slides)`);
  } catch (error) {
    console.error('Error syncing PITCH_DECK.txt:', error);
  }
}

// Run if called directly
if (require.main === module) {
  console.log('Syncing PITCH_DECK.txt from deck-content.json...');
  syncPitchDeckFile();
}





