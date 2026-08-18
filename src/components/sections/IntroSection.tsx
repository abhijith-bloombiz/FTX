"use client";

import Image from "next/image";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface IntroSectionProps {
    locale: Locale;
    messages: any;
}

export function IntroSection({ locale, messages }: IntroSectionProps) {
    return (
        <section id="about" className="py-10 sm:py-12 bg-ftx-obsidian relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Image Grid */}
                    <ScrollReveal type="card" duration={850} className="lg:col-span-5 relative">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-ftx-surface-high shadow-xl group">
                            <Image
                                src="/images/about/craftsmanship.jpg"
                                alt="FTX Precision Studio Craftsmanship"
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 hidden sm:block w-48 h-32 bg-ftx-surface border border-ftx-lime/40 rounded p-4 shadow-2xl">
                            <div className="text-[10px] font-mono text-ftx-lime uppercase tracking-wider font-bold">
                                SURGICAL PRECISION
                            </div>
                            <div className="text-xs text-ftx-silver mt-1 font-body">
                                Climate-Controlled Studio Bays
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Copy */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            {messages.intro.badge}
                        </div>

                        <TextReveal as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight">
                            <span>{messages.intro.title}</span>
                        </TextReveal>

                        <ScrollReveal type="editorial" delay={150} duration={850} className="space-y-4 text-sm text-ftx-silver font-body leading-relaxed">
                            <p>{messages.intro.p1}</p>
                            <p>{messages.intro.p2}</p>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
