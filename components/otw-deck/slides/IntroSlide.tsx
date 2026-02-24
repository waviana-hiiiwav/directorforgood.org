'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function IntroSlide({ slide, onUpdate }: Props) {
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
          <div className="h-1 w-full bg-white/20 mt-4" />
          <EditableText
            value={content.subtitle as string}
            onChange={(v) => updateField('subtitle', v)}
            className="text-lg text-[var(--orange)] mt-4 block"
            tag="p"
          />
        </div>

        {/* Arrow */}
        <div className="text-[var(--lime)] text-4xl mb-6">↘</div>

        {/* Bullets */}
        <ul className="space-y-4 mb-8 max-w-2xl">
          {(content.bullets as string[] || []).map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-white mt-1">•</span>
              <EditableText
                value={bullet}
                onChange={(v) => updateBullet(i, v)}
                className="text-lg text-white/90"
                multiline
              />
            </li>
          ))}
        </ul>

        {/* Event Photo */}
        <div className="flex-1 flex items-end">
          <div className="w-full h-64 rounded-lg overflow-hidden relative">
            <Image
              src="/images/networking-event.png"
              alt="Oakland Tech Week Networking"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

