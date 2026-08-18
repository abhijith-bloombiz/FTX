"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { galleryData } from "@/data/gallery";
import { GalleryCategory } from "@/types/gallery";
import { GalleryFilter } from "@/components/ui/GalleryFilter";
import { Lightbox } from "@/components/ui/Lightbox";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface GalleryPageProps {
    params: { locale: Locale };
}

export default function GalleryPage({ params: { locale } }: GalleryPageProps) {
    const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

    const categories: { id: GalleryCategory; label: string }[] = [
        { id: "all", label: "ALL WORK" },
        { id: "ppf", label: "PPF" },
        { id: "ceramic", label: "CERAMIC" },
        { id: "detailing", label: "DETAILING" },
    ];

    const filteredItems =
        activeCategory === "all"
            ? galleryData
            : galleryData.filter((item) => item.category === activeCategory);

    const beforeAfterItem = galleryData.find((g) => g.category === "before-after");

    return (
        <div className="pt-24 pb-24 bg-ftx-black min-h-screen">
            {/* Stitch Header: BUILT TO BE SEEN */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal type="editorial">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-ftx-surface-high/60">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase mb-4">
                                <span className="w-5 h-0.5 bg-ftx-lime" />
                                <span>THE GALLERY</span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-heading font-black text-white uppercase tracking-tight leading-[0.95]">
                                BUILT TO <br />
                                <span className="text-ftx-lime">BE SEEN.</span>
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-ftx-silver max-w-md font-body leading-relaxed">
                            A showcase of our most demanding projects. Where raw engineering meets flawless execution.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Filter and Layout Switcher */}
                <GalleryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => setActiveCategory(cat)}
                    layoutMode={layoutMode}
                    onLayoutChange={(mode) => setLayoutMode(mode)}
                />

                {/* Interactive Stitch Asymmetric Grid Showcase */}
                {layoutMode === "grid" ? (
                    <div className="space-y-8">
                        {/* Top Row: Main Feature (8 cols) + Tall Hydrophobic Card (4 cols) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Top Left Main Feature Card */}
                            <ScrollReveal type="scale" className="lg:col-span-8">
                                <div
                                    onClick={() => setActiveLightboxIndex(0)}
                                    className="ftx-border-card ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-8 shadow-2xl"
                                >
                                    <Image
                                        src="/images/gallery/ppf-studio-hero.jpg"
                                        alt="PROJECT: STEALTH - Lamborghini Aventador SVJ"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-103"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/40 to-transparent" />

                                    {/* Top Badge */}
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                        CERAMIC + PPF
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-2">
                                        <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                                            PROJECT: STEALTH
                                        </h2>
                                        <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase">
                                            LAMBORGHINI AVENTADOR SVJ • FULL BODY XPEL STEALTH
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Top Right Tall Hydrophobic Card */}
                            <ScrollReveal type="scale" delay={120} className="lg:col-span-4">
                                <div
                                    onClick={() => setActiveLightboxIndex(1)}
                                    className="ftx-border-card ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high h-full min-h-[380px] flex flex-col justify-end p-8 shadow-2xl"
                                >
                                    <Image
                                        src="/images/gallery/ceramic-beading.jpg"
                                        alt="Hydrophobic Mastery - 10H Ceramic Coating"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-103"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                    {/* Top Badge */}
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                        DETAILING
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                            HYDROPHOBIC MASTERY
                                        </h3>
                                        <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                            Multi-stage paint correction followed by our signature 10H ceramic coating application.
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Bottom Row: Interior Restoration Card (4 cols) + Paint Correction Wide Split (8 cols) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Bottom Left Card: McLaren 720S Interior */}
                            <ScrollReveal type="scale" delay={200} className="lg:col-span-4">
                                <div
                                    onClick={() => setActiveLightboxIndex(4)}
                                    className="ftx-border-card ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high min-h-[320px] sm:min-h-[360px] flex flex-col justify-end p-8 shadow-2xl"
                                >
                                    <Image
                                        src="/images/services/ppf-main.png"
                                        alt="McLaren 720S Interior Restoration"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-103"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-1">
                                        <span className="text-[10px] font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                            INTERIOR RESTORATION
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                            MCLAREN 720S
                                        </h3>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Bottom Right Wide Card: Paint Correction Split Showcase */}
                            <ScrollReveal type="scale" delay={280} className="lg:col-span-8">
                                <div className="ftx-border-card ftx-squircle-xl group bg-ftx-surface relative overflow-hidden border border-ftx-surface-high min-h-[320px] sm:min-h-[360px] grid grid-cols-1 sm:grid-cols-2 shadow-2xl">
                                    {/* Content Side */}
                                    <div className="p-8 flex flex-col justify-between bg-ftx-surface/90 relative z-10 space-y-6">
                                        <div className="space-y-3">
                                            <div className="w-8 h-1 bg-ftx-lime" />
                                            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                                                PAINT CORRECTION
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed max-w-sm">
                                                Resurfacing heavy defects to reveal flawless, show-quality reflections.
                                            </p>
                                        </div>

                                        <Link
                                            href={`/${locale}/services`}
                                            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ftx-lime hover:text-ftx-lime-bright uppercase tracking-wider group/link"
                                        >
                                            <span>VIEW PROCESS</span>
                                            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                        </Link>
                                    </div>

                                    {/* Split Image Side */}
                                    <div className="relative w-full h-full min-h-[220px]">
                                        <Image
                                            src="/images/services/detailing-main.png"
                                            alt="Paint Correction Process"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-ftx-surface via-transparent to-transparent hidden sm:block" />
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                ) : (
                    /* List Mode Grid Fallback */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredItems.map((item, index) => (
                            <ScrollReveal key={item.id} type="scale" delay={(index % 2) * 120}>
                                <div
                                    onClick={() => setActiveLightboxIndex(index)}
                                    className="ftx-border-card ftx-squircle-xl group cursor-pointer bg-ftx-surface border border-ftx-surface-high overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col sm:flex-row"
                                >
                                    <div className="relative w-full sm:w-1/2 aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title[locale]}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 px-2.5 py-1 bg-ftx-obsidian/90 border border-ftx-lime/30 text-[10px] font-mono text-ftx-lime uppercase ftx-squircle-sm">
                                            {item.vehicle}
                                        </div>
                                    </div>

                                    <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-3">
                                        <div>
                                            <h3 className="text-base font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {item.title[locale]}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body line-clamp-3 mt-2">
                                                {item.description[locale]}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-mono text-ftx-lime uppercase">
                                            VIEW HIGHLIGHTS &rarr;
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Before & After Interactive Showcase Section if present */}
                {beforeAfterItem && (
                    <div className="mt-16 bg-ftx-surface p-5 sm:p-6 ftx-squircle-xl border border-ftx-surface-high shadow-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                    {beforeAfterItem.vehicle}
                                </span>
                                <h3 className="text-xl font-heading font-bold text-white uppercase mt-0.5">
                                    {beforeAfterItem.title[locale]}
                                </h3>
                            </div>
                            <span className="px-3 py-1 bg-ftx-obsidian text-[10px] font-mono text-ftx-silver border border-ftx-surface-high ftx-squircle-sm self-start sm:self-auto">
                                SLIDE TO COMPARE
                            </span>
                        </div>

                        <BeforeAfterSlider
                            beforeImage={beforeAfterItem.beforeImage!}
                            afterImage={beforeAfterItem.afterImage!}
                            alt={beforeAfterItem.vehicle}
                        />
                    </div>
                )}

                {/* Stitch Bottom Button: • LOAD MORE PROJECTS */}
                <div className="mt-16 text-center">
                    <button className="ftx-btn-tech inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-obsidian hover:bg-ftx-surface border border-ftx-surface-high transition-all duration-300">
                        <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow animate-pulse" />
                        <span>LOAD MORE PROJECTS</span>
                    </button>
                </div>
            </div>

            {/* Lightbox Modal */}
            {activeLightboxIndex !== null && (
                <Lightbox
                    item={filteredItems[activeLightboxIndex] || galleryData[0]}
                    locale={locale}
                    onClose={() => setActiveLightboxIndex(null)}
                    onPrev={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === 0 ? filteredItems.length - 1 : (prev as number) - 1
                        )
                    }
                    onNext={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === filteredItems.length - 1 ? 0 : (prev as number) + 1
                        )
                    }
                />
            )}
        </div>
    );
}
