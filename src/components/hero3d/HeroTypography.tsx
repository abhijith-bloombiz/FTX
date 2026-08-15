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
        return Math.pow(raw, 1.3);
    };

    // Phase 1: F -> FIRST (spread across 0.04 -> 0.30)
    const iProg = getLetterProgress(0.04, 0.10);
    const r1Prog = getLetterProgress(0.10, 0.16);
    const sProg = getLetterProgress(0.16, 0.22);
    const t1Prog = getLetterProgress(0.22, 0.28);

    // Phase 2: T -> TORQUE (spread across 0.30 -> 0.65 so ALL letters complete before frame 140)
    const oProg = getLetterProgress(0.30, 0.37);
    const r2Prog = getLetterProgress(0.37, 0.44);
    const qProg = getLetterProgress(0.44, 0.51);
    const uProg = getLetterProgress(0.51, 0.58);
    const eProg = getLetterProgress(0.58, 0.65);

    // Scroll-driven fill progress (0.0 to 1.0)
    const fillProg = Math.min(1, Math.max(0, progress / 0.65));

    // Frame 150 Hide Calculation:
    // frame_0150.jpg corresponds to progress = 149 / 191 (~0.7801).
    // All letters finish revealing at progress 0.65.
    // Fades out smoothly between frame 140 (~0.7277) and frame 150 (~0.7801).
    const frame150Progress = 149 / 191;
    const frame140Progress = 139 / 191;

    let frameHideOpacity = 1;
    if (progress >= frame150Progress) {
        frameHideOpacity = 0;
    } else if (progress > frame140Progress) {
        frameHideOpacity = 1 - (progress - frame140Progress) / (frame150Progress - frame140Progress);
    }

    // Pure Delicate Light Outline Style: Zero background fill, clean stroke
    const getXGlassStyle = () => {
        return {
            WebkitTextStroke: `0.6px rgba(255, 255, 255, ${(0.20 + fillProg * 0.20) * frameHideOpacity})`,
            color: "transparent",
            backgroundColor: "transparent",
            backgroundImage: "none",
        };
    };

    const isVisible = revealed && entryRevealed;

    return (
        <div
            className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center w-full max-w-full overflow-hidden px-4 select-none transition-opacity duration-300"
            style={{
                opacity: isVisible ? frameHideOpacity : 0,
                visibility: frameHideOpacity < 0.01 ? "hidden" : "visible",
            }}
        >
            {/* Perfectly centered glassy typography container */}
            <div
                className="flex items-center justify-center text-center gap-2 sm:gap-4 lg:gap-5 font-heading font-black tracking-tighter leading-none max-w-full overflow-hidden"
                suppressHydrationWarning
                translate="no"
            >
                {/* WORD 1: F -> FIRST (Slide in smoothly from LEFT to RIGHT) */}
                <div
                    className="flex items-center justify-center text-[clamp(2.2rem,6.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? frameHideOpacity : 0,
                        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-140px, 0, 0)",
                        filter: isVisible && frameHideOpacity > 0.01 ? "blur(0px)" : "blur(18px)",
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
                    className="flex items-center justify-center text-[clamp(2.2rem,6.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? frameHideOpacity : 0,
                        transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 50px, 0) scaleY(0.15) scaleX(0.85)",
                        filter: isVisible && frameHideOpacity > 0.01 ? "blur(0px)" : "blur(22px)",
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
                    className="text-[clamp(2.2rem,6.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                    style={{
                        ...getXGlassStyle(),
                        opacity: isVisible ? frameHideOpacity : 0,
                        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(140px, 0, 0)",
                        filter: isVisible && frameHideOpacity > 0.01 ? "blur(0px)" : "blur(18px)",
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
