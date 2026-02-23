import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Database, Leaf, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Sovereignty AI by Director | Ethical, Private AI for Main Street',
  description: 'An AI-powered back office that runs on green energy and never shares your data with Big Tech.',
};

export default function SovereigntyAIPage() {
  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-black selection:text-white font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight text-xl text-neutral-900">
            Director
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">
              Back to Main
            </Link>
            <Button asChild className="rounded-full bg-black text-white hover:bg-neutral-800 transition-all">
              <Link href="#join-waitlist">Get Early Access</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6">
                <Leaf className="w-4 h-4" />
                <span>Powered by 100% Renewable Energy</span>
              </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.1]">
                  Your data is <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">nobody else&apos;s business.</span>
                </h1>
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Meet <strong className="text-neutral-900">Sovereignty AI</strong> by Director. The first complete AI back-office for small businesses that runs off-grid, protects your financial data, and never trains big corporate models on your struggle.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full bg-black text-white hover:bg-neutral-800 h-14 px-8 text-lg" asChild>
                  <Link href="#join-waitlist">Join the Waitlist <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-neutral-300" asChild>
                  <Link href="#how-it-works">How it Works</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-transparent rounded-3xl transform rotate-3"></div>
              <div className="bg-white border border-neutral-200 shadow-xl rounded-3xl p-8 relative z-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
                  <div>
                    <h3 className="font-bold text-lg">System Status</h3>
                    <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                      Local Node Active
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-emerald-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Database className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Data Isolation</p>
                      <p className="text-xs text-neutral-500">100% On-Premise. No cloud scraping.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Lock className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Zero-Knowledge Processing</p>
                      <p className="text-xs text-neutral-500">Receipts & contracts processed in memory.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Leaf className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Energy Source</p>
                      <p className="text-xs text-neutral-500">Local Solar Array (Oakland, CA)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem / Solution */}
        <section id="how-it-works" className="bg-black text-white py-24">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Big Tech wasn&apos;t built for Main Street.</h2>
                <p className="text-lg text-neutral-400">
                Traditional SaaS tools judge your finances, extract your data, and burn massive amounts of energy. We built an alternative.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">True Data Sovereignty</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Your contracts, employee records, and bank data never go to OpenAI or Google. We run local, open-source models on isolated hardware. What happens in your business, stays in your business.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Graceful Accounting</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  We don&apos;t red-flag you for using a business card at the grocery store. Our AI understands the realities of small business cash flow, classifying commingled funds cleanly and safely without judgment.
                </p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Off-Grid & Green</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Massive AI data centers drain local water and power grids. Our localized micro-nodes run on efficient Small Language Models (SLMs) powered by solar and battery storage. 
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Replacement Stack */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Replace the software spaghetti.</h2>
              <p className="text-lg text-neutral-600 mb-8">
                Stop paying $800/month for 10 different tools that don&apos;t talk to each other. Sovereignty AI is your unified, private operating system.
              </p>
              
              <ul className="space-y-4">
                {[
                  "QuickBooks & Bookkeepers (Financials)",
                  "DocuSign (Contracts & Legal)",
                  "Expensify (Receipt Tracking)",
                  "Mailchimp (Investor/Client Updates)",
                  "Excel (Cash Runway Forecasting)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span>Replaces {item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-neutral-100 rounded-3xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <div className="text-sm font-semibold text-neutral-500 mb-1">Old Way</div>
                  <div className="text-2xl font-bold text-neutral-900 line-through decoration-red-500/50 decoration-4">~$850 / month</div>
                  <div className="text-sm text-neutral-500 mt-2">Plus your data is sold to 3rd parties.</div>
                </div>
                
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                  <div className="text-sm font-semibold text-emerald-800 mb-1">Sovereignty AI</div>
                  <div className="text-4xl font-bold text-emerald-600">$150 / month</div>
                  <div className="text-sm text-emerald-700 mt-2 font-medium">100% Private. 100% Yours.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form */}
        <section id="join-waitlist" className="py-24 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure your spot on the private node.</h2>
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

              <Button type="submit" className="w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 h-14 text-lg mt-4">
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
          <div className="font-bold text-lg tracking-tight">Director</div>
          <div className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Director. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
