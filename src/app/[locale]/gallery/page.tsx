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
import { PageHeader } from "@/components/ui/PageHeader";
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
        { id: "all", label: locale === "ar" ? "جميع الأعمال" : "ALL WORK" },
        { id: "ppf", label: locale === "ar" ? "أفلام الحماية" : "PPF" },
        { id: "ceramic", label: locale === "ar" ? "طلاء السيراميك" : "CERAMIC" },
        { id: "detailing", label: locale === "ar" ? "العناية والتلميع" : "DETAILING" },
    ];

    const filteredItems =
        activeCategory === "all"
            ? galleryData
            : galleryData.filter((item) => item.category === activeCategory);

    const beforeAfterItem = galleryData.find((g) => g.category === "before-after");

    return (
        <div className="pt-24 pb-0 bg-ftx-black min-h-screen">
            {/* Global Synchronized Header: BUILT TO BE SEEN. */}
            <PageHeader
                badge={locale === "ar" ? "معرض الأعمال" : "THE GALLERY"}
                titleLine1={locale === "ar" ? "صُنعت لتُشاهد" : "BUILT TO"}
                titleLine2={locale === "ar" ? "." : "BE SEEN."}
                subtitle={
                    locale === "ar"
                        ? "معرض لأحدث مشاريعنا وأكثرها متطلباً، حيث تلتقي الهندسة الدقيقة بالتنفيذ المثالي."
                        : "A showcase of our most demanding projects. Where raw engineering meets flawless execution."
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10 sm:pb-12">
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
                            {/* Top Left Main Feature Card (1st: From Left) */}
                            <ScrollReveal type="horizontal" direction="left" delay={0} className="lg:col-span-8 flex flex-col h-full">
                                <div
                                    onClick={() => setActiveLightboxIndex(0)}
                                    className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] sm:min-h-[460px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                >
                                    <Image
                                        src="/images/gallery/ppf-studio-hero.jpg"
                                        alt="PROJECT: STEALTH - Lamborghini Aventador SVJ"
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/40 to-transparent" />

                                    {/* Top Badge */}
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                        {locale === "ar" ? "سيراميك + PPF" : "CERAMIC + PPF"}
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-2">
                                        <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                                            {locale === "ar" ? "مشروع: ستيلث" : "PROJECT: STEALTH"}
                                        </h2>
                                        <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase">
                                            {locale === "ar" ? "لامبورغيني أفينتادور SVJ • تغليف كامل XPEL STEALTH" : "LAMBORGHINI AVENTADOR SVJ • FULL BODY XPEL STEALTH"}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Top Right Tall Hydrophobic Card (2nd: From Right) */}
                            <ScrollReveal type="horizontal" direction="right" delay={120} className="lg:col-span-4 flex flex-col h-full">
                                <div
                                    onClick={() => setActiveLightboxIndex(1)}
                                    className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] sm:min-h-[460px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                >
                                    <Image
                                        src="/images/gallery/ceramic-beading.jpg"
                                        alt="Hydrophobic Mastery - 10H Ceramic Coating"
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                    {/* Top Badge */}
                                    <div className="absolute top-6 right-6 px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                        {locale === "ar" ? "العناية والتلميع" : "DETAILING"}
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                            {locale === "ar" ? "إتقان طرد المياه" : "HYDROPHOBIC MASTERY"}
                                        </h3>
                                        <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                            {locale === "ar"
                                                ? "تصحيح طلاء متعدد المراحل متبوع بطبقة نانو سيراميك 10H الشاملة."
                                                : "Multi-stage paint correction followed by our signature 10H ceramic coating application."}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Bottom Row: Interior Restoration Card (4 cols) + Paint Correction Wide Split (8 cols) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            {/* Bottom Left Card: McLaren 720S Interior (3rd: From Left) */}
                            <ScrollReveal type="horizontal" direction="left" delay={200} className="lg:col-span-4 flex flex-col h-full">
                                <div
                                    onClick={() => setActiveLightboxIndex(4)}
                                    className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[320px] sm:min-h-[380px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                >
                                    <Image
                                        src="/images/services/ppf-main.png"
                                        alt="McLaren 720S Interior Restoration"
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                    {/* Bottom Content */}
                                    <div className="relative z-10 space-y-1">
                                        <span className="text-[10px] font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                            {locale === "ar" ? "تجديد المقصورة الداخلية" : "INTERIOR RESTORATION"}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                            MCLAREN 720S
                                        </h3>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Bottom Right Wide Card: Paint Correction Split Showcase (4th: From Right) */}
                            <ScrollReveal type="horizontal" direction="right" delay={280} className="lg:col-span-8 flex flex-col h-full">
                                <div className="ftx-squircle-xl group bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[320px] sm:min-h-[380px] h-full grid grid-cols-1 sm:grid-cols-2 shadow-2xl transition-colors duration-300">
                                    {/* Content Side */}
                                    <div className="p-8 sm:p-10 flex flex-col justify-between bg-ftx-surface/90 relative z-10 space-y-6">
                                        <div className="space-y-3">
                                            <div className="w-8 h-1 bg-ftx-lime" />
                                            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                                                {locale === "ar" ? "تصحيح الطلاء" : "PAINT CORRECTION"}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body leading-relaxed max-w-sm">
                                                {locale === "ar"
                                                    ? "معالجة الخدوش والعيوب العميقة لاستعادة اللمعان البصري الفائق."
                                                    : "Resurfacing heavy defects to reveal flawless, show-quality reflections."}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/${locale}/services`}
                                            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-ftx-lime hover:text-ftx-lime-bright uppercase tracking-wider group/link"
                                        >
                                            <span>{locale === "ar" ? "عرض خطوات العمل" : "VIEW PROCESS"}</span>
                                            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                        </Link>
                                    </div>

                                    {/* Split Image Side */}
                                    <div className="relative w-full h-full min-h-[220px]">
                                        <Image
                                            src="/images/services/detailing-main.png"
                                            alt="Paint Correction Process"
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-ftx-surface via-transparent to-transparent hidden sm:block" />
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                ) : (
                    /* List Mode Grid Fallback */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {filteredItems.map((item, index) => (
                            <ScrollReveal
                                key={item.id}
                                type="horizontal"
                                direction={index % 2 === 0 ? "left" : "right"}
                                delay={(index % 2) * 120}
                                className="h-full flex flex-col"
                            >
                                <div
                                    onClick={() => setActiveLightboxIndex(index)}
                                    className="ftx-squircle-xl group cursor-pointer bg-ftx-surface border border-ftx-surface-high hover:border-ftx-lime/40 overflow-hidden transition-colors duration-300 shadow-2xl flex flex-col sm:flex-row h-full min-h-[220px] sm:min-h-[240px]"
                                >
                                    <div className="relative w-full sm:w-1/2 min-h-[200px] sm:min-h-full overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title[locale]}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 px-2.5 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                            {item.vehicle}
                                        </div>
                                    </div>

                                    <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-3 h-full">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">
                                                {item.title[locale]}
                                            </h3>
                                            <p className="text-xs text-ftx-silver-muted font-body line-clamp-3 mt-2">
                                                {item.description[locale]}
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-ftx-lime uppercase tracking-wider flex items-center gap-1 group-hover:text-ftx-lime-bright transition-colors">
                                            <span>{locale === "ar" ? "عرض التفاصيل" : "VIEW HIGHLIGHTS"}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* Before & After Interactive Showcase Section if present */}
                {beforeAfterItem && beforeAfterItem.beforeImage && beforeAfterItem.afterImage && (
                    <ScrollReveal type="card" delay={0} duration={850} className="mt-16">
                        <div className="bg-ftx-surface p-5 sm:p-6 ftx-squircle-xl border border-ftx-surface-high shadow-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                <div>
                                    <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                                        {beforeAfterItem.vehicle}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase mt-1">
                                        {beforeAfterItem.title[locale]}
                                    </h3>
                                </div>
                                <span className="px-3 py-1 bg-ftx-obsidian text-[10px] font-mono text-ftx-silver border border-ftx-surface-high ftx-squircle-sm self-start sm:self-auto">
                                    {locale === "ar" ? "اسحب للمقارنة" : "SLIDE TO COMPARE"}
                                </span>
                            </div>

                            <BeforeAfterSlider
                                beforeImage={beforeAfterItem.beforeImage}
                                afterImage={beforeAfterItem.afterImage}
                                beforeLabel={locale === "ar" ? "قبل" : "BEFORE"}
                                afterLabel={locale === "ar" ? "بعد" : "AFTER"}
                                alt={beforeAfterItem.vehicle}
                            />
                        </div>
                    </ScrollReveal>
                )}

                {/* Stitch Bottom Button: • LOAD MORE PROJECTS */}
                <div className="mt-16 text-center">
                    <button className="ftx-btn-tech inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-obsidian hover:bg-ftx-surface border border-ftx-surface-high transition-all duration-300">
                        <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow animate-pulse" />
                        <span>{locale === "ar" ? "تحميل المزيد من المشاريع" : "LOAD MORE PROJECTS"}</span>
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
