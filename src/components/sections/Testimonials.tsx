"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface TestimonialsProps {
    locale: Locale;
    messages: any;
}

export function Testimonials({ locale, messages }: TestimonialsProps) {
    return (
        <section className="pt-14 pb-24 bg-ftx-obsidian relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left max-w-3xl mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                        <span>{messages.testimonials.badge}</span>
                    </div>
                    <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                        <span>{messages.testimonials.title}</span>
                    </TextReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((item, index) => (
                        <ScrollReveal key={item.id} type="card" delay={index * 140} duration={850}>
                            <div className="ftx-border-card ftx-squircle-xl pt-6 pb-10 px-8 sm:pt-7 sm:pb-12 sm:px-10 min-h-[300px] bg-ftx-surface flex flex-col justify-between relative group hover:border-ftx-lime/40 transition-all duration-500 hover:-translate-y-1.5 h-full shadow-2xl">
                                <Quote className="absolute top-8 right-8 w-10 h-10 text-ftx-lime/10 group-hover:text-ftx-lime/20 transition-colors z-10" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-1 text-ftx-lime">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-ftx-lime" />
                                        ))}
                                    </div>

                                    <p className="text-xs sm:text-sm text-ftx-silver font-body leading-relaxed italic">
                                        "{item.content[locale]}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-ftx-surface-high">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-ftx-lime/40 shrink-0">
                                        <img
                                            src={item.avatar}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono font-bold text-white uppercase">
                                            {item.name}
                                        </div>
                                        <div className="text-[10px] font-mono text-ftx-lime">
                                            {item.role[locale]} • {item.vehicle}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
