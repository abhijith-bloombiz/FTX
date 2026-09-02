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
    const activeCardIndexRef = useRef(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

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

    const updateMobileCards = useCallback((progress: number) => {
        const totalPillars = pillars.length;
        if (totalPillars === 0) return;

        const animProgress = Math.min(1, Math.max(0, progress));
        const stage = animProgress * (totalPillars - 1);
        const activeIdx = Math.min(totalPillars - 1, Math.round(stage));

        if (activeIdx !== activeCardIndexRef.current) {
            activeCardIndexRef.current = activeIdx;
            setActiveCardIndex(activeIdx);
        }

        const firstCard = cardRefs.current[0];
        const cardWidth = firstCard ? firstCard.offsetWidth : 340;
        const cubeRadius = Math.round(cardWidth / 2); // Dynamic 3D cube pivot radius (half card width)

        pillars.forEach((_, idx) => {
            const cardEl = cardRefs.current[idx];
            if (!cardEl) return;

            const dist = stage - idx; // >0: scrolled past/top face; <0: incoming/bottom face
            const absDist = Math.abs(dist);

            // Natural 3D Cube Rotation Easing Math:
            // Smooth non-linear curve for organic physical rotation
            const easedDist = Math.sign(dist) * Math.pow(absDist, 0.92);
            const rotY = easedDist * -90;
            const rotX = Math.sin(dist * Math.PI) * 3.5; // Subtle organic pitch tilt during rotation
            const scale = Math.max(0.78, 1 - Math.pow(Math.min(1, absDist), 1.2) * 0.12);
            const opacity = Math.min(1, Math.max(0, 1 - Math.pow(absDist, 1.4) * 0.85));
            const zIndex = Math.max(1, Math.round(30 - absDist * 10));

            cardEl.style.transformOrigin = `50% 50% -${cubeRadius}px`;
            cardEl.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toFixed(3);
            cardEl.style.zIndex = String(zIndex);
            cardEl.style.pointerEvents = absDist < 0.4 ? "auto" : "none";
        });
    }, [pillars.length]);

    // GSAP ScrollTrigger Mobile Section Pinning
    useEffect(() => {
        if (typeof window === "undefined") return;

        const pinWrapper = mobilePinWrapperRef.current;
        const section = mobileSectionRef.current;
        if (!pinWrapper || !section) return;

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(max-width: 767px)", () => {
                const st = ScrollTrigger.create({
                    id: "why-ftx-mobile-3d-pin",
                    trigger: section,
                    pin: section,
                    pinSpacing: true,
                    anticipatePin: 1,
                    start: "top top+=65px",
                    end: "+=2400px",
                    scrub: 0.4,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        updateMobileCards(self.progress);
                    },
                });

                scrollTriggerRef.current = st;

                // Guarantee first card is active initially
                updateMobileCards(0);

                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 150);
            });
        }, section);

        return () => {
            ctx.revert();
            scrollTriggerRef.current = null;
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === section || (st as any).vars?.pin === section || (st as any).vars?.id === "why-ftx-mobile-3d-pin") {
                    try {
                        (st as any).revert?.(true);
                    } catch (e) { }
                    st.kill(true);
                }
            });

            if (section) {
                section.style.position = "";
                section.style.top = "";
                section.style.left = "";
                section.style.width = "";
                section.style.height = "";
                section.style.transform = "";
                section.style.inset = "";

                const parent = section.parentElement;
                if (parent && parent.classList.contains("pin-spacer")) {
                    parent.replaceWith(section);
                }
            }

            ScrollTrigger.refresh();
        };
    }, [updateMobileCards]);

    const handleDotClick = (index: number) => {
        const st = scrollTriggerRef.current;
        if (!st) return;
        const totalSteps = pillars.length - 1;
        if (totalSteps <= 0) return;
        const targetProgress = index / totalSteps;
        const targetScroll = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
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
                            <span>{messages.whyFtx.badge}</span>
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
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
                className="block md:hidden relative w-full bg-black motion-reduce:h-auto overflow-x-clip py-8"
            >
                {/* Bottom-Left Atmospheric Lime Glow Partition Light */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[250px] pointer-events-none z-0"
                    style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                />

                <div
                    ref={mobilePinWrapperRef}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent relative flex flex-col justify-between min-h-[calc(100vh-4.5rem)] py-2 z-10"
                >
                    {/* Section Header */}
                    <div className="text-left w-full space-y-2 mb-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages.whyFtx.badge}</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                            {messages.whyFtx.title}
                        </h2>
                    </div>

                    {/* 3D Card Deck Carousel Stage */}
                    <div className="relative w-full h-[350px] xs:h-[380px] max-w-[325px] xs:max-w-[355px] mx-auto my-auto flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
                        {pillars.map((item, idx) => {
                            const IconComponent = item.icon;

                            return (
                                <div
                                    key={idx}
                                    ref={(el) => { cardRefs.current[idx] = el; }}
                                    className="absolute inset-0 w-full h-full will-change-transform ftx-squircle-lg border border-white/15 bg-ftx-surface shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transformStyle: "preserve-3d",
                                        transform: `perspective(1200px) rotateY(${idx === 0 ? 0 : 12}deg) scale(${idx === 0 ? 1 : 0.84})`,
                                        opacity: idx === 0 ? 1 : 0.45,
                                        zIndex: idx === 0 ? 30 : 20 - idx,
                                        pointerEvents: idx === 0 ? "auto" : "none",
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
                                            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                                        />

                                        {/* Dark Bottom & Top Gradient Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

                                        {/* Top-Left Squircle Icon Badge */}
                                        <div className="relative z-10 p-5 xs:p-6">
                                            <div className="inline-flex p-3 ftx-squircle-sm bg-black/80 backdrop-blur-md border border-ftx-lime/40 text-ftx-lime shadow-md">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Bottom Overlay: Title & Description */}
                                        <div className="relative z-10 p-6 xs:p-7 flex flex-col justify-end text-left space-y-2">
                                            <h3 className="text-xl xs:text-2xl font-heading font-black text-white uppercase tracking-wider leading-tight drop-shadow-md">
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


                </div>
            </section>
        </>
    );
}

