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
import { ViewportVideo } from "@/components/ui/ViewportVideo";
import { PageHeader } from "@/components/ui/PageHeader";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface GalleryPageProps {
    params: { locale: Locale };
}

let cachedGalleryItems: any[] | null = null;
let cachedServicesItems: any[] | null = null;

export default function GalleryPage({ params: { locale } }: GalleryPageProps) {
    const [allGalleryItems, setAllGalleryItems] = useState<any[]>(cachedGalleryItems || galleryData);
    const [allServices, setAllServices] = useState<any[]>(cachedServicesItems || []);
    const [loading, setLoading] = useState(!cachedGalleryItems && galleryData.length === 0);
    const [activeMediaType, setActiveMediaType] = useState<MediaTypeFilter>("all");
    const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
    const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(10);

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/gallery").then((res) => res.json()).catch(() => ({})),
            fetch("/api/admin/services").then((res) => res.json()).catch(() => ({})),
        ])
            .then(([galData, srvData]) => {
                if (galData.gallery && galData.gallery.length > 0) {
                    cachedGalleryItems = galData.gallery;
                    setAllGalleryItems(galData.gallery);
                }
                if (srvData.services && srvData.services.length > 0) {
                    cachedServicesItems = srvData.services;
                    setAllServices(srvData.services);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const mediaTypes: { id: MediaTypeFilter; label: string }[] = [
        { id: "all", label: locale === "ar" ? "جميع الوسائط" : "ALL MEDIA" },
        { id: "image", label: locale === "ar" ? "الصور" : "IMAGES" },
        { id: "video", label: locale === "ar" ? "الفيديوهات" : "VIDEOS" },
    ];

    const defaultCategories: { id: GalleryCategory; label: string }[] = [
        { id: "all", label: locale === "ar" ? "جميع الأعمال" : "ALL WORK" },
        { id: "ppf", label: locale === "ar" ? "أفلام الحماية" : "PPF" },
        { id: "ceramic", label: locale === "ar" ? "طلاء السيراميك" : "CERAMIC" },
        { id: "detailing", label: locale === "ar" ? "العناية والتلميع" : "DETAILING" },
    ];

    const categories: { id: GalleryCategory; label: string }[] = allServices.length > 0
        ? [
            { id: "all", label: locale === "ar" ? "جميع الأعمال" : "ALL WORK" },
            ...allServices.map((srv: any) => {
                const id = srv.serviceId || srv.id;
                const label = typeof srv.title === "object"
                    ? (srv.title[locale] || srv.title.en || srv.title.ar)
                    : (srv.title || (typeof srv.name === "object" ? srv.name[locale] || srv.name.en : srv.name)) || id;
                return { id, label };
            }),
        ]
        : defaultCategories;

    const filteredItems = allGalleryItems.filter((item) => {
        // Exclude before/after items from standard gallery cards (they belong in the dedicated Before & After section)
        if (item.category === "before-after" || item.isBeforeAfter || (item.beforeImage && item.afterImage)) return false;

        // 1. Media Format Filter
        if (activeMediaType === "image" && (item.isVideo || item.video)) return false;
        if (activeMediaType === "video" && !item.isVideo && !item.video) return false;

        // 2. Service Category Filter
        if (activeCategory !== "all" && item.category !== activeCategory) return false;

        return true;
    });

    const visibleItems = filteredItems.slice(0, visibleCount);
    const hasMore = visibleCount < filteredItems.length;

    const getItemImage = (item: any) => {
        if (item?.image && typeof item.image === "string" && !item.image.endsWith(".mp4") && !item.image.endsWith(".webm") && item.image.trim().length > 0) {
            return item.image;
        }
        return "/images/gallery/ppf-studio-hero.jpg";
    };

    const getItemVideo = (item: any) => {
        if (!item) return null;
        if (item.video) return item.video;
        if (item.videoUrl) return item.videoUrl;
        if (typeof item.image === "string" && (item.image.endsWith(".mp4") || item.image.endsWith(".webm"))) return item.image;
        if (typeof item.src === "string" && (item.src.endsWith(".mp4") || item.src.endsWith(".webm"))) return item.src;
        return null;
    };

    const beforeAfterItem = allGalleryItems.find((g) => g.category === "before-after" || g.isBeforeAfter || (g.beforeImage && g.afterImage));

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-2 pb-10 sm:pb-12">
                {/* Filter and Layout Switcher */}
                <GalleryFilter
                    mediaTypes={mediaTypes}
                    activeMediaType={activeMediaType}
                    onSelectMediaType={(media) => {
                        setActiveMediaType(media);
                        setVisibleCount(10);
                    }}
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => {
                        setActiveCategory(cat);
                        setVisibleCount(10);
                    }}
                    layoutMode={layoutMode}
                    onLayoutChange={(mode) => setLayoutMode(mode)}
                />

                {/* Interactive Stitch Asymmetric Grid Showcase Skeleton Loader */}
                {loading ? (
                    <div className="space-y-8 animate-pulse">
                        {/* Top Row Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            <div className="lg:col-span-8 bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl min-h-[380px] sm:min-h-[460px] p-8 sm:p-10 flex flex-col justify-end space-y-4">
                                <div className="h-5 bg-ftx-surface-high/60 rounded w-1/4" />
                                <div className="h-9 bg-ftx-surface-high/50 rounded w-2/3" />
                                <div className="h-4 bg-ftx-surface-high/30 rounded w-1/2" />
                            </div>
                            <div className="lg:col-span-4 bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl min-h-[380px] sm:min-h-[460px] p-8 sm:p-10 flex flex-col justify-end space-y-4">
                                <div className="h-5 bg-ftx-surface-high/60 rounded w-1/3" />
                                <div className="h-7 bg-ftx-surface-high/50 rounded w-3/4" />
                                <div className="h-4 bg-ftx-surface-high/30 rounded w-full" />
                            </div>
                        </div>

                        {/* Bottom Row Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            <div className="lg:col-span-4 bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl min-h-[320px] sm:min-h-[380px] p-8 sm:p-10 flex flex-col justify-end space-y-3">
                                <div className="h-4 bg-ftx-surface-high/60 rounded w-1/3" />
                                <div className="h-7 bg-ftx-surface-high/50 rounded w-3/4" />
                            </div>
                            <div className="lg:col-span-8 bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl min-h-[320px] sm:min-h-[380px] p-8 sm:p-10 flex flex-col justify-end space-y-4">
                                <div className="h-5 bg-ftx-surface-high/60 rounded w-1/4" />
                                <div className="h-8 bg-ftx-surface-high/50 rounded w-1/2" />
                                <div className="h-4 bg-ftx-surface-high/30 rounded w-2/3" />
                            </div>
                        </div>
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
                                            {getItemVideo(visibleItems[0]) ? (
                                                <ViewportVideo
                                                    src={getItemVideo(visibleItems[0])!}
                                                    poster={getItemImage(visibleItems[0])}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <Image
                                                    src={getItemImage(visibleItems[0])}
                                                    alt={visibleItems[0]?.title?.[locale] || "PROJECT: STEALTH"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    priority
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/40 to-transparent" />

                                            {/* Top Badge for Static Images */}
                                            {!(visibleItems[0]?.isVideo || visibleItems[0]?.video) && (
                                                <div className="absolute top-6 right-6 z-10">
                                                    <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                        {visibleItems[0] ? getVehicleLabel(visibleItems[0].vehicle, locale) : ""}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Center Play Button Overlay for Videos */}
                                            {(visibleItems[0]?.isVideo || visibleItems[0]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-16 h-16 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-7 h-7 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h2 className="text-xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight line-clamp-2">
                                                    {visibleItems[0]?.title?.[locale] || (locale === "ar" ? "مشروع: ستيلث" : "PROJECT: STEALTH")}
                                                </h2>
                                                <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase line-clamp-1">
                                                    {visibleItems[0]?.description?.[locale] || (locale === "ar" ? "لامبورغيني أفينتادور SVJ • تغليف كامل XPEL STEALTH" : "LAMBORGHINI AVENTADOR SVJ • FULL BODY XPEL STEALTH")}
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
                                            {getItemVideo(visibleItems[1]) ? (
                                                <ViewportVideo
                                                    src={getItemVideo(visibleItems[1])!}
                                                    poster={getItemImage(visibleItems[1])}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <Image
                                                    src={getItemImage(visibleItems[1])}
                                                    alt={visibleItems[1]?.title?.[locale] || "Hydrophobic Mastery"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge for Static Images */}
                                            {!(visibleItems[1]?.isVideo || visibleItems[1]?.video) && (
                                                <div className="absolute top-6 right-6 z-10">
                                                    <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                        {visibleItems[1] ? getVehicleLabel(visibleItems[1].vehicle, locale) : ""}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Center Play Button Overlay for Videos */}
                                            {(visibleItems[1]?.isVideo || visibleItems[1]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                                    {visibleItems[1]?.title?.[locale]}
                                                </h3>
                                                <p className="text-xs text-ftx-silver-muted font-body leading-relaxed line-clamp-3">
                                                    {visibleItems[1]?.description?.[locale]}
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
                                            {getItemVideo(visibleItems[2]) ? (
                                                <ViewportVideo
                                                    src={getItemVideo(visibleItems[2])!}
                                                    poster={getItemImage(visibleItems[2])}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <Image
                                                    src={getItemImage(visibleItems[2])}
                                                    alt={visibleItems[2]?.title?.[locale] || "Porsche 911 GT3 RS"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge */}
                                            <div className="absolute top-6 right-6 z-10">
                                                <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                    {visibleItems[2] ? getVehicleLabel(visibleItems[2].vehicle, locale) : "PORSCHE 911 GT3 RS"}
                                                </div>
                                            </div>

                                            {/* Center Play Button Overlay for Videos */}
                                            {(visibleItems[2]?.isVideo || visibleItems[2]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-1">
                                                <span className="text-[10px] font-mono font-bold text-ftx-lime uppercase tracking-widest block">
                                                    {visibleItems[2] ? getVehicleLabel(visibleItems[2].vehicle, locale) : "PORSCHE 911 GT3 RS"}
                                                </span>
                                                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                                    {visibleItems[2]?.title?.[locale]}
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
                                            {getItemVideo(visibleItems[3]) ? (
                                                <ViewportVideo
                                                    src={getItemVideo(visibleItems[3])!}
                                                    poster={getItemImage(visibleItems[3])}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <Image
                                                    src={getItemImage(visibleItems[3])}
                                                    alt={visibleItems[3]?.title?.[locale] || "Hypercar Gloss Matrix"}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black via-ftx-black/50 to-transparent" />

                                            {/* Top Badge */}
                                            <div className="absolute top-6 right-6 z-10">
                                                <div className="px-3 py-1 bg-ftx-obsidian/90 border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime font-bold uppercase tracking-wider ftx-squircle-sm shadow-md">
                                                    {visibleItems[3] ? getVehicleLabel(visibleItems[3].vehicle, locale) : "HYPERCAR GLOSS MATRIX"}
                                                </div>
                                            </div>

                                            {/* Center Play Button Overlay for Videos */}
                                            {(visibleItems[3]?.isVideo || visibleItems[3]?.video) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                    <div className="w-14 h-14 rounded-full bg-ftx-lime text-ftx-black flex items-center justify-center shadow-lime-glow group-hover:scale-110 transition-transform duration-300">
                                                        <Play className="w-6 h-6 fill-ftx-black ml-1" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bottom Content */}
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
                                                    {visibleItems[3]?.title?.[locale] || (locale === "ar" ? "تصحيح الطلاء" : "PAINT CORRECTION")}
                                                </h3>
                                                <p className="text-xs sm:text-sm font-mono text-ftx-silver-muted tracking-wider uppercase line-clamp-2 max-w-2xl">
                                                    {visibleItems[3]?.description?.[locale]}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                </div>

                                {/* Additional dynamic cards if visibleItems has more than 4 items */}
                                {visibleItems.length > 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
                                        {visibleItems.slice(4).map((item, subIdx) => {
                                            const actualIndex = subIdx + 4;
                                            const isVideoItem = item.isVideo || item.video;
                                            return (
                                                <ScrollReveal
                                                    key={item._id || item.id || item.itemId || `gallery-grid-${subIdx}`}
                                                    type="card"
                                                    delay={(subIdx % 3) * 100}
                                                    className="h-full flex flex-col"
                                                >
                                                    <div
                                                        onClick={() => setActiveLightboxIndex(actualIndex)}
                                                        className="ftx-squircle-xl group cursor-pointer bg-ftx-surface relative overflow-hidden border border-ftx-surface-high hover:border-ftx-lime/40 min-h-[380px] h-full flex flex-col justify-end p-8 sm:p-10 shadow-2xl transition-all duration-300"
                                                    >
                                                        {getItemVideo(item) ? (
                                                            <ViewportVideo
                                                                src={getItemVideo(item)!}
                                                                poster={getItemImage(item)}
                                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <Image
                                                                src={getItemImage(item)}
                                                                alt={item.title?.[locale] || ""}
                                                                fill
                                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                            />
                                                        )}
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
                                                                {item.title?.[locale]}
                                                            </h3>
                                                            <p className="text-xs text-ftx-silver-muted font-mono tracking-wider uppercase line-clamp-2">
                                                                {item.description?.[locale]}
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
                                {visibleItems.map((item, index) => (
                                    <ScrollReveal
                                        key={item._id || item.id || item.itemId || `gallery-list-${index}`}
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
                                                {getItemVideo(item) ? (
                                                    <ViewportVideo
                                                        src={getItemVideo(item)!}
                                                        poster={getItemImage(item)}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={getItemImage(item)}
                                                        alt={item.title?.[locale] || ""}
                                                        fill
                                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    />
                                                )}
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
                                                        {item.title?.[locale]}
                                                    </h3>
                                                    <p className="text-xs text-ftx-silver-muted font-body line-clamp-3 mt-2">
                                                        {item.description?.[locale]}
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
                                                {locale === "ar" ? "عرض التغيير" : "TRANSFORMATION SHOWCASE"}
                                            </span>
                                            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase mt-1">
                                                {locale === "ar" ? "شاهد معايير FTX" : "WITNESS THE FTX STANDARD"}
                                            </h3>
                                        </div>
                                        <span className="hidden sm:inline-block px-3 py-1 bg-ftx-obsidian text-[10px] font-mono text-ftx-silver border border-ftx-surface-high ftx-squircle-sm self-start sm:self-auto">
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
                        {hasMore && (
                            <div className="mt-16 text-center">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 10)}
                                    className="ftx-btn-tech inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-obsidian hover:bg-ftx-surface border border-ftx-surface-high transition-all duration-300 group hover:border-ftx-lime/50 cursor-pointer"
                                >
                                    <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow animate-pulse group-hover:scale-125 transition-transform" />
                                    <span>{locale === "ar" ? "تحميل المزيد" : "LOAD MORE"}</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Lightbox Modal */}
                {activeLightboxIndex !== null && (
                    <Lightbox
                        item={visibleItems[activeLightboxIndex] || visibleItems[0]}
                        locale={locale}
                        onClose={() => setActiveLightboxIndex(null)}
                        onPrev={() =>
                            setActiveLightboxIndex((prev) =>
                                prev === 0 ? visibleItems.length - 1 : (prev as number) - 1
                            )
                        }
                        onNext={() =>
                            setActiveLightboxIndex((prev) =>
                                prev === visibleItems.length - 1 ? 0 : (prev as number) + 1
                            )
                        }
                    />
                )}
            </div>
        </div>
    );
}
