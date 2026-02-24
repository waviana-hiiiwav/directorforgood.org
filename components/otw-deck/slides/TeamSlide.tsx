'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function TeamSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const team = [...(content.team as TeamMember[])];
    team[index] = { ...team[index], [field]: value };
    onUpdate({ ...content, team });
  };

  return (
    <div className="slide bg-[#F8F7F2] text-black">
      <div className="slide-inner flex flex-col justify-center p-20">
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-7xl md:text-8xl text-black mb-20 leading-[0.8]"
          tag="h1"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(content.team as TeamMember[] || []).map((member, i) => (
            <div key={i} className="group">
              {/* Image Frame with Custom Cut */}
              <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-500">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    [Photo]
                  </div>
                )}
                {/* Custom top-right diagonal cut effect (CSS mask/clip-path) */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 bg-[#F8F7F2] z-20" 
                  style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                />
              </div>

              <div className="space-y-1">
                <EditableText
                  value={member.name}
                  onChange={(v) => updateMember(i, 'name', v)}
                  className="text-2xl font-black uppercase tracking-tight"
                />
                <EditableText
                  value={member.role}
                  onChange={(v) => updateMember(i, 'role', v)}
                  className="text-lg font-medium opacity-60 italic"
                />
              </div>
              <div className="mt-4 text-black/20 font-light text-2xl">+</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

