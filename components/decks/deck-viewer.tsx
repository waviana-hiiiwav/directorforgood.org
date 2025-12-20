'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DeckContent, getOrderedSlides } from '@/lib/deck-content';

interface DeckViewerProps {
  content: DeckContent;
  slug: string;
}

export function DeckViewer({ content, slug }: DeckViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(-1); // -1 is cover
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slides = getOrderedSlides(content);
  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > -1 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'f') setIsFullscreen((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const currentSlide = currentSlideIndex === -1 ? null : slides[currentSlideIndex];

  return (
    <div className={`flex flex-col min-h-screen bg-black text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Bar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold">{content.cover.title}</h1>
            <span className="text-xs text-gray-500 uppercase tracking-widest px-2 py-1 bg-gray-800 rounded">
              {currentSlideIndex === -1 ? 'Cover' : `Slide ${currentSlideIndex + 1} / ${totalSlides}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)} className="border-gray-700">
              <Maximize2 className="w-4 h-4 mr-2" /> Present
            </Button>
            <Link href={`/api/deck?slug=${slug}`} target="_blank">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Slide Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-12">
        {currentSlideIndex === -1 ? (
          /* Cover Slide */
          <div className="max-w-4xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-7xl font-bold tracking-tight">{content.cover.title}</h2>
            <p className="text-3xl text-gray-300 font-light max-w-2xl mx-auto leading-tight">
              {content.cover.tagline}
            </p>
            <div className="pt-8">
              <p className="text-gray-500 text-lg uppercase tracking-widest">{content.cover.subtagline}</p>
              <p className="text-gray-600 mt-4">{content.cover.url}</p>
            </div>
          </div>
        ) : (
          /* Content Slide */
          <div key={currentSlide?.id} className="w-full max-w-5xl h-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 mb-12">
              <h2 className="text-5xl font-bold text-white">{currentSlide?.title}</h2>
              {currentSlide?.subtitle && <p className="text-2xl text-orange-500 font-medium">{currentSlide.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                {currentSlide?.sections?.map((section, i) => (
                  <div key={i} className="space-y-4">
                    {section.heading && <h3 className="text-xl font-bold text-gray-400 uppercase tracking-wider">{section.heading}</h3>}
                    {section.text && <p className="text-xl text-gray-200 leading-relaxed">{section.text}</p>}
                    {section.items && (
                      <ul className="space-y-4">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-xl text-gray-300">
                            <span className="text-orange-500 mt-1.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {currentSlide?.image && (
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center p-8">
                  {currentSlide.image.url ? (
                    <img src={currentSlide.image.url} alt={currentSlide.image.placeholder} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🖼️</span>
                      </div>
                      <p className="text-gray-500 italic">{currentSlide.image.placeholder}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {currentSlide?.highlight && (
              <div className="mt-12 p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <p className="text-2xl font-bold text-orange-500 text-center">{currentSlide.highlight}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Controls Overlay */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 px-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={currentSlideIndex === -1}
            className="w-12 h-12 rounded-full hover:bg-gray-800/50"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <div className="text-sm text-gray-500 font-mono">
            {currentSlideIndex + 2} / {totalSlides + 1}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="w-12 h-12 rounded-full hover:bg-gray-800/50"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        {isFullscreen && (
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

