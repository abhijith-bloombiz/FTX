"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface ServicesGridProps {
    locale: Locale;
    messages: any;
}

// Multi-image asset pools for automatic luxury slideshows (verified high-res project assets)
const PPF_IMAGES = [
    "/images/services/ppf-main.png",
    "/images/gallery/gt3rs-ppf.jpg",
    "/images/gallery/ppf-studio-hero.jpg",
    "/images/pillars/protection.jpg",
];

const CERAMIC_IMAGES = [
    "/images/services/ceramic-main.png",
    "/images/gallery/ceramic-beading.jpg",
    "/images/pillars/precision.jpg",
    "/images/about/infrared.jpg",
];

const DETAILING_IMAGES = [
    "/images/services/detailing-main.png",
    "/images/gallery/g63-after.jpg",
    "/images/pillars/performance.jpg",
    "/images/about/craftsmanship.jpg",
];

// Helper Component for Full Card Container Auto-Rotating Image Background
function AutoImageSlideshow({
    images,
    intervalMs = 4000,
    offsetMs = 0,
}: {
    images: string[];
    intervalMs?: number;
    offsetMs?: number;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches) return;

        let timer: NodeJS.Timeout;
        const initialDelay = setTimeout(() => {
            timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, intervalMs);
        }, offsetMs);

        return () => {
            clearTimeout(initialDelay);
            if (timer) clearInterval(timer);
        };
    }, [images.length, intervalMs, offsetMs]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {images.map((src, idx) => (
                <img
                    key={src}
                    src={src}
                    alt="FTX Service Background"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-[1.04] ${idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                        }`}
                />
            ))}

            {/* Dark Gradient Overlay for Maximum Typography Contrast */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-ftx-black via-ftx-black/60 to-ftx-black/30 pointer-events-none" />

            {/* Subtle Progress Indicator Dots */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ftx-black/80 backdrop-blur-md border border-white/20">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-3.5 bg-ftx-lime" : "w-1.5 bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export function ServicesGrid({ locale, messages }: ServicesGridProps) {
    return (
        <section id="services" className="py-24 bg-ftx-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row: Masked Editorial Text Reveal */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>CORE SERVICES</span>
                        </div>
                        <TextReveal as="h2" className="text-4xl sm:text-6xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                            <span>MASTERCLASS</span>
                            <span className="text-white">PROTECTION.</span>
                        </TextReveal>
                    </div>

                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ftx-silver hover:text-white uppercase tracking-wider transition-colors group/link self-start sm:self-auto"
                    >
                        <span>VIEW ALL SERVICES</span>
                        <ArrowRight className="w-4 h-4 text-ftx-lime transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                </div>

                {/* Asymmetric Core Services Showcase (8:4 Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Card: Flagship Paint Protection Film Card (8 cols) — REVEALS FROM LEFT TO RIGHT */}
                    <ScrollReveal
                        type="horizontal"
                        direction="left"
                        delay={0}
                        duration={950}
                        className="lg:col-span-8 flex flex-col"
                    >
                        <Link
                            href={`/${locale}/services#ppf`}
                            className="group relative overflow-hidden ftx-squircle-xl ftx-border-card bg-ftx-surface border border-ftx-surface-high w-full min-h-[480px] flex flex-col justify-between p-8 sm:p-10 shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
                        >
                            {/* Full-bleed Background Image Slideshow (7.5s View Time) */}
                            <AutoImageSlideshow images={PPF_IMAGES} intervalMs={7500} offsetMs={0} />

                            {/* Top Row: Badge & Watermark 01 */}
                            <div className="relative z-20 flex items-center justify-between">
                                <div className="px-3.5 py-1.5 bg-ftx-black/80 border border-ftx-lime/50 text-[10px] font-mono font-bold text-ftx-lime tracking-widest uppercase ftx-squircle-sm backdrop-blur-md shadow-lg">
                                    FLAGSHIP SERVICE
                                </div>
                                <div className="text-4xl font-mono font-black text-white/60 group-hover:text-ftx-lime transition-colors drop-shadow-lg">
                                    01
                                </div>
                            </div>

                            {/* Bottom Row: Title, Description & Badges */}
                            <div className="relative z-20 space-y-4 pt-16 mt-auto">
                                <h3 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors drop-shadow-xl">
                                    PAINT PROTECTION FILM
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-200 font-body leading-relaxed max-w-xl drop-shadow-md">
                                    Self-healing, invisible shield against rock chips, scratches, and environmental contaminants. The ultimate armor for your vehicle's paintwork.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5 text-white bg-ftx-black/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20 shadow-lg">
                                        <span className="text-ftx-lime">⚡</span> ULTRA-CLEAR
                                    </span>
                                    <span className="flex items-center gap-1.5 text-white bg-ftx-black/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20 shadow-lg">
                                        <span className="text-ftx-lime">❖</span> SELF-HEALING
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>

                    {/* Right Column: Stacked Cards (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {/* Top Card: Ceramic Coating (02) — REVEALS FROM RIGHT TO LEFT (Time 1: 180ms delay) */}
                        <ScrollReveal
                            type="horizontal"
                            direction="right"
                            delay={180}
                            duration={950}
                            className="flex-1 flex flex-col"
                        >
                            <Link
                                href={`/${locale}/services#ceramic`}
                                className="group relative overflow-hidden ftx-squircle-xl ftx-border-card bg-ftx-surface border border-ftx-surface-high w-full h-full min-h-[230px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
                            >
                                {/* Full-bleed Background Image Slideshow (7.5s View Time) */}
                                <AutoImageSlideshow images={CERAMIC_IMAGES} intervalMs={7500} offsetMs={2500} />

                                {/* Watermark Top Right */}
                                <div className="relative z-20 flex justify-end">
                                    <div className="text-3xl font-mono font-black text-white/60 group-hover:text-ftx-lime transition-colors drop-shadow-lg">
                                        02
                                    </div>
                                </div>

                                {/* Title & Description Bottom */}
                                <div className="relative z-20 space-y-2 pt-8 mt-auto">
                                    <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors drop-shadow-xl">
                                        CERAMIC COATING
                                    </h3>
                                    <p className="text-xs text-gray-200 font-body leading-relaxed drop-shadow-md">
                                        Extreme hydrophobic gloss and UV protection for years of effortless maintenance.
                                    </p>
                                </div>
                            </Link>
                        </ScrollReveal>

                        {/* Bottom Card: Pro Detailing (03) — REVEALS FROM RIGHT TO LEFT (Time 2: 380ms delay) */}
                        <ScrollReveal
                            type="horizontal"
                            direction="right"
                            delay={380}
                            duration={950}
                            className="flex-1 flex flex-col"
                        >
                            <Link
                                href={`/${locale}/services#detailing`}
                                className="group relative overflow-hidden ftx-squircle-xl ftx-border-card bg-ftx-surface border border-ftx-surface-high w-full h-full min-h-[230px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
                            >
                                {/* Full-bleed Background Image Slideshow (7.5s View Time) */}
                                <AutoImageSlideshow images={DETAILING_IMAGES} intervalMs={7500} offsetMs={5000} />

                                {/* Watermark Top Right */}
                                <div className="relative z-20 flex justify-end">
                                    <div className="text-3xl font-mono font-black text-white/60 group-hover:text-ftx-lime transition-colors drop-shadow-lg">
                                        03
                                    </div>
                                </div>

                                {/* Title, Description & CTA Arrow Bottom */}
                                <div className="relative z-20 flex items-end justify-between gap-4 pt-8 mt-auto">
                                    <div className="space-y-1 max-w-[80%]">
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors drop-shadow-xl">
                                            PRO DETAILING
                                        </h3>
                                        <p className="text-xs text-gray-200 font-body leading-relaxed drop-shadow-md">
                                            Surgical precision interior & exterior restoration.
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-full bg-ftx-black/80 border border-white/20 flex items-center justify-center text-white group-hover:bg-ftx-lime group-hover:text-ftx-black transition-all duration-300 shrink-0 backdrop-blur-md shadow-lg">
                                        <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
