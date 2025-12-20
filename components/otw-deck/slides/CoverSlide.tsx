'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function CoverSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide relative overflow-hidden text-white">
      {/* Purple Silk Background */}
      <Image
        src="/images/purple-silk-bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="slide-inner relative z-10 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start">
            {/* HiiiWAV Logo - Top Left */}
            <div className="relative h-12 w-48">
              <Image
                src="/logos/hiiiwav-logo-white.png"
                alt="HiiiWAV"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <EditableText
              value={content.website as string}
              onChange={(v) => updateField('website', v)}
              className="text-sm opacity-90 text-white font-medium"
            />
          </div>
          {/* Horizontal white line - full width */}
          <div className="h-px w-full bg-white mt-2 opacity-50" />
        </div>

        {/* Main Title */}
        <div className="flex-1 flex flex-col justify-start items-start text-left pt-2 pb-8">
          <EditableText
            value={content.year as string}
            onChange={(v) => updateField('year', v)}
            className="text-2xl font-light tracking-widest mb-3 text-white"
          />
          
          <h1 className="text-white">
            <EditableText
              value={content.title as string || 'iMPACT'}
              onChange={(v) => updateField('title', v)}
              className="text-[5.4rem] md:text-[7.2rem] leading-none block font-black tracking-tight text-white"
              tag="span"
            />
            <EditableText
              value={content.titleLine2 as string}
              onChange={(v) => updateField('titleLine2', v)}
              className="text-[5.4rem] md:text-[7.2rem] leading-[0.85] text-white block -mt-2 font-black tracking-tight"
              tag="span"
            />
          </h1>

          {/* Cover Photo */}
          <div className="w-full max-w-4xl h-96 rounded-lg my-8 overflow-hidden relative border border-white/10 shadow-2xl">
            <Image
              src="/images/cover-photo-proclamation.png"
              alt="Oakland Tech Week Proclamation"
              fill
              className="object-contain"
            />
          </div>

          {/* Oakland Tech Week Logo */}
          <div className="relative h-[5.5rem] w-[33rem] max-w-full mx-auto mt-4">
            <Image
              src="/logos/OTWLogo-09.png"
              alt="Oakland Tech Week"
              fill
              className="object-contain filter brightness-0 invert"
              priority
            />
          </div>
        </div>

        {/* Footer */}
        <div>
          {/* Horizontal white line - full width */}
          <div className="h-px w-full bg-white mb-2 opacity-50" />
          <div className="flex justify-between items-start text-xs text-white">
            <div>
              {/* HiiiWAV Logo - Bottom Left */}
              <div className="relative h-6 w-24 mb-1">
                <Image
                  src="/logos/hiiiwav-logo-white.png"
                  alt="HiiiWAV"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <EditableText
                value={content.address as string}
                onChange={(v) => updateField('address', v)}
                className="opacity-90 whitespace-pre-line text-white"
                multiline
              />
            </div>
          <div>
            <EditableText
              value={content.email as string}
              onChange={(v) => updateField('email', v)}
              className="block text-white opacity-90"
            />
            <EditableText
              value={content.phone as string}
              onChange={(v) => updateField('phone', v)}
              className="block text-white opacity-90"
            />
          </div>
          <div className="flex items-start gap-1 opacity-90 text-right text-white font-medium">
            <span>✳</span>
            <div>
              <div>*HiiiWAV Is A 501(C)3</div>
              <div>Nonprofit Corporation</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

