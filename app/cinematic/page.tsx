"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Terminal, Crosshair, Activity, Shield } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Global tokens for Preset C (Brutalist Signal)
const colors = {
    primary: "#E8E4DD", // Paper
    accent: "#E63B2E", // Signal Red
    background: "#F5F3EE", // Off-white
    dark: "#111111", // Black
};

export default function CinematicLandingPage() {
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
                            backgroundColor: "rgba(245, 243, 238, 0.6)",
                            backdropFilter: "blur(12px)",
                            color: colors.dark,
                            borderColor: "rgba(17,17,17,0.1)",
                            duration: 0.3,
                        });
                        gsap.to(".nav-btn", { backgroundColor: colors.accent, color: colors.primary });
                    } else {
                        gsap.to(".navbar", {
                            backgroundColor: "transparent",
                            backdropFilter: "blur(0px)",
                            color: colors.primary,
                            borderColor: "transparent",
                            duration: 0.3,
                        });
                        gsap.to(".nav-btn", { backgroundColor: colors.accent, color: colors.primary });
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
        <div ref={containerRef} className="font-sans antialiased bg-[#F5F3EE] text-[#111111] overflow-x-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@400;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-sans-head { font-family: 'Space Grotesk', sans-serif; }
        .font-drama { font-family: 'DM Serif Display', serif; }
        .font-data { font-family: 'Space Mono', monospace; }

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
            <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8 rounded-[3rem] px-6 py-3 text-[#E8E4DD] border border-transparent transition-colors duration-300">
                <div className="font-sans-head font-bold tracking-tight text-xl uppercase">Director</div>
                <div className="hidden md:flex gap-6 font-data text-sm uppercase">
                    <a href="#features" className="hover-lift">System</a>
                    <a href="#philosophy" className="hover-lift">Philosophy</a>
                    <a href="#protocol" className="hover-lift">Protocol</a>
                </div>
                <button className="nav-btn bg-[#E63B2E] text-[#E8E4DD] font-sans-head font-bold px-6 py-2 rounded-full magnetic-btn relative overflow-hidden group">
                    <span className="relative z-10">Access</span>
                    <span className="absolute inset-0 bg-[#c52b20] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                </button>
            </nav>

            {/* B. HERO SECTION */}
            <section className="relative h-[100dvh] w-full flex items-end pb-24 px-8 md:px-16 lg:px-24">
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=2000"
                        alt="Brutalist Concrete Texture"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-4xl text-[#E8E4DD]">
                    <h1 className="leading-[0.9] tracking-tighter flex flex-col items-start gap-2">
                        <span className="hero-text-elem font-sans-head font-bold text-4xl md:text-6xl uppercase tracking-tighter text-[#E63B2E]">Command the</span>
                        <span className="hero-text-elem font-drama italic text-7xl md:text-[10rem] pr-4">Backbone.</span>
                    </h1>
                    <p className="hero-text-elem font-data mt-8 text-lg max-w-xl text-[#E8E4DD]/80">
                        Director is the AI-native operating system and forward-deployed team that lets a single founder safely run a $5M nonprofit with no internal back-office hires.
                    </p>
                    <div className="hero-text-elem mt-10">
                        <button className="bg-[#E63B2E] text-[#E8E4DD] font-sans-head font-bold text-lg px-8 py-4 rounded-[2rem] magnetic-btn flex items-center gap-3 relative overflow-hidden group">
                            <span className="relative z-10">Request Early Access</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                        </button>
                    </div>
                </div>
            </section>

            {/* C. FEATURES */}
            <section id="features" className="py-32 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <h2 className="font-sans-head font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-16 text-[#111111]">
                    Functional <span className="text-[#E63B2E]">Artifacts</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard1 />
                    <FeatureCard2 />
                    <FeatureCard3 />
                </div>
            </section>

            {/* D. PHILOSOPHY */}
            <section id="philosophy" className="philosophy-section relative w-full py-40 bg-[#111111] text-[#E8E4DD] overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1621245999887-b088bd21869e?auto=format&fit=crop&q=80&w=2000"
                        alt="Raw Material Texture"
                        className="philosophy-bg w-full h-[120%] object-cover -top-[10%]"
                    />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
                    <div className="philosophy-text font-sans-head text-xl md:text-2xl text-[#E8E4DD]/60 mb-6 uppercase tracking-wider">
                        Most nonprofits focus on
                        <br />
                        <span className="lowercase font-data text-lg mt-2 inline-block">stitching together chaotic tools and paying expensive consultants.</span>
                    </div>
                    <div className="philosophy-text font-drama italic text-5xl md:text-7xl leading-tight">
                        We focus on <span className="text-[#E63B2E]">infinite capacity</span> and autonomous execution.
                    </div>
                </div>
            </section>

            {/* E. PROTOCOL */}
            <section id="protocol" className="relative bg-[#111111]">
                <div className="protocol-card min-h-screen w-full bg-[#111111] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-white/5 relative overflow-hidden">
                    <ProtocolBg1 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#E63B2E] text-sm md:text-base mb-4 uppercase">Phase 01</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#E8E4DD] uppercase tracking-tighter mb-6">Revenue & <br /> Relationships</h3>
                        <p className="font-data text-[#E8E4DD]/70 text-lg md:text-xl leading-relaxed">
                            Major gifts map, warm pipeline, next-best actions. Map and grow the major gifts pipeline. Prepare founders for high-stakes meetings.
                        </p>
                    </div>
                </div>
                <div className="protocol-card min-h-screen w-full bg-[#1A1A1A] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-white/5 relative overflow-hidden">
                    <ProtocolBg2 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#E63B2E] text-sm md:text-base mb-4 uppercase">Phase 02</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#E8E4DD] uppercase tracking-tighter mb-6">Runway & <br /> Finance</h3>
                        <p className="font-data text-[#E8E4DD]/70 text-lg md:text-xl leading-relaxed">
                            Live cash forecasts, budget vs actuals visibility. Data flows directly from accounting into standardized board-ready views.
                        </p>
                    </div>
                </div>
                <div className="protocol-card min-h-screen w-full bg-[#0A0A0A] flex flex-col justify-center px-8 md:px-16 lg:px-24 relative overflow-hidden">
                    <ProtocolBg3 />
                    <div className="relative z-10 max-w-3xl pt-20">
                        <div className="font-data text-[#E63B2E] text-sm md:text-base mb-4 uppercase">Phase 03</div>
                        <h3 className="font-sans-head font-bold text-5xl md:text-7xl text-[#E8E4DD] uppercase tracking-tighter mb-6">Ops & <br /> Compliance</h3>
                        <p className="font-data text-[#E8E4DD]/70 text-lg md:text-xl leading-relaxed">
                            Recurring task engine, checklists, playbooks. Generating funder narrative reports effortlessly, maintaining pure information density.
                        </p>
                    </div>
                </div>
            </section>

            {/* F. MEMBERSHIP / GET STARTED */}
            <section className="py-40 bg-[#F5F3EE] px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center">
                <h2 className="font-sans-head font-bold text-5xl md:text-7xl text-[#111111] uppercase tracking-tighter mb-6">
                    Deploy <span className="font-drama italic font-normal text-[#E63B2E] lowercase">Director</span>
                </h2>
                <p className="font-data text-[#111111]/70 max-w-2xl mx-auto mb-12 text-lg">
                    Stop sacrificing your vision for administration. Secure a dedicated Director Pod for your organization today.
                </p>
                <button className="bg-[#111111] text-[#E8E4DD] font-sans-head font-bold text-xl px-12 py-6 rounded-[3rem] magnetic-btn shadow-2xl relative overflow-hidden group">
                    <span className="relative z-10">Secure Your Forward-Deployed Pod</span>
                    <span className="absolute inset-0 bg-[#E63B2E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                </button>
            </section>

            {/* G. FOOTER */}
            <footer className="bg-[#111111] text-[#E8E4DD] rounded-t-[4rem] px-8 md:px-16 lg:px-24 py-20 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="font-sans-head font-bold text-3xl tracking-tight mb-4 uppercase">Director</div>
                        <p className="font-data text-sm text-[#E8E4DD]/60 max-w-sm mb-8">
                            The AI agent team that lets a single founder run a $5M nonprofit with no back-office staff.
                        </p>
                        <div className="flex items-center gap-3 bg-white/5 w-max px-4 py-2 rounded-[2rem] border border-white/10">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63B2E] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E63B2E]"></span>
                            </div>
                            <span className="font-data text-xs uppercase text-[#E8E4DD]/80">System Operational</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans-head font-bold uppercase mb-4 text-[#E63B2E]">OS</h4>
                        <div className="flex flex-col gap-4 font-data text-sm text-[#E8E4DD]/70">
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Revenue</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Runway</span>
                            <span className="hover:text-white cursor-pointer hover-lift inline-block w-max">Ops Engine</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-sans-head font-bold uppercase mb-4 text-[#E63B2E]">Legal</h4>
                        <div className="flex flex-col gap-4 font-data text-sm text-[#E8E4DD]/70">
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
        <div className="bg-[#E8E4DD] rounded-[3rem] p-8 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6"><Crosshair className="w-8 h-8 text-[#E63B2E]" /></div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2">Revenue Engine</h3>
            <p className="font-data text-sm text-[#111111]/70 mb-8 h-12">Identify and engage your major donors effortlessly.</p>

            <div className="relative h-40">
                {items.map((item, i) => (
                    <div
                        key={item}
                        className="absolute left-0 right-0 bg-white border border-black/10 rounded-[1.5rem] p-4 shadow-sm flex items-center justify-between"
                        style={{
                            top: `${i * 15}px`,
                            zIndex: 10 - i,
                            transform: `scale(${1 - i * 0.05})`,
                            opacity: animating && i === items.length - 1 ? 0 : 1 - i * 0.2,
                            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                    >
                        <span className="font-data text-xs font-bold uppercase text-[#111111]">{item}</span>
                        <Activity className="w-4 h-4 text-[#111111]/40" />
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
        <div className="bg-[#111111] rounded-[3rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.2)] text-[#E8E4DD] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
                <Terminal className="w-8 h-8 text-[#E63B2E]" />
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63B2E] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E63B2E]"></span>
                    </span>
                    <span className="font-data text-[10px] uppercase text-[#E63B2E]">Live Feed</span>
                </div>
            </div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2">Telemetry</h3>
            <p className="font-data text-sm text-[#E8E4DD]/60 mb-8 h-12">Real-time financial visibility and accurate cash forecasting.</p>

            <div className="bg-[#1A1A1A] border border-white/10 rounded-[1.5rem] p-5 h-40 font-data text-xs whitespace-pre text-[#E63B2E] overflow-hidden leading-relaxed">
                {text}<span className="animate-pulse inline-block w-2.5 h-3 bg-[#E63B2E] ml-1 align-middle"></span>
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
        <div ref={containerRef} className="bg-[#E8E4DD] rounded-[3rem] p-8 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="mb-6"><Shield className="w-8 h-8 text-[#E63B2E]" /></div>
            <h3 className="font-sans-head font-bold text-xl uppercase tracking-tight mb-2">Ops Protocol</h3>
            <p className="font-data text-sm text-[#111111]/70 mb-8 h-12">Automated recurring tasks, board compliance, and playbooks.</p>

            <div className="bg-white border border-black/10 rounded-[1.5rem] p-5 h-40 relative">
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                    {days.map((d, i) => (
                        <div key={i} className="text-center font-data text-[10px] text-black/40">{d}</div>
                    ))}
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-6 rounded-[0.4rem] border ${i === activeCell
                                    ? "bg-[#E63B2E] border-[#E63B2E]"
                                    : i === 3 && activeCell === 3
                                        ? "bg-[#E63B2E] border-[#E63B2E]"
                                        : "bg-[#F5F3EE] border-black/5"
                                } transition-colors duration-300`}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <div className="bg-[#111111] text-white font-data text-[10px] px-4 py-2 rounded-xl uppercase flex items-center gap-1 shadow-md">
                        Save Protocol
                    </div>
                </div>

                <div className="the-cursor absolute top-0 left-0 pointer-events-none z-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 4L9.5 20L12 13.5L18.5 11L5.5 4Z" fill="#111111" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function ProtocolBg1() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-end opacity-[0.08] pointer-events-none pr-[-20%]">
            <svg className="w-[800px] h-[800px] animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E63B2E" strokeWidth="0.5" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#E63B2E" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#E8E4DD" strokeWidth="0.5" />
                <path d="M50 10 L50 90 M10 50 L90 50" stroke="#E63B2E" strokeWidth="0.2" />
            </svg>
        </div>
    );
}

function ProtocolBg2() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
            <div className="w-full h-full relative overflow-hidden bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:40px_40px]">
                <div className="absolute inset-y-0 w-1 bg-[#E63B2E] shadow-[0_0_20px_#E63B2E] animate-[ping_3s_ease-in-out_infinite_alternate]" style={{ left: '50%' }}></div>
            </div>
        </div>
    );
}

function ProtocolBg3() {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-start opacity-[0.15] pointer-events-none">
            <svg width="600" height="200" viewBox="0 0 600 200" className="w-[80vw]">
                <path
                    d="M0 100 L200 100 L220 50 L240 150 L260 80 L280 120 L300 100 L600 100"
                    fill="none"
                    stroke="#E63B2E"
                    strokeWidth="3"
                    className="animate-[dash_3s_linear_infinite]"
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
