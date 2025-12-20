'use client';

import { SlideData } from '@/data/otw-slides';
import CoverSlide from './CoverSlide';
import IntroSlide from './IntroSlide';
import HighlightSlide from './HighlightSlide';
import LeadersSlide from './LeadersSlide';
import AboutSlide from './AboutSlide';
import StatsSlide from './StatsSlide';
import ContentSlide from './ContentSlide';
import BudgetSlide from './BudgetSlide';
import FundingSlide from './FundingSlide';
import CTASlide from './CTASlide';
import QuoteSlide from './QuoteSlide';
import AppendixSlide from './AppendixSlide';
import CommitmentSlide from './CommitmentSlide';
import PositioningSlide from './PositioningSlide';
import GoalsResultsSlide from './GoalsResultsSlide';

interface Props {
  slide: SlideData;
  onUpdate: (content: Record<string, unknown>) => void;
}

export default function SlideRenderer({ slide, onUpdate }: Props) {
  switch (slide.type) {
    case 'cover':
      return <CoverSlide slide={slide} onUpdate={onUpdate} />;
    case 'intro':
      return <IntroSlide slide={slide} onUpdate={onUpdate} />;
    case 'highlight':
      return <HighlightSlide slide={slide} onUpdate={onUpdate} />;
    case 'leaders':
      return <LeadersSlide slide={slide} onUpdate={onUpdate} />;
    case 'about':
      return <AboutSlide slide={slide} onUpdate={onUpdate} />;
    case 'stats':
      return <StatsSlide slide={slide} onUpdate={onUpdate} />;
    case 'content':
      return <ContentSlide slide={slide} onUpdate={onUpdate} />;
    case 'budget':
      return <BudgetSlide slide={slide} onUpdate={onUpdate} />;
    case 'funding':
      return <FundingSlide slide={slide} onUpdate={onUpdate} />;
    case 'cta':
      return <CTASlide slide={slide} onUpdate={onUpdate} />;
    case 'quote':
      return <QuoteSlide slide={slide} onUpdate={onUpdate} />;
    case 'appendix':
      return <AppendixSlide slide={slide} onUpdate={onUpdate} />;
    case 'moments':
      return <MomentsSlide slide={slide} onUpdate={onUpdate} />;
    case 'initiatives':
      return <InitiativesSlide slide={slide} onUpdate={onUpdate} />;
    case 'story':
      return <StorySlide slide={slide} onUpdate={onUpdate} />;
    case 'startups':
      return <StartupsSlide slide={slide} onUpdate={onUpdate} />;
    case 'coalition':
      return <CoalitionSlide slide={slide} onUpdate={onUpdate} />;
    case 'outcomes':
      return <OutcomesSlide slide={slide} onUpdate={onUpdate} />;
    case 'vision':
      return <VisionSlide slide={slide} onUpdate={onUpdate} />;
    case 'commitment':
      return <CommitmentSlide slide={slide} onUpdate={onUpdate} />;
    case 'positioning':
      return <PositioningSlide slide={slide} onUpdate={onUpdate} />;
    case 'goals-results':
      return <GoalsResultsSlide slide={slide} onUpdate={onUpdate} />;
    default:
      return <ContentSlide slide={slide} onUpdate={onUpdate} />;
  }
}

// Moments Slide Component
function MomentsSlide({ slide, onUpdate }: Props) {
  const { content } = slide;
  
  interface Event {
    name: string;
    description: string;
  }

  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        <h1 className="headline-display text-4xl md:text-5xl text-white mb-2">
          {content.title as string}
        </h1>
        <p className="text-white/60 italic mb-8">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-lg h-48 flex items-center justify-center text-white/20">
              [Event Photo]
            </div>
            
            {(content.events as Event[]).slice(0, 2).map((event, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold mb-2">{event.name}</h3>
                <p className="text-white/70 text-sm">{event.description}</p>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {(content.events as Event[]).slice(2).map((event, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold mb-2">{event.name}</h3>
                <p className="text-white/70 text-sm">{event.description}</p>
              </div>
            ))}
            
            <div className="bg-gray-800/30 rounded-lg h-48 flex items-center justify-center text-white/20">
              [Speaker Photo]
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-white/50 italic">
          [VIDEO TO BE PUT HERE]
        </div>
      </div>
    </div>
  );
}

// Initiatives Slide Component
function InitiativesSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  interface Initiative {
    name: string;
    description: string;
  }

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        <h1 className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-2">
          {content.title as string}
        </h1>
        <p className="text-white/70 mb-8">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(content.initiatives as Initiative[]).map((initiative, i) => (
            <div
              key={i}
              className="bg-[var(--purple-mid)]/30 border border-[var(--purple-mid)] rounded-lg p-6"
            >
              <div className="text-[var(--lime)] text-3xl font-bold mb-2">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {initiative.name}
              </h3>
              <p className="text-white/60 text-sm">{initiative.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Story Slide Component
function StorySlide({ slide, onUpdate }: Props) {
  const { content } = slide;
  const isPurple = slide.theme === 'purple-solid';

  return (
    <div className={`slide ${isPurple ? 'bg-[var(--purple)]' : 'bg-[var(--black)]'}`}>
      <div className="slide-inner">
        <h1 className={`headline-display text-4xl md:text-5xl mb-2 whitespace-pre-line ${isPurple ? 'text-white' : 'text-[var(--lime)]'}`}>
          {content.title as string}
        </h1>
        <p className={`italic mb-8 ${isPurple ? 'text-white/80' : 'text-[var(--orange)]'}`}>
          {content.subtitle as string}
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            {(content.paragraphs as string[]).slice(0, 2).map((para, i) => (
              <p key={i} className={`text-lg leading-relaxed ${isPurple ? 'text-white/90' : 'text-white/80'}`}>
                {para}
              </p>
            ))}
          </div>
          <div className="space-y-4">
            {(content.paragraphs as string[]).slice(2).map((para, i) => (
              <p key={i} className={`text-lg leading-relaxed ${isPurple ? 'text-white/90' : 'text-white/80'}`}>
                {para}
              </p>
            ))}
            <div className={`mt-6 p-4 rounded-lg ${isPurple ? 'bg-white/10' : 'bg-[var(--purple)]/20'}`}>
              <p className="text-sm text-white/60 italic">
                This is your "person-level" story that makes the initiative tangible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Startups Slide Component
function StartupsSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        <h1 className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-2">
          {content.title as string}
        </h1>
        <p className="text-[var(--orange)] italic mb-8">{content.subtitle as string}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(content.startups as string[]).map((startup, i) => (
            <div
              key={i}
              className="bg-[var(--purple)]/20 border border-[var(--purple)]/40 rounded-lg p-4 text-center"
            >
              <span className="text-white font-medium">{startup}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-[var(--lime)] font-semibold mb-4">Outcomes:</h3>
          <ul className="space-y-3">
            {(content.outcomes as string[]).map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[var(--lime)]">→</span>
                <span className="text-white/80">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Coalition Slide Component
function CoalitionSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  interface Category {
    name: string;
    items: string[];
  }

  return (
    <div className="slide bg-[var(--purple)]">
      <div className="slide-inner">
        <h1 className="headline-display text-4xl md:text-5xl text-white mb-2 whitespace-pre-line">
          {content.title as string}
        </h1>
        <p className="text-white/80 italic mb-8">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {(content.categories as Category[]).map((cat, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-5">
              <h3 className="text-[var(--lime)] font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--lime)]" />
                {cat.name}
              </h3>
              <ul className="space-y-2">
                {cat.items.map((item, j) => (
                  <li key={j} className="text-white/80 text-sm flex items-start gap-2">
                    <span className="text-white/40">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {content.footer && (
          <p className="mt-8 text-center text-white/60 italic">
            {content.footer as string}
          </p>
        )}
      </div>
    </div>
  );
}

// Outcomes Slide Component
function OutcomesSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  return (
    <div className="slide bg-[var(--black)]">
      <div className="slide-inner">
        <h1 className="headline-display text-5xl md:text-6xl text-[var(--lime)] mb-2">
          {content.title as string}
        </h1>
        <p className="text-[var(--orange)] italic mb-8">{content.subtitle as string}</p>

        <div className="grid md:grid-cols-2 gap-4">
          {(content.outcomes as string[]).map((outcome, i) => (
            <div
              key={i}
              className="bg-white/5 border-l-4 border-[var(--lime)] p-4 rounded-r-lg"
            >
              <div className="flex items-start gap-3">
                <span className="text-[var(--lime)] text-xl">✓</span>
                <span className="text-white/90">{outcome}</span>
              </div>
            </div>
          ))}
        </div>

        {content.footer && (
          <p className="mt-8 text-center text-white/60 italic bg-white/5 rounded-lg p-4">
            {content.footer as string}
          </p>
        )}
      </div>
    </div>
  );
}

// Vision Slide Component
function VisionSlide({ slide, onUpdate }: Props) {
  const { content } = slide;

  return (
    <div className="slide bg-[var(--purple)]">
      <div className="slide-inner">
        <h1 className="headline-display text-4xl md:text-5xl text-white mb-2 whitespace-pre-line">
          {content.title as string}
        </h1>
        <p className="text-[var(--lime)] italic mb-6">{content.subtitle as string}</p>

        {content.intro && (
          <p className="text-white/80 text-lg mb-8 max-w-3xl">
            {content.intro as string}
          </p>
        )}

        <div className="bg-white/10 rounded-lg p-6 mb-8">
          <h3 className="text-[var(--lime)] font-semibold mb-4">By 2029, a $5M investment would mean:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(content.outcomes as string[]).map((outcome, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[var(--lime)] text-2xl font-bold">{i + 1}</span>
                <span className="text-white/90">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {content.footer && (
          <p className="text-center text-white font-medium text-lg">
            {content.footer as string}
          </p>
        )}
      </div>
    </div>
  );
}

