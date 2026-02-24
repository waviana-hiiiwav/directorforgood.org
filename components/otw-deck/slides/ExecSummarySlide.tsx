import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function ExecSummarySlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string | string[]) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateParagraph = (index: number, value: string) => {
    const paragraphs = [...(content.paragraphs as string[])];
    paragraphs[index] = value;
    updateField('paragraphs', paragraphs);
  };

  return (
    <div className="slide bg-white text-black overflow-hidden">
      {/* Outer Border Frame */}
      <div className="absolute inset-8 border-[1px] border-black/10 pointer-events-none" />
      <div className="absolute inset-10 border-[4px] border-black pointer-events-none" />

      <div className="slide-inner flex flex-col p-20 relative z-10">
        {/* Header Section */}
        <div className="mb-12 border-b-[6px] border-black pb-6 flex justify-between items-end">
          <EditableText
            value={content.title as string}
            onChange={(v) => updateField('title', v)}
            className="headline-display text-5xl text-black leading-none m-0"
            tag="h1"
          />
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 m-0">Phase II Proposal</p>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 m-0">2025-2026</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-2 gap-16 flex-1">
          {/* Column 1 */}
          <div className="space-y-10">
            {(content.paragraphs as string[])?.slice(0, 2).map((p, i) => (
              <div key={i} className="relative">
                <EditableText
                  value={p}
                  onChange={(v) => updateParagraph(i, v)}
                  className="text-[1.3rem] leading-relaxed font-medium text-black/80"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-10 flex flex-col">
            {(content.paragraphs as string[])?.slice(2).map((p, i) => (
              <div key={i+2} className="flex-1">
                <EditableText
                  value={p}
                  onChange={(v) => updateParagraph(i + 2, v)}
                  className="text-[1.3rem] leading-relaxed font-medium text-black/80"
                  multiline
                />
              </div>
            ))}
            
            {/* Logo Area */}
            <div className="mt-auto pt-12">
               <div className="relative w-48 h-16">
                  <Image 
                    src="/logos/Hiiiwav_logo_black-no-border.png" 
                    alt="HiiiWAV" 
                    fill 
                    className="object-contain object-left" 
                    priority
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
