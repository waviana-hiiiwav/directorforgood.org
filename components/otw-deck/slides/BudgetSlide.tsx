'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Row {
  label: string;
  value: string;
}

export default function BudgetSlide({ slide, onUpdate }: Props) {
  const { content, theme } = slide;
  const isPurple = theme === 'purple-solid';

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateRow = (index: number, field: 'label' | 'value', newValue: string) => {
    const rows = [...(content.rows as Row[])];
    rows[index] = { ...rows[index], [field]: newValue };
    onUpdate({ ...content, rows });
  };

  return (
    <div className={`slide ${isPurple ? 'bg-[var(--purple-mid)]' : 'bg-[var(--black)]'}`}>
      <div className="slide-inner">
        {/* Title */}
        <EditableText
          value={content.title as string}
          onChange={(v) => updateField('title', v)}
          className={`headline-display text-5xl md:text-6xl mb-4 ${isPurple ? 'text-white' : 'text-[var(--lime)]'}`}
          tag="h1"
        />

        {content.subtitle && (
          <EditableText
            value={content.subtitle as string}
            onChange={(v) => updateField('subtitle', v)}
            className={`text-xl mb-8 ${isPurple ? 'text-[var(--lime)]' : 'text-white/70'}`}
            tag="p"
          />
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-white/20 mb-8">
          <table className="w-full">
            <tbody>
              {(content.rows as Row[]).map((row, i) => {
                const isTotal = row.label.toLowerCase().includes('total');
                return (
                  <tr
                    key={i}
                    className={`border-b border-white/10 last:border-b-0 ${
                      isTotal ? 'bg-white/10' : ''
                    }`}
                  >
                    <td className="p-4">
                      <EditableText
                        value={row.label}
                        onChange={(v) => updateRow(i, 'label', v)}
                        className={`${isTotal ? 'font-bold text-white' : 'text-white/80'}`}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <EditableText
                        value={row.value}
                        onChange={(v) => updateRow(i, 'value', v)}
                        className={`${
                          isTotal
                            ? 'font-bold text-[var(--lime)]'
                            : isPurple
                            ? 'text-white'
                            : 'text-[var(--lime)]'
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Additional Details */}
        {content.details && (
          <div className="space-y-2">
            {(content.details as string[]).map((detail, i) => (
              <p key={i} className="text-white/70 text-sm">
                {detail}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}








