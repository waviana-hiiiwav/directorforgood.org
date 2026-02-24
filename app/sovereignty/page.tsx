import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Database, Leaf, Lock, CheckCircle2, Sparkles, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Liberation Intelligence | Community-Led AI Abundance',
  description: 'The operating system for a Just Transition. Reclaiming the creative economy through private, green, and community-owned intelligence.',
};

export default function LiberationIntelligencePage() {
  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-black selection:text-white font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black tracking-tighter text-2xl text-neutral-900 italic">
              Liberation Intelligence
            </Link>
            <div className="h-6 w-px bg-neutral-300 hidden sm:block"></div>
            <span className="font-bold tracking-tight text-xl text-indigo-600 hidden sm:block">
              OS
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
              Back to Main
            </Link>
            <Button asChild className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              <Link href="#join-waitlist">Join the Transition</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-16">
        
        {/* Giant Header Section */}
        <section className="bg-neutral-900 py-12 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-[10vw] font-black leading-none tracking-tighter text-white italic opacity-90">
              Liberation <span className="text-indigo-500">Intelligence</span>
            </h1>
          </div>
        </section>
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold mb-6 border border-indigo-200">
                <Sparkles className="w-4 h-4" />
                <span>The Operating System for a Just Transition</span>
              </div>
              <h1 className="text-5xl lg:text-8xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.05]">
                From Extraction to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Community Abundance.</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed max-w-xl">
                Meet <strong className="text-neutral-900">Liberation Intelligence</strong>. Founded and owned by Award-winning technologist <strong className="text-neutral-900">Bosko Kante</strong>, we provide a 100% clean energy powered back-office for small businesses that protects your financial data and never trains big corporate models on your struggle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full bg-black text-white hover:bg-neutral-800 h-14 px-8 text-lg" asChild>
                  <Link href="#join-waitlist">Claim Your Liberation <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-neutral-300" asChild>
                  <Link href="#how-it-works">Our Manifesto</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-violet-100 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
              <div className="bg-white border border-neutral-200 shadow-2xl rounded-3xl p-8 relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <div className="mb-6 overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-100 border border-neutral-200 relative group max-w-[50%] mx-auto">
                  <img 
                    src="/images/bosko-kante-headshot.png" 
                    alt="Bosko Kante" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium">Bosko Kante, Founder</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                  <div>
                    <h3 className="font-bold text-2xl text-neutral-900">Bosko Kante</h3>
                    <p className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">Founder & Owner</p>
                  </div>
                  <Users className="w-10 h-10 text-indigo-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Zap className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Post-Work Automation</p>
                      <p className="text-xs text-neutral-500">Automating the 9-5 grind into a 5-9 life.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Users className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Community-Led AI</p>
                      <p className="text-xs text-neutral-500">Owned by the people, for the people.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Leaf className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Regenerative Power</p>
                      <p className="text-xs text-neutral-500">100% Solar-Powered Micro-Nodes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oakland Imagery Section */}
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl overflow-hidden relative group md:col-span-2 h-[400px]">
              <img 
                src="/images/lake-merritt-oakland.jpg?v=4" 
                alt="Lake Merritt, Oakland" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <p className="text-white font-bold text-2xl">Rooted in Oakland. Built for the Commons.</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden relative group h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800" 
                alt="Nature" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent flex items-end p-8">
                <p className="text-white font-bold text-xl">Powered by the Sun.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem / Solution */}
        <section id="how-it-works" className="bg-neutral-900 text-white py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=2000" 
              alt="Solar Panels" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-900"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">A Just Transition for the Creative Class.</h2>
                <p className="text-lg text-neutral-400">
                Silicon Valley builds AI to replace you. We build AI to liberate you. Moving from an extractive economy to one of community-led abundance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community-Led Abundance</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We are moving toward a post-work society where AI creates enough for everyone. Our tools are designed to build community wealth, not corporate dividends.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Graceful Accounting</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We recognize that life and business are intertwined. Our AI helps you manage commingled funds without judgment, providing a path to clean separation as you transition to growth.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Regenerative Infrastructure</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Our solar-powered micro-nodes run on efficient Small Language Models (SLMs). We don&apos;t drain the grid; we power the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Replacement Stack */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative">
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Liberate your time.</h2>
            <p className="text-lg text-neutral-600">
              Stop paying for tools that own your data. Liberation Intelligence is your private, community-owned operating system.
            </p>
          </div>

          {/* Subscription Kill List */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_1fr_auto_auto] items-center gap-4 px-6 py-4 bg-neutral-900 text-white text-sm font-bold">
              <span>Tool You Cancel</span>
              <span className="hidden md:block">What Liberation Intelligence Does</span>
              <span className="text-right">Cost/mo</span>
              <span className="text-center w-8">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto" />
              </span>
            </div>

            {[
              { tool: "QuickBooks / Xero", replacement: "AI bookkeeping with auto-categorization", cost: "$60" },
              { tool: "Expensify", replacement: "Text a receipt photo, auto-matched to transactions", cost: "$20" },
              { tool: "DocuSign / HelloSign", replacement: "Smart contracts generated & sent for e-sign", cost: "$25" },
              { tool: "Mailchimp / ConvertKit", replacement: "AI-drafted customer & investor updates", cost: "$40" },
              { tool: "Calendly", replacement: "AI scheduling agent negotiates meeting times", cost: "$15" },
              { tool: "HubSpot CRM", replacement: "Relationship map with next-best-action reminders", cost: "$50" },
              { tool: "TurboTax / Tax Prep", replacement: "Year-round tax-ready books, 1099 tracking, filing reminders", cost: "$50" },
              { tool: "Bench / Pilot (Bookkeeping Service)", replacement: "AI handles categorization, reconciliation, reports", cost: "$400" },
              { tool: "Belay / Time Etc (VA Service)", replacement: "AI handles scheduling, follow-ups, compliance", cost: "$250" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_1fr_auto_auto] items-center gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'} border-b border-neutral-100`}>
                <span className="font-semibold text-neutral-900 text-sm">{row.tool}</span>
                <span className="hidden md:block text-sm text-neutral-500">{row.replacement}</span>
                <span className="text-sm font-mono text-red-500 line-through text-right">{row.cost}</span>
                <span className="text-center w-8">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 mx-auto" />
                </span>
              </div>
            ))}

            <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_1fr_auto_auto] items-center gap-4 px-6 py-5 bg-neutral-900 text-white">
              <span className="font-bold text-lg">Total You Save</span>
              <span className="hidden md:block"></span>
              <span className="font-bold text-lg text-right line-through decoration-red-400 decoration-2">$910/mo</span>
              <span></span>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center">
              <div className="text-sm font-semibold text-neutral-500 mb-2 uppercase tracking-wide">The Old Way</div>
              <div className="text-3xl font-bold text-neutral-900 line-through decoration-red-500/50 decoration-4">~$910 / month</div>
              <div className="text-sm text-neutral-500 mt-3">9+ subscriptions. Data sold to 3rd parties. No integration.</div>
            </div>
            
            <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-300 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">Recommended</div>
              <div className="text-sm font-semibold text-indigo-800 mb-2 uppercase tracking-wide">Liberation Intelligence</div>
              <div className="text-5xl font-bold text-indigo-600">$150<span className="text-lg font-normal text-indigo-500">/mo</span></div>
              <div className="text-sm text-indigo-700 mt-3 font-medium">100% Private. 100% Yours. 100% Clean Energy.</div>
            </div>
          </div>
        </section>

        {/* Waitlist Form */}
        <section id="join-waitlist" className="py-24 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure your spot in the transition.</h2>
            <p className="text-lg text-neutral-600 mb-10">
              Hardware capacity is limited to 1,000 businesses per solar micro-node. Join the waitlist to get priority access when we launch in Oakland.
            </p>
            
            <form className="max-w-md mx-auto space-y-4 text-left" action="https://formspree.io/f/your-form-id" method="POST">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="jane@yourbusiness.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="business" className="block text-sm font-medium text-neutral-700 mb-1">Business Name & Type</label>
                <input 
                  type="text" 
                  id="business" 
                  name="business" 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  placeholder="e.g., Bakery, Creative Agency"
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 h-14 text-lg mt-4">
                Reserve My Spot
              </Button>
              <p className="text-xs text-center text-neutral-500 mt-4">
                No commitment required. We will never share your email.
              </p>
            </form>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-bold text-lg tracking-tight italic">Liberation Intelligence</div>
          <div className="text-sm text-neutral-500">
            © Liberation Intelligence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
