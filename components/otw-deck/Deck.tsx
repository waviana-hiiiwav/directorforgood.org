'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlideData, initialSlides } from '@/data/otw-slides';
import SlideRenderer from './slides';
import ThumbnailRenderer from './ThumbnailRenderer';
import { ChevronLeft, ChevronRight, Edit3, Eye, Grid, Download, Home } from 'lucide-react';

export default function Deck() {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditMode, setIsEditMode] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);

  const updateSlideContent = useCallback(
    (slideId: string, newContent: Record<string, unknown>) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === slideId ? { ...slide, content: newContent as Record<string, string | string[] | { label: string; value: string }[]> } : slide
        )
      );
    },
    []
  );

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
      setShowThumbnails(false);
    }
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      } else if (e.key === 'g') {
        setShowThumbnails((prev) => !prev);
      } else if (e.key === 'e') {
        setIsEditMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  const exportData = () => {
    const data = JSON.stringify(slides, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deck-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-[var(--black)]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#222222] border-b border-white/30 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => goToSlide(0)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              title="Go to start (Home)"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
            <span className="text-sm text-white font-extrabold tracking-widest uppercase">
              Oakland Tech Week | Phase II Proposal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 text-white"
              title="Previous slide (←)"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className="px-4 py-1.5 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors text-white border border-white/10"
              title="Show all slides (G)"
            >
              {currentSlide + 1} / {slides.length}
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-20 text-white"
              title="Next slide (→)"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-2 rounded-lg transition-colors ${
                showThumbnails ? 'bg-[var(--purple-mid)] text-white' : 'hover:bg-white/10 text-white'
              }`}
              title="Grid view (G)"
            >
              <Grid className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-2 rounded-lg transition-colors ${
                isEditMode ? 'bg-[var(--lime)] text-black' : 'hover:bg-white/10 text-white'
              }`}
              title="Toggle edit mode (E)"
            >
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5 text-white" />}
            </button>

            <button
              onClick={exportData}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              title="Export data"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Thumbnail Grid */}
      {showThumbnails && (
        <div className="fixed inset-0 z-40 bg-black/95 pt-16 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-white mb-6">All Slides</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    index === currentSlide
                      ? 'border-[var(--lime)] ring-2 ring-[var(--lime)]/50'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <ThumbnailRenderer slide={slide} />
                  
                  {/* Slide Number Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-2 py-1.5">
                    <div className="text-xs text-white font-medium">
                      {index + 1}. {slide.id.replace(/-/g, ' ')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Slide Area */}
      <main className={`pt-14 ${isEditMode ? '' : 'select-none'}`}>
        <SlideRenderer
          slide={slides[currentSlide]}
          onUpdate={(content) => updateSlideContent(slides[currentSlide].id, content)}
        />
      </main>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed bottom-4 right-4 z-50 bg-[var(--lime)] text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Mode — Click text to edit
        </div>
      )}

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-[var(--lime)] transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}





