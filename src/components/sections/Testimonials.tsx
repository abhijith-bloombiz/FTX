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
        <section className="py-10 sm:py-12 bg-black relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Bottom Left) */}
            <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_bottom_left,rgba(164,214,94,0.18),transparent_70%)] pointer-events-none z-0" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left max-w-3xl mb-8 space-y-3">
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
                            <div className="ftx-btn-specular bg-ftx-surface border border-ftx-surface-high ftx-squircle-xl pt-3.5 pb-5 px-6 sm:pt-4 sm:pb-6 sm:px-8 flex flex-col justify-between relative group hover:border-ftx-lime/50 hover:shadow-[0_0_30px_rgba(164,214,94,0.22)] transition-all duration-500 h-full">
                                <Quote className="absolute top-4 right-6 w-8 h-8 text-ftx-lime/10 group-hover:text-ftx-lime/20 transition-colors z-10" />

                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center gap-1 text-ftx-lime">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-ftx-lime" />
                                        ))}
                                    </div>

                                    <p className="text-xs sm:text-sm text-ftx-silver font-body leading-relaxed italic">
                                        "{item.content[locale]}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-ftx-surface-high relative z-10">
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-ftx-lime/40 shrink-0">
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
