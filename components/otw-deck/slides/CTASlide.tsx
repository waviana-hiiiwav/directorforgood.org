'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Contact {
  name: string;
  role: string;
  email: string;
}

export default function CTASlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string | string[]) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateStep = (index: number, value: string) => {
    const nextSteps = [...(content.nextSteps as string[])];
    nextSteps[index] = value;
    updateField('nextSteps', nextSteps);
  };

  const contact = content.contact as Contact;

  return (
    <div className="slide relative overflow-hidden">
      {/* Purple Silk Background */}
      <Image
        src="/images/purple-silk-bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="slide-inner relative z-10 flex flex-col items-center justify-center text-center">
        {/* Title */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-6xl md:text-7xl text-white mb-4"
          tag="h1"
        />

        <EditableText
          value={content.subtitle as string}
          onChange={(v) => updateField('subtitle', v)}
          className="text-2xl text-[var(--lime)] font-semibold mb-8"
          tag="h2"
        />

        <EditableText
          value={content.body as string}
          onChange={(v) => updateField('body', v)}
          className="text-xl text-white/80 max-w-2xl mb-12"
          multiline
        />

        {/* Next Steps */}
        <div className="text-left w-full max-w-md mb-12">
          <p className="text-white font-semibold mb-4">Next steps:</p>
          <ol className="space-y-3">
            {(content.nextSteps as string[]).map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--lime)] text-black flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <EditableText
                  value={step}
                  onChange={(v) => updateStep(i, v)}
                  className="text-white/90"
                />
              </li>
            ))}
          </ol>
        </div>

        {/* Contact */}
        <div className="border-t border-white/20 pt-8 w-full max-w-md">
          <EditableText
            value={contact.name}
            onChange={(v) => updateField('contact', { ...contact, name: v })}
            className="text-lg font-bold text-white"
          />
          <EditableText
            value={contact.role}
            onChange={(v) => updateField('contact', { ...contact, role: v })}
            className="text-white/70 block"
          />
          <EditableText
            value={contact.email}
            onChange={(v) => updateField('contact', { ...contact, email: v })}
            className="text-[var(--lime)] block mt-2"
          />
        </div>
      </div>
    </div>
  );
}

