"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

    // Stage 1 default: 01 PRECISION (left), 02 PROTECTION (center), 03 CRAFTSMANSHIP (right)
    const [activeCardIndex, setActiveCardIndex] = useState(1);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(true);

    // Scroll Entrance Animation State
    const revealStateRef = useRef({
        center: 0,
        left: 0,
        right: 0,
    });

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
    const currentStageRef = useRef<{ stage: number }>({ stage: 1 });
    const activeCardIndexRef = useRef(1);

    const updateMobileCardsFromStage = useCallback((stage: number) => {
        const totalPillars = pillars.length;
        if (totalPillars === 0) return;

        const { center, left, right } = revealStateRef.current;

        pillars.forEach((_, idx) => {
            const cardEl = cardRefs.current[idx];
            if (!cardEl) return;

            let dist = (idx - stage) % totalPillars;
            if (dist > totalPillars / 2) dist -= totalPillars;
            if (dist <= -totalPillars / 2) dist += totalPillars;

            const absDist = Math.abs(dist);

            // Base resting carousel positions
            let tx = dist * 115;
            let ty = 0;
            let tz = 20 - absDist * 70;
            let rotY = dist * -18;
            let scale = Math.max(0.8, 1 - absDist * 0.15);

            let progress = 1;

            if (absDist <= 0.3) {
                // CENTER CARD: came from BOTTOM
                progress = center;
                const inv = 1 - center;
                ty += inv * 160; // starts 160px below
                scale *= (1 - inv * 0.1);
            } else if (dist < -0.3) {
                // LEFT CARD: came from LEFT
                progress = left;
                const inv = 1 - left;
                tx += inv * -200; // starts 200px further to the left
                rotY += inv * -18; // dynamic flight angle
            } else if (dist > 0.3) {
                // RIGHT CARD: came from RIGHT
                progress = right;
                const inv = 1 - right;
                tx += inv * 200; // starts 200px further to the right
                rotY += inv * 18; // dynamic flight angle
            }

            const baseOpacity = absDist > 1.8 ? 0 : Math.max(0, 1 - absDist * 0.3);
            const opacity = baseOpacity * progress;
            const zIndex = Math.max(1, Math.round(50 - absDist * 20));

            cardEl.style.transformOrigin = "50% 50%";
            cardEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toFixed(2);
            cardEl.style.zIndex = String(zIndex);
            cardEl.style.pointerEvents = (absDist < 0.3 && progress > 0.8) ? "auto" : "none";
        });
    }, [pillars.length]);

    // Bidirectional Smooth Scroll-Linked Reveal (works on forward scroll AND reverse scroll)
    useEffect(() => {
        if (!sectionRef.current || typeof window === "undefined" || !isHomePage) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            revealStateRef.current = { center: 1, left: 1, right: 1 };
            updateMobileCardsFromStage(currentStageRef.current.stage);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );
        observer.observe(sectionRef.current);

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 95%", // starts as soon as top of section enters bottom of viewport
                end: "bottom 10%", // ends when bottom of section exits off the top
                scrub: 0.6, // buttery smooth 0.6s physical interpolation in both directions!
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const p = self.progress; // 0.0 -> 1.0
                    let reveal = 1;

                    // Continuous bidirectional envelope:
                    // 0.0 -> 0.28: enters from top of page (forward scroll 0->1, reverse scroll 1->0)
                    // 0.28 -> 0.72: locked at 1.0 (fully resting & interactive while viewing)
                    // 0.72 -> 1.0: exits past bottom (forward scroll 1->0, reverse scroll from below 0->1)
                    if (p < 0.28) {
                        const t = p / 0.28;
                        reveal = t * t * (3 - 2 * t); // smoothstep ease
                    } else if (p > 0.72) {
                        const t = (1 - p) / 0.28;
                        reveal = t * t * (3 - 2 * t); // smoothstep ease
                    } else {
                        reveal = 1;
                    }

                    reveal = Math.max(0, Math.min(1, reveal));

                    revealStateRef.current = {
                        center: reveal,
                        left: reveal,
                        right: reveal,
                    };

                    updateMobileCardsFromStage(currentStageRef.current.stage);
                },
            });
        }, sectionRef);

        return () => {
            observer.disconnect();
            ctx.revert();
        };
    }, [isHomePage, updateMobileCardsFromStage]);

    const isPausedRef = useRef(false);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const pauseAutoPlay = () => {
        isPausedRef.current = true;
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 4000);
    };

    const isIdleRef = useRef(true);

    // Lightweight Ref-based Scroll Detector: Pauses auto-play while user scrolls without triggering React re-renders
    useEffect(() => {
        if (typeof window === "undefined") return;

        let scrollTimer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            isIdleRef.current = false;
            if (scrollTimer) clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {
                isIdleRef.current = true;
            }, 1800);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, []);

    const animateStageTo = useCallback((targetStage: number, duration = 0.55, ease = "power2.out") => {
        const totalPillars = pillars.length;
        const normalizedActiveIndex = ((Math.round(targetStage) % totalPillars) + totalPillars) % totalPillars;

        pauseAutoPlay();
        gsap.killTweensOf(currentStageRef.current);

        gsap.to(currentStageRef.current, {
            stage: targetStage,
            duration,
            ease,
            onUpdate: () => {
                updateMobileCardsFromStage(currentStageRef.current.stage);
            },
            onComplete: () => {
                currentStageRef.current.stage = targetStage;
                if (activeCardIndexRef.current !== normalizedActiveIndex) {
                    activeCardIndexRef.current = normalizedActiveIndex;
                    setActiveCardIndex(normalizedActiveIndex);
                }
            },
        });
    }, [pillars.length, updateMobileCardsFromStage]);

    // Auto-scroll 3D card slideshow timer (ONLY cycles when in view, idle, unpaused, and entrance completed)
    useEffect(() => {
        if (!isHomePage || !isInView) return;

        const interval = setInterval(() => {
            if (!isPausedRef.current && isIdleRef.current && revealStateRef.current.center > 0.9) {
                const currentIntegerStage = Math.round(currentStageRef.current.stage);
                const nextStage = currentIntegerStage + 1;
                animateStageTo(nextStage, 0.7, "power2.inOut");
            }
        }, 4000);

        return () => {
            clearInterval(interval);
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        };
    }, [isHomePage, isInView, pillars.length, animateStageTo]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (revealStateRef.current.center < 0.8) return;
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
            // Swiped Left -> Next Card (Snappy power2.out for finger swipe release)
            animateStageTo(currentStage + 1, 0.5, "power2.out");
        } else if (diffX < -swipeThreshold) {
            // Swiped Right -> Previous Card
            animateStageTo(currentStage - 1, 0.5, "power2.out");
        }

        touchStartXRef.current = null;
        touchEndXRef.current = null;
    };

    const handleDotClick = (index: number) => {
        const totalPillars = pillars.length;
        const currentStage = Math.round(currentStageRef.current.stage);
        const currentMod = ((currentStage % totalPillars) + totalPillars) % totalPillars;
        let diff = index - currentMod;
        if (diff > totalPillars / 2) diff -= totalPillars;
        if (diff < -totalPillars / 2) diff += totalPillars;

        animateStageTo(currentStage + diff, 0.65, "power2.inOut");
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
                                <ScrollReveal key={idx} type="card" delay={idx * 100} duration={850} className="h-full flex flex-col">
                                    <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface transition-all duration-500 hover:-translate-y-1.5 h-full shadow-lg">
                                        {/* Single direct child wrapper to prevent inner seam rounding from .ftx-border-card > * */}
                                        <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-ftx-surface">
                                            {/* Media Header */}
                                            <div className="relative w-full aspect-[16/10] overflow-hidden bg-ftx-surface">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 1024px) 50vw, 25vw"
                                                    quality={88}
                                                    decoding="async"
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out md:group-hover:scale-110"
                                                />
                                                {/* Seamless 100% solid surface fade eliminating any photo floor artifacts */}
                                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ftx-surface via-ftx-surface/60 to-transparent pointer-events-none z-10" />
                                                <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform duration-300 z-20">
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                            </div>

                                            {/* Content Body */}
                                            <div className="p-6 flex flex-col justify-start space-y-2 flex-grow bg-ftx-surface relative z-10">
                                                <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-ftx-silver font-body leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
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
                ref={sectionRef}
                id="packages-mobile"
                className="block md:hidden relative w-full bg-black py-10 overflow-x-clip"
            >
                {/* Bottom-Left Atmospheric Lime Glow Partition Light */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[250px] pointer-events-none z-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)",
                        transform: "translateZ(0)",
                    }}
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

                    {/* 3D Card Deck Carousel Stage with Touch Swipe Gestures */}
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
                                    className="absolute inset-0 w-full h-full will-change-transform ftx-squircle-lg border border-white/15 bg-neutral-950 shadow-xl shadow-black/80 overflow-hidden cursor-pointer"
                                    style={{
                                        transformOrigin: "50% 50% -140px",
                                        backfaceVisibility: "hidden",
                                        transformStyle: "preserve-3d",
                                        contain: "paint",
                                    }}
                                >
                                    {/* Card Frame Content */}
                                    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
                                        {/* Background Image */}
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 310px, 25vw"
                                            quality={75}
                                            decoding="async"
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-100"
                                        />

                                        {/* Light Bottom Vignette Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                                        {/* Top Bar: Icon Badge & Watermark Index */}
                                        <div className="relative z-10 p-5 xs:p-6 flex items-start justify-between">
                                            <div className="inline-flex items-center gap-2 p-2.5 xs:p-3 ftx-squircle-sm bg-black/90 border border-ftx-lime/40 text-ftx-lime shadow-md">
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            <div className="text-4xl xs:text-5xl font-mono font-black text-white/20 select-none tracking-tighter">
                                                0{idx + 1}
                                            </div>
                                        </div>

                                        {/* Bottom Overlay: Title & Description */}
                                        <div className="relative z-10 p-6 xs:p-7 flex flex-col justify-end text-left space-y-2">
                                            <h3 className="text-xl xs:text-2xl font-heading font-black text-white uppercase tracking-wider leading-tight">
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
                </div>
            </section>
        </>
    );
}

