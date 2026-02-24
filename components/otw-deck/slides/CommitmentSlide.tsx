'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Metric {
  label: string;
  value: string;
}

interface Partner {
  name: string;
  domain: string;
}

export default function CommitmentSlide({ slide, onUpdate }: Props) {
  const { content, theme } = slide;
  const isVortex = theme === 'purple-silk';

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateMetric = (index: number, field: 'label' | 'value', newValue: string) => {
    const metrics = [...(content.metrics as Metric[])];
    metrics[index] = { ...metrics[index], [field]: newValue };
    onUpdate({ ...content, metrics });
  };

  return (
    <div className={`slide relative overflow-hidden ${isVortex ? '' : 'bg-[var(--purple)]'}`}>
      {/* Vortex Background for Silk theme */}
      {isVortex && (
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/otwvortex.png" 
            alt="Background" 
            fill 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0033]/80 via-[#1A0033]/40 to-[#1A0033]/90" />
        </div>
      )}

      <div className="slide-inner relative z-10 flex flex-col h-full py-12">
        {/* Header */}
        <div className="mb-8">
          <EditableText
            value={content.title as string}
            onChange={(v) => updateField('title', v)}
            className="headline-display text-5xl md:text-6xl text-white mb-2 leading-[0.9]"
            tag="h1"
          />
          <EditableText
            value={content.subtitle as string}
            onChange={(v) => updateField('subtitle', v)}
            className="text-xl text-white/80 italic font-medium"
            tag="p"
          />
        </div>

        {/* Coalition Partners Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight m-0">Coalition Partners</h2>
            <div className="h-[2px] flex-1 bg-white/20" />
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-wrap gap-4 items-center justify-center">
              {(content.partners as Partner[] || []).map((partner, i) => (
                <div 
                  key={i} 
                  className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 group hover:bg-white/20 transition-all duration-300"
                  title={partner.name}
                >
                  {partner.domain ? (
                    <div className="relative w-6 h-6 shrink-0 bg-white rounded-md overflow-hidden p-0.5">
                      <Image
                        src={`https://img.logo.dev/${partner.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY || 'pk_shUIsqtoSr-AgVsFrZ6_dg'}`} 
                        alt={partner.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-bold text-white/90 whitespace-nowrap">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        {content.footer && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-white text-2xl font-black italic leading-tight uppercase tracking-tight">
              &quot;{content.footer as string}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
