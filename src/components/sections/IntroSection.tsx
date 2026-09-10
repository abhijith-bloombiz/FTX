"use client";

import Image from "next/image";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface IntroSectionProps {
    locale: Locale;
    messages: any;
}

export function IntroSection({ locale, messages }: IntroSectionProps) {
    return (
        <section id="about" className="py-12 sm:py-16 bg-black relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Bottom Left - Desktop Only for GPU Optimization) */}
            <div
                className="absolute bottom-0 left-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0 hidden sm:block"
                style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">
                    {/* Copy (First on Mobile, Right on Desktop) */}
                    <div className="order-1 lg:order-2 lg:col-span-7 space-y-6">
                        <ScrollReveal type="editorial" delay={120} duration={1100}>
                            <div className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                                {messages.intro.badge}
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight mt-2">
                                {messages.intro.title}
                            </h2>

                            <div className="space-y-4 text-sm text-ftx-silver font-body leading-relaxed mt-4">
                                <p>{messages.intro.p1}</p>
                                <p>{messages.intro.p2}</p>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Image Grid with Overlapping Badge (Desktop-parity on Mobile) */}
                    <div className="order-2 lg:order-1 lg:col-span-5 relative w-full pr-4 pb-4 sm:pr-6 sm:pb-6">
                        <ScrollReveal type="horizontal" direction="left" delay={0} duration={1200}>
                            <div className="relative w-full aspect-[4/3] ftx-squircle-lg border border-ftx-surface-high shadow-2xl overflow-hidden bg-ftx-obsidian">
                                <Image
                                    src={messages.intro?.image || "/images/about/craftsmanship.jpg"}
                                    alt="FTX Precision Studio Craftsmanship"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 45vw"
                                    quality={92}
                                    decoding="async"
                                    loading="lazy"
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-[10px] -right-[10px] z-20 w-40 sm:w-48 bg-ftx-surface/95 backdrop-blur-md border border-ftx-lime/40 ftx-squircle-sm p-3 sm:p-4 shadow-2xl">
                                <div className="text-[10px] font-mono text-ftx-lime uppercase tracking-wider font-bold">
                                    {messages.intro?.badgeTitle || "SURGICAL PRECISION"}
                                </div>
                                <div className="text-xs text-ftx-silver mt-1 font-body leading-tight">
                                    {messages.intro?.badgeSub || "Climate-Controlled Studio Bays"}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
