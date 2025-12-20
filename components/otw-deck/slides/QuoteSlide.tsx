'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function QuoteSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner flex flex-col items-center justify-center text-center">
        {/* Opening Quote Mark */}
        <div className="text-[var(--lime)] text-8xl font-serif leading-none mb-4">"</div>

        {/* Quote Text */}
        <EditableText
          value={(content.quote as string).replace(/^"|"$/g, '')}
          onChange={(v) => updateField('quote', `"${v}"`)}
          className="text-2xl md:text-3xl text-white/90 italic max-w-3xl leading-relaxed mb-8"
          tag="p"
          multiline
        />

        {/* Closing Quote Mark */}
        <div className="text-[var(--lime)] text-8xl font-serif leading-none mb-8">"</div>

        {/* Attribution */}
        <EditableText
          value={content.attribution as string}
          onChange={(v) => updateField('attribution', v)}
          className="text-lg text-white/60 font-semibold"
        />

        {/* Decorative Line */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px w-32 bg-[var(--purple-mid)]" />
          <span className="text-[var(--purple-mid)]">✳</span>
          <div className="h-px w-32 bg-[var(--purple-mid)]" />
        </div>
      </div>
    </div>
  );
}








