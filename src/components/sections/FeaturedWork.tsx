"use client";

import { useState, useEffect } from "react";
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

let cachedFeaturedGallery: any[] | null = null;

export function FeaturedWork({ locale, messages }: FeaturedWorkProps) {
    const [allGalleryItems, setAllGalleryItems] = useState<any[]>(cachedFeaturedGallery || galleryData);
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/admin/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (data.gallery && data.gallery.length > 0) {
                    cachedFeaturedGallery = data.gallery;
                    setAllGalleryItems(data.gallery);
                }
            })
            .catch(() => { });
    }, []);

    const isBeforeAfterItem = (g: any) => g.category === "before-after" || g.isBeforeAfter || (g.beforeImage && g.afterImage);
    const featuredItems = allGalleryItems.filter((g) => !g.isVideo && !isBeforeAfterItem(g)).slice(0, 4);
    if (featuredItems.length < 4) {
        const remaining = allGalleryItems.filter((g) => !isBeforeAfterItem(g) && !featuredItems.some((f) => f.id === g.id));
        featuredItems.push(...remaining.slice(0, 4 - featuredItems.length));
    }
    const beforeAfterItem = allGalleryItems.find((g) => isBeforeAfterItem(g));

    const getTitle = (item: any) => {
        if (!item?.title) return "";
        if (typeof item.title === "string") return item.title;
        return item.title[locale] || item.title.en || "";
    };

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

                {/* 4-Grid Asymmetric Layout: Row 1 (40% / 60%), Row 2 (60% / 40%) */}
                <div className="grid grid-cols-12 gap-3 sm:gap-6 items-stretch">
                    {/* Row 1, Card 1: 40% Width (5 Columns) */}
                    {featuredItems[0] && (
                        <ScrollReveal type="horizontal" direction="left" delay={0} duration={850} className="col-span-6 sm:col-span-5">
                            <div
                                onClick={() => setActiveLightboxIndex(0)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[160px] sm:h-[250px] shadow-lg transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
                                    <Image
                                        src={featuredItems[0].image || "/images/gallery/ppf-studio-hero.jpg"}
                                        alt={getTitle(featuredItems[0])}
                                        fill
                                        decoding="async"
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-3 sm:p-5 z-10">
                                        <h4 className="text-xs sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight line-clamp-1">
                                            {getTitle(featuredItems[0])}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Row 1, Card 2: 60% Width (7 Columns) */}
                    {featuredItems[1] && (
                        <ScrollReveal type="horizontal" direction="right" delay={100} duration={850} className="col-span-6 sm:col-span-7">
                            <div
                                onClick={() => setActiveLightboxIndex(1)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[160px] sm:h-[250px] shadow-lg transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
                                    <Image
                                        src={featuredItems[1].image || "/images/gallery/ppf-studio-hero.jpg"}
                                        alt={getTitle(featuredItems[1])}
                                        fill
                                        decoding="async"
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-3 sm:p-5 z-10">
                                        <h4 className="text-xs sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight line-clamp-1">
                                            {getTitle(featuredItems[1])}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Row 2, Card 3: 60% Width (7 Columns) */}
                    {featuredItems[2] && (
                        <ScrollReveal type="horizontal" direction="left" delay={200} duration={850} className="col-span-6 sm:col-span-7">
                            <div
                                onClick={() => setActiveLightboxIndex(2)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[160px] sm:h-[250px] shadow-lg transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
                                    <Image
                                        src={featuredItems[2].image || "/images/gallery/ppf-studio-hero.jpg"}
                                        alt={getTitle(featuredItems[2])}
                                        fill
                                        decoding="async"
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-3 sm:p-5 z-10">
                                        <h4 className="text-xs sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight line-clamp-1">
                                            {getTitle(featuredItems[2])}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Row 2, Card 4: 40% Width (5 Columns) */}
                    {featuredItems[3] && (
                        <ScrollReveal type="horizontal" direction="right" delay={300} duration={850} className="col-span-6 sm:col-span-5">
                            <div
                                onClick={() => setActiveLightboxIndex(3)}
                                className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[160px] sm:h-[250px] shadow-lg transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
                                    <Image
                                        src={featuredItems[3].image || "/images/gallery/ppf-studio-hero.jpg"}
                                        alt={getTitle(featuredItems[3])}
                                        fill
                                        decoding="async"
                                        loading="lazy"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black/95 via-ftx-black/75 to-transparent backdrop-blur-sm p-3 sm:p-5 z-10">
                                        <h4 className="text-xs sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors leading-tight line-clamp-1">
                                            {getTitle(featuredItems[3])}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )}
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
