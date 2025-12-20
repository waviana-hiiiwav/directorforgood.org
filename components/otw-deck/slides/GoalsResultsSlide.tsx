'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface GoalResult {
  goal: string;
  result: string;
  percentage?: string;
}

export default function GoalsResultsSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide bg-[var(--orange)]">
      <div className="slide-inner">
        {/* Header */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-4xl md:text-5xl text-white mb-2"
          tag="h1"
        />
        <p className="text-white/80 italic mb-8">
          {content.subtitle as string}
        </p>

        {/* Goals vs Results Grid */}
        <div className="space-y-4">
          {(content.items as GoalResult[]).map((item, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Goal */}
              <div className="flex-1">
                <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">
                  Goal
                </span>
                <span className="text-white text-lg">{item.goal}</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-white/40 text-2xl">→</div>

              {/* Result */}
              <div className="flex-1">
                <span className="text-white/60 text-xs uppercase tracking-wider block mb-1">
                  Result
                </span>
                <span className="text-white text-lg font-semibold flex items-center gap-2">
                  <span className="text-[var(--lime)]">✓</span>
                  {item.result}
                  {item.percentage && (
                    <span className="bg-[var(--lime)] text-black text-sm font-bold px-2 py-0.5 rounded">
                      {item.percentage}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {content.footer && (
          <p className="mt-8 text-center text-white/90 text-lg bg-white/10 rounded-lg p-4">
            {content.footer as string}
          </p>
        )}
      </div>
    </div>
  );
}



