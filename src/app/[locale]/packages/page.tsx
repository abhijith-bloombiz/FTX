"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, ChevronDown, Loader2, ArrowUpRight } from "lucide-react";
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
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopOpen, setIsDesktopOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const desktopDropdownRef = useRef<HTMLDivElement>(null);

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

    const filteredPackages = allPackages.filter((pkg) => {
        const pCat = (pkg.category || "").toLowerCase().trim();
        const aCat = (activeCategory || "").toLowerCase().trim();
        return pCat === aCat;
    });

    const handleSelectCategory = (catId: string) => {
        setActiveCategory(catId);
        setIsOpen(false);
        setIsDesktopOpen(false);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("category", catId);
            window.history.replaceState({}, "", url.toString());
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
                setIsDesktopOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

            {/* Category Tabs & Dropdown */}
            <div id="packages-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Mobile Filter Button (sm:hidden) - Positioned Right with RTL support */}
                <div className="sm:hidden mb-6 flex justify-end">
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2.5 ftx-btn-tech shadow-xl transition-all duration-200 flex items-center justify-center ${isOpen || activeCategory !== "ppf"
                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-bold"
                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                }`}
                            title="Filter Packages"
                        >
                            <Filter className="w-4 h-4" />
                        </button>

                        <div
                            className={`absolute ltr:right-0 rtl:left-0 top-full mt-2 z-50 min-w-[240px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 transform-gpu transition-all duration-150 ease-out ltr:origin-top-right rtl:origin-top-left ${isOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat, idx) => {
                                const isActive = activeCategory === cat.id;
                                const delay = isOpen ? idx * 40 : (categories.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelectCategory(cat.id)}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${isOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span>{cat.label}</span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Desktop Category Filter Dropdown (hidden sm:flex) */}
                <div className="hidden sm:flex items-center ltr:justify-start rtl:justify-end mb-6">
                    <div ref={desktopDropdownRef} className="relative">
                        <button
                            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                            className={`px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border flex items-center gap-3 ${isDesktopOpen || activeCategory !== "ppf"
                                ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow font-black"
                                : "bg-ftx-surface text-ftx-silver hover:text-white border-ftx-surface-high hover:bg-ftx-surface-high"
                                }`}
                        >
                            <span>
                                <span className="opacity-60 font-medium me-1">
                                    {locale === "ar" ? "الفئة:" : "CATEGORY:"}
                                </span>
                                {categories.find((c) => c.id === activeCategory)?.label || activeCategory.toUpperCase()}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ease-out ${isDesktopOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div
                            className={`absolute ltr:left-0 rtl:right-0 top-full mt-2 z-50 min-w-[270px] bg-ftx-surface/95 backdrop-blur-xl border border-ftx-surface-high/80 ftx-squircle-lg p-1.5 shadow-2xl space-y-1 transform-gpu transition-all duration-150 ease-out ltr:origin-top-left rtl:origin-top-right ${isDesktopOpen
                                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat, idx) => {
                                const isActive = activeCategory === cat.id;
                                const delay = isDesktopOpen ? idx * 40 : (categories.length - 1 - idx) * 25;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelectCategory(cat.id)}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech flex items-center justify-between transition-all duration-200 ease-out transform-gpu ${isDesktopOpen
                                            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                                            : "opacity-0 -translate-y-1.5 scale-95 pointer-events-none"
                                            } ${isActive
                                                ? "bg-ftx-lime text-ftx-black shadow-lime-glow font-black"
                                                : "bg-ftx-surface text-ftx-silver hover:text-white hover:bg-ftx-surface-high border border-ftx-surface-high"
                                            }`}
                                    >
                                        <span>{cat.label}</span>
                                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ftx-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Packages Cards Grid or Empty State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 animate-pulse">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
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
