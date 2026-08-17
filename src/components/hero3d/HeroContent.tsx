"use client";

import { RefObject } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Locale } from "@/i18n/config";

interface HeroContentProps {
    locale: Locale;
    messages: any;
    scrollProgress?: number;
    revealed?: boolean;
    contentRef?: RefObject<HTMLDivElement>;
}

export function HeroContent({
    locale,
    messages,
    scrollProgress = 0,
    revealed = true,
    contentRef,
}: HeroContentProps) {
    // Helper to calculate smooth fade, translate, and blur based on scrollProgress
    const getProgressStyle = (start: number, end: number) => {
        if (scrollProgress <= start) {
            return {
                opacity: 0,
                transform: "translate3d(0, 35px, 0)",
                filter: "blur(8px)",
                pointerEvents: "none" as const,
            };
        }
        if (scrollProgress >= end) {
            return {
                opacity: 1,
                transform: "translate3d(0, 0px, 0)",
                filter: "blur(0px)",
                pointerEvents: "auto" as const,
            };
        }
        const p = (scrollProgress - start) / (end - start);
        return {
            opacity: p,
            transform: `translate3d(0, ${(1 - p) * 35}px, 0)`,
            filter: `blur(${(1 - p) * 8}px)`,
            pointerEvents: p > 0.5 ? ("auto" as const) : ("none" as const),
        };
    };

    // Helper for horizontal reveal (left to right)
    const getLeftToRightStyle = (start: number, end: number) => {
        if (scrollProgress <= start) {
            return {
                opacity: 0,
                transform: "translate3d(-45px, 0, 0)",
                filter: "blur(8px)",
                pointerEvents: "none" as const,
            };
        }
        if (scrollProgress >= end) {
            return {
                opacity: 1,
                transform: "translate3d(0px, 0px, 0)",
                filter: "blur(0px)",
                pointerEvents: "auto" as const,
            };
        }
        const p = (scrollProgress - start) / (end - start);
        return {
            opacity: p,
            transform: `translate3d(${(1 - p) * -45}px, 0, 0)`,
            filter: `blur(${(1 - p) * 8}px)`,
            pointerEvents: p > 0.5 ? ("auto" as const) : ("none" as const),
        };
    };

    // Helper for vertical reveal from under button 1
    const getFromUnderStyle = (start: number, end: number) => {
        if (scrollProgress <= start) {
            return {
                opacity: 0,
                transform: "translate3d(0, 40px, 0) scale(0.92)",
                filter: "blur(8px)",
                pointerEvents: "none" as const,
            };
        }
        if (scrollProgress >= end) {
            return {
                opacity: 1,
                transform: "translate3d(0, 0px, 0) scale(1)",
                filter: "blur(0px)",
                pointerEvents: "auto" as const,
            };
        }
        const p = (scrollProgress - start) / (end - start);
        return {
            opacity: p,
            transform: `translate3d(0, ${(1 - p) * 40}px, 0) scale(${0.92 + p * 0.08})`,
            filter: `blur(${(1 - p) * 8}px)`,
            pointerEvents: p > 0.5 ? ("auto" as const) : ("none" as const),
        };
    };

    // Staggered styles for each line
    // Line 1: PRECISION (0.04 -> 0.18)
    const precisionStyle = getProgressStyle(0.04, 0.18);

    // Line 2: PROTECTION. (0.18 -> 0.32)
    const protectionStyle = getProgressStyle(0.18, 0.32);

    // Line 3: AUTOMOTIVE (0.32 -> 0.46)
    const automotiveStyle = getProgressStyle(0.32, 0.46);

    // Line 4: PERFECTION. (0.46 -> 0.60)
    const perfectionStyle = getProgressStyle(0.46, 0.60);

    // Staggered CTA button reveals starting IMMEDIATELY on first scroll
    // Button 1: Get a Quote (0.04 -> 0.20, Left to Right on First Scroll)
    const btn1Style = getLeftToRightStyle(0.04, 0.20);

    // Button 2: Explore Services (0.18 -> 0.34, From Under Button 1)
    const btn2Style = getFromUnderStyle(0.18, 0.34);

    // Split title and subtitle safely into 2 lines each
    const titleParts = messages?.hero?.title ? messages.hero.title.split(" ") : ["PRECISION", "PROTECTION."];
    const titleLine1 = titleParts[0] || "PRECISION";
    const titleLine2 = titleParts.slice(1).join(" ") || "PROTECTION.";

    const subParts = messages?.hero?.subtitle ? messages.hero.subtitle.split(" ") : ["AUTOMOTIVE", "PERFECTION."];
    const subLine1 = subParts[0] || "AUTOMOTIVE";
    const subLine2 = subParts.slice(1).join(" ") || "PERFECTION.";

    return (
        <div
            ref={contentRef}
            className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between py-12 transition-opacity duration-300 pointer-events-none"
            style={{ opacity: revealed ? 1 : 0 }}
        >
            {/* TOP SECTION: PRECISION & PROTECTION. + AUTOMOTIVE PERFECTION (Mobile View) */}
            <div className="pt-4 pointer-events-auto">
                <div className="space-y-1 text-center lg:text-left">
                    <div className="overflow-hidden py-0.5">
                        <h1
                            className="text-[3.25rem] sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out"
                            style={precisionStyle}
                        >
                            <span>{titleLine1}</span>
                        </h1>
                    </div>
                    <div className="overflow-hidden py-0.5">
                        <h1
                            className="text-[3.25rem] sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out"
                            style={protectionStyle}
                        >
                            <span>{titleLine2}</span>
                        </h1>
                    </div>

                    {/* AUTOMOTIVE PERFECTION — Mobile position (directly under PRECISION PROTECTION) */}
                    <div className="block lg:hidden pt-2 space-y-0.5 text-center">
                        <div className="overflow-hidden py-0.5">
                            <h2
                                className="text-[2.75rem] sm:text-4xl font-heading font-black text-gradient-lime uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out drop-shadow-2xl"
                                style={automotiveStyle}
                            >
                                <span>{subLine1}</span>
                            </h2>
                        </div>
                        <div className="overflow-hidden py-0.5">
                            <h2
                                className="text-[2.75rem] sm:text-4xl font-heading font-black text-gradient-lime uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out drop-shadow-2xl"
                                style={perfectionStyle}
                            >
                                <span>{subLine2}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: CTAs (Left) + AUTOMOTIVE PERFECTION (Desktop Right View) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end pb-4 pt-4 lg:pt-8">
                {/* CTAs & Buttons */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left pointer-events-auto">
                    <div className="relative z-20 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                        <Link
                            href={`/${locale}/contact`}
                            className="ftx-btn-tech ftx-btn-specular group inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-all duration-500 ease-out shadow-lime-glow hover:scale-103"
                            style={btn1Style}
                        >
                            <span>{messages.common.getQuote}</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        <Link
                            href={`/${locale}/services`}
                            className="ftx-btn-tech ftx-btn-specular inline-flex items-center gap-2 px-7 py-4 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high transition-all duration-500 ease-out"
                            style={btn2Style}
                        >
                            <span>{messages.common.exploreServices}</span>
                            <ChevronDown className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* AUTOMOTIVE PERFECTION — Desktop position (bottom right) */}
                <div className="hidden lg:flex lg:col-span-5 flex-col justify-end items-end text-right pointer-events-auto translate-y-16">
                    <div className="space-y-1 text-right">
                        <div className="overflow-hidden py-0.5">
                            <h2
                                className="text-6xl font-heading font-black text-gradient-lime uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out drop-shadow-2xl"
                                style={automotiveStyle}
                            >
                                <span>{subLine1}</span>
                            </h2>
                        </div>
                        <div className="overflow-hidden py-0.5">
                            <h2
                                className="text-6xl font-heading font-black text-gradient-lime uppercase tracking-tight leading-[1.02] transition-all duration-500 ease-out drop-shadow-2xl"
                                style={perfectionStyle}
                            >
                                <span>{subLine2}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
