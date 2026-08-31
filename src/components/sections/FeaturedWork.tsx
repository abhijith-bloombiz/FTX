"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { galleryData, getVehicleLabel } from "@/data/gallery";
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

    const featuredItems = galleryData.filter((g) => !g.isVideo).slice(0, 3);
    const beforeAfterItem = galleryData.find((g) => g.category === "before-after");

    return (
        <section id="ourwork" className="py-10 sm:py-12 bg-black relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Bottom Right) */}
            <div
                className="absolute bottom-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Row with Masked Text Reveal */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
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
                    <ScrollReveal type="card" delay={0} duration={850} className="mb-8">
                        <div className="bg-ftx-surface p-5 sm:p-6 ftx-squircle-xl border border-ftx-surface-high shadow-2xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {messages.beforeAfter.badge}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase mt-1">
                                        {messages.beforeAfter.title}
                                    </h3>
                                </div>
                                <span className="px-3 py-1 bg-ftx-obsidian text-[10px] font-mono text-ftx-silver border border-ftx-surface-high ftx-squircle-sm self-start md:self-auto">
                                    {messages.beforeAfter?.slideToCompare || (locale === "ar" ? "اسحب للمقارنة" : "SLIDE TO COMPARE")}
                                </span>
                            </div>

                            <BeforeAfterSlider
                                beforeImage={beforeAfterItem.beforeImage}
                                afterImage={beforeAfterItem.afterImage}
                                beforeLabel={messages.beforeAfter.before}
                                afterLabel={messages.beforeAfter.after}
                                alt={getVehicleLabel(beforeAfterItem.vehicle, locale)}
                            />
                        </div>
                    </ScrollReveal>
                )}

                {/* Modern Asymmetric Cards Layout: 2 Left Cards (Stacked) + 1 Right Card (Tall Hero) - Mobile & Desktop */}
                <div className="grid grid-cols-12 gap-3 sm:gap-6 items-stretch">
                    {/* Left Column: 2 Stacked Cards */}
                    <div className="col-span-6 sm:col-span-7 flex flex-col gap-3 sm:gap-6 justify-between">
                        {/* Card 1 (Top Left) */}
                        <ScrollReveal type="horizontal" direction="left" delay={0} duration={850} className="w-full">
                            <div
                                onClick={() => setActiveLightboxIndex(0)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[135px] sm:h-[230px] shadow-lg flex flex-col justify-end transition-all duration-500 hover:-translate-y-1"
                            >
                                <Image
                                    src={featuredItems[0].image}
                                    alt={featuredItems[0].title[locale]}
                                    fill
                                    decoding="async"
                                    loading="lazy"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                />
                                <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-2 sm:p-5 z-10">
                                    <h4 className="text-[10px] sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight">
                                        {featuredItems[0].title[locale]}
                                    </h4>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Card 2 (Bottom Left) */}
                        <ScrollReveal type="horizontal" direction="left" delay={120} duration={850} className="w-full">
                            <div
                                onClick={() => setActiveLightboxIndex(1)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[135px] sm:h-[230px] shadow-lg flex flex-col justify-end transition-all duration-500 hover:-translate-y-1"
                            >
                                <Image
                                    src={featuredItems[1].image}
                                    alt={featuredItems[1].title[locale]}
                                    fill
                                    decoding="async"
                                    loading="lazy"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                />
                                <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-2 sm:p-5 z-10">
                                    <h4 className="text-[10px] sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight">
                                        {featuredItems[1].title[locale]}
                                    </h4>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: 1 Tall Hero Card */}
                    <div className="col-span-6 sm:col-span-5 flex flex-col h-full">
                        <ScrollReveal type="horizontal" direction="right" delay={240} duration={850} className="w-full h-full">
                            <div
                                onClick={() => setActiveLightboxIndex(2)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden min-h-[282px] sm:min-h-full h-full shadow-lg flex flex-col justify-end transition-all duration-500 hover:-translate-y-1"
                            >
                                <Image
                                    src={featuredItems[2].image}
                                    alt={featuredItems[2].title[locale]}
                                    fill
                                    decoding="async"
                                    loading="lazy"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                />
                                <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-2.5 sm:p-6 z-10 space-y-0.5 sm:space-y-2">
                                    <span className="text-[8px] sm:text-[10px] font-mono text-ftx-lime uppercase tracking-widest font-bold">
                                        {locale === "ar" ? "مشروع مميز" : "FEATURED HIGHLIGHT"}
                                    </span>
                                    <h4 className="text-[11px] sm:text-2xl font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight">
                                        {featuredItems[2].title[locale]}
                                    </h4>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
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
