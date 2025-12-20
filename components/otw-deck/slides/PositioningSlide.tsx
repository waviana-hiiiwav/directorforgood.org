'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Reason {
  title: string;
  description: string;
}

export default function PositioningSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        {/* Header */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-4xl md:text-5xl text-[var(--lime)] mb-4"
          tag="h1"
        />

        {/* The Gap / Context */}
        {content.context && (
          <div className="bg-[var(--orange)]/20 border-l-4 border-[var(--orange)] rounded-r-lg p-5 mb-8">
            <h3 className="text-[var(--orange)] font-semibold mb-2">The Gap</h3>
            <p className="text-white/90 text-lg">{content.context as string}</p>
          </div>
        )}

        {/* Why Us Reasons */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {(content.reasons as Reason[]).map((reason, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-[var(--lime)] text-xl">✓</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">{reason.title}</h4>
                  <p className="text-white/70 text-sm">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CYA Framing */}
        {content.cya && (
          <div className="bg-[var(--purple)]/30 border border-[var(--purple)] rounded-lg p-6 text-center">
            <p className="text-white text-lg font-medium">
              {content.cya as string}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



