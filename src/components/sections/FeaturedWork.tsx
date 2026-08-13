"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { galleryData } from "@/data/gallery";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Lightbox } from "@/components/ui/Lightbox";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TextReveal } from "@/components/motion/TextReveal";

interface FeaturedWorkProps {
    locale: Locale;
    messages: any;
}

export function FeaturedWork({ locale, messages }: FeaturedWorkProps) {
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

    const featuredItems = galleryData.slice(0, 3);
    const beforeAfterItem = galleryData.find((g) => g.category === "before-after");

    return (
        <section id="ourwork" className="py-24 bg-ftx-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row with Masked Text Reveal */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <div className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            {messages.gallery.heroTitle}
                        </div>
                        <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight mt-2">
                            <span>{messages.nav.gallery}</span>
                        </TextReveal>
                    </div>

                    <Link
                        href={`/${locale}/gallery`}
                        className="ftx-btn-specular inline-flex items-center gap-2 px-5 py-3 text-xs font-mono font-bold tracking-wider text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high clip-button transition-colors self-start md:self-auto"
                    >
                        <span>{messages.common.viewGallery}</span>
                        <ArrowUpRight className="w-4 h-4 text-ftx-lime" />
                    </Link>
                </div>

                {/* Interactive Before/After Showcase */}
                {beforeAfterItem && beforeAfterItem.beforeImage && beforeAfterItem.afterImage && (
                    <ScrollReveal type="card" delay={0} duration={850} className="mb-16">
                        <div className="bg-ftx-surface p-6 sm:p-8 ftx-squircle-xl border border-ftx-surface-high shadow-2xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {messages.beforeAfter.badge}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase mt-1">
                                        {messages.beforeAfter.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-ftx-silver-muted max-w-md font-body">
                                    {messages.beforeAfter.subtitle}
                                </p>
                            </div>

                            <BeforeAfterSlider
                                beforeImage={beforeAfterItem.beforeImage}
                                afterImage={beforeAfterItem.afterImage}
                                beforeLabel={messages.beforeAfter.before}
                                afterLabel={messages.beforeAfter.after}
                                alt={beforeAfterItem.vehicle}
                            />
                        </div>
                    </ScrollReveal>
                )}

                {/* 3 Featured Cards Grid with Phenomenon Stagger */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredItems.map((item, index) => (
                        <ScrollReveal key={item.id} type="card" delay={index * 120} duration={850}>
                            <div
                                onClick={() => setActiveLightboxIndex(index)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 h-full shadow-lg"
                            >
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title[locale]}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-transparent to-transparent opacity-80" />

                                    <div className="absolute top-4 left-4 px-2.5 py-1 bg-ftx-obsidian/90 border border-ftx-lime/30 text-[10px] font-mono text-ftx-lime uppercase rounded">
                                        {item.vehicle}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h4 className="text-base font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                        {item.title[locale]}
                                    </h4>
                                    <p className="text-xs text-ftx-silver-muted mt-2 font-body line-clamp-2">
                                        {item.description[locale]}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {activeLightboxIndex !== null && (
                <Lightbox
                    item={featuredItems[activeLightboxIndex]}
                    locale={locale}
                    onClose={() => setActiveLightboxIndex(null)}
                    onPrev={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === 0 ? featuredItems.length - 1 : (prev as number) - 1
                        )
                    }
                    onNext={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === featuredItems.length - 1 ? 0 : (prev as number) + 1
                        )
                    }
                />
            )}
        </section>
    );
}
