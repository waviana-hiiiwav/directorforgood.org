import fs from 'fs';
import path from 'path';

const MD_PATH = path.join(process.cwd(), 'data/deck-editor/otw-content.md');
const TS_PATH = path.join(process.cwd(), 'data/otw-slides.ts');

function parseMarkdown(md: string) {
  const slides: any[] = [];
  const sections = md.split(/^---$/m).slice(1);

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const slide: any = { content: {} };
    
    let currentField = '';
    let currentContent: string[] = [];

    const flushContent = () => {
      if (currentField) {
        let value: any = currentContent.join('\n').trim();
        
        // Handle specific list types
        if (currentField === 'Items' || currentField === 'Metrics' || currentField === 'Stats' || currentField === 'Initiatives' || currentField === 'Rows' || currentField === 'Funders') {
          value = value.split('\n').map((line: string) => {
            const parts = line.replace(/^- /, '').split(' | ').map(p => p.trim());
            if (currentField === 'Metrics' || currentField === 'Stats') return { label: parts[0], value: parts[1] };
            if (currentField === 'Items') {
              // Special case for TOC items
              if (slide.type === 'toc') return { title: parts[0], page: parts[1] };
              return { goal: parts[0], result: parts[1], percentage: parts[2] };
            }
            if (currentField === 'Initiatives') return { name: parts[0], description: parts[1] };
            if (currentField === 'Rows') return { label: parts[0], value: parts[1] };
            if (currentField === 'Funders') return { name: parts[0], ask: parts[1], status: parts[2] };
            return parts;
          });
        } else if (currentField === 'Bullets' || currentField === 'Outcomes' || currentField === 'Milestones' || currentField === 'Next Steps' || currentField === 'Paragraphs' || currentField === 'Details') {
          value = value.split('\n').map((l: string) => l.replace(/^- /, '').trim()).filter((l: string) => l.length > 0);
        } else if (currentField === 'Partners' || currentField === 'Startups') {
          const list = value.split(',').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
          if (currentField === 'Partners') {
            // Load coalition members to get domains
            try {
              const membersPath = path.join(process.cwd(), 'data/coalition-members.json');
              const members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
              value = list.map(name => {
                const member = members.find((m: any) => m.name.toLowerCase() === name.toLowerCase() || m.name_short?.toLowerCase() === name.toLowerCase());
                return { name, domain: member?.domain || '' };
              });
            } catch (e) {
              value = list.map(name => ({ name, domain: '' }));
            }
          } else {
            value = list;
          }
        } else if (currentField === 'Team') {
          value = value.split('\n').map((line: string) => {
            const parts = line.replace(/^- /, '').split(' | ').map(p => p.trim());
            return { name: parts[0], role: parts[1], image: parts[2] };
          });
        } else if (currentField === 'Events') {
          value = value.split('\n').map((line: string) => {
            const parts = line.replace(/^- /, '').split(' | ').map(p => p.trim());
            return { name: parts[0], description: parts[1] };
          });
        } else if (currentField === 'Reasons') {
          // Handle Reasons for positioning slide
          const reasons = value.split(/^### /m).slice(1).map((r: string) => {
            const lines = r.trim().split('\n');
            return {
              title: lines[0].trim(),
              description: lines.slice(1).join('\n').trim()
            };
          });
          value = reasons;
        } else if (currentField === 'Categories') {
           // Handle nested categories
           const cats = value.split(/^### /m).slice(1).map((c: string) => {
             const lines = c.trim().split('\n');
             return {
               name: lines[0].trim(),
               items: lines.slice(1).join('\n').split(',').map((i: string) => i.trim()).filter((i: string) => i.length > 0)
             };
           });
           value = cats;
        } else if (currentField === 'Documents') {
          const docs = value.split(/^### /m).slice(1).map((d: string) => {
            const lines = d.trim().split('\n');
            const doc: any = { title: lines[0].trim(), id: lines[0].toLowerCase().replace(/[^a-z0-9]+/g, '-') };
            const contentLines: string[] = [];
            let inContent = false;
            for (const line of lines.slice(1)) {
              if (line.startsWith('Date: ')) doc.date = line.replace('Date: ', '').trim();
              else if (line.startsWith('Source: ')) doc.source = line.replace('Source: ', '').trim();
              else if (line.startsWith('Type: ')) doc.type = line.replace('Type: ', '').trim();
              else if (line.startsWith('Content: ')) {
                inContent = true;
                contentLines.push(line.replace('Content: ', '').trim());
              } else if (inContent) {
                contentLines.push(line.trim());
              }
            }
            doc.content = contentLines.join('\n');
            return doc;
          });
          value = docs;
        }

        const key = currentField.toLowerCase().replace(/ (?:[a-z0-9])/g, (m) => m.toUpperCase().trim()).replace(/ /g, '');
        if (['id', 'type', 'theme'].includes(key)) {
          slide[key] = value;
        } else if (key === 'contactName' || key === 'contactRole' || key === 'contactEmail') {
           if (!slide.content.contact) slide.content.contact = {};
           slide.content.contact[key.replace('contact', '').toLowerCase()] = value;
        } else {
          slide.content[key] = value;
        }
      }
    };

    for (const line of lines) {
      if (line.startsWith('## ')) {
        flushContent();
        currentField = line.replace('## ', '').trim();
        currentContent = [];
      } else if (!currentField && (line.startsWith('ID: ') || line.startsWith('Type: ') || line.startsWith('Theme: '))) {
        const [k, v] = line.split(': ');
        slide[k.toLowerCase()] = v.trim();
      } else {
        currentContent.push(line);
      }
    }
    flushContent();
    slides.push(slide);
  }
  return slides;
}

function generateTS(slides: any[]) {
  return `export interface SlideData {
  id: string;
  type: 'cover' | 'toc' | 'intro' | 'stats' | 'content' | 'highlight' | 'about' | 'leaders' | 'moments' | 'initiatives' | 'budget' | 'funding' | 'cta' | 'quote' | 'appendix' | 'story' | 'startups' | 'coalition' | 'outcomes' | 'vision' | 'commitment' | 'positioning' | 'goals-results' | 'exec-summary';
  theme: 'purple-silk' | 'black' | 'orange' | 'purple-solid' | 'lime' | 'white';
  content: Record<string, unknown>;
}

export const initialSlides: SlideData[] = ${JSON.stringify(slides, null, 2)};
`;
}

try {
  const md = fs.readFileSync(MD_PATH, 'utf-8');
  const slides = parseMarkdown(md);
  
  // 1. Generate TypeScript for the interactive deck
  const ts = generateTS(slides);
  fs.writeFileSync(TS_PATH, ts);
  
  // 2. Generate JSON for the PDF generator
  const coverSlide = slides.find(s => s.type === 'cover')?.content || {};
  const ctaSlide = slides.find(s => s.type === 'cta')?.content || {};
  const investmentSlide = slides.find(s => s.id === 'investment')?.content || {};

  const deckContent = {
    cover: {
      title: coverSlide.title + (coverSlide.titleLine2 ? ' ' + coverSlide.titleLine2 : ''),
      tagline: coverSlide.eventTagline || '',
      subtagline: coverSlide.year || '',
      url: coverSlide.website || 'oaklandtechweek.com'
    },
    slides: slides.map((s: any) => ({
      id: s.id,
      title: s.content.title || s.id,
      subtitle: s.content.subtitle || '',
      sections: s.content.paragraphs ? [{ text: s.content.paragraphs.join('\n\n') }] : 
               s.content.bullets ? [{ items: s.content.bullets }] : 
               s.content.outcomes ? [{ items: s.content.outcomes }] : [],
      footnote: s.content.footer || ''
    })),
    slideOrder: slides.map((s: any) => s.id),
    ask: {
      amount: investmentSlide.total || '',
      items: (ctaSlide.nextSteps as string[]) || []
    }
  };
  
  const JSON_PATH = path.join(process.cwd(), 'data/otw-deck-content.json');
  fs.writeFileSync(JSON_PATH, JSON.stringify(deckContent, null, 2));

  console.log('Successfully synced Markdown to TypeScript and JSON!');
} catch (error) {
  console.error('Error syncing files:', error);
  process.exit(1);
}

