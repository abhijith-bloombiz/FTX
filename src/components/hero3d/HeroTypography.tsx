"use client";

import React from "react";

interface HeroTypographyProps {
    progress?: number; // 0.0 to 1.0 from GSAP ScrollTrigger
    revealed?: boolean;
    isMobile?: boolean;
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
                willChange: p >= 0.99 ? "auto" : "transform, max-width, opacity, filter",
            }}
        >
            {char}
        </span>
    );
});

export interface HeroTypographyHandle {
    setProgress: (progress: number) => void;
}

export const HeroTypography = React.forwardRef<HeroTypographyHandle, HeroTypographyProps>(
    function HeroTypography({ progress: initialProgress = 0, revealed = true, isMobile = false }, ref) {
        const [entryRevealed, setEntryRevealed] = React.useState(false);
        const containerRef = React.useRef<HTMLDivElement>(null);

        // Letter DOM refs for zero-re-render high-performance scroll updates
        const charRefs = React.useRef<{ [key: string]: HTMLSpanElement | null }>({});
        const word1Ref = React.useRef<HTMLDivElement>(null);
        const word2Ref = React.useRef<HTMLDivElement>(null);
        const word3Ref = React.useRef<HTMLDivElement>(null);

        const currentProgressRef = React.useRef(initialProgress);

        React.useEffect(() => {
            setEntryRevealed(false);
            const timer = setTimeout(() => {
                setEntryRevealed(true);
            }, 60);
            return () => clearTimeout(timer);
        }, [revealed]);

        const updateDOM = React.useCallback((p: number) => {
            currentProgressRef.current = p;
            const isVis = revealed && entryRevealed;

            const maxIndex = 129; // 130 total frames (0..129)
            const frame130Progress = 129 / maxIndex; // 1.0
            const frame120Progress = 119 / maxIndex;

            let frameHideOpacity = 1;
            if (p >= frame130Progress) {
                frameHideOpacity = 0;
            } else if (p > frame120Progress) {
                frameHideOpacity = 1 - (p - frame120Progress) / (frame130Progress - frame120Progress);
            }

            const fillProg = Math.min(1, Math.max(0, p / 0.65));
            const strokeAlpha = (0.20 + fillProg * 0.20) * frameHideOpacity;
            const strokeStyle = `0.6px rgba(255, 255, 255, ${strokeAlpha.toFixed(3)})`;

            if (containerRef.current) {
                containerRef.current.style.opacity = isVis ? String(frameHideOpacity.toFixed(3)) : "0";
                containerRef.current.style.visibility = frameHideOpacity < 0.01 ? "hidden" : "visible";
            }

            // Word 1: FIRST
            if (word1Ref.current) {
                word1Ref.current.style.webkitTextStroke = strokeStyle;
                word1Ref.current.style.opacity = isVis ? String(frameHideOpacity.toFixed(3)) : "0";
                word1Ref.current.style.transform = isVis ? "translate3d(0, 0, 0)" : "translate3d(-140px, 0, 0)";
                word1Ref.current.style.filter = !isMobile && isVis && frameHideOpacity > 0.01 ? "blur(0px)" : !isMobile ? "blur(18px)" : "none";
            }

            // Word 2: TORQUE
            if (word2Ref.current) {
                word2Ref.current.style.webkitTextStroke = strokeStyle;
                word2Ref.current.style.opacity = isVis ? String(frameHideOpacity.toFixed(3)) : "0";
                word2Ref.current.style.transform = isVis ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 50px, 0) scaleY(0.15) scaleX(0.85)";
                word2Ref.current.style.filter = !isMobile && isVis && frameHideOpacity > 0.01 ? "blur(0px)" : !isMobile ? "blur(22px)" : "none";
            }

            // Word 3: X
            if (word3Ref.current) {
                word3Ref.current.style.webkitTextStroke = strokeStyle;
                word3Ref.current.style.opacity = isVis ? String(frameHideOpacity.toFixed(3)) : "0";
                word3Ref.current.style.transform = isVis ? "translate3d(0, 0, 0)" : "translate3d(140px, 0, 0)";
                word3Ref.current.style.filter = !isMobile && isVis && frameHideOpacity > 0.01 ? "blur(0px)" : !isMobile ? "blur(18px)" : "none";
            }

            const getLetterP = (start: number, end: number) => {
                if (p <= start) return 0;
                if (p >= end) return 1;
                const raw = (p - start) / (end - start);
                return Math.pow(raw, 1.3);
            };

            const lettersConfig = [
                { key: "I", start: 0.04, end: 0.10 },
                { key: "R1", start: 0.10, end: 0.16 },
                { key: "S", start: 0.16, end: 0.22 },
                { key: "T1", start: 0.22, end: 0.28 },
                { key: "O", start: 0.30, end: 0.37 },
                { key: "R2", start: 0.37, end: 0.44 },
                { key: "Q", start: 0.44, end: 0.51 },
                { key: "U", start: 0.51, end: 0.58 },
                { key: "E", start: 0.58, end: 0.65 },
            ];

            lettersConfig.forEach(({ key, start, end }) => {
                const el = charRefs.current[key];
                if (!el) return;
                const lp = getLetterP(start, end);
                const op = Math.pow(lp, 1.2);
                el.style.maxWidth = `${(lp * 0.85).toFixed(3)}em`;
                el.style.opacity = op.toFixed(3);
                el.style.transform = `translate3d(${((1 - lp) * -16).toFixed(1)}px, 0, 0) scale(${(0.78 + lp * 0.22).toFixed(3)})`;
                el.style.filter = !isMobile && lp < 0.98 ? `blur(${((1 - lp) * 5).toFixed(1)}px)` : "none";
            });
        }, [entryRevealed, revealed, isMobile]);

        React.useImperativeHandle(ref, () => ({
            setProgress: (p: number) => {
                updateDOM(p);
            },
        }), [updateDOM]);

        React.useEffect(() => {
            updateDOM(initialProgress);
        }, [initialProgress, updateDOM]);

        const isVisible = revealed && entryRevealed;

        return (
            <div
                ref={containerRef}
                className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center w-full max-w-full overflow-hidden px-4 select-none transition-opacity duration-300"
                style={{
                    opacity: isVisible ? 1 : 0,
                }}
            >
                <div
                    className="flex flex-row items-center justify-center text-center gap-2 sm:gap-4 lg:gap-5 font-heading font-black tracking-tighter leading-none max-w-full overflow-hidden"
                    dir="ltr"
                    suppressHydrationWarning
                    translate="no"
                >
                    {/* WORD 1: F -> FIRST */}
                    <div
                        ref={word1Ref}
                        className="flex items-center justify-center text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
                            transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                            transitionDelay: "200ms",
                        }}
                    >
                        <span>F</span>
                        <span ref={(el) => { charRefs.current["I"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">I</span>
                        <span ref={(el) => { charRefs.current["R1"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">R</span>
                        <span ref={(el) => { charRefs.current["S"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">S</span>
                        <span ref={(el) => { charRefs.current["T1"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">T</span>
                    </div>

                    {/* WORD 2: T -> TORQUE */}
                    <div
                        ref={word2Ref}
                        className="flex items-center justify-center text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
                            transformOrigin: "bottom center",
                            transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                            transitionDelay: "380ms",
                        }}
                    >
                        <span>T</span>
                        <span ref={(el) => { charRefs.current["O"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">O</span>
                        <span ref={(el) => { charRefs.current["R2"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">R</span>
                        <span ref={(el) => { charRefs.current["Q"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">Q</span>
                        <span ref={(el) => { charRefs.current["U"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">U</span>
                        <span ref={(el) => { charRefs.current["E"] = el; }} className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform">E</span>
                    </div>

                    {/* WORD 3: X */}
                    <div
                        ref={word3Ref}
                        className="text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
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
);

