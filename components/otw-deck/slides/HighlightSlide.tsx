'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function HighlightSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string | string[]) => {
    onUpdate({ ...content, [field]: value });
  };

  const bullets = (content.bullets as string[]) || [];

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    updateField('bullets', newBullets);
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner p-0 max-w-none">
        {/* Orange Header Section */}
        <div className="bg-[var(--orange)] px-8 py-12 relative">
          {/* Decorative lines */}
          <div className="absolute top-4 left-8 right-8 h-px bg-red-600/30" />
          <div className="absolute bottom-4 right-8 w-32 h-px bg-red-600/30" />
          
          <div className="max-w-4xl mx-auto">
            <EditableText
              value={content.title as string}
              onChange={(v) => updateField('title', v)}
              className="headline-display text-5xl md:text-6xl text-white whitespace-pre-line leading-tight"
              tag="h1"
              multiline
            />
            <EditableText
              value={content.subtitle as string}
              onChange={(v) => updateField('subtitle', v)}
              className="text-lg font-semibold text-white/90 mt-4 block"
              tag="p"
            />
          </div>
        </div>

        {/* Event Photo */}
        <div className="w-full h-64 relative">
          <Image
            src="/images/networking-event.png"
            alt="Oakland Tech Week Event"
            fill
            className="object-cover"
          />
        </div>

        {/* Orange Content Section */}
        <div className="bg-[var(--orange)] px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
              <span>✳</span>
              <span>[PUT CAPTION HERE]</span>
              <span>✳</span>
            </div>
            
            <ul className="space-y-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-white mt-1">•</span>
                  <EditableText
                    value={bullet}
                    onChange={(v) => updateBullet(i, v)}
                    className="text-white/95"
                    multiline
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

