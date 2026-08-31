"use client";

import React, { useRef, useCallback, useEffect, useState, useImperativeHandle } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Locale } from "@/i18n/config";

interface HeroContentProps {
    locale: Locale;
    messages: any;
    progress?: number;
    revealed?: boolean;
}

export interface HeroContentHandle {
    setProgress: (progress: number) => void;
}

export const HeroContent = React.forwardRef<HeroContentHandle, HeroContentProps>(
    function HeroContent({ locale, messages, progress: initialProgress = 0, revealed = true }, ref) {
        const containerRef = useRef<HTMLDivElement>(null);

        // Group 1 Individual Line Refs (Top Left)
        const line1Ref = useRef<HTMLDivElement>(null); // "PRECISION"
        const line2Ref = useRef<HTMLDivElement>(null); // "PROTECTION."

        // Group 2 Individual Line Refs (Top Left - Same Position)
        const line3Ref = useRef<HTMLDivElement>(null); // "AUTOMOTIVE"
        const line4Ref = useRef<HTMLDivElement>(null); // "PERFECTION."

        // CTA Button refs
        const btn1Ref = useRef<HTMLAnchorElement>(null);
        const btn2Ref = useRef<HTMLAnchorElement>(null);

        const [entryRevealed, setEntryRevealed] = useState(false);
        const [transitionFinished, setTransitionFinished] = useState(false);

        useEffect(() => {
            if (revealed) {
                const timer1 = setTimeout(() => {
                    setEntryRevealed(true);
                }, 100);
                const timer2 = setTimeout(() => {
                    setTransitionFinished(true);
                }, 900);
                return () => {
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                };
            }
        }, [revealed]);

        const updateDOM = useCallback((p: number) => {
            // Helper function for individual line staggered enter & exit (used for Group 2)
            const animateLine = (
                el: HTMLDivElement | null,
                inStart: number,
                inEnd: number,
                outStart: number,
                outEnd: number,
                exitDirection: "left" | "fade" = "left"
            ) => {
                if (!el) return;
                if (p < inStart) {
                    el.style.opacity = "0";
                    el.style.transform = "translate3d(0, 28px, 0)";
                    el.style.filter = "blur(7px)";
                    el.style.pointerEvents = "none";
                } else if (p <= inEnd) {
                    const inP = (p - inStart) / (inEnd - inStart);
                    const op = Math.min(1, inP * 1.25).toFixed(3);
                    const translateY = ((1 - inP) * 28).toFixed(1);
                    const blurVal = ((1 - inP) * 7).toFixed(1);

                    el.style.opacity = op;
                    el.style.transform = `translate3d(0, ${translateY}px, 0)`;
                    el.style.filter = `blur(${blurVal}px)`;
                    el.style.pointerEvents = "auto";
                } else if (p <= outStart) {
                    el.style.opacity = "1";
                    el.style.transform = "translate3d(0, 0, 0)";
                    el.style.filter = "blur(0px)";
                    el.style.pointerEvents = "auto";
                } else if (p <= outEnd) {
                    const outP = (p - outStart) / (outEnd - outStart);
                    const op = (1 - outP).toFixed(3);
                    const blurVal = (outP * 8).toFixed(1);

                    if (exitDirection === "left") {
                        const translateX = (-outP * 140).toFixed(1);
                        el.style.opacity = op;
                        el.style.transform = `translate3d(${translateX}px, 0, 0)`;
                        el.style.filter = `blur(${blurVal}px)`;
                    } else {
                        el.style.opacity = op;
                        el.style.filter = `blur(${blurVal}px)`;
                    }
                    el.style.pointerEvents = "none";
                } else {
                    el.style.opacity = "0";
                    if (exitDirection === "left") {
                        el.style.transform = "translate3d(-140px, 0, 0)";
                    }
                    el.style.filter = "blur(10px)";
                    el.style.pointerEvents = "none";
                }
            };

            // =========================================================================
            // GROUP 1: PRECISION then PROTECTION.
            // Visible immediately on page visit (p=0.00 -> 0.32), Exits Left 0.32 -> 0.42
            // =========================================================================
            const animateGroup1Line = (
                el: HTMLDivElement | null,
                outStart: number,
                outEnd: number
            ) => {
                if (!el) return;
                if (p <= outStart) {
                    el.style.opacity = entryRevealed ? "1" : "0";
                    el.style.transform = entryRevealed ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)";
                    el.style.filter = entryRevealed ? "blur(0px)" : "blur(6px)";
                    el.style.pointerEvents = "auto";
                } else if (p <= outEnd) {
                    const outP = (p - outStart) / (outEnd - outStart);
                    const op = (1 - outP).toFixed(3);
                    const blurVal = (outP * 8).toFixed(1);
                    const translateX = (-outP * 140).toFixed(1);

                    el.style.opacity = op;
                    el.style.transform = `translate3d(${translateX}px, 0, 0)`;
                    el.style.filter = `blur(${blurVal}px)`;
                    el.style.pointerEvents = "none";
                } else {
                    el.style.opacity = "0";
                    el.style.transform = "translate3d(-140px, 0, 0)";
                    el.style.filter = "blur(10px)";
                    el.style.pointerEvents = "none";
                }
            };

            animateGroup1Line(line1Ref.current, 0.32, 0.42);
            animateGroup1Line(line2Ref.current, 0.35, 0.45);

            // =========================================================================
            // GROUP 2: AUTOMOTIVE then PERFECTION. (Top-Left Same Spot)
            // Line 3 ("AUTOMOTIVE"): Enters 0.42 -> 0.54 | Holds 0.54 -> 0.85 | Exits Fade 0.85 -> 0.96
            // Line 4 ("PERFECTION."): Enters 0.50 -> 0.62 | Holds 0.62 -> 0.85 | Exits Fade 0.85 -> 0.98
            // =========================================================================
            animateLine(line3Ref.current, 0.42, 0.54, 0.85, 0.96, "fade");
            animateLine(line4Ref.current, 0.50, 0.62, 0.85, 0.98, "fade");

            // =========================================================================
            // CTA BUTTONS: Visible on Page Visit (p=0.00 -> 0.88), Exits to edges 0.88 -> 1.00
            // =========================================================================
            const btnOutStart = 0.88;
            const btnOutEnd = 1.00;

            if (p <= btnOutStart) {
                if (btn1Ref.current) {
                    btn1Ref.current.style.opacity = entryRevealed ? "1" : "0";
                    btn1Ref.current.style.transform = entryRevealed ? "translate3d(0, 0, 0)" : "translate3d(-50px, 0, 0)";
                    btn1Ref.current.style.filter = entryRevealed ? "blur(0px)" : "blur(6px)";
                    btn1Ref.current.style.pointerEvents = "auto";
                }
                if (btn2Ref.current) {
                    btn2Ref.current.style.opacity = entryRevealed ? "1" : "0";
                    btn2Ref.current.style.transform = entryRevealed ? "translate3d(0, 0, 0)" : "translate3d(50px, 0, 0)";
                    btn2Ref.current.style.filter = entryRevealed ? "blur(0px)" : "blur(6px)";
                    btn2Ref.current.style.pointerEvents = "auto";
                }
            } else if (p <= btnOutEnd) {
                const outP = (p - btnOutStart) / (btnOutEnd - btnOutStart);
                const op = (1 - outP).toFixed(3);
                const blurVal = (outP * 10).toFixed(1);
                const tx1 = ((-100) * outP).toFixed(1);
                const tx2 = ((100) * outP).toFixed(1);

                if (btn1Ref.current) {
                    btn1Ref.current.style.opacity = op;
                    btn1Ref.current.style.transform = `translate3d(${tx1}vw, 0, 0)`;
                    btn1Ref.current.style.filter = `blur(${blurVal}px)`;
                    btn1Ref.current.style.pointerEvents = "none";
                }
                if (btn2Ref.current) {
                    btn2Ref.current.style.opacity = op;
                    btn2Ref.current.style.transform = `translate3d(${tx2}vw, 0, 0)`;
                    btn2Ref.current.style.filter = `blur(${blurVal}px)`;
                    btn2Ref.current.style.pointerEvents = "none";
                }
            } else {
                if (btn1Ref.current) {
                    btn1Ref.current.style.opacity = "0";
                    btn1Ref.current.style.transform = "translate3d(-100vw, 0, 0)";
                    btn1Ref.current.style.filter = "blur(10px)";
                    btn1Ref.current.style.pointerEvents = "none";
                }
                if (btn2Ref.current) {
                    btn2Ref.current.style.opacity = "0";
                    btn2Ref.current.style.transform = "translate3d(100vw, 0, 0)";
                    btn2Ref.current.style.filter = "blur(10px)";
                    btn2Ref.current.style.pointerEvents = "none";
                }
            }
        }, [entryRevealed]);

        useEffect(() => {
            if (revealed) {
                updateDOM(initialProgress);
            }
        }, [revealed, initialProgress, updateDOM]);

        useImperativeHandle(ref, () => ({
            setProgress: (p: number) => {
                updateDOM(p);
            },
        }), [updateDOM]);

        const isRtl = locale === "ar";

        return (
            <div
                ref={containerRef}
                className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between py-12 transition-opacity duration-300 pointer-events-none"
                style={{ opacity: revealed ? 1 : 0 }}
            >
                {/* TOP LEFT STACKED CONTAINER */}
                <div className="relative pt-4 pointer-events-auto translate-x-0 sm:-translate-x-[10px] min-h-[360px] sm:min-h-[410px] lg:min-h-[470px] xl:min-h-[530px]">
                    {/* GROUP 1: PRECISION PROTECTION. */}
                    <div className="contents">
                        {/* LINE 1 */}
                        <div className="absolute top-[10px] sm:top-[30px] left-0 right-0 w-full flex justify-center lg:justify-start text-left overflow-hidden py-0.5">
                            {locale === "en" ? (
                                <div
                                    ref={line1Ref}
                                    className={`-ml-[1px] h-[89px] sm:h-[109px] lg:h-[125px] xl:h-[141px] aspect-[2021/724] bg-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out"}`}
                                    style={{
                                        maskImage: "url('/fonts/home/precision.svg')",
                                        WebkitMaskImage: "url('/fonts/home/precision.svg')",
                                        maskSize: "contain",
                                        WebkitMaskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                    aria-label="PRECISION"
                                    role="img"
                                />
                            ) : (
                                <h1
                                    ref={line1Ref}
                                    className={`text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out"}`}
                                >
                                    {(messages?.hero?.title || "PRECISION PROTECTION.").split(" ")[0]}
                                </h1>
                            )}
                        </div>

                        {/* LINE 2 */}
                        <div className="absolute top-[51px] sm:top-[61px] lg:top-[77px] xl:top-[101px] left-0 right-0 w-full flex justify-center lg:justify-start text-left overflow-hidden py-0.5">
                            {locale === "en" ? (
                                <div
                                    ref={line2Ref}
                                    className={`h-[94px] sm:h-[114px] lg:h-[130px] xl:h-[146px] aspect-[2032/775] bg-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out delay-100"}`}
                                    style={{
                                        maskImage: "url('/fonts/home/protection.svg')",
                                        WebkitMaskImage: "url('/fonts/home/protection.svg')",
                                        maskSize: "contain",
                                        WebkitMaskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                    aria-label="PROTECTION."
                                    role="img"
                                />
                            ) : (
                                <h1
                                    ref={line2Ref}
                                    className={`text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black tracking-tight text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.25)] will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out delay-100"}`}
                                >
                                    {(messages?.hero?.title || "PRECISION PROTECTION.").split(" ").slice(1).join(" ")}
                                </h1>
                            )}
                        </div>
                    </div>

                    {/* GROUP 2: AUTOMOTIVE PERFECTION. */}
                    <div className="contents">
                        {/* LINE 3 */}
                        <div className="absolute top-0 lg:top-[15px] left-0 right-0 w-full flex justify-center lg:justify-start text-left overflow-hidden py-0.5">
                            {locale === "en" ? (
                                <div
                                    ref={line3Ref}
                                    className="-ml-[2px] h-[104px] sm:h-[124px] lg:h-[140px] xl:h-[156px] aspect-[2021/724] bg-gradient-to-r from-ftx-lime via-ftx-lime-bright to-ftx-lime drop-shadow-[0_0_30px_rgba(164,214,94,0.4)] will-change-transform"
                                    style={{
                                        maskImage: "url('/fonts/home/automotive.svg')",
                                        WebkitMaskImage: "url('/fonts/home/automotive.svg')",
                                        maskSize: "contain",
                                        WebkitMaskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                    aria-label="AUTOMOTIVE"
                                    role="img"
                                />
                            ) : (
                                <h1
                                    ref={line3Ref}
                                    className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ftx-lime via-ftx-lime-bright to-ftx-lime uppercase drop-shadow-[0_0_30px_rgba(164,214,94,0.4)] will-change-transform"
                                >
                                    {(messages?.hero?.subtitle || "AUTOMOTIVE PERFECTION.").split(" ")[0]}
                                </h1>
                            )}
                        </div>

                        {/* LINE 4 */}
                        <div className="absolute top-[51px] sm:top-[61px] lg:top-[67px] xl:top-[91px] left-0 right-0 w-full flex justify-center lg:justify-start text-left overflow-hidden py-0.5">
                            {locale === "en" ? (
                                <div
                                    ref={line4Ref}
                                    className="ml-[1px] h-[94px] sm:h-[114px] lg:h-[130px] xl:h-[146px] aspect-[1983/793] bg-gradient-to-r from-ftx-lime via-ftx-lime-bright to-ftx-lime drop-shadow-[0_0_30px_rgba(164,214,94,0.4)] will-change-transform"
                                    style={{
                                        maskImage: "url('/fonts/home/perfection.svg')",
                                        WebkitMaskImage: "url('/fonts/home/perfection.svg')",
                                        maskSize: "contain",
                                        WebkitMaskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        WebkitMaskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskPosition: "center",
                                    }}
                                    aria-label="PERFECTION."
                                    role="img"
                                />
                            ) : (
                                <h1
                                    ref={line4Ref}
                                    className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ftx-lime via-ftx-lime-bright to-ftx-lime uppercase drop-shadow-[0_0_30px_rgba(164,214,94,0.4)] will-change-transform"
                                >
                                    {(messages?.hero?.subtitle || "AUTOMOTIVE PERFECTION.").split(" ").slice(1).join(" ")}
                                </h1>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: CTA Buttons */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end pb-12 sm:pb-8 lg:pb-4 pt-2 lg:pt-8 overflow-hidden">
                    <div className="lg:col-span-7 lg:text-left space-y-6 text-center pointer-events-auto w-full">
                        <div className="relative z-20 flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full pt-1 pb-2">
                            <Link
                                ref={btn1Ref}
                                href={`/${locale}/contact`}
                                className={`flex-1 sm:flex-initial ftx-btn-tech ftx-btn-specular group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-mono font-bold tracking-wider sm:tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright shadow-lime-glow hover:scale-103 whitespace-nowrap min-w-0 will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out"}`}
                            >
                                <span>{messages?.common?.getQuote || "GET A QUOTE"}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>

                            <Link
                                ref={btn2Ref}
                                href={`/${locale}/services`}
                                className={`flex-1 sm:flex-initial ftx-btn-tech ftx-btn-specular group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-mono font-bold tracking-wider sm:tracking-widest text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high whitespace-nowrap min-w-0 will-change-transform ${transitionFinished ? "" : "transition-all duration-700 ease-out delay-100"}`}
                            >
                                <span>{messages?.common?.exploreServices || "EXPLORE SERVICES"}</span>
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
