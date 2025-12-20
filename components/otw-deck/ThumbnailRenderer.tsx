'use client';

import { SlideData } from '@/data/otw-slides';
import Image from 'next/image';

interface Props {
  slide: SlideData;
}

export default function ThumbnailRenderer({ slide }: Props) {
  const { content, type, theme } = slide;

  // Common thumbnail styles
  const thumbnailBase = 'absolute inset-0 flex flex-col items-center justify-center p-2 text-[8px] leading-tight';
  
  switch (type) {
    case 'cover':
      return (
        <div className={`${thumbnailBase} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 opacity-80" />
          <div className="relative z-10 text-center w-full">
            <div className="text-white/90 font-bold mb-1 text-[6px]">2025</div>
            <div className="text-white font-bold text-[10px] mb-1">IMPACT</div>
            <div className="text-[var(--lime)] font-bold text-[10px]">REPORT</div>
            <div className="text-white/70 text-[7px] mt-2">Oakland TECH WEEK</div>
          </div>
        </div>
      );

    case 'intro':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[9px] mb-1 text-center leading-tight">
            CITY OF BELONGING
            <br />X OAKLAND TECH WEEK
          </div>
          <div className="text-[var(--orange)] text-[6px] mt-1">From Successful Launch...</div>
          <div className="text-white/60 text-[5px] mt-2 space-y-0.5">
            <div>• Multi-year effort</div>
            <div>• $1.25M initiative</div>
            <div>• $5M platform vision</div>
          </div>
        </div>
      );

    case 'highlight':
      return (
        <div className={`${thumbnailBase} bg-[var(--orange)]`}>
          <div className="text-white font-bold text-[8px] mb-1 text-center leading-tight">
            SUCCESSFUL LAUNCH
          </div>
          <div className="text-white/90 text-[6px] mb-2">What We Did Together</div>
          <div className="text-white/80 text-[5px] space-y-0.5">
            <div>• 7 days, 40+ events</div>
            <div>• 4,200+ participants</div>
            <div>• 30+ organizations</div>
          </div>
        </div>
      );

    case 'leaders':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-1 text-center">
            WHO SHOWED UP
          </div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            <div>• City & County</div>
            <div>• Philanthropy</div>
            <div>• Industry</div>
            <div>• Artists</div>
          </div>
        </div>
      );

    case 'moments':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-white font-bold text-[8px] mb-1">Moments That Defined</div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            <div>• Rise, Reset & Reimagine</div>
            <div>• AI Summit</div>
            <div>• Fireside Chat</div>
            <div>• Town Alive</div>
          </div>
        </div>
      );

    case 'about':
      return (
        <div className={`${thumbnailBase} bg-[var(--purple-mid)]`}>
          <div className="text-white font-bold text-[9px] mb-1">
            Hiii<span className="text-[var(--lime)]">LIGHTS</span>
          </div>
          <div className="text-white/80 text-[5px] space-y-0.5">
            <div>• Visionary org</div>
            <div>• AFRO AI</div>
            <div>• HiiiWAV FEST</div>
            <div>• STEAM programs</div>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-2">Year 1: By The Numbers</div>
          <div className="grid grid-cols-2 gap-1 text-center">
            <div>
              <div className="text-white font-bold text-[9px]">4,200+</div>
              <div className="text-white/60 text-[4px]">Participants</div>
            </div>
            <div>
              <div className="text-white font-bold text-[9px]">40+</div>
              <div className="text-white/60 text-[4px]">Events</div>
            </div>
            <div>
              <div className="text-white font-bold text-[9px]">30+</div>
              <div className="text-white/60 text-[4px]">Orgs</div>
            </div>
            <div>
              <div className="text-white font-bold text-[9px]">14</div>
              <div className="text-white/60 text-[4px]">Startups</div>
            </div>
          </div>
        </div>
      );

    case 'initiatives':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-1">What We Built</div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            <div>• Laney AI Center</div>
            <div>• Town Alive</div>
            <div>• CR4AI</div>
            <div>• Code Vibes</div>
          </div>
        </div>
      );

    case 'budget':
      return (
        <div className={`${thumbnailBase} ${theme === 'purple-solid' ? 'bg-[var(--purple-mid)]' : 'bg-black'}`}>
          <div className={`font-bold text-[8px] mb-1 ${theme === 'purple-solid' ? 'text-white' : 'text-[var(--lime)]'}`}>
            {content.title as string}
          </div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            {(content.rows as Array<{ label: string; value: string }>)?.slice(0, 3).map((row, i) => (
              <div key={i} className="flex justify-between">
                <span>{row.label.substring(0, 15)}...</span>
                <span className="text-[var(--lime)]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'funding':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-1">Funding Coalition</div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            <div>• Kapor: $450K</div>
            <div>• SF Foundation: $150K</div>
            <div>• Omidyar: $150K</div>
            <div className="text-[var(--lime)] font-bold mt-1">Total: $1.25M</div>
          </div>
        </div>
      );

    case 'content':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-1">{content.title as string}</div>
          <div className="text-white/70 text-[5px] space-y-0.5">
            {(content.bullets as string[])?.slice(0, 4).map((bullet, i) => (
              <div key={i}>• {bullet.substring(0, 25)}...</div>
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className={`${thumbnailBase} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 opacity-80" />
          <div className="relative z-10 text-center">
            <div className="text-white font-bold text-[8px] mb-1">Call to Action</div>
            <div className="text-[var(--lime)] text-[7px] mb-1">Complete Year 1. Scale Year 2.</div>
            <div className="text-white/70 text-[5px]">Schedule follow-up</div>
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] text-[12px] mb-1">"</div>
          <div className="text-white/80 text-[6px] italic text-center leading-tight px-1">
            We had six weeks to vibe-code...
          </div>
          <div className="text-[var(--lime)] text-[12px] mt-1">"</div>
          <div className="text-white/60 text-[5px] mt-1">— Bosko Kante</div>
        </div>
      );

    case 'appendix':
      return (
        <div className={`${thumbnailBase} bg-black`}>
          <div className="text-[var(--lime)] font-bold text-[8px] mb-1">APPENDIX</div>
          <div className="text-white/70 text-[6px] mb-2">Supporting Documents</div>
          <div className="text-white/60 text-[5px] space-y-0.5">
            <div>📄 Mayor's Announcement</div>
            <div className="text-[4px] text-white/40">Nov 25, 2025</div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`${thumbnailBase} bg-gray-800`}>
          <span className="text-white/40 text-[8px]">{type}</span>
        </div>
      );
  }
}




