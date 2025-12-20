'use client';

import { useState, useMemo } from 'react';
import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Funder {
  name: string;
  ask: string;
  status: string;
}

export default function FundingSlide({ slide, onUpdate }: Props) {
  const { content } = slide;
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateFunder = (index: number, field: keyof Funder, newValue: string) => {
    const funders = [...(content.funders as Funder[])];
    funders[index] = { ...funders[index], [field]: newValue };
    onUpdate({ ...content, funders });
  };

  // Parse amount from ask string (e.g., "$25K" -> 25)
  const parseAmount = (ask: string): number => {
    if (ask === 'TBD' || ask === 'tbd') return 0;
    const match = ask.match(/\$?(\d+(?:\.\d+)?)K?/i);
    return match ? parseFloat(match[1]) : 0;
  };

  // Group funders by threshold, preserving original indices
  // Specific funders to always include in small group: Kaiser, EBCF
  const { majorFunders, smallFunders, smallTotal } = useMemo(() => {
    const funders = content.funders as Funder[];
    const major: Array<Funder & { originalIndex: number }> = [];
    const small: Array<Funder & { originalIndex: number }> = [];
    let total = 0;

    const smallGroupNames = ['Kaiser', 'East Bay Community Foundation'];

    funders.forEach((funder, index) => {
      const amount = parseAmount(funder.ask);
      const shouldBeSmall = smallGroupNames.some(name => 
        funder.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (shouldBeSmall || amount < 75) {
        small.push({ ...funder, originalIndex: index });
        total += amount;
      } else {
        major.push({ ...funder, originalIndex: index });
      }
    });

    return {
      majorFunders: major,
      smallFunders: small,
      smallTotal: total,
    };
  }, [content.funders]);

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        {/* Title */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-8"
          tag="h1"
        />

        {/* Funders Table */}
        <div className="overflow-hidden rounded-lg border border-white/20">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--purple-mid)]/50 border-b border-white/20">
                <th className="p-4 text-left text-white font-semibold">Funder</th>
                <th className="p-4 text-left text-white font-semibold">Ask</th>
                <th className="p-4 text-left text-white font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Major Funders */}
              {majorFunders.map((funder) => (
                <tr key={funder.originalIndex} className="border-b border-white/10">
                  <td className="p-4">
                    <EditableText
                      value={funder.name}
                      onChange={(v) => updateFunder(funder.originalIndex, 'name', v)}
                      className="text-white font-medium"
                    />
                  </td>
                  <td className="p-4">
                    <EditableText
                      value={funder.ask}
                      onChange={(v) => updateFunder(funder.originalIndex, 'ask', v)}
                      className="text-[var(--lime)]"
                    />
                  </td>
                  <td className="p-4">
                    <EditableText
                      value={funder.status}
                      onChange={(v) => updateFunder(funder.originalIndex, 'status', v)}
                      className={`${
                        funder.status.includes('✓')
                          ? 'text-[var(--lime)]'
                          : funder.status.includes('in')
                          ? 'text-[var(--lime)]'
                          : 'text-white/60'
                      }`}
                    />
                  </td>
                </tr>
              ))}

              {/* Small Funders - Collapsible */}
              {smallFunders.length > 0 && (
                <>
                  <tr
                    className="border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-white/60" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white/60" />
                        )}
                        <span className="text-white font-medium">
                          {smallFunders.map((f) => f.name).join(', ')}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[var(--lime)]">
                        ${smallTotal}K
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white/60">
                        {smallFunders.every((f) => f.status === smallFunders[0].status)
                          ? smallFunders[0].status
                          : 'Mixed'}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Small Funders */}
                  {isExpanded &&
                    smallFunders.map((funder) => (
                      <tr
                        key={funder.originalIndex}
                        className="border-b border-white/5 bg-white/5"
                      >
                        <td className="p-4 pl-12">
                          <EditableText
                            value={funder.name}
                            onChange={(v) => updateFunder(funder.originalIndex, 'name', v)}
                            className="text-white/80 text-sm"
                          />
                        </td>
                        <td className="p-4">
                          <EditableText
                            value={funder.ask}
                            onChange={(v) => updateFunder(funder.originalIndex, 'ask', v)}
                            className="text-[var(--lime)] text-sm"
                          />
                        </td>
                        <td className="p-4">
                          <EditableText
                            value={funder.status}
                            onChange={(v) => updateFunder(funder.originalIndex, 'status', v)}
                            className={`text-sm ${
                              funder.status.includes('✓')
                                ? 'text-[var(--lime)]'
                                : funder.status.includes('in')
                                ? 'text-[var(--lime)]'
                                : 'text-white/60'
                            }`}
                          />
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-white/10">
                <td className="p-4 font-bold text-white">Total</td>
                <td colSpan={2} className="p-4 font-bold text-[var(--lime)]">
                  <EditableText
                    value={content.total as string}
                    onChange={(v) => updateField('total', v)}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

