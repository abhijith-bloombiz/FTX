"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Loader2 } from "lucide-react";
import { galleryData, getVehicleLabel } from "@/data/gallery";
import { GalleryCategory, MediaTypeFilter } from "@/types/gallery";
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
    const [allGalleryItems, setAllGalleryItems] = useState<any[]>(galleryData);
    const [loading, setLoading] = useState(true);
    const [activeMediaType, setActiveMediaType] = useState<MediaTypeFilter>("all");
    const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/admin/gallery")
            .then((res) => res.json())
            .then((data) => {
                if (data.gallery && data.gallery.length > 0) {
                    setAllGalleryItems(data.gallery);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const mediaTypes: { id: MediaTypeFilter; label: string }[] = [
        { id: "all", label: locale === "ar" ? "جميع الوسائط" : "ALL MEDIA" },
        { id: "image", label: locale === "ar" ? "الصور" : "IMAGES" },
        { id: "video", label: locale === "ar" ? "الفيديوهات" : "VIDEOS" },
    ];

    const categories: { id: GalleryCategory; label: string }[] = [
        { id: "all", label: locale === "ar" ? "جميع الأعمال" : "ALL WORK" },
        { id: "ppf", label: locale === "ar" ? "أفلام الحماية" : "PPF" },
        { id: "ceramic", label: locale === "ar" ? "طلاء السيراميك" : "CERAMIC" },
        { id: "detailing", label: locale === "ar" ? "العناية والتلميع" : "DETAILING" },
    ];

    const filteredItems = allGalleryItems.filter((item) => {
        // 1. Media Format Filter
        if (activeMediaType === "image" && (item.isVideo || item.video)) return false;
        if (activeMediaType === "video" && !item.isVideo && !item.video) return false;

        // 2. Service Category Filter
        if (activeCategory !== "all" && item.category !== activeCategory) return false;

        return true;
    });

    const beforeAfterItem = allGalleryItems.find((g) => g.category === "before-after");

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div
                className="absolute top-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
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
                    mediaTypes={mediaTypes}
                    activeMediaType={activeMediaType}
                    onSelectMediaType={(media) => setActiveMediaType(media)}
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => setActiveCategory(cat)}
                    layoutMode={layoutMode}
                    onLayoutChange={(mode) => setLayoutMode(mode)}
                />

                {/* Interactive Stitch Asymmetric Grid Showcase */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-ftx-surface/20 border border-ftx-surface-high/40 ftx-squircle-xl">
                        <div className="p-3 rounded-full bg-ftx-lime/10 border border-ftx-lime/30 text-ftx-lime shadow-lime-glow">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <p className="text-xs font-mono text-ftx-silver uppercase tracking-widest animate-pulse">
                            {locale === "ar" ? "جاري تحميل الوسائط من قاعدة البيانات..." : "LOADING GALLERY MEDIA FROM DATABASE..."}
                        </p>
                    </div>
                ) : (
                    <div key={`${activeCategory}-${activeMediaType}-${layoutMode}`} className="animate-grid-reveal">
                        {layoutMode === "grid" ? (
                            <div className="space-y-8">
                                {/* Top Row: Main Feature (8 cols) + Tall Hydrophobic Card (4 cols) */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                    {/* Top Left Main Feature Card (1st: Video Showcase) */}
                                    <ScrollReveal type="horizontal" direction="left" delay={0} className="lg:col-span-8 flex flex-col h-full">
                                        <div
                                            onClick={() => setActiveLightboxIndex(0)}
                                            className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] sm:min-h-[460px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                        >
                                            <Image
                                                src={filteredItems[0]?.image || "/images/gallery/ppf-studio-hero.jpg"}
                                                alt={filteredItems[0]?.title[locale] || "PROJECT: STEALTH"}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                priority
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/40 to-transparent" />

                                            {/* Top Badge for Static Images */}
                                            {!(filteredItems[0]?.isVideo || filteredItems[0]?.video) && (
                                                <div className="absolute top-6 right-6 z-10">
                                                    <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                        {filteredItems[0] ? getVehicleLabel(filteredItems[0].vehicle, locale) : ""}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Center Play Button Overlay for Videos */}
                                            {(filteredItems[0]?.isVideo || filteredItems[0]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-16 h-16 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-7 h-7 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h2 className="text-xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight line-clamp-2">
                                                    {filteredItems[0]?.title[locale] || (locale === "ar" ? "مشروع: ستيلث" : "PROJECT: STEALTH")}
                                                </h2>
                                                <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase line-clamp-1">
                                                    {filteredItems[0]?.description[locale] || (locale === "ar" ? "لامبورغيني أفينتادور SVJ • تغليف كامل XPEL STEALTH" : "LAMBORGHINI AVENTADOR SVJ • FULL BODY XPEL STEALTH")}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollReveal>

                                    {/* Top Right Tall Hydrophobic Card (2nd: Video Showcase) */}
                                    <ScrollReveal type="horizontal" direction="right" delay={120} className="lg:col-span-4 flex flex-col h-full">
                                        <div
                                            onClick={() => setActiveLightboxIndex(1)}
                                            className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] sm:min-h-[460px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                        >
                                            <Image
                                                src={filteredItems[1]?.image || "/images/gallery/ceramic-beading.jpg"}
                                                alt={filteredItems[1]?.title[locale] || "Hydrophobic Mastery"}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge for Static Images */}
                                            {!(filteredItems[1]?.isVideo || filteredItems[1]?.video) && (
                                                <div className="absolute top-6 right-6 z-10">
                                                    <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                        {filteredItems[1] ? getVehicleLabel(filteredItems[1].vehicle, locale) : ""}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Center Play Button Overlay for Videos */}
                                            {(filteredItems[1]?.isVideo || filteredItems[1]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                                    {filteredItems[1]?.title[locale]}
                                                </h3>
                                                <p className="text-xs text-ftx-silver-muted font-body leading-relaxed line-clamp-3">
                                                    {filteredItems[1]?.description[locale]}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                </div>

                                {/* Bottom Row: 4 cols card + 8 cols Wide card */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                    {/* Bottom Left Card (3rd item: Image Showcase) */}
                                    <ScrollReveal type="horizontal" direction="left" delay={200} className="lg:col-span-4 flex flex-col h-full">
                                        <div
                                            onClick={() => setActiveLightboxIndex(2)}
                                            className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[320px] sm:min-h-[380px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                        >
                                            <Image
                                                src={filteredItems[2]?.image || "/images/services/ppf-main.png"}
                                                alt={filteredItems[2]?.title[locale] || "Porsche 911 GT3 RS"}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge */}
                                            <div className="absolute top-6 right-6 z-10">
                                                <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                    {filteredItems[2] ? getVehicleLabel(filteredItems[2].vehicle, locale) : "PORSCHE 911 GT3 RS"}
                                                </div>
                                            </div>

                                            {/* Center Play Button Overlay for Videos */}
                                            {(filteredItems[2]?.isVideo || filteredItems[2]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-1">
                                                <span className="text-[10px] font-mono font-bold text-ftx-lime uppercase tracking-widest block">
                                                    {filteredItems[2] ? getVehicleLabel(filteredItems[2].vehicle, locale) : "PORSCHE 911 GT3 RS"}
                                                </span>
                                                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                                    {filteredItems[2]?.title[locale]}
                                                </h3>
                                            </div>
                                        </div>
                                    </ScrollReveal>

                                    {/* Bottom Right Wide Card (4th item: Image Showcase) */}
                                    <ScrollReveal type="horizontal" direction="right" delay={280} className="lg:col-span-8 flex flex-col h-full">
                                        <div
                                            onClick={() => setActiveLightboxIndex(3)}
                                            className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[320px] sm:min-h-[380px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-colors duration-300"
                                        >
                                            <Image
                                                src={filteredItems[3]?.image || "/images/services/detailing-main.png"}
                                                alt={filteredItems[3]?.title[locale] || "Hypercar Gloss Matrix"}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge */}
                                            <div className="absolute top-6 right-6 z-10">
                                                <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                    {filteredItems[3] ? getVehicleLabel(filteredItems[3].vehicle, locale) : "HYPERCAR GLOSS MATRIX"}
                                                </div>
                                            </div>

                                            {/* Center Play Button Overlay for Videos */}
                                            {(filteredItems[3]?.isVideo || filteredItems[3]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                                                    {filteredItems[3]?.title[locale] || (locale === "ar" ? "تصحيح الطلاء" : "PAINT CORRECTION")}
                                                </h3>
                                                <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase line-clamp-2 max-w-2xl">
                                                    {filteredItems[3]?.description[locale]}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                </div>

                                {/* Additional dynamic cards if filteredItems has more than 4 items */}
                                {filteredItems.length > 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
                                        {filteredItems.slice(4).map((item, subIdx) => {
                                            const actualIndex = subIdx + 4;
                                            const isVideoItem = item.isVideo || item.video;
                                            return (
                                                <ScrollReveal
                                                    key={item.id}
                                                    type="card"
                                                    delay={(subIdx % 3) * 100}
                                                    className="h-full flex flex-col"
                                                >
                                                    <div
                                                        onClick={() => setActiveLightboxIndex(actualIndex)}
                                                        className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-all duration-300"
                                                    >
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title[locale]}
                                                            fill
                                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                                        {/* Top Badge for Static Images */}
                                                        {!isVideoItem && (
                                                            <div className="absolute top-6 right-6 z-10">
                                                                <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                                    {getVehicleLabel(item.vehicle, locale)}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Center Play Button Overlay for Videos */}
                                                        {isVideoItem && (
                                                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                                <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                                    <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Bottom Content */}
                                                        <div className="relative z-10 space-y-2">
                                                            <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                                                {item.title[locale]}
                                                            </h3>
                                                            <p className="text-xs text-ftx-silver-muted font-mono tracking-wider uppercase line-clamp-2">
                                                                {item.description[locale]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ScrollReveal>
                                            );
                                        })}
                                    </div>
                                )}
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
                                                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-2.5 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                    {getVehicleLabel(item.vehicle, locale)}
                                                </div>
                                                {(item.isVideo || item.video) && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-ftx-black/30 group-hover:bg-ftx-black/10 transition-colors">
                                                        <div className="w-12 h-12 rounded-full bg-ftx-lime/90 text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform">
                                                            <Play className="w-5 h-5 fill-ftx-black ml-0.5" />
                                                        </div>
                                                    </div>
                                                )}
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
                                                {getVehicleLabel(beforeAfterItem.vehicle, locale)}
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
                                        alt={getVehicleLabel(beforeAfterItem.vehicle, locale)}
                                    />
                                </div>
                            </ScrollReveal>
                        )}

                        {/* Stitch Bottom Button: • LOAD MORE */}
                        <div className="mt-16 text-center">
                            <button className="ftx-btn-tech inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-obsidian hover:bg-ftx-surface border border-ftx-surface-high transition-all duration-300">
                                <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow animate-pulse" />
                                <span>{locale === "ar" ? "تحميل المزيد" : "LOAD MORE"}</span>
                            </button>
                        </div>
                    </div>
                )}

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
        </div>
    );
}
