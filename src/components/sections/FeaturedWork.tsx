"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { galleryData, getVehicleLabel } from "@/data/gallery";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Lightbox } from "@/components/ui/Lightbox";
import { ViewportVideo } from "@/components/ui/ViewportVideo";
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

    // Track the 4 active item indices for slot 0, 1, 2, 3
    const [slotIndices, setSlotIndices] = useState<number[]>([0, 1, 2, 3]);
    const [fadingSlots, setFadingSlots] = useState<number[]>([]);

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
    const availableItems = allGalleryItems.filter((g) => !isBeforeAfterItem(g));
    const beforeAfterItem = allGalleryItems.find((g) => isBeforeAfterItem(g));

    const getTitle = (item: any) => {
        if (!item?.title) return "";
        if (typeof item.title === "string") return item.title;
        return item.title[locale] || item.title.en || "";
    };

    const getItemImage = (item: any) => {
        if (!item) return "/images/gallery/ppf-studio-hero.jpg";
        return item.image || item.src || item.coverImage || "/images/gallery/ppf-studio-hero.jpg";
    };

    const getItemVideo = (item: any) => {
        if (!item) return null;
        if (item.video) return item.video;
        if (item.videoUrl) return item.videoUrl;
        if (typeof item.image === "string" && (item.image.endsWith(".mp4") || item.image.endsWith(".webm"))) return item.image;
        if (typeof item.src === "string" && (item.src.endsWith(".mp4") || item.src.endsWith(".webm"))) return item.src;
        return null;
    };

    // Helper to initialize slot indices with unique items and non-duplicate assets
    useEffect(() => {
        if (availableItems.length === 0) return;

        const selected: number[] = [];
        const usedAssets = new Set<string>();

        for (let i = 0; i < availableItems.length && selected.length < 4; i++) {
            const item = availableItems[i];
            const assetKey = getItemVideo(item) || getItemImage(item);
            if (!usedAssets.has(assetKey)) {
                usedAssets.add(assetKey);
                selected.push(i);
            }
        }

        for (let i = 0; i < availableItems.length && selected.length < 4; i++) {
            if (!selected.includes(i)) {
                selected.push(i);
            }
        }

        while (selected.length < 4) {
            selected.push(0);
        }

        setSlotIndices(selected);
    }, [availableItems.length]);

    const [isIdle, setIsIdle] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(true);

    // 1. Viewport Awareness: Only run image rotation when section is in view
    useEffect(() => {
        if (!sectionRef.current || typeof window === "undefined" || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Scroll Detector: Pause image rotation while scrolling, set idle after 2.5s of no scroll
    useEffect(() => {
        if (typeof window === "undefined") return;

        let scrollTimer: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            setIsIdle(false);
            if (scrollTimer) clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {
                setIsIdle(true);
            }, 2500);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, []);

    // Helper to find the next item index for a slot that avoids index and asset collisions with active slots
    const getNextUniqueIndex = (
        slotIndex: number,
        currentSlots: number[],
        items: any[],
        excludedAssetKeys: Set<string>
    ): number => {
        if (items.length <= 1) return 0;
        const currentIdx = currentSlots[slotIndex] ?? slotIndex;

        for (let step = 1; step <= items.length; step++) {
            const candidateIdx = (currentIdx + step) % items.length;
            const candidateItem = items[candidateIdx];
            const assetKey = getItemVideo(candidateItem) || getItemImage(candidateItem);

            const isUsedInOtherSlot = currentSlots.some((idx, sIdx) => sIdx !== slotIndex && idx === candidateIdx);
            const isAssetDuplicate = excludedAssetKeys.has(assetKey);

            if (!isUsedInOtherSlot && !isAssetDuplicate) {
                return candidateIdx;
            }
        }

        // Fallback: pick next index not currently used in another slot
        for (let step = 1; step <= items.length; step++) {
            const candidateIdx = (currentIdx + step) % items.length;
            if (!currentSlots.some((idx, sIdx) => sIdx !== slotIndex && idx === candidateIdx)) {
                return candidateIdx;
            }
        }

        return (currentIdx + 1) % items.length;
    };

    // 3. Paired Image Auto-Switch:
    // Pair 1 (Card 1 & Card 4: slots 0 & 3) rotates every 6s
    // Pair 2 (Card 2 & Card 3: slots 1 & 2) rotates every 6s, delayed by 3s
    useEffect(() => {
        if (availableItems.length <= 4 || !isInView || !isIdle) return;

        let interval1: NodeJS.Timeout;
        let interval2: NodeJS.Timeout;
        let timeout2: NodeJS.Timeout;
        let fadeTimeout1: NodeJS.Timeout;
        let fadeTimeout2: NodeJS.Timeout;

        const triggerPair1 = () => {
            setFadingSlots([0, 3]);
            fadeTimeout1 = setTimeout(() => {
                setSlotIndices((prev) => {
                    const next = [...prev];

                    const otherAssets = new Set<string>();
                    [1, 2].forEach((s) => {
                        const item = availableItems[next[s]];
                        if (item) otherAssets.add(getItemVideo(item) || getItemImage(item));
                    });

                    const next0 = getNextUniqueIndex(0, next, availableItems, otherAssets);
                    next[0] = next0;

                    const item0 = availableItems[next0];
                    if (item0) otherAssets.add(getItemVideo(item0) || getItemImage(item0));

                    const next3 = getNextUniqueIndex(3, next, availableItems, otherAssets);
                    next[3] = next3;

                    return next;
                });
                setFadingSlots([]);
            }, 400);
        };

        const triggerPair2 = () => {
            setFadingSlots([1, 2]);
            fadeTimeout2 = setTimeout(() => {
                setSlotIndices((prev) => {
                    const next = [...prev];

                    const otherAssets = new Set<string>();
                    [0, 3].forEach((s) => {
                        const item = availableItems[next[s]];
                        if (item) otherAssets.add(getItemVideo(item) || getItemImage(item));
                    });

                    const next1 = getNextUniqueIndex(1, next, availableItems, otherAssets);
                    next[1] = next1;

                    const item1 = availableItems[next1];
                    if (item1) otherAssets.add(getItemVideo(item1) || getItemImage(item1));

                    const next2 = getNextUniqueIndex(2, next, availableItems, otherAssets);
                    next[2] = next2;

                    return next;
                });
                setFadingSlots([]);
            }, 400);
        };

        interval1 = setInterval(triggerPair1, 6000);

        timeout2 = setTimeout(() => {
            triggerPair2();
            interval2 = setInterval(triggerPair2, 6000);
        }, 3000);

        return () => {
            clearInterval(interval1);
            clearTimeout(timeout2);
            if (interval2) clearInterval(interval2);
            if (fadeTimeout1) clearTimeout(fadeTimeout1);
            if (fadeTimeout2) clearTimeout(fadeTimeout2);
        };
    }, [availableItems.length, isInView, isIdle]);

    const renderCardSlot = (slotIndex: number, colSpanClass: string, direction: "left" | "right", delay: number) => {
        const itemIdx = (slotIndices[slotIndex] ?? slotIndex) % (availableItems.length || 1);
        const item = availableItems[itemIdx] || availableItems[0];
        const isFading = fadingSlots.includes(slotIndex);

        if (!item) return null;

        const videoSrc = getItemVideo(item);

        return (
            <ScrollReveal type="horizontal" direction={direction} delay={delay} duration={850} className={colSpanClass}>
                <div
                    onClick={() => setActiveLightboxIndex(itemIdx)}
                    className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface relative overflow-hidden h-[160px] sm:h-[250px] shadow-lg transition-all duration-500 hover:-translate-y-1"
                >
                    <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
                        {videoSrc ? (
                            <ViewportVideo
                                src={videoSrc}
                                poster={getItemImage(item)}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${isFading ? "opacity-20 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"
                                    }`}
                            />
                        ) : (
                            <img
                                src={getItemImage(item)}
                                alt={getTitle(item)}
                                decoding="async"
                                loading="lazy"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${isFading ? "opacity-20 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"
                                    }`}
                            />
                        )}
                        <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-ftx-black via-ftx-black/80 to-transparent p-3 sm:p-5 z-10">
                            <h4 className={`text-xs sm:text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-all duration-500 leading-tight line-clamp-1 ${isFading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                                }`}>
                                {getTitle(item)}
                            </h4>
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        );
    };

    return (
        <section ref={sectionRef} id="ourwork" className="py-10 sm:py-12 bg-black relative overflow-hidden">
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
                                <span className="hidden sm:inline-block px-3 py-1 bg-ftx-obsidian text-[10px] font-mono text-ftx-silver border border-ftx-surface-high ftx-squircle-sm self-start md:self-auto">
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
                    {renderCardSlot(0, "col-span-6 sm:col-span-5", "left", 0)}

                    {/* Row 1, Card 2: 60% Width (7 Columns) */}
                    {renderCardSlot(1, "col-span-6 sm:col-span-7", "right", 100)}

                    {/* Row 2, Card 3: 60% Width (7 Columns) */}
                    {renderCardSlot(2, "col-span-6 sm:col-span-7", "left", 200)}

                    {/* Row 2, Card 4: 40% Width (5 Columns) */}
                    {renderCardSlot(3, "col-span-6 sm:col-span-5", "right", 300)}
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            {activeLightboxIndex !== null && availableItems[activeLightboxIndex] && (
                <Lightbox
                    item={availableItems[activeLightboxIndex]}
                    locale={locale}
                    onClose={() => setActiveLightboxIndex(null)}
                    onPrev={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === 0 ? availableItems.length - 1 : (prev as number) - 1
                        )
                    }
                    onNext={() =>
                        setActiveLightboxIndex((prev) =>
                            prev === availableItems.length - 1 ? 0 : (prev as number) + 1
                        )
                    }
                />
            )}
        </section>
    );
}
