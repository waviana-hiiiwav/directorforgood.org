"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Terminal, Crosshair, Activity, Shield } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Global tokens for Preset D (Vapor Clinic / Neon Biotech)
const colors = {
    primary: "#0A0A14", // Deep Void
    accent: "#E281F2", // Smooth Pink Glow
    background: "#F0EFF4", // Ghost
    dark: "#18181B", // Graphite 
};

export default function CinematicLandingPageOptionB() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Setup hero stagger
            gsap.from(".hero-text-elem", {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2,
            });

            // Navbar Morph
            ScrollTrigger.create({
                start: "top -10%",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (self.progress > 0.05) {
                        gsap.to(".navbar", {
                            backgroundColor: "rgba(10, 10, 20, 0.7)",
                            backdropFilter: "blur(12px)",
                            color: colors.background,
                            borderColor: "rgba(255,255,255,0.1)",
                            duration: 0.3,
                        });
                        gsap.to(".nav-btn", { backgroundColor: colors.accent, color: colors.background });
                    } else {
                        gsap.to(".navbar", {
                            backgroundColor: "transparent",
                            backdropFilter: "blur(0px)",
                            color: colors.background,
                            borderColor: "transparent",
                            duration: 0.3,
                        });
                        gsap.to(".nav-btn", { backgroundColor: colors.accent, color: colors.background });
                    }
                },
            });

            // Philosophy Parallax and Reveal
            gsap.to(".philosophy-bg", {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });

            gsap.from(".philosophy-text", {
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top center+=100",
                },
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: "power3.out",
            });

            // Protocol Sticky Stacking Archive
            const protocolCards = gsap.utils.toArray(".protocol-card") as HTMLElement[];
            protocolCards.forEach((card, i) => {
                if (i < protocolCards.length - 1) {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top top",
                        endTrigger: protocolCards[i + 1],
                        end: "top top",
                        pin: true,
                        pinSpacing: false,
                        onUpdate: (self) => {
                            gsap.to(card, {
                                scale: 1 - self.progress * 0.1,
                                opacity: 1 - self.progress * 0.5,
                                filter: `blur(${self.progress * 20}px)`,
                                ease: "power2.inOut",
                                duration: 0.1,
                            });
                        },
                    });
                } else {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top top",
                        end: "+=100%",
                        pin: true,
                        pinSpacing: true,
                    });
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="font-sans antialiased bg-[#0A0A14] text-[#F0EFF4] overflow-x-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Instrument+Serif:ital@0;1&family=Sora:wght@400;600;700&display=swap');
        
        .font-sans-head { font-family: 'Sora', sans-serif; }
        .font-drama { font-family: 'Instrument Serif', serif; }
        .font-data { font-family: 'Fira Code', monospace; }

        .magnetic-btn {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .magnetic-btn:hover {
          transform: scale(1.03);
        }

        .hover-lift {
          transition: transform 0.2s ease-out;
        }
        .hover-lift:hover {
          transform: translateY(-1px);
        }
      ` }} />

            <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* A. NAVBAR */}
            <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8 rounded-[3rem] px-6 py-3 text-[#F0EFF4] border border-transparent transition-colors duration-300">
                <div className="font-sans-head font-bold tracking-tight text-xl uppercase">Director</div>
                <div className="hidden md:flex gap-6 font-data text-sm uppercase">
                    <a href="#features" className="hover-lift">System</a>
                    <a href="#philosophy" className="hover-lift">Philosophy</a>
                    <a href="#protocol" className="hover-lift">Protocol</a>
                </div>
                <button className="nav-btn bg-[#7B61FF] text-[#F0EFF4] font-sans-head font-bold px-6 py-2 rounded-full magnetic-btn relative overflow-hidden group">
                    <span className="relative z-10">Access</span>
                    <span className="absolute inset-0 bg-[#C65CD8] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                </button>
            </nav>

            {/* B. HERO SECTION */}
            <section className="relative h-[100dvh] w-full flex items-end pb-24 px-8 md:px-16 lg:px-24">
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1625685554446-9c0dc87d506a?auto=format&fit=crop&q=80&w=2000"
                        alt="Neon Arts and Culture"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-4xl text-[#F0EFF4]">
                    <h1 className="leading-[0.9] tracking-tighter flex flex-col items-start gap-2">
                        <span className="hero-text-elem font-sans-head font-bold text-4xl md:text-6xl uppercase tracking-tighter text-[#7B61FF]">Backbone</span>
                        <span className="hero-text-elem font-drama italic text-7xl md:text-[10rem] pr-4 text-[#F0EFF4]">beyond limits.</span>
                    </h1>
                    <p className="hero-text-elem font-data mt-8 text-lg max-w-xl text-[#F0EFF4]/80">
                        Director is the AI-native operating system and forward-deployed team that lets a single founder safely run a $5M nonprofit with no internal back-office hires.
                    </p>
                    <div className="hero-text-elem mt-10">
                        <button className="bg-[#7B61FF] text-[#F0EFF4] font-sans-head font-bold text-lg px-8 py-4 rounded-[2rem] magnetic-btn flex items-center gap-3 relative overflow-hidden group shadow-[0_0_20px_rgba(226,129,242,0.4)] hover:shadow-[0_0_30px_rgba(226,129,242,0.6)] transition-shadow">
                            <span className="relative z-10">Request Early Access</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                        </button>
                    </div>
                </div>
            </section>

            {/* C. FEATURES */}
            <section id="features" className="py-32 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <h2 className="font-sans-head font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-16 text-[#F0EFF4]">
                    Functional <span className="text-[#7B61FF]">Artifacts</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard1 />
                    <FeatureCard2 />
                    <FeatureCard3 />
                </div>
            </section>

            {/* D. PHILOSOPHY */}
            <section id="philosophy" className="philosophy-section relative w-full py-40 bg-[#0A0A14] text-[#F0EFF4] overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <img
                        src="https://images.unsplash.com/photo-1625685554446-9c0dc87d506a?auto=format&fit=crop&q=80&w=2000"
                        alt="Neon Glow Texture"
                        className="philosophy-bg w-full h-[120%] object-cover -top-[10%] mix-blend-screen"
                    />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
                    <div className="philosophy-text font-sans-head text-xl md:text-2xl text-[#F0EFF4]/60 mb-6 uppercase tracking-wider">
                        Most nonprofits focus on
                        <br />
                        <span className="lowercase font-data text-lg mt-2 inline-block">stitching together chaotic tools and paying expensive consultants.</span>
                    </div>
                    <div className="philosophy-text font-drama italic text-5xl md:text-7xl leading-tight">
                        We focus on <span className="text-[#7B61FF] relative inline-block">infinite capacity<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#7B61FF] shadow-[0_0_10px_#7B61FF]"></span></span> and autonomous execution.
                    </div>
                </div>
            </section>

            {/* E. PROTOCOL */}
            <section id="protocol" className="relative bg-[#0A0A14]">
                <div className="protocol-card min-h-screen w-full bg-[#0A0A14] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-white/5 relative overflow-hidden">
                    <ProtocolBg1 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#7B61FF] text-sm md:text-base mb-4 uppercase">Phase 01</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#F0EFF4] uppercase tracking-tighter mb-6">Revenue & <br /> Relationships</h3>
                        <p className="font-data text-[#F0EFF4]/70 text-lg md:text-xl leading-relaxed">
                            Major gifts map, warm pipeline, next-best actions. Map and grow the major gifts pipeline. Prepare founders for high-stakes meetings.
                        </p>
                    </div>
                </div>
                <div className="protocol-card min-h-screen w-full bg-[#101018] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-white/5 relative overflow-hidden">
                    <ProtocolBg2 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#7B61FF] text-sm md:text-base mb-4 uppercase">Phase 02</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#F0EFF4] uppercase tracking-tighter mb-6">Runway & <br /> Finance</h3>
                        <p className="font-data text-[#F0EFF4]/70 text-lg md:text-xl leading-relaxed">
                            Live cash forecasts, budget vs actuals visibility. Data flows directly from accounting into standardized board-ready views.
                        </p>
                    </div>
                </div>
                <div className="protocol-card min-h-screen w-full bg-[#05050A] flex flex-col justify-center px-8 md:px-16 lg:px-24 relative overflow-hidden">
                    <ProtocolBg3 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#7B61FF] text-sm md:text-base mb-4 uppercase">Phase 03</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#F0EFF4] uppercase tracking-tighter mb-6">Ops & <br /> Compliance</h3>
                        <p className="font-data text-[#F0EFF4]/70 text-lg md:text-xl leading-relaxed">
                            Recurring task engine, checklists, playbooks. Generating funder narrative reports effortlessly, maintaining pure information density.
                        </p>
                    </div>
                </div>
            </section>

            {/* F. MEMBERSHIP / GET STARTED */}
            <section className="py-40 bg-[#18181B] px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center">
                <h2 className="font-sans-head font-bold text-5xl md:text-7xl text-[#F0EFF4] uppercase tracking-tighter mb-6">
                    Deploy <span className="font-drama italic font-normal text-[#7B61FF] lowercase">Director</span>
                </h2>
                <p className="font-data text-[#F0EFF4]/70 max-w-2xl mx-auto mb-12 text-lg">
                    Stop sacrificing your vision for administration. Secure a dedicated Director Pod for your organization today.
                </p>
                <button className="bg-[#7B61FF] text-[#F0EFF4] font-sans-head font-bold text-xl px-12 py-6 rounded-[3rem] magnetic-btn shadow-[0_0_30px_rgba(226,129,242,0.3)] relative overflow-hidden group">
                    <span className="relative z-10">Secure Your Forward-Deployed Pod</span>
                    <span className="absolute inset-0 bg-[#C65CD8] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                </button>
            </section>

            {/* G. FOOTER */}
            <footer className="bg-[#0A0A14] text-[#F0EFF4] px-8 md:px-16 lg:px-24 py-20 relative z-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="font-sans-head font-bold text-3xl tracking-tight mb-4 uppercase">Director</div>
                        <p className="font-data text-sm text-[#F0EFF4]/60 max-w-sm mb-8">
                            The AI agent team that lets a single founder run a $5M nonprofit with no back-office staff.
                        </p>
                        <div className="flex items-center gap-3 bg-white/5 w-max px-4 py-2 rounded-[2rem] border border-[#7B61FF]/30 shadow-[0_0_10px_rgba(226,129,242,0.1)]">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B61FF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B61FF] shadow-[0_0_5px_#7B61FF]"></span>
                            </div>
                            <span className="font-data text-xs uppercase text-[#7B61FF]">System Operational</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans-head font-bold uppercase mb-4 text-[#7B61FF]">OS</h4>
                        <div className="flex flex-col gap-4 font-data text-sm text-[#F0EFF4]/70">
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Revenue</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Runway</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Ops Engine</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans-head font-bold uppercase mb-4 text-[#7B61FF]">Legal</h4>
                        <div className="flex flex-col gap-4 font-data text-sm text-[#F0EFF4]/70">
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Privacy</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Terms</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Security</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard1() {
    const [items, setItems] = useState(["Major Gifts Mapping", "Pipeline Optimization", "Next-Best Action Gen"]);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setItems(prev => {
                    const arr = [...prev];
                    const last = arr.pop()!;
                    arr.unshift(last);
                    return arr;
                });
                setAnimating(false);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#18181B] rounded-[3rem] p-8 border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6"><Crosshair className="w-8 h-8 text-[#7B61FF] filter drop-shadow-[0_0_8px_rgba(226,129,242,0.6)]" /></div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2 text-[#F0EFF4]">Revenue Engine</h3>
            <p className="font-data text-sm text-[#F0EFF4]/60 mb-8 h-12">Identify and engage your major donors effortlessly.</p>

            <div className="relative h-40">
                {items.map((item, i) => (
                    <div
                        key={item}
                        className="absolute left-0 right-0 bg-[#0A0A14] border border-[#7B61FF]/20 rounded-[1.5rem] p-4 shadow-sm flex items-center justify-between"
                        style={{
                            top: `${i * 15}px`,
                            zIndex: 10 - i,
                            transform: `scale(${1 - i * 0.05})`,
                            opacity: animating && i === items.length - 1 ? 0 : 1 - i * 0.2,
                            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                    >
                        <span className="font-data text-xs font-bold uppercase text-[#F0EFF4]">{item}</span>
                        <Activity className="w-4 h-4 text-[#7B61FF]/60" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function FeatureCard2() {
    const fullText = "$ LIVE RUNWAY: 12.4 MO\n> BURN RT: $42K/MO\n> NEXT FUND: MAR 24\n> ALERTS: NONE\n...";
    const [text, setText] = useState("");

    useEffect(() => {
        let i = 0;
        setText("");
        const interval = setInterval(() => {
            setText(fullText.substring(0, i));
            i++;
            if (i > fullText.length + 10) i = 0;
        }, 80);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0A0A14] rounded-[3rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-[#F0EFF4] border border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
                <Terminal className="w-8 h-8 text-[#7B61FF] filter drop-shadow-[0_0_8px_rgba(226,129,242,0.6)]" />
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B61FF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7B61FF] shadow-[0_0_5px_#7B61FF]"></span>
                    </span>
                    <span className="font-data text-[10px] uppercase text-[#7B61FF]">Live Feed</span>
                </div>
            </div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2 text-[#F0EFF4]">Telemetry</h3>
            <p className="font-data text-sm text-[#F0EFF4]/60 mb-8 h-12">Real-time financial visibility and accurate cash forecasting.</p>

            <div className="bg-[#18181B] border border-[#7B61FF]/20 rounded-[1.5rem] p-5 h-40 font-data text-xs whitespace-pre text-[#7B61FF] overflow-hidden leading-relaxed shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                {text}<span className="animate-pulse inline-block w-2.5 h-3 bg-[#7B61FF] ml-1 align-middle shadow-[0_0_8px_#7B61FF]"></span>
            </div>
        </div>
    );
}

function FeatureCard3() {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const [activeCell, setActiveCell] = useState(2);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            tl.set(".the-cursor", { x: 0, y: 50, opacity: 0, scale: 1 })
                .to(".the-cursor", { opacity: 1, duration: 0.3 })
                .to(".the-cursor", { x: 85, y: 25, duration: 0.8, ease: "power2.inOut" })
                .to(".the-cursor", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1, onComplete: () => setActiveCell(3) })
                .to(".the-cursor", { x: 220, y: 80, duration: 0.7, ease: "power2.inOut" })
                .to(".the-cursor", { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
                .to(".the-cursor", { opacity: 0, duration: 0.3, delay: 0.5 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-[#18181B] rounded-[3rem] p-8 border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6"><Shield className="w-8 h-8 text-[#7B61FF] filter drop-shadow-[0_0_8px_rgba(226,129,242,0.6)]" /></div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2 text-[#F0EFF4]">Ops Protocol</h3>
            <p className="font-data text-sm text-[#F0EFF4]/60 mb-8 h-12">Automated recurring tasks, board compliance, and playbooks.</p>

            <div className="bg-[#0A0A14] border border-[#7B61FF]/20 rounded-[1.5rem] p-5 h-40 relative">
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                    {days.map((d, i) => (
                        <div key={i} className="text-center font-data text-[10px] text-white/40">{d}</div>
                    ))}
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-6 rounded-[0.4rem] border ${i === activeCell
                                ? "bg-[#7B61FF] border-[#7B61FF] shadow-[0_0_10px_rgba(226,129,242,0.5)]"
                                : i === 3 && activeCell === 3
                                    ? "bg-[#7B61FF] border-[#7B61FF] shadow-[0_0_10px_rgba(226,129,242,0.5)]"
                                    : "bg-[#18181B] border-white/5"
                                } transition-all duration-300`}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <div className="bg-[#7B61FF] text-[#0A0A14] font-data text-[10px] px-4 py-2 rounded-xl uppercase flex items-center gap-1 font-bold shadow-[0_0_15px_rgba(226,129,242,0.4)]">
                        Save Protocol
                    </div>
                </div>

                <div className="the-cursor absolute top-0 left-0 pointer-events-none z-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                        <path d="M5.5 4L9.5 20L12 13.5L18.5 11L5.5 4Z" fill="#F0EFF4" stroke="#7B61FF" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function ProtocolBg1() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-end opacity-[0.15] pointer-events-none pr-[-20%] mix-blend-screen">
            <svg className="w-[800px] h-[800px] animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7B61FF" strokeWidth="0.5" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#7B61FF" strokeWidth="1" className="filter drop-shadow-[0_0_2px_#7B61FF]" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#F0EFF4" strokeWidth="0.5" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="#7B61FF" strokeWidth="0.2" />
            </svg>
        </div>
    );
}

function ProtocolBg2() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.1] pointer-events-none mix-blend-screen">
            <div className="w-full h-full relative overflow-hidden bg-[radial-gradient(circle_at_center,_#7B61FF_1px,_transparent_1px)] bg-[size:40px_40px]">
                <div className="absolute inset-y-0 w-1 bg-[#7B61FF] shadow-[0_0_20px_#7B61FF] animate-[ping_3s_ease-in-out_infinite_alternate]" style={{ left: '50%' }}></div>
            </div>
        </div>
    );
}

function ProtocolBg3() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-start opacity-[0.25] pointer-events-none mix-blend-screen">
            <svg width="600" height="200" viewBox="0 0 600 200" className="w-[80vw]">
                <path
                    d="M0 100 L200 100 L220 50 L240 150 L260 80 L280 120 L300 100 L600 100"
                    fill="none"
                    stroke="#7B61FF"
                    strokeWidth="2"
                    className="animate-[dash_3s_linear_infinite] filter drop-shadow-[0_0_5px_#7B61FF]"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                />
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}} />
            </svg>
        </div>
    );
}
