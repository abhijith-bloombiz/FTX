"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Shield, Sparkles, Award, Zap } from "lucide-react";
import { gsap } from "gsap";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface WhyFTXProps {
    locale: Locale;
    messages: any;
}

export function WhyFTX({ locale, messages }: WhyFTXProps) {
    const pathname = usePathname();
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const pillars = [
        {
            icon: Zap,
            title: messages.whyFtx.v1Title,
            desc: messages.whyFtx.v1Desc,
            image: messages.whyFtx.v1Image || "/images/pillars/precision.jpg",
        },
        {
            icon: Shield,
            title: messages.whyFtx.v2Title,
            desc: messages.whyFtx.v2Desc,
            image: messages.whyFtx.v2Image || "/images/pillars/protection.jpg",
        },
        {
            icon: Award,
            title: messages.whyFtx.v3Title,
            desc: messages.whyFtx.v3Desc,
            image: messages.whyFtx.v3Image || "/images/pillars/craftsmanship.jpg",
        },
        {
            icon: Sparkles,
            title: messages.whyFtx.v4Title,
            desc: messages.whyFtx.v4Desc,
            image: messages.whyFtx.v4Image || "/images/pillars/performance.jpg",
        },
    ];

    const touchStartXRef = useRef<number | null>(null);
    const touchEndXRef = useRef<number | null>(null);
    const currentStageRef = useRef<{ stage: number }>({ stage: 0 });

    const activeCardIndexRef = useRef(0);

    const updateMobileCardsFromStage = useCallback((stage: number) => {
        const totalPillars = pillars.length;
        if (totalPillars === 0) return;

        const activeIdx = ((Math.round(stage) % totalPillars) + totalPillars) % totalPillars;
        if (activeIdx !== activeCardIndexRef.current) {
            activeCardIndexRef.current = activeIdx;
            setActiveCardIndex(activeIdx);
        }

        pillars.forEach((_, idx) => {
            const cardEl = cardRefs.current[idx];
            if (!cardEl) return;

            let dist = (idx - stage) % totalPillars;
            if (dist > totalPillars / 2) dist -= totalPillars;
            if (dist <= -totalPillars / 2) dist += totalPillars;

            const absDist = Math.abs(dist);

            // Translate side cards by ±130px so their sides peek out behind center card
            const tx = dist * 130;
            // Push side cards backward into Z-depth so they sit strictly BEHIND the active center card
            const tz = 30 - absDist * 90;
            // Elegant 25-degree 3D inward tilt angle
            const rotY = dist * -25;

            const scale = Math.max(0.76, 1 - absDist * 0.16);
            const opacity = absDist > 1.8 ? 0 : Math.max(0, 1 - absDist * 0.3);
            const zIndex = Math.max(1, Math.round(50 - absDist * 20));

            cardEl.style.transformOrigin = "50% 50%";
            cardEl.style.transform = `perspective(1000px) translate3d(${tx.toFixed(2)}px, 0px, ${tz.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toFixed(3);
            cardEl.style.zIndex = String(zIndex);
            cardEl.style.pointerEvents = absDist < 0.3 ? "auto" : "none";
        });
    }, [pillars.length]);

    const isPausedRef = useRef(false);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const pauseAutoPlay = () => {
        isPausedRef.current = true;
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 4000);
    };

    useEffect(() => {
        if (!isHomePage) return;
        updateMobileCardsFromStage(0);
    }, [isHomePage, updateMobileCardsFromStage]);

    // Auto-scroll slideshow timer (continuously cycles infinite cards every 3.5s)
    useEffect(() => {
        if (!isHomePage) return;

        const interval = setInterval(() => {
            if (!isPausedRef.current) {
                const nextStage = currentStageRef.current.stage + 1;
                animateStageTo(nextStage);
            }
        }, 3500);

        return () => {
            clearInterval(interval);
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        };
    }, [isHomePage, pillars.length, updateMobileCardsFromStage]);

    const animateStageTo = (targetStage: number) => {
        const totalPillars = pillars.length;
        const normalizedActiveIndex = ((Math.round(targetStage) % totalPillars) + totalPillars) % totalPillars;
        setActiveCardIndex(normalizedActiveIndex);
        pauseAutoPlay();

        gsap.to(currentStageRef.current, {
            stage: targetStage,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                updateMobileCardsFromStage(currentStageRef.current.stage);
            },
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        pauseAutoPlay();
        touchStartXRef.current = e.touches[0].clientX;
        touchEndXRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartXRef.current || !touchEndXRef.current) return;
        const diffX = touchStartXRef.current - touchEndXRef.current;
        const swipeThreshold = 35;

        const currentStage = Math.round(currentStageRef.current.stage);

        if (diffX > swipeThreshold) {
            // Swiped Left -> Next Card (Infinite Forward)
            animateStageTo(currentStage + 1);
        } else if (diffX < -swipeThreshold) {
            // Swiped Right -> Previous Card (Infinite Backward)
            animateStageTo(currentStage - 1);
        }

        touchStartXRef.current = null;
        touchEndXRef.current = null;
    };

    const handleDotClick = (index: number) => {
        const totalPillars = pillars.length;
        const currentStage = currentStageRef.current.stage;
        const currentMod = ((Math.round(currentStage) % totalPillars) + totalPillars) % totalPillars;
        let diff = index - currentMod;
        if (diff > totalPillars / 2) diff -= totalPillars;
        if (diff < -totalPillars / 2) diff += totalPillars;

        animateStageTo(currentStage + diff);
    };

    if (!isHomePage) {
        return null;
    }

    return (
        <>
            {/* DESKTOP & TABLET LAYOUT (>= md): Unchanged Standard Grid Section */}
            <section id="packages" className="hidden md:block py-12 bg-black relative overflow-x-clip">
                {/* Bottom-Left Atmospheric Lime Glow Partition Light */}
                <div
                    className="absolute bottom-0 left-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                    style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left max-w-3xl mb-8 space-y-3">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.title}</span>
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                            <span>{messages.whyFtx.badge}</span>
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

                                        <div className="p-6 flex flex-col justify-start space-y-2 flex-grow">
                                            <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm text-ftx-silver font-body leading-relaxed">
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

            {/* MOBILE 3D CARD DECK CAROUSEL LAYOUT (< md) - Pure Swipable 3D Deck */}
            <section
                id="packages-mobile"
                className="block md:hidden relative w-full bg-black py-10 overflow-x-clip"
            >
                {/* Bottom-Left Atmospheric Lime Glow Partition Light */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[250px] pointer-events-none z-0"
                    style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent relative flex flex-col justify-start gap-4 z-10">
                    {/* Section Header with Scroll Reveal */}
                    <div className="text-left w-full space-y-1.5 mb-2 mt-2">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.title}</span>
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                            <span>{messages.whyFtx.badge}</span>
                        </TextReveal>
                    </div>

                    {/* 3D Card Deck Carousel Stage with Touch Swipe Gestures & Scroll Reveal */}
                    <ScrollReveal type="rise-from-floor" duration={850}>
                        <div
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="relative w-full h-[370px] xs:h-[400px] max-w-[280px] xs:max-w-[310px] mx-auto mt-4 flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d] touch-pan-y"
                        >
                            {pillars.map((item, idx) => {
                                const IconComponent = item.icon;

                                return (
                                    <div
                                        key={idx}
                                        ref={(el) => { cardRefs.current[idx] = el; }}
                                        className="absolute inset-0 w-full h-full will-change-transform ftx-squircle-lg border border-white/15 bg-gradient-to-b from-neutral-900/90 via-black to-neutral-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden cursor-pointer"
                                        style={{
                                            transformOrigin: "50% 50% -140px",
                                            backfaceVisibility: "hidden",
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        {/* Card Frame Content */}
                                        <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
                                            {/* Background Image */}
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                decoding="async"
                                                loading="lazy"
                                                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-100"
                                            />

                                            {/* Light Bottom Vignette Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                                            {/* Top Bar: Icon Badge & Watermark Index */}
                                            <div className="relative z-10 p-5 xs:p-6 flex items-start justify-between">
                                                <div className="inline-flex items-center gap-2 p-2.5 xs:p-3 ftx-squircle-sm bg-black/80 backdrop-blur-xl border border-ftx-lime/40 text-ftx-lime shadow-lg">
                                                    <IconComponent className="w-5 h-5" />
                                                </div>

                                                <div className="text-4xl xs:text-5xl font-mono font-black text-black/70 select-none tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                                    0{idx + 1}
                                                </div>
                                            </div>

                                            {/* Bottom Overlay: Title & Description */}
                                            <div className="relative z-10 p-6 xs:p-7 flex flex-col justify-end text-left space-y-2">
                                                <h3 className="text-xl xs:text-2xl font-heading font-black text-white uppercase tracking-wider leading-tight drop-shadow-lg">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs xs:text-sm text-ftx-silver font-body leading-relaxed line-clamp-3">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex items-center justify-center gap-2.5 mt-6 z-20">
                            {pillars.map((_, dotIdx) => {
                                const isActive = dotIdx === activeCardIndex;
                                return (
                                    <button
                                        key={dotIdx}
                                        onClick={() => handleDotClick(dotIdx)}
                                        aria-label={`Go to slide ${dotIdx + 1}`}
                                        className={`h-2 rounded-full transition-all duration-300 ${isActive
                                            ? "w-8 bg-ftx-lime shadow-[0_0_12px_rgba(164,214,94,0.6)]"
                                            : "w-2 bg-white/20 hover:bg-white/40"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
