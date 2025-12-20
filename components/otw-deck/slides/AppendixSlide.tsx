'use client';

import { SlideData } from '@/data/otw-slides';
import EditableText from '../EditableText';
import { FileText, Download } from 'lucide-react';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Document {
  id: string;
  title: string;
  date?: string;
  source?: string;
  content: string;
  type: 'announcement' | 'report' | 'proposal' | 'other';
}

export default function AppendixSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  const documents = (content.documents as Document[]) || [];

  const updateField = (field: string, value: unknown) => {
    onUpdate({ ...content, [field]: value });
  };

  const updateDocument = (index: number, field: keyof Document, newValue: string) => {
    const docs = [...documents];
    docs[index] = { ...docs[index], [field]: newValue };
    updateField('documents', docs);
  };

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

        {content.subtitle && (
          <EditableText
            value={content.subtitle as string}
            onChange={(v) => updateField('subtitle', v)}
            className="text-xl text-white/70 mb-8"
            tag="p"
          />
        )}

        {/* Documents List */}
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-[var(--purple-mid)]/20 border border-[var(--purple-mid)]/50 rounded-lg p-6 hover:bg-[var(--purple-mid)]/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="w-6 h-6 text-[var(--lime)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <EditableText
                      value={doc.title}
                      onChange={(v) => updateDocument(index, 'title', v)}
                      className="text-xl font-semibold text-white"
                      tag="h3"
                    />
                    {doc.date && (
                      <span className="text-sm text-white/60 whitespace-nowrap">
                        {doc.date}
                      </span>
                    )}
                  </div>
                  {doc.source && (
                    <EditableText
                      value={doc.source}
                      onChange={(v) => updateDocument(index, 'source', v)}
                      className="text-sm text-[var(--lime)] mb-3"
                    />
                  )}
                  <div className="text-white/80 text-sm leading-relaxed max-h-48 overflow-y-auto">
                    <EditableText
                      value={doc.content}
                      onChange={(v) => updateDocument(index, 'content', v)}
                      className="whitespace-pre-wrap"
                      multiline
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Document Button Placeholder */}
        {documents.length === 0 && (
          <div className="text-center py-12 text-white/40">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p>Documents will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}








