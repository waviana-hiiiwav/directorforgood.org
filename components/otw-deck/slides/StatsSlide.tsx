'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Stat {
  label: string;
  value: string;
}

export default function StatsSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateStat = (index: number, field: 'label' | 'value', newValue: string) => {
    const stats = [...(content.stats as Stat[])];
    stats[index] = { ...stats[index], [field]: newValue };
    onUpdate({ ...content, stats });
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner flex flex-col items-center justify-center">
        {/* Title */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-12 text-center"
          tag="h1"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-4xl">
          {(content.stats as Stat[]).map((stat, i) => (
            <div key={i} className="text-center">
              <EditableText
                value={stat.value}
                onChange={(v) => updateStat(i, 'value', v)}
                className="headline-display text-6xl md:text-7xl text-white mb-2 block"
                tag="div"
              />
              <EditableText
                value={stat.label}
                onChange={(v) => updateStat(i, 'label', v)}
                className="text-lg text-white/70 uppercase tracking-wider"
              />
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px w-20 bg-[var(--purple-mid)]" />
          <span className="text-[var(--purple-mid)]">✳</span>
          <div className="h-px w-20 bg-[var(--purple-mid)]" />
        </div>
      </div>
    </div>
  );
}








