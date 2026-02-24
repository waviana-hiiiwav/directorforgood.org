import { initialSlides } from '@/data/otw-slides'
import { globalStyles } from './styles'
import { logos, colorVars } from './brand'
import Image from 'next/image'

export default function OTWPhaseIIWebsite() {
  const coverContent = initialSlides.find(s => s.id === 'cover')?.content || {}
  const execSummaryContent = initialSlides.find(s => s.type === 'exec-summary')?.content || {}
  const tocContent = initialSlides.find(s => s.id === 'toc')?.content || {}
  const visionContent = initialSlides.find(s => s.id === 'city-of-belonging')?.content || {}
  const commitmentContent = initialSlides.find(s => s.id === 'coalition-commitment')?.content || {}
  const whyUsContent = initialSlides.find(s => s.id === 'why-us')?.content || {}
  const goalsResultsContent = initialSlides.find(s => s.id === 'goals-vs-results')?.content || {}
  const earlyOutcomesContent = initialSlides.find(s => s.id === 'early-outcomes')?.content || {}
  const investmentContent = initialSlides.find(s => s.id === 'investment')?.content || {}
  const teamContent = initialSlides.find(s => s.id === 'team')?.content || {}
  const budgetPlanContent = initialSlides.find(s => s.id === 'budget-plan')?.content || {}
  const budgetBreakdownContent = initialSlides.find(s => s.id === 'budget-breakdown')?.content || {}
  const roadmapContent = initialSlides.find(s => s.id === 'five-year-roadmap')?.content || {}
  const ctaContent = initialSlides.find(s => s.id === 'cta')?.content || {}
  
  const LOGO_DEV_KEY = process.env.LOGO_DEV_KEY || 'pk_shUIsqtoSr-AgVsFrZ6_dg';
  
  return (
    <main className="otw-proposal">
      <style>{globalStyles}</style>

      {/* Header Navigation */}
      <header className="nav-header">
        <div className="flex items-center gap-4">
          <Image src={logos.dark} alt="HiiiWAV" width={80} height={20} className="object-contain" />
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="nav-logo-text">OTW Phase II Proposal</span>
        </div>
        <a href="#cta" className="nav-button">Partner With Us</a>
      </header>

      {/* 1. Cover Section */}
      <section className="bg-silk text-center">
        <div className="container">
          <p className="text-2xl tracking-[0.5em] mb-4 opacity-80 uppercase font-black">{coverContent.year as string}</p>
          <h1 className="mb-8">
            {coverContent.title as string}<br />
            <span className="text-purple">{coverContent.titleLine2 as string}</span>
          </h1>
          <div className="flex justify-center mt-12">
             <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image 
                  src="/images/cover-photo-proclamation.png" 
                  alt="OTW" 
                  fill 
                  className="object-cover"
                />
             </div>
          </div>
          <div className="mt-12">
            <Image src={logos.otw} alt="Oakland Tech Week" width={400} height={100} className="mx-auto brightness-0 invert opacity-80" />
          </div>
        </div>
      </section>

      {/* 2. Executive Summary & TOC */}
      <section className="bg-white text-black py-32">
        <div className="container">
          <div className="grid md:grid-cols-[1.5fr,1fr] gap-20">
            {/* Left Column: Executive Summary */}
            <div className="border-r border-black/10 pr-20">
              <h2 className="text-black mb-12 text-5xl">{execSummaryContent.title as string || 'Executive Summary'}</h2>
              <div className="space-y-8 text-xl leading-relaxed font-medium">
                {(execSummaryContent.paragraphs as string[])?.map((p, i) => (
                  <p key={i}>
                    {/* Add some basic parsing for known keywords if needed, or just render the text */}
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right Column: Table of Contents */}
            <div>
              <h2 className="text-black mb-12 text-5xl">Impact Guide</h2>
              <div className="space-y-4">
                {(tocContent.items as any[])?.map((item, i) => (
                  <div key={i} className="flex justify-between items-baseline group border-b border-black/5 pb-4 hover:border-purple/30 transition-colors">
                    <span className="text-lg font-black uppercase tracking-tight group-hover:text-purple transition-colors">
                      {item.title}
                    </span>
                    <div className="flex-1 border-b border-dotted border-black/20 mx-4 group-hover:border-purple/20" />
                    <span className="text-xl font-black text-purple">
                      {item.page}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-16 p-8 bg-purple/5 border border-purple/10 rounded-2xl">
                <p className="text-sm font-black uppercase tracking-widest text-purple mb-4">A Collaborative Achievement</p>
                <p className="text-lg font-bold leading-tight text-purple/80 italic">
                  Oakland Tech Week was made possible through a grant from the Kapor Foundation and foundational partnerships with Northeastern University and the City of Oakland.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Goals vs Results */}
      <section className="bg-white text-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-[6px] border-black pb-8">
            <h2 className="mb-0 text-black">{goalsResultsContent.title as string}</h2>
            <p className="text-2xl italic font-black uppercase tracking-tight text-purple">{goalsResultsContent.subtitle as string}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            {(goalsResultsContent.items as any[])?.map((item, i) => (
              <div key={i} className="flex justify-between items-center group border-b border-black/10 pb-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest opacity-40 mb-1 font-black">Strategic Goal</p>
                  <p className="text-xl font-black uppercase leading-tight">{item.goal}</p>
                </div>
                <div className="text-right flex-1 pl-4">
                  <p className="text-xs uppercase tracking-widest text-purple mb-1 font-black">Result</p>
                  <p className="text-3xl font-black text-purple">{item.result}</p>
                  {item.percentage && <p className="text-xs font-black text-white bg-black px-3 py-1 rounded-full inline-block mt-2 uppercase tracking-widest">{item.percentage}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Commitment Section */}
      <section className="bg-silk relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-7xl md:text-8xl font-black mb-4 leading-none tracking-tighter uppercase">{commitmentContent.title as string}</h2>
            <p className="text-2xl text-white/60 italic font-medium">{(commitmentContent.subtitle as string)}</p>
          </div>
          
          <div className="mb-16">
            <div className="flex items-center gap-6 mb-12">
              <h3 className="text-4xl font-black uppercase tracking-tight m-0 whitespace-nowrap">Coalition Partners</h3>
              <div className="h-[2px] flex-1 bg-white/20" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(commitmentContent.partners as any[])?.map((partner, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all">
                  <div className="relative w-8 h-8 shrink-0 bg-white rounded-lg p-1 overflow-hidden">
                    <img 
                      src={`https://img.logo.dev/${partner.domain || 'placeholder.com'}?token=${LOGO_DEV_KEY}`} 
                      alt={partner.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-16 border-t border-white/10 text-center">
            <p className="text-3xl font-black italic uppercase tracking-tighter text-white opacity-90">&quot;{(commitmentContent.footer as string)}&quot;</p>
          </div>
        </div>
      </section>

      {/* 4. Vision Section */}
      <section id="vision" className="bg-black py-40 border-b border-white/10">
        <div className="container">
          <div className="grid md:grid-cols-2 items-center gap-20">
            <div>
              <h2 className="text-lime leading-tight mb-4 text-7xl">{visionContent.title as string}</h2>
              <p className="text-3xl italic text-orange mb-12 font-black uppercase tracking-tight">{visionContent.subtitle as string}</p>
              <ul className="bullet-list">
                {(visionContent.bullets as string[])?.map((bullet, i) => (
                  <li key={i} className="font-bold opacity-90 text-2xl mb-6 leading-tight">{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square rounded-full border-[3px] border-lime/20 p-12 flex items-center justify-center">
               <div className="absolute inset-0 bg-lime/10 rounded-full blur-[100px]" />
               <div className="relative z-10 text-center">
                  <span className="text-[10rem] md:text-[12rem] font-black text-lime block leading-none tracking-tighter">$1.25M</span>
                  <span className="text-2xl uppercase tracking-[0.4em] font-black text-white opacity-40">Two-Year Initiative</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Early Outcomes */}
      <section className="bg-orange text-white">
        <div className="container">
          <h2 className="text-center text-black mb-16">{earlyOutcomesContent.title as string}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(earlyOutcomesContent.outcomes as string[])?.map((outcome, i) => (
              <div key={i} className="bg-black/10 p-10 rounded-3xl border border-white/20 backdrop-blur-md">
                <div className="flex items-start gap-6">
                  <span className="text-4xl text-black font-black leading-none">0{i+1}</span>
                  <p className="text-xl leading-tight font-bold">{outcome}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center p-10 bg-black/20 rounded-3xl italic text-2xl font-black uppercase tracking-tight">
            {earlyOutcomesContent.footer as string}
          </div>
        </div>
      </section>

      {/* 5. Investment Table */}
      <section className="bg-black">
        <div className="container max-w-4xl">
          <h2 className="text-center text-purple mb-4">{investmentContent.title as string}</h2>
          <p className="text-center text-2xl mb-16 opacity-60 font-bold uppercase tracking-widest">{investmentContent.subtitle as string}</p>
          <div className="bg-[#0A0A0A] rounded-[2rem] overflow-hidden border border-purple/30 shadow-[0_0_50px_rgba(163,77,255,0.1)]">
            {(investmentContent.rows as any[])?.map((row, i) => (
              <div key={i} className="flex justify-between items-center px-12 py-8 border-b border-purple/10 hover:bg-purple/5 transition-all">
                <span className="text-xl font-black uppercase tracking-wide">{row.label}</span>
                <span className="text-3xl font-black text-purple">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Us Section */}
      <section className="bg-[#050505]">
        <div className="container">
          <div className="max-w-3xl mb-20">
            <h2 className="text-orange mb-6">{whyUsContent.title as string}</h2>
            <p className="text-2xl leading-tight mb-12 opacity-80 font-bold uppercase tracking-tight">{whyUsContent.context as string}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {(whyUsContent.reasons as any[])?.map((reason, i) => (
              <div key={i} className="border-l-[6px] border-orange pl-10 py-6 bg-orange/5 rounded-r-[2rem]">
                <h3 className="text-2xl font-black uppercase mb-3 text-orange tracking-tight">{reason.title}</h3>
                <p className="text-lg opacity-80 leading-snug">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Event Committee Section */}
      <section className="bg-[#F8F7F2] text-black">
        <div className="container">
          <h2 className="text-7xl md:text-8xl font-black mb-24 leading-none tracking-tighter uppercase">{teamContent.title as string}</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {(teamContent.team as any[])?.map((member, i) => (
              <div key={i} className="group">
                <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-500">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black/5" />
                  )}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F7F2]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                </div>
                <p className="text-2xl font-black uppercase tracking-tight mb-1">{member.name}</p>
                <p className="text-lg font-medium opacity-60 italic">{member.role}</p>
                <div className="mt-4 text-black/20 text-3xl font-light">+</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Budget Roadmap */}
      <section className="bg-black py-40">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-lime mb-4">{budgetPlanContent.title as string}</h2>
              <p className="text-2xl font-black uppercase tracking-widest text-white/40 mb-12">{budgetPlanContent.subtitle as string}</p>
              <div className="space-y-4">
                {(budgetPlanContent.rows as any[])?.map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/10 group hover:bg-white/5 px-4 transition-colors">
                    <span className="text-xl font-bold uppercase">{row.label}</span>
                    <span className="text-2xl font-black text-lime">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-orange mb-4">{roadmapContent.title as string}</h2>
              <p className="text-2xl font-black uppercase tracking-widest text-white/40 mb-12">Target Outcomes</p>
              <div className="grid grid-cols-2 gap-8">
                {(roadmapContent.stats as any[])?.map((stat, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-4xl font-black text-orange mb-2">{stat.value}</p>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call to Action */}
      <section id="cta" className="bg-silk py-40">
        <div className="container text-center">
          <h2 className="mb-6">{ctaContent.title as string}</h2>
          <p className="text-4xl font-black text-lime mb-16 uppercase tracking-[0.2em]">{ctaContent.subtitle as string}</p>
          <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-2xl p-16 rounded-[4rem] border border-white/10 shadow-2xl">
            <p className="text-3xl leading-tight mb-16 font-bold uppercase tracking-tight">{ctaContent.body as string}</p>
            <div className="grid md:grid-cols-3 gap-10 text-left mb-16">
              {(ctaContent.nextSteps as string[])?.map((step, i) => (
                <div key={i} className="flex gap-4 items-start border-t border-white/10 pt-6">
                  <span className="bg-lime text-black w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0 text-xl">0{i + 1}</span>
                  <p className="font-black uppercase text-xs tracking-[0.1em] opacity-80 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="pt-16 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="text-left">
                <p className="text-xs opacity-50 uppercase tracking-[0.3em] mb-2 font-black">Strategic Partnership</p>
                <p className="text-3xl font-black uppercase tracking-tight">{ctaContent.contactName as string}</p>
                <p className="text-lime font-black uppercase tracking-[0.1em] text-sm">{ctaContent.contactRole as string}</p>
              </div>
              <a 
                href={`mailto:${ctaContent.contactEmail as string}`}
                className="bg-white text-black px-12 py-6 rounded-none font-black text-xl hover:bg-lime transition-all shadow-2xl uppercase tracking-widest"
              >
                Connect Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center border-t border-white/10 bg-[#0A0A0A]">
        <div className="container">
          <Image src={logos.dark} alt="HiiiWAV" width={120} height={30} className="mx-auto mb-8 opacity-50" />
          <p className="opacity-40 uppercase font-black tracking-[0.3em] text-xs">Oakland Tech Week | Phase II Proposal | 2025-2026</p>
        </div>
      </footer>
    </main>
  )
}
