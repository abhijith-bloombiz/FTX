"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface ServicesGridProps {
    locale: Locale;
    messages: any;
}

export function ServicesGrid({ locale, messages }: ServicesGridProps) {
    return (
        <section id="services" className="py-10 sm:py-12 bg-black relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Bottom Right - Desktop Only for GPU Optimization) */}
            <div
                className="absolute bottom-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            <span>{messages?.servicesSection?.badge || messages?.services?.badge || "CORE SERVICES"}</span>
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                            <span>{messages?.servicesSection?.title || "WORLD-CLASS PROTECTION & DETAILING"}</span>
                        </TextReveal>
                    </div>

                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ftx-silver hover:text-white uppercase tracking-wider transition-colors group/link self-start sm:self-auto"
                    >
                        <span>{messages?.common?.viewAllServices || messages?.common?.exploreServices || "VIEW ALL SERVICES"}</span>
                        <ArrowRight className="w-4 h-4 text-ftx-lime transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                </div>

                {/* 2-Column Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Main Card 01: Paint Protection Film (7 columns on desktop) */}
                    <ScrollReveal
                        type="card"
                        delay={0}
                        duration={750}
                        className="lg:col-span-7 flex flex-col h-full"
                    >
                        <Link
                            href={`/${locale}/services#ppf`}
                            className="group relative overflow-hidden ftx-squircle-xl bg-[#131313] border border-white/10 min-h-[480px] sm:min-h-[520px] h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl transition-[transform,border-color,box-shadow] duration-500 hover:border-ftx-lime/50 hover:-translate-y-1"
                        >
                            {/* Full-Bleed Background Image Container */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
                                <img
                                    src="/images/gallery/gt3rs-ppf.jpg"
                                    alt="Paint Protection Film"
                                    decoding="async"
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                />
                                {/* Gradient Overlay for High-Contrast Typography */}
                                <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/80 to-ftx-black/30 z-10" />
                            </div>

                            {/* Top Header Overlay: Badge & Index Number (01) */}
                            <div className="relative z-20 flex items-center justify-between">
                                <div className="px-3.5 py-1.5 bg-ftx-black/90 border border-ftx-lime/50 text-[10px] font-mono font-bold text-ftx-lime tracking-widest uppercase ftx-squircle-sm shadow-lg">
                                    {messages?.servicesSection?.flagship || "FLAGSHIP SERVICE"}
                                </div>
                                <div className="text-3xl sm:text-4xl font-mono font-black text-white/50 group-hover:text-ftx-lime transition-colors">
                                    01
                                </div>
                            </div>

                            {/* Bottom Content Overlay */}
                            <div className="relative z-20 flex items-end justify-between gap-6 mt-auto">
                                <div className="space-y-2 max-w-xl">
                                    <h3 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors">
                                        {messages?.servicesSection?.ppfTitle || "PAINT PROTECTION FILM (PPF)"}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-300 font-body leading-relaxed">
                                        {messages?.servicesSection?.ppfDesc ||
                                            "Self-healing, invisible shield against rock chips, scratches, and environmental contaminants. Preserves factory finish with ultra-durable protection."}
                                    </p>
                                </div>

                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-ftx-lime flex items-center justify-center text-ftx-lime bg-ftx-black/80 group-hover:bg-ftx-lime group-hover:text-ftx-black transition-all duration-300 shrink-0 shadow-lg mb-1">
                                    <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>

                    {/* Right Stacked Cards (5 columns on desktop) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full justify-between">
                        {/* Card 02: Ceramic Coating */}
                        <ScrollReveal
                            type="card"
                            delay={100}
                            duration={750}
                            className="flex-1 flex flex-col h-full"
                        >
                            <Link
                                href={`/${locale}/services#ceramic`}
                                className="group relative overflow-hidden ftx-squircle-xl bg-[#131313] border border-white/10 min-h-[235px] sm:min-h-[245px] flex flex-col justify-between p-5 sm:p-6 shadow-2xl transition-[transform,border-color,box-shadow] duration-500 hover:border-ftx-lime/50 hover:-translate-y-1 h-full"
                            >
                                {/* Full-Bleed Background Image Container */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
                                    <img
                                        src="/images/services/ceramic-main.png"
                                        alt="Ceramic Coating"
                                        decoding="async"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    {/* Gradient Overlay for Typography Contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/80 to-ftx-black/20 z-10" />
                                </div>

                                {/* Top Header Overlay: Index Number (02) */}
                                <div className="relative z-20 flex items-center justify-end">
                                    <span className="text-2xl sm:text-3xl font-mono font-black text-white/50 group-hover:text-ftx-lime transition-colors">
                                        02
                                    </span>
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="relative z-20 flex items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors">
                                            {messages?.servicesSection?.ceramicTitle || "CERAMIC COATING"}
                                        </h3>
                                        <p className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-wider">
                                            {messages?.servicesSection?.premiumProtection || "PREMIUM PROTECTION"}
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border border-ftx-lime flex items-center justify-center text-ftx-lime bg-ftx-black/80 group-hover:bg-ftx-lime group-hover:text-ftx-black transition-all duration-300 shadow-lg shrink-0">
                                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>

                        {/* Card 03: Pro Detailing */}
                        <ScrollReveal
                            type="card"
                            delay={200}
                            duration={750}
                            className="flex-1 flex flex-col h-full"
                        >
                            <Link
                                href={`/${locale}/services#detailing`}
                                className="group relative overflow-hidden ftx-squircle-xl bg-[#131313] border border-white/10 min-h-[235px] sm:min-h-[245px] flex flex-col justify-between p-5 sm:p-6 shadow-2xl transition-[transform,border-color,box-shadow] duration-500 hover:border-ftx-lime/50 hover:-translate-y-1 h-full"
                            >
                                {/* Full-Bleed Background Image Container */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
                                    <img
                                        src="/images/gallery/g63-after.jpg"
                                        alt="Pro Detailing"
                                        decoding="async"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    {/* Gradient Overlay for Typography Contrast */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/80 to-ftx-black/20 z-10" />
                                </div>

                                {/* Top Header Overlay: Index Number (03) */}
                                <div className="relative z-20 flex items-center justify-end">
                                    <span className="text-2xl sm:text-3xl font-mono font-black text-white/50 group-hover:text-ftx-lime transition-colors">
                                        03
                                    </span>
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="relative z-20 flex items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight group-hover:text-ftx-lime transition-colors">
                                            {messages?.servicesSection?.detailingTitle || "PRO DETAILING"}
                                        </h3>
                                        <p className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-wider">
                                            {messages?.servicesSection?.expertRestoration || "EXPERT RESTORATION"}
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-full border border-ftx-lime flex items-center justify-center text-ftx-lime bg-ftx-black/80 group-hover:bg-ftx-lime group-hover:text-ftx-black transition-all duration-300 shadow-lg shrink-0">
                                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
