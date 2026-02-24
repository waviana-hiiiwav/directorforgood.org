'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function AboutSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const milestones = (content.milestones as string[]) || [];

  const updateField = (field: string, value: string | string[]) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    updateField('milestones', newMilestones);
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner p-0 max-w-none flex">
        {/* Purple Left Column */}
        <div className="w-1/2 bg-[var(--purple-mid)] p-8 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <span className="text-white font-bold text-sm tracking-wider">HiiiWAV</span>
            <span className="text-white/60 text-sm">page 00</span>
          </div>
          <div className="h-px bg-[var(--orange)] mb-8" />

          {/* Title */}
          <h1 className="headline-display text-5xl text-white mb-6 uppercase">
            <EditableText
              value={content.title as string || 'HiiiLIGHTS'}
              onChange={(v) => updateField('title', v)}
              className="text-[var(--lime)]"
            />
          </h1>

          {/* Intro Text */}
          <EditableText
            value={content.intro as string}
            onChange={(v) => updateField('intro', v)}
            className="text-sm text-white/90 leading-relaxed mb-6"
            multiline
          />

          {/* Quote Section */}
          <div className="border-t-2 border-[var(--lime)] pt-4 mb-6">
            <div className="text-[var(--lime)] text-4xl leading-none mb-2">"</div>
            <EditableText
              value={content.quote as string}
              onChange={(v) => updateField('quote', v)}
              className="text-sm text-[var(--lime)] italic mb-2"
              multiline
            />
            <EditableText
              value={content.quoteAttribution as string}
              onChange={(v) => updateField('quoteAttribution', v)}
              className="text-xs text-[var(--lime)]/80"
            />
            <div className="text-[var(--lime)] text-4xl leading-none mt-2 text-right">"</div>
          </div>
          <div className="border-b-2 border-[var(--lime)]" />

          {/* Key Milestones */}
          <div className="mt-6">
            <p className="text-white/80 text-sm mb-3">
              In 2023-2024 HiiiWAV made a transformative leap from a bold experiment to a cornerstone of Oakland&apos;s cultural and technological landscape. <strong className="text-white">Key milestones include:</strong>
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-white/90">
                <span className="text-white">•</span>
                <span>
                  <EditableText
                    value={milestones[0] || ''}
                    onChange={(v) => updateMilestone(0, v)}
                    multiline
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Milestones */}
        <div className="w-1/2 bg-[var(--purple-mid)] p-8 flex flex-col">
          <ul className="space-y-4">
            {milestones.slice(1).map((milestone, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                <span className="text-white">•</span>
                <EditableText
                  value={milestone}
                  onChange={(v) => updateMilestone(i + 1, v)}
                  multiline
                />
              </li>
            ))}
          </ul>

          {/* Team Info */}
          <div className="mt-auto">
            <p className="text-sm text-white/80 mb-4">
              At HiiiWAV, we reject the silos that divide artists from technologists. Instead, we foster a radical ecosystem where Grammy-winning producers, startup founders, engineers, and grassroots organizers collaborate to share resources, mentorship, and opportunities.
            </p>
            <p className="text-sm text-white/80 mb-4">
              This ethos is embodied by our founding leadership team — <strong className="text-white">Bosko Kante</strong> (Executive Director, Grammy-winner, award-winning inventor), <strong className="text-white">Maya Kante</strong>, and <strong className="text-white">Miles Dotson</strong> — who bring decades of experience navigating the frontiers of music, tech, and social impact.
            </p>
            <p className="text-sm text-white/80 mb-6">
              This report celebrates two years of audacious growth, but it is only the beginning. As we look ahead, HiiiWAV remains laser-focused on one question:
            </p>
            <EditableText
              value={content.closingQuestion as string}
              onChange={(v) => updateField('closingQuestion', v)}
              className="text-sm text-[var(--lime)] italic font-semibold"
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
}








