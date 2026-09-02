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
    ScrollTrigger.config({ ignoreMobileResize: true });
}

interface WhyFTXProps {
    locale: Locale;
    messages: any;
}

export function WhyFTX({ locale, messages }: WhyFTXProps) {
    const pathname = usePathname();
    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === "/";

    if (!isHomePage) {
        if (typeof window !== "undefined") {
            const st = ScrollTrigger.getById("why-ftx-mobile-3d-pin");
            if (st) {
                try {
                    (st as any).revert?.(true);
                } catch (e) { }
                st.kill(true);
            }
            document.querySelectorAll(".pin-spacer").forEach((spacer) => {
                if (spacer.innerHTML.includes("packages-mobile") || spacer.contains(mobileSectionRef.current)) {
                    spacer.replaceWith(...Array.from(spacer.children));
                }
            });
            ScrollTrigger.refresh();
        }
        return null;
    }
    const mobileSectionRef = useRef<HTMLElement>(null);
    const mobilePinWrapperRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const activeCardIndexRef = useRef(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const cachedCardWidthRef = useRef<number>(340);

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

    const updateMobileCardsFromStage = useCallback((stage: number) => {
        const totalPillars = pillars.length;
        if (totalPillars === 0) return;

        const activeIdx = Math.min(totalPillars - 1, Math.max(0, Math.round(stage)));
        setActiveCardIndex(activeIdx);

        pillars.forEach((_, idx) => {
            const cardEl = cardRefs.current[idx];
            if (!cardEl) return;

            // Continuous circular offset in range [-2, 2)
            let dist = (idx - stage) % totalPillars;
            if (dist > 2) dist -= totalPillars;
            if (dist <= -2) dist += totalPillars;

            const absDist = Math.abs(dist);

            // Translate side cards by ±135px so their sides peek out beside center card
            const tx = dist * 135;
            // 45-degree 3D Cube inward tilt angle
            const rotY = dist * -45;

            const scale = Math.max(0.72, 1 - absDist * 0.14);
            const opacity = absDist > 1.8 ? 0 : Math.max(0, 1 - Math.pow(absDist, 1.4) * 0.42);
            const zIndex = Math.max(1, Math.round(30 - absDist * 10));
            const brightness = Math.max(0.5, 1 - absDist * 0.45);

            cardEl.style.transformOrigin = "50% 50%";
            cardEl.style.transform = `perspective(1000px) translateX(${tx.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toFixed(3);
            cardEl.style.filter = brightness < 0.98 ? `brightness(${brightness.toFixed(2)})` : "none";
            cardEl.style.zIndex = String(zIndex);
            cardEl.style.pointerEvents = absDist < 0.3 ? "auto" : "none";
            cardEl.style.willChange = "transform, opacity";
        });
    }, [pillars.length]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const section = mobileSectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(max-width: 767px)", () => {
                const getNavHeight = () => {
                    const navEl = document.querySelector("header");
                    const h = navEl ? navEl.offsetHeight : 72;
                    return Math.max(0, h - 12);
                };

                const stageProxy = { stage: 0 };

                const tl = gsap.timeline({
                    scrollTrigger: {
                        id: "why-ftx-mobile-3d-pin",
                        trigger: section,
                        pin: section,
                        pinSpacing: true,
                        anticipatePin: 1,
                        start: () => `top ${getNavHeight()}px`,
                        end: "+=3600px", // Extended scroll height for slower, elegant transitions on mobile
                        scrub: 1.8,     // Silky inertia damping for buttery smooth phone scrolling
                        fastScrollEnd: false,
                        preventOverlaps: true,
                        invalidateOnRefresh: true,
                    },
                });

                tl.to(stageProxy, {
                    stage: pillars.length - 1,
                    ease: "none",
                    onUpdate: () => {
                        updateMobileCardsFromStage(stageProxy.stage);
                    },
                });

                scrollTriggerRef.current = tl.scrollTrigger || null;
                updateMobileCardsFromStage(0);

                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 150);
            });
        }, section);

        return () => {
            ctx.revert();
            scrollTriggerRef.current = null;
            const st = ScrollTrigger.getById("why-ftx-mobile-3d-pin");
            if (st) {
                try {
                    (st as any).revert?.(true);
                } catch (e) { }
                st.kill(true);
            }

            if (typeof document !== "undefined") {
                document.querySelectorAll(".pin-spacer").forEach((spacer) => {
                    if (spacer.innerHTML.includes("packages-mobile")) {
                        spacer.replaceWith(...Array.from(spacer.children));
                    }
                });
            }

            if (section) {
                section.style.cssText = "";
            }

            ScrollTrigger.refresh();
        };
    }, [updateMobileCardsFromStage, pillars.length, pathname]);

    const animateStageTo = (targetStage: number) => {
        const clampedStage = Math.max(0, Math.min(pillars.length - 1, targetStage));
        setActiveCardIndex(clampedStage);

        gsap.to(currentStageRef.current, {
            stage: clampedStage,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: () => {
                updateMobileCardsFromStage(currentStageRef.current.stage);
            },
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartXRef.current = e.touches[0].clientX;
        touchEndXRef.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartXRef.current || !touchEndXRef.current) return;
        const diffX = touchStartXRef.current - touchEndXRef.current;
        const swipeThreshold = 40;

        if (diffX > swipeThreshold) {
            // Swiped Left -> Next Card
            animateStageTo(activeCardIndex + 1);
        } else if (diffX < -swipeThreshold) {
            // Swiped Right -> Previous Card
            animateStageTo(activeCardIndex - 1);
        }

        touchStartXRef.current = null;
        touchEndXRef.current = null;
    };

    const handleDotClick = (index: number) => {
        animateStageTo(index);
    };

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

            {/* MOBILE 3D CARD DECK CAROUSEL LAYOUT (< md) */}
            <section
                ref={mobileSectionRef}
                id="packages-mobile"
                className="block md:hidden relative w-full bg-black motion-reduce:h-auto overflow-x-clip pt-2 pb-7 sm:py-8"
            >
                {/* Bottom-Left Atmospheric Lime Glow Partition Light */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[250px] pointer-events-none z-0"
                    style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                />

                <div
                    ref={mobilePinWrapperRef}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent relative flex flex-col justify-start gap-2 min-h-[calc(100vh-4.5rem)] pt-3 pb-5 z-10"
                >
                    {/* Section Header */}
                    <div className="text-left w-full space-y-1.5 mb-1 mt-3.5 xs:mt-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.title}</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                            {messages.whyFtx.badge}
                        </h2>
                    </div>

                    {/* 3D Card Deck Carousel Stage with Touch Swipe Gestures */}
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="relative w-full h-[370px] xs:h-[400px] max-w-[280px] xs:max-w-[310px] mx-auto mt-10 flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d] touch-pan-y"
                    >
                        {pillars.map((item, idx) => {
                            const IconComponent = item.icon;
                            const isCenter = idx === 0;
                            const isRight = idx === 1;
                            const isLeft = idx === 3;
                            let initRotY = -180;
                            let initOpacity = 0;
                            let initZIndex = 10;

                            if (isCenter) {
                                initRotY = 0;
                                initOpacity = 1;
                                initZIndex = 30;
                            } else if (isRight) {
                                initRotY = -90;
                                initOpacity = 0.85;
                                initZIndex = 20;
                            } else if (isLeft) {
                                initRotY = 90;
                                initOpacity = 0.85;
                                initZIndex = 20;
                            }

                            return (
                                <div
                                    key={idx}
                                    ref={(el) => { cardRefs.current[idx] = el; }}
                                    className="absolute inset-0 w-full h-full will-change-transform ftx-squircle-lg border border-white/15 bg-gradient-to-b from-neutral-900/90 via-black to-neutral-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden"
                                    style={{
                                        transformOrigin: "50% 50% -140px",
                                        backfaceVisibility: "hidden",
                                        transformStyle: "preserve-3d",
                                        transform: `perspective(1000px) rotateY(${initRotY}deg)`,
                                        opacity: initOpacity,
                                        zIndex: initZIndex,
                                        pointerEvents: isCenter ? "auto" : "none",
                                    }}
                                >
                                    {/* Card Frame Content */}
                                    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
                                        {/* Background Image with High-Clarity Visibility */}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            decoding="async"
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-100"
                                        />

                                        {/* Light Bottom Vignette Gradient Overlay for Readable Text */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                                        {/* Top Bar: Icon Badge & Watermark Index */}
                                        <div className="relative z-10 p-5 xs:p-6 flex items-start justify-between">
                                            <div className="inline-flex items-center gap-2 p-2.5 xs:p-3 ftx-squircle-sm bg-black/80 backdrop-blur-xl border border-ftx-lime/40 text-ftx-lime shadow-lg">
                                                <IconComponent className="w-5 h-5" />
                                            </div>

                                            {/* Large Dark Watermark Step Counter */}
                                            <div className="text-4xl xs:text-5xl font-mono font-black text-black/70 select-none tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                                0{idx + 1}
                                            </div>
                                        </div>

                                        {/* Bottom Overlay: Title & Description */}
                                        <div className="relative z-10 p-6 xs:p-7 flex flex-col justify-end text-left space-y-2">
                                            <h3 className="text-xl xs:text-2xl font-heading font-black text-white uppercase tracking-wider leading-tight drop-shadow-lg">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs xs:text-sm text-ftx-silver font-body leading-relaxed max-w-[270px] drop-shadow-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Dots Indicator Bar */}
                    <div className="flex items-center justify-center gap-2.5 mt-24 sm:mt-28 z-20">
                        {pillars.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={`Go to slide ${idx + 1}`}
                                onClick={() => handleDotClick(idx)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${activeCardIndex === idx
                                    ? "w-8 bg-ftx-lime shadow-[0_0_14px_rgba(164,214,94,0.85)]"
                                    : "w-2.5 bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

