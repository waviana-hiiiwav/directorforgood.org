'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import Image from 'next/image';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function TOCSlide({ slide, onUpdate }: Props) {
  const { content } = slide;
  const items = (content.items as { title: string; page: string }[]) || [];

  const updateField = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateField('items', newItems);
  };

  return (
    <div className="slide bg-white text-black p-0 overflow-hidden font-['PP_Neue_Montreal',sans-serif]">
      <div className="slide-inner flex flex-col h-full py-12 px-16 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="relative h-12 w-48">
            <Image
              src="/logos/Hiiiwav_logo_black-no-border.png"
              alt="HiiiWAV"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="text-right">
            <EditableText
              value={content.website as string || 'www.hiiiwav.org'}
              onChange={(v) => updateField('website', v)}
              className="text-sm font-medium opacity-60"
            />
          </div>
        </div>

        {/* Title and Arrow */}
        <div className="relative mb-8">
          <h2 className="text-[5rem] font-black leading-[0.9] tracking-tight text-[#1A1A1A] uppercase italic">
            <EditableText
              value={content.title as string || 'TABLE OF\nCONTENTS'}
              onChange={(v) => updateField('title', v)}
              multiline
            />
          </h2>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <span className="text-[6rem] font-light text-black opacity-80">↘</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-[1fr_1.5fr] gap-20 items-start overflow-hidden">
          {/* Left Column: Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden grayscale">
              <Image
                src={content.image as string || '/images/networking-event.png'}
                alt="Featured artist"
                fill
                className="object-cover"
              />
            </div>
            <EditableText
              value={content.imageCaption as string || 'Dame Drummer @ HiiiWAV FEST'}
              onChange={(v) => updateField('imageCaption', v)}
              className="text-xs italic font-medium opacity-60"
            />
          </div>

          {/* Right Column: List */}
          <div className="overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(163, 77, 255, 0.3) rgba(0, 0, 0, 0.05)' }}>
            <ul className="flex flex-col w-full">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-baseline py-2.5 border-b border-black/10 last:border-0"
                >
                  <EditableText
                    value={item.title}
                    onChange={(v) => updateItem(index, 'title', v)}
                    className="text-base font-medium pr-4"
                  />
                  <EditableText
                    value={item.page}
                    onChange={(v) => updateItem(index, 'page', v)}
                    className="text-lg font-black text-[#A34DFF]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer: Donors Banner */}
        <div className="mt-12 pt-8 border-t border-black/5">
          <EditableText
            value={content.donors as string}
            onChange={(v) => updateField('donors', v)}
            className="text-sm italic text-center block w-full leading-relaxed tracking-tight font-semibold text-[#A34DFF]"
            multiline
          />
        </div>
      </div>
    </div>
  );
}

