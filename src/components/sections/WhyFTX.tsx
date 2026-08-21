"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Shield, Sparkles, Award, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface WhyFTXProps {
    locale: Locale;
    messages: any;
}

export function WhyFTX({ locale, messages }: WhyFTXProps) {
    const mobileSectionRef = useRef<HTMLElement>(null);
    const mobilePinWrapperRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const pillars = [
        {
            icon: Zap,
            title: messages.whyFtx.v1Title,
            desc: messages.whyFtx.v1Desc,
            image: "/images/pillars/precision.jpg",
        },
        {
            icon: Shield,
            title: messages.whyFtx.v2Title,
            desc: messages.whyFtx.v2Desc,
            image: "/images/pillars/protection.jpg",
        },
        {
            icon: Award,
            title: messages.whyFtx.v3Title,
            desc: messages.whyFtx.v3Desc,
            image: "/images/pillars/craftsmanship.jpg",
        },
        {
            icon: Sparkles,
            title: messages.whyFtx.v4Title,
            desc: messages.whyFtx.v4Desc,
            image: "/images/pillars/performance.jpg",
        },
    ];

    const [cardStyles, setCardStyles] = useState<{ scale: number; opacity: number; translateY: number; translateZ: number; rotateX: number }[]>([
        { scale: 1, opacity: 1, translateY: 0, translateZ: 0, rotateX: 0 },
        { scale: 0.94, opacity: 0, translateY: 90, translateZ: -60, rotateX: -12 },
        { scale: 0.94, opacity: 0, translateY: 90, translateZ: -60, rotateX: -12 },
        { scale: 0.94, opacity: 0, translateY: 90, translateZ: -60, rotateX: -12 },
    ]);

    const updateMobileCards = useCallback((progress: number) => {
        // Map progress 0.0 -> 1.0 directly across 3 card transitions
        const animProgress = Math.min(1, Math.max(0, progress));
        const activeIdx = Math.min(pillars.length - 1, Math.floor(animProgress * 3.99));
        setActiveCardIndex(activeIdx);

        const newStyles = pillars.map((_, idx) => {
            if (idx === 0) {
                const depth = Math.min(3, animProgress * 3);
                return {
                    translateY: -depth * 8,
                    translateZ: -depth * 35,
                    rotateX: depth * 3.5,
                    scale: Math.max(0.84, 1 - depth * 0.05),
                    opacity: Math.max(0.40, 1 - depth * 0.20),
                };
            }

            const startEntry = (idx - 1) / 3;
            const endEntry = idx / 3;

            if (animProgress < startEntry) {
                return {
                    translateY: 90,
                    translateZ: -60,
                    rotateX: -12,
                    scale: 0.92,
                    opacity: 0,
                };
            } else if (animProgress >= startEntry && animProgress <= endEntry) {
                const entryProgress = (animProgress - startEntry) / (endEntry - startEntry);
                // Silky 3D sine ease-in-out curve
                const ease = (1 - Math.cos(entryProgress * Math.PI)) / 2;
                const translateY = (1 - ease) * 90;
                const translateZ = (1 - ease) * -60;
                const rotateX = (1 - ease) * -12;
                const opacity = ease;
                const scale = 0.92 + ease * 0.08;
                return { translateY, translateZ, rotateX, scale, opacity };
            } else {
                const depth = Math.min(3 - idx, (animProgress - endEntry) * 3);
                return {
                    translateY: -depth * 8,
                    translateZ: -depth * 35,
                    rotateX: depth * 3.5,
                    scale: Math.max(0.84, 1 - depth * 0.05),
                    opacity: Math.max(0.40, 1 - depth * 0.20),
                };
            }
        });

        setCardStyles(newStyles);
    }, [pillars.length]);

    // GSAP ScrollTrigger Mobile Section Pinning using official gsap.matchMedia
    useEffect(() => {
        if (typeof window === "undefined") return;

        const pinWrapper = mobilePinWrapperRef.current;
        const section = mobileSectionRef.current;
        if (!pinWrapper || !section) return;

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const mm = gsap.matchMedia();

        mm.add("(max-width: 639px)", () => {
            ScrollTrigger.create({
                trigger: section,
                pin: pinWrapper,
                pinSpacing: true,
                start: "top top+=70px",
                end: "+=1000px",
                scrub: 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    updateMobileCards(self.progress);
                },
            });

            // Guarantee first card is active initially
            updateMobileCards(0);
        });

        return () => {
            mm.revert();
        };
    }, [updateMobileCards]);

    return (
        <>
            {/* DESKTOP & TABLET LAYOUT (>= sm): Unchanged Standard Grid Section */}
            <section id="packages" className="hidden sm:block py-12 bg-black relative overflow-x-clip">
                <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_bottom_left,rgba(164,214,94,0.18),transparent_70%)] pointer-events-none z-0" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left max-w-3xl mb-8 space-y-3">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.badge}</span>
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                            <span>{messages.whyFtx.title}</span>
                        </TextReveal>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((item, idx) => {
                            const IconComponent = item.icon;

                            return (
                                <ScrollReveal key={idx} type="card" delay={idx * 100} duration={850}>
                                    <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface/60 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 h-full shadow-lg">
                                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                            <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform duration-300">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wide group-hover:text-ftx-lime transition-colors">
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* MOBILE GSAP PINNED SCROLL DECK LAYOUT (< sm): Standard Section Spacing */}
            <section
                ref={mobileSectionRef}
                id="packages-mobile"
                className="block sm:hidden relative w-full bg-black motion-reduce:h-auto overflow-x-clip py-4"
            >
                {/* Ambient Green Glow / Partition Background Shade */}
                <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-ftx-lime/15 blur-[100px] rounded-full pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_bottom_left,rgba(164,214,94,0.18),transparent_70%)] pointer-events-none z-0" />

                <div
                    ref={mobilePinWrapperRef}
                    className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent relative flex flex-col justify-between min-h-[calc(100vh-5rem)] py-2 z-10"
                >
                    {/* Mobile Pinned Section Heading - Aligned with standard page grid */}
                    <div className="text-left w-full space-y-1 mb-3">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.badge}</span>
                        </div>
                        <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                            {messages.whyFtx.title}
                        </h2>
                    </div>

                    {/* MAIN PARENT CONTAINER (Plain flex wrapper fitting mobile screen size) */}
                    <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-between gap-4 my-auto py-2">
                        {/* TOP: 3D Image Card Deck Stage */}
                        <div className="relative w-full h-[250px] [perspective:1000px] [transform-style:preserve-3d]">
                            {pillars.map((item, idx) => {
                                const IconComponent = item.icon;
                                const style = cardStyles[idx] || { scale: 1, opacity: 1, translateY: 90, translateZ: -60, rotateX: -12 };

                                return (
                                    <div
                                        key={idx}
                                        className="absolute inset-0 w-full h-full will-change-transform [backface-visibility:hidden]"
                                        style={{
                                            zIndex: (idx + 1) * 10,
                                            transform: `perspective(1000px) translate3d(0, ${style.translateY.toFixed(1)}px, ${style.translateZ.toFixed(1)}px) rotateX(${style.rotateX.toFixed(1)}deg) scale(${style.scale.toFixed(3)})`,
                                            opacity: style.opacity.toFixed(2),
                                            transformOrigin: "center bottom",
                                            pointerEvents: style.opacity < 0.2 ? "none" : "auto",
                                        }}
                                    >
                                        {/* Styled Image Card Frame */}
                                        <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface/95 backdrop-blur-xl border border-white/15 overflow-hidden h-full shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
                                            <div className="relative w-full h-full overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                                <div className="absolute top-3.5 left-3.5 p-2 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* BOTTOM: Content Card Fitting Available Space with Slide-Up Animation */}
                        <div className="w-full flex-1 min-h-[120px] relative overflow-hidden flex flex-col justify-end">
                            {pillars.map((item, idx) => {
                                const isActive = activeCardIndex === idx;

                                return (
                                    <div
                                        key={idx}
                                        className={`w-full h-full transition-all duration-500 ease-out text-start flex flex-col justify-end ${isActive
                                            ? "opacity-100 translate-y-0 relative z-10"
                                            : "opacity-0 translate-y-6 absolute inset-x-0 bottom-0 pointer-events-none z-0"
                                            }`}
                                    >
                                        <div className="space-y-2 flex flex-col justify-center h-full px-1 py-2">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wide">
                                                {item.title}
                                            </h3>

                                            <p className="text-xs sm:text-sm text-ftx-silver-muted font-body leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
