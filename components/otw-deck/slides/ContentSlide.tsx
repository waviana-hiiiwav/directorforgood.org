'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function ContentSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string | string[]) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateBullet = (index: number, value: string) => {
    const bullets = [...(content.bullets as string[])];
    bullets[index] = value;
    updateField('bullets', bullets);
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner flex flex-col justify-center">
        {/* Title */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-8"
          tag="h1"
        />

        {/* Bullets */}
        <ul className="space-y-6 max-w-3xl">
          {(content.bullets as string[] || []).map((bullet, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="text-[var(--lime)] text-2xl font-bold">{i + 1}.</span>
              <EditableText
                value={bullet}
                onChange={(v) => updateBullet(i, v)}
                className="text-xl text-white/90"
                multiline
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}








