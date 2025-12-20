'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Category {
  name: string;
  items: string[];
}

export default function LeadersSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const categories = content.categories as Category[];

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        {/* Title */}
        <div className="mb-8">
          <EditableText
            value={content.title as string}
            onChange={(v) => updateField('title', v)}
            className="headline-display text-5xl md:text-6xl text-[var(--lime)] whitespace-pre-line"
            tag="h1"
            multiline
          />
          <div className="h-px w-full bg-white/20 mt-4" />
          <EditableText
            value={content.subtitle as string}
            onChange={(v) => updateField('subtitle', v)}
            className="text-lg text-white/70 mt-3 italic block"
            tag="p"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - City Leadership with photo */}
          <div>
            <div className="relative rounded-lg overflow-hidden bg-gray-800/50 h-48 mb-4 flex items-end">
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                [Leadership Photo]
              </div>
              <div className="relative z-10 bg-gradient-to-t from-black/80 to-transparent w-full p-4">
                <span className="text-white font-semibold">{categories[0]?.name}</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              {categories[0]?.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-white">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Other categories with speaker photo */}
          <div className="space-y-6">
            {categories.slice(1).map((cat, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--purple-mid)]" />
                  <span className="font-semibold text-white">{cat.name}</span>
                </div>
                <ul className="space-y-1 text-sm text-white/80 ml-5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-white/50">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Speaker Photo Placeholder */}
            <div className="relative rounded-lg overflow-hidden bg-gray-800/50 h-56 mt-4">
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                [Speaker Photo - Cordae]
              </div>
              {/* Green wave pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--lime)]/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








