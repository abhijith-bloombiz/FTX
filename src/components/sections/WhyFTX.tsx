"use client";

import Image from "next/image";
import { Shield, Sparkles, Award, Zap } from "lucide-react";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface WhyFTXProps {
    locale: Locale;
    messages: any;
}

export function WhyFTX({ locale, messages }: WhyFTXProps) {
    const pillars = [
        {
            icon: Zap,
            title: messages.whyFtx.v1Title,
            desc: messages.whyFtx.v1Desc,
            image: "/images/pillars/precision.jpg",
        },
        {
            icon: Shield,
            title: messages.whyFtx.v2Title,
            desc: messages.whyFtx.v2Desc,
            image: "/images/pillars/protection.jpg",
        },
        {
            icon: Award,
            title: messages.whyFtx.v3Title,
            desc: messages.whyFtx.v3Desc,
            image: "/images/pillars/craftsmanship.jpg",
        },
        {
            icon: Sparkles,
            title: messages.whyFtx.v4Title,
            desc: messages.whyFtx.v4Desc,
            image: "/images/pillars/performance.jpg",
        },
    ];

    return (
        <section id="packages" className="py-24 bg-ftx-obsidian relative overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left max-w-3xl mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                        <span>{messages.whyFtx.badge}</span>
                    </div>
                    <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                        <span>{messages.whyFtx.title}</span>
                    </TextReveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((item, idx) => {
                        const IconComponent = item.icon;

                        return (
                            <ScrollReveal key={idx} type="card" delay={idx * 100} duration={850}>
                                <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface/60 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 h-full shadow-lg">
                                    {/* Image Cover */}
                                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                        <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                        <h3 className="text-lg font-heading font-bold text-white uppercase tracking-wide group-hover:text-ftx-lime transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
