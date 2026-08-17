"use client";

import React, { useImperativeHandle, useRef, useEffect, useState } from "react";

export interface HeroTypographyRef {
    updateProgress: (p: number) => void;
}

interface HeroTypographyProps {
    progress?: number; // 0.0 to 1.0 from GSAP ScrollTrigger
    revealed?: boolean;
    isMobile?: boolean;
}

export const HeroTypography = React.forwardRef<HeroTypographyRef, HeroTypographyProps>(
    function HeroTypography({ progress = 0, revealed = true, isMobile = false }, ref) {
        const [entryRevealed, setEntryRevealed] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const word1Ref = useRef<HTMLDivElement>(null);
        const word2Ref = useRef<HTMLDivElement>(null);
        const word3Ref = useRef<HTMLDivElement>(null);
        const charRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

        useEffect(() => {
            setEntryRevealed(false);
            const timer = setTimeout(() => {
                setEntryRevealed(true);
            }, 60);
            return () => clearTimeout(timer);
        }, [revealed]);

        const applyProgress = (p: number) => {
            const isVisible = revealed && entryRevealed;

            const getLetterProgress = (start: number, end: number) => {
                if (p <= start) return 0;
                if (p >= end) return 1;
                const raw = (p - start) / (end - start);
                return Math.pow(raw, 1.3);
            };

            const iProg = getLetterProgress(0.04, 0.10);
            const r1Prog = getLetterProgress(0.10, 0.16);
            const sProg = getLetterProgress(0.16, 0.22);
            const t1Prog = getLetterProgress(0.22, 0.28);

            const oProg = getLetterProgress(0.30, 0.37);
            const r2Prog = getLetterProgress(0.37, 0.44);
            const qProg = getLetterProgress(0.44, 0.51);
            const uProg = getLetterProgress(0.51, 0.58);
            const eProg = getLetterProgress(0.58, 0.65);

            const fillProg = Math.min(1, Math.max(0, p / 0.65));

            // Total 150 frames: maxIndex = 149
            const maxIndex = 149;
            const frame150Progress = 149 / maxIndex;
            const frame140Progress = 139 / maxIndex;

            let frameHideOpacity = 1;
            if (p >= frame150Progress) {
                frameHideOpacity = 0;
            } else if (p > frame140Progress) {
                frameHideOpacity = 1 - (p - frame140Progress) / (frame150Progress - frame140Progress);
            }

            const strokeAlpha = (0.20 + fillProg * 0.20) * frameHideOpacity;
            const strokeStyle = `0.6px rgba(255, 255, 255, ${strokeAlpha})`;

            if (containerRef.current) {
                containerRef.current.style.opacity = isVisible ? String(frameHideOpacity) : "0";
                containerRef.current.style.visibility = frameHideOpacity < 0.01 ? "hidden" : "visible";
            }

            if (word1Ref.current) {
                word1Ref.current.style.webkitTextStroke = strokeStyle;
            }
            if (word2Ref.current) {
                word2Ref.current.style.webkitTextStroke = strokeStyle;
            }
            if (word3Ref.current) {
                word3Ref.current.style.webkitTextStroke = strokeStyle;
            }

            const updateChar = (key: string, charP: number) => {
                const el = charRefs.current.get(key);
                if (!el) return;
                const op = Math.pow(charP, 1.2);
                el.style.maxWidth = `${charP * 0.85}em`;
                el.style.opacity = String(op);
                el.style.transform = `translate3d(${(1 - charP) * -16}px, 0, 0) scale(${0.78 + charP * 0.22})`;
                el.style.filter = charP < 0.98 ? `blur(${(1 - charP) * 5}px)` : "none";
            };

            updateChar("I", iProg);
            updateChar("R1", r1Prog);
            updateChar("S", sProg);
            updateChar("T1", t1Prog);
            updateChar("O", oProg);
            updateChar("R2", r2Prog);
            updateChar("Q", qProg);
            updateChar("U", uProg);
            updateChar("E", eProg);
        };

        useImperativeHandle(ref, () => ({
            updateProgress: (p: number) => {
                applyProgress(p);
            },
        }));

        useEffect(() => {
            applyProgress(progress);
        }, [progress, entryRevealed, revealed]);

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
                    className="flex items-center justify-center text-center gap-2 sm:gap-4 lg:gap-5 font-heading font-black tracking-tighter leading-none max-w-full overflow-hidden"
                    suppressHydrationWarning
                    translate="no"
                >
                    {/* WORD 1: F -> FIRST */}
                    <div
                        ref={word1Ref}
                        className="flex items-center justify-center text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
                            WebkitTextStroke: "0.6px rgba(255, 255, 255, 0.20)",
                            color: "transparent",
                            backgroundColor: "transparent",
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(-140px, 0, 0)",
                            filter: isVisible ? "blur(0px)" : "blur(18px)",
                            transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                            transitionDelay: "200ms",
                        }}
                    >
                        <span>F</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("I", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >I</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("R1", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >R</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("S", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >S</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("T1", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >T</span>
                    </div>

                    {/* WORD 2: T -> TORQUE */}
                    <div
                        ref={word2Ref}
                        className="flex items-center justify-center text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
                            WebkitTextStroke: "0.6px rgba(255, 255, 255, 0.20)",
                            color: "transparent",
                            backgroundColor: "transparent",
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 50px, 0) scaleY(0.15) scaleX(0.85)",
                            filter: isVisible ? "blur(0px)" : "blur(22px)",
                            transformOrigin: "bottom center",
                            transition: "transform 1800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1600ms cubic-bezier(0.16, 1, 0.3, 1), filter 1600ms ease-out",
                            transitionDelay: "380ms",
                        }}
                    >
                        <span>T</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("O", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >O</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("R2", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >R</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("Q", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >Q</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("U", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >U</span>
                        <span
                            ref={(el) => { if (el) charRefs.current.set("E", el); }}
                            className="inline-block overflow-hidden align-bottom whitespace-nowrap will-change-transform"
                            style={{ maxWidth: "0em", opacity: 0 }}
                        >E</span>
                    </div>

                    {/* WORD 3: X */}
                    <div
                        ref={word3Ref}
                        className="text-[clamp(3.4rem,8.5vw,6.5rem)] font-black uppercase text-transparent text-center"
                        style={{
                            WebkitTextStroke: "0.6px rgba(255, 255, 255, 0.20)",
                            color: "transparent",
                            backgroundColor: "transparent",
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
);
