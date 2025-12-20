'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Metric {
  target: string;
  description: string;
}

export default function CommitmentSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide bg-[var(--purple)]">
      <div className="slide-inner">
        {/* Header */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-4xl md:text-5xl text-white mb-2 whitespace-pre-line"
          tag="h1"
        />
        <p className="text-[var(--lime)] italic mb-8">
          {content.subtitle as string}
        </p>

        {/* Hard Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(content.metrics as Metric[]).map((metric, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg p-5 border-l-4 border-[var(--lime)]"
            >
              <div className="text-[var(--lime)] text-3xl md:text-4xl font-bold mb-2">
                {metric.target}
              </div>
              <p className="text-white/90">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Coalition Highlights */}
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)]" />
            Coalition Partners
          </h3>
          <div className="flex flex-wrap gap-3">
            {(content.partners as string[]).map((partner, i) => (
              <span
                key={i}
                className="bg-white/10 text-white/90 px-3 py-1.5 rounded-full text-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        {content.footer && (
          <p className="mt-8 text-center text-white/70 text-lg">
            {content.footer as string}
          </p>
        )}
      </div>
    </div>
  );
}



