"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Sparkles, Wrench, Layers, Loader2, ArrowUpRight } from "lucide-react";
import { packagesData } from "@/data/packages";
import { PackageCard } from "@/components/ui/PackageCard";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface PackagesPageProps {
    params: { locale: Locale };
}

let cachedPackagesItems: any[] | null = null;
let cachedServicesItems: any[] | null = null;

function PackagesContent({ locale }: { locale: Locale }) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");

    const [allPackages, setAllPackages] = useState<any[]>(cachedPackagesItems || packagesData);
    const [allServices, setAllServices] = useState<any[]>(cachedServicesItems || []);
    const [loading, setLoading] = useState(!cachedPackagesItems && packagesData.length === 0);
    const [activeCategory, setActiveCategory] = useState<string>(() => categoryParam || "ppf");

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const firstSetRef = useRef<HTMLDivElement>(null);
    const isPausedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const wheelTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStartLeft, setScrollStartLeft] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);

    // Continuous smooth auto-scroll marquee loop
    useEffect(() => {
        let animId: number;
        const speed = 0.7; // pixels per frame (calibrated for smooth automotive banner glide)

        const tick = () => {
            if (
                !isPausedRef.current &&
                !isDraggingRef.current &&
                scrollContainerRef.current &&
                firstSetRef.current
            ) {
                const container = scrollContainerRef.current;
                const setWidth = firstSetRef.current.offsetWidth;
                if (setWidth > 0) {
                    container.scrollLeft += speed;
                    if (container.scrollLeft >= setWidth) {
                        container.scrollLeft -= setWidth;
                    }
                }
            }
            animId = requestAnimationFrame(tick);
        };

        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
    }, []);

    // Wheel support for horizontal scrolling on hover
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                isPausedRef.current = true;
                el.scrollLeft += e.deltaY;
                const setWidth = firstSetRef.current?.offsetWidth || 0;
                if (setWidth > 0) {
                    if (el.scrollLeft >= setWidth * 2) el.scrollLeft -= setWidth;
                    if (el.scrollLeft < 0) el.scrollLeft += setWidth;
                }
                if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
                wheelTimerRef.current = setTimeout(() => {
                    if (!isDraggingRef.current) {
                        isPausedRef.current = false;
                    }
                }, 1200);
            }
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            el.removeEventListener("wheel", onWheel);
            if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        isDraggingRef.current = true;
        isPausedRef.current = true;
        setIsDragging(true);
        setHasDragged(false);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollStartLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        isPausedRef.current = false;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setTimeout(() => {
            if (!isDraggingRef.current) {
                isPausedRef.current = false;
            }
        }, 1000);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || !scrollContainerRef.current || !firstSetRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) {
            setHasDragged(true);
        }
        const setWidth = firstSetRef.current.offsetWidth;
        let newScroll = scrollStartLeft - walk;
        if (setWidth > 0) {
            if (newScroll < 0) {
                newScroll += setWidth;
                setScrollStartLeft((prev) => prev + setWidth);
            } else if (newScroll >= setWidth * 2) {
                newScroll -= setWidth;
                setScrollStartLeft((prev) => prev - setWidth);
            }
        }
        scrollContainerRef.current.scrollLeft = newScroll;
    };

    // Sync active category if categoryParam changes
    useEffect(() => {
        if (categoryParam) {
            setActiveCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/packages").then((res) => res.json()).catch(() => ({})),
            fetch("/api/admin/services").then((res) => res.json()).catch(() => ({})),
        ])
            .then(([pkgData, srvData]) => {
                if (pkgData.packages && pkgData.packages.length > 0) {
                    cachedPackagesItems = pkgData.packages;
                    setAllPackages(pkgData.packages);
                }
                if (srvData.services && srvData.services.length > 0) {
                    cachedServicesItems = srvData.services;
                    setAllServices(srvData.services);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const defaultCategories = [
        { id: "ppf", label: locale === "ar" ? "أفلام حماية الطلاء (PPF)" : "Paint Protection Film (PPF)" },
        { id: "ceramic", label: locale === "ar" ? "طلاء السيراميك" : "Ceramic Coating" },
        { id: "detailing", label: locale === "ar" ? "التلميع والعناية" : "Detailing" },
    ];

    const categories = allServices.length > 0
        ? allServices.map((srv: any) => {
            const id = srv.serviceId || srv.id;
            const label = typeof srv.title === "object"
                ? (srv.title[locale] || srv.title.en || srv.title.ar)
                : (srv.title || (typeof srv.name === "object" ? srv.name[locale] || srv.name.en : srv.name)) || id;
            return { id, label };
        })
        : defaultCategories;

    const activeCategoryObj = categories.find((c) => c.id === activeCategory) || categories[0];

    const filteredPackages = allPackages.filter((pkg) => {
        const pCat = (pkg.category || "").toLowerCase().trim();
        const aCat = (activeCategory || "").toLowerCase().trim();
        return pCat === aCat;
    });

    const handleSelectCategory = (catId: string) => {
        setActiveCategory(catId);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("category", catId);
            window.history.replaceState({}, "", url.toString());
        }
    };

    const getCategoryIcon = (catId: string) => {
        const id = (catId || "").toLowerCase();
        if (id.includes("ppf") || id.includes("film") || id.includes("حماية")) {
            return <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
        }
        if (id.includes("ceramic") || id.includes("سيراميك")) {
            return <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
        }
        if (id.includes("detail") || id.includes("تلميع")) {
            return <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
        }
        return <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />;
    };

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div
                className="absolute top-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            {/* Global Header */}
            <PageHeader
                badge={locale === "ar" ? "باقات وأسعار شفافة" : "TRANSPARENT PRICING & TIERS"}
                titleLine1={locale === "ar" ? "باقات" : "PROTECTION"}
                titleLine2={locale === "ar" ? "الحماية." : "PACKAGES."}
                subtitle={
                    locale === "ar"
                        ? "اختر من بين باقات الحماية المصممة خصيصاً لتناسب السيارات الفائقة، الصالون الفاخرة، والسيارات الرياضية."
                        : "Choose from custom-tailored protection packages designed specifically for supercars, luxury sedans, and performance SUVs."
                }
            />

            {/* Category Filter Banners (Single Row Auto-Scrolling Marquee) */}
            <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="relative mb-2 sm:mb-3">
                    {/* Subtle edge fade masks for seamless banner look */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

                    <div
                        ref={scrollContainerRef}
                        data-lenis-prevent
                        onMouseEnter={() => {
                            isPausedRef.current = true;
                        }}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={() => {
                            isPausedRef.current = true;
                        }}
                        onTouchEnd={() => {
                            setTimeout(() => {
                                if (!isDraggingRef.current) isPausedRef.current = false;
                            }, 1000);
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className="flex flex-nowrap items-center [direction:ltr] overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
                    >
                        {[0, 1, 2, 3].map((setIndex) => (
                            <div
                                key={`cat-set-${setIndex}`}
                                ref={setIndex === 0 ? firstSetRef : undefined}
                                aria-hidden={setIndex > 0 ? "true" : undefined}
                                className="flex flex-nowrap items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5 shrink-0"
                            >
                                {categories.map((cat) => {
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={`${cat.id}-${setIndex}`}
                                            type="button"
                                            tabIndex={setIndex === 0 ? 0 : -1}
                                            data-active={isActive}
                                            onFocus={() => {
                                                isPausedRef.current = true;
                                            }}
                                            onBlur={() => {
                                                isPausedRef.current = false;
                                            }}
                                            onClick={() => {
                                                if (hasDragged) return;
                                                handleSelectCategory(cat.id);
                                            }}
                                            className={`group relative shrink-0 w-auto inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 ftx-btn-tech ftx-btn-specular transition-all duration-200 border cursor-pointer select-none whitespace-nowrap ${isActive
                                                ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow font-black"
                                                : "bg-ftx-surface hover:bg-ftx-surface-high text-ftx-silver hover:text-white border-ftx-surface-high hover:border-ftx-lime/50"
                                                }`}
                                        >
                                            <div className={`p-1 rounded transition-colors shrink-0 ${isActive
                                                ? "bg-black/15 text-ftx-black"
                                                : "bg-black/40 text-ftx-lime group-hover:bg-ftx-lime/15"
                                                }`}>
                                                {getCategoryIcon(cat.id)}
                                            </div>
                                            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
                                                {cat.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Package Category Display (Fits inside the existing gap without taking extra space) */}
                <div className="flex items-center gap-2 sm:gap-2.5 px-1 mb-4 sm:mb-5 border-b border-ftx-surface-high/40 pb-2.5 min-w-0">
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-ftx-silver uppercase shrink-0">
                        {locale === "ar" ? "الباقة المحددة:" : "SELECTED PACKAGE:"}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-ftx-lime uppercase tracking-wider truncate">
                        {activeCategoryObj?.label || activeCategory}
                    </span>
                </div>

                {/* Packages Cards Grid or Empty State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={`pkg-skeleton-${i}`} className="bg-ftx-surface/30 border border-ftx-surface-high/50 ftx-squircle-xl p-8 space-y-6 min-h-[480px] flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="h-5 bg-ftx-surface-high/60 rounded w-1/3" />
                                    <div className="h-9 bg-ftx-surface-high/50 rounded w-3/4" />
                                    <div className="h-4 bg-ftx-surface-high/30 rounded w-full" />
                                    <div className="space-y-3 pt-4">
                                        {[1, 2, 3, 4].map((f) => (
                                            <div key={`f-${f}`} className="h-4 bg-ftx-surface-high/30 rounded w-5/6" />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-ftx-surface-high/40">
                                    <div className="h-8 bg-ftx-surface-high/60 rounded w-1/2" />
                                    <div className="h-12 bg-ftx-surface-high/70 rounded-xl w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center bg-ftx-surface/40 border border-dashed border-ftx-surface-high rounded-2xl space-y-4 max-w-xl mx-auto my-8">
                        <p className="text-sm font-mono text-ftx-silver leading-relaxed">
                            {locale === "ar"
                                ? "لا توجد باقات جاهزة حالياً لهذه الفئة. يرجى التواصل معنا للحصول على عرض سعر مخصص."
                                : "No pre-configured packages currently listed for this category. Contact our studio specialists for a tailored quotation."}
                        </p>
                        <Link
                            href={`/${locale}/contact?service=${encodeURIComponent(activeCategory)}`}
                            className="ftx-btn-tech inline-flex items-center gap-2 px-6 py-3 bg-ftx-lime text-ftx-black text-xs font-mono font-bold uppercase tracking-wider shadow-lime-glow hover:bg-ftx-lime-bright transition-colors"
                        >
                            <span>{locale === "ar" ? "طلب تسعير مخصص" : "REQUEST CUSTOM QUOTE"}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg, idx) => (
                            <ScrollReveal key={pkg.id || pkg._id || `package-${idx}`} type="scale" delay={idx * 120} className="h-full">
                                <PackageCard
                                    packageData={pkg}
                                    locale={locale}
                                    ctaText={locale === "ar" ? "طلب عرض سعر" : "REQUEST QUOTE"}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PackagesPage({ params: { locale } }: PackagesPageProps) {
    return (
        <Suspense
            fallback={
                <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-ftx-lime" />
                </div>
            }
        >
            <PackagesContent locale={locale} />
        </Suspense>
    );
}
