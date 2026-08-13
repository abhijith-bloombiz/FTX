"use client";

import React from "react";

interface HeroTypographyProps {
    progress: number; // 0.0 to 1.0 from GSAP ScrollTrigger
    revealed?: boolean;
}

// Top-level memoized reveal character component with stable keys and GPU hardware acceleration
const RevealChar = React.memo(function RevealChar({ char, p }: { char: string; p: number }) {
    const opacity = Math.pow(p, 1.2);
    return (
        <span
            className="inline-block overflow-hidden align-bottom whitespace-nowrap"
            style={{
                maxWidth: `${p * 0.85}em`,
                opacity: opacity,
                transform: `translate3d(${(1 - p) * -16}px, 0, 0) scale(${0.78 + p * 0.22})`,
                filter: p < 0.98 ? `blur(${(1 - p) * 5}px)` : "none",
                willChange: "transform, max-width, opacity, filter",
            }}
        >
            {char}
        </span>
    );
});

export function HeroTypography({ progress, revealed = true }: HeroTypographyProps) {
    const [entryRevealed, setEntryRevealed] = React.useState(false);

    React.useEffect(() => {
        setEntryRevealed(false);
        const timer = setTimeout(() => {
            setEntryRevealed(true);
        }, 60);
        return () => clearTimeout(timer);
    }, [revealed]);

    // Helper to calculate eased progress for slow, graceful letter expansion
    const getLetterProgress = (start: number, end: number) => {
        if (progress <= start) return 0;
        if (progress >= end) return 1;
        const raw = (progress - start) / (end - start);
        // Smooth quadratic ease for slow, gradual appearance
        return Math.pow(raw, 1.3);
    };

    // Phase 1: F -> FIRST (spread slowly across 0.08 -> 0.45)
    const iProg = getLetterProgress(0.08, 0.18);
    const r1Prog = getLetterProgress(0.17, 0.27);
    const sProg = getLetterProgress(0.26, 0.36);
    const t1Prog = getLetterProgress(0.35, 0.45);

    // Phase 2: T -> TORQUE (spread slowly across 0.45 -> 0.85)
    const oProg = getLetterProgress(0.45, 0.53);
    const r2Prog = getLetterProgress(0.53, 0.61);
    const qProg = getLetterProgress(0.61, 0.69);
    const uProg = getLetterProgress(0.69, 0.77);
    const eProg = getLetterProgress(0.77, 0.85);

    // Scroll-driven liquid green fill progress (0.0 to 1.0)
    const fillProg = Math.min(1, Math.max(0, progress / 0.75));
    // Green fill stop percentage: 80% (bottom 20% green at rest) -> 35% (as you scroll down)
    const greenStop = Math.round(80 - fillProg * 45);

    // Dynamic Glass Style for FTX Typography: Initial 20% green at bottom -> Scroll fills Green higher
    const getXGlassStyle = () => {
        return {
            WebkitTextStroke: "0.8px rgba(20, 20, 20, 0.40)",
            backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.65) ${Math.max(0, greenStop - 15)}%, rgba(163, 230, 53, 0.95) ${greenStop}%, rgba(163, 230, 53, 0.85) 100%)`,
            textShadow: `0 8px 32px rgba(163, 230, 53, ${0.15 + fillProg * 0.25}), 0 0 20px rgba(163, 230, 53, ${0.10 + fillProg * 0.20})`,
        };
    };

    const isVisible = revealed && entryRevealed;

    return (
        <div
            className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center -translate-y-6 sm:-translate-y-8 lg:-translate-y-10 w-full max-w-full overflow-hidden px-4 select-none"
        >
            {/* Tightly grouped 2X enlarged glassy typography container centered behind the 3D car */}
            <div
                className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 font-heading font-black tracking-tighter leading-none text-center max-w-full overflow-hidden"
                suppressHydrationWarning
                translate="no"
            >
                {/* WORD 1: F -> FIRST (Slide in smoothly from LEFT to RIGHT) */}
                <div
                    className="flex items-center text-[clamp(3.5rem,10vw,10rem)] font-black uppercase text-transparent bg-clip-text drop-shadow-2xl"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-140px, 0, 0)",
                        filter: isVisible ? "blur(0px)" : "blur(18px)",
                        transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                        transitionDelay: "200ms",
                    }}
                >
                    <span>F</span>
                    <RevealChar key="char-I" char="I" p={iProg} />
                    <RevealChar key="char-R1" char="R" p={r1Prog} />
                    <RevealChar key="char-S" char="S" p={sProg} />
                    <RevealChar key="char-T1" char="T" p={t1Prog} />
                </div>

                {/* WORD 2: T -> TORQUE (Vertical Fill-Up & Expand effect from bottom) */}
                <div
                    className="flex items-center text-[clamp(3.5rem,10vw,10rem)] font-black uppercase text-transparent bg-clip-text drop-shadow-2xl"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 50px, 0) scaleY(0.15) scaleX(0.85)",
                        filter: isVisible ? "blur(0px)" : "blur(22px)",
                        transformOrigin: "bottom center",
                        transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                        transitionDelay: "380ms",
                    }}
                >
                    <span>T</span>
                    <RevealChar key="char-O" char="O" p={oProg} />
                    <RevealChar key="char-R2" char="R" p={r2Prog} />
                    <RevealChar key="char-Q" char="Q" p={qProg} />
                    <RevealChar key="char-U" char="U" p={uProg} />
                    <RevealChar key="char-E" char="E" p={eProg} />
                </div>

                {/* WORD 3: X (Slide in smoothly from RIGHT to LEFT) */}
                <div
                    className="text-[clamp(3.5rem,10vw,10rem)] font-black uppercase text-transparent bg-clip-text drop-shadow-2xl"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(140px, 0, 0)",
                        filter: isVisible ? "blur(0px)" : "blur(18px)",
                        transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                        transitionDelay: "560ms",
                    }}
                >
                    <span>X</span>
                </div>
            </div>
        </div>
    );
}
