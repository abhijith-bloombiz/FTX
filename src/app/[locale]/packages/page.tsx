"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { packagesData } from "@/data/packages";
import { PackageCard } from "@/components/ui/PackageCard";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface PackagesPageProps {
    params: { locale: Locale };
}

export default function PackagesPage({ params: { locale } }: PackagesPageProps) {
    const [activeCategory, setActiveCategory] = useState<"ppf" | "ceramic" | "detailing">("ppf");
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopOpen, setIsDesktopOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const desktopDropdownRef = useRef<HTMLDivElement>(null);

    const categories = [
        {
            id: "ppf",
            label: locale === "ar" ? "أفلام حماية الطلاء (PPF)" : "Paint Protection Film (PPF)"
        },
        {
            id: "ceramic",
            label: locale === "ar" ? "طلاء السيراميك" : "Ceramic Coating"
        },
        {
            id: "detailing",
            label: locale === "ar" ? "التلميع والعناية" : "Detailing"
        },
    ] as const;

    const filteredPackages = packagesData.filter((pkg) => pkg.category === activeCategory);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setIsOpen(false);
                                        }}
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
                                {categories.find((c) => c.id === activeCategory)?.label}
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
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setIsDesktopOpen(false);
                                        }}
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

                {/* Packages Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                    {filteredPackages.map((pkg, idx) => (
                        <ScrollReveal key={pkg.id} type="scale" delay={idx * 120} className="h-full">
                            <PackageCard
                                packageData={pkg}
                                locale={locale}
                                ctaText={locale === "ar" ? "طلب عرض سعر" : "REQUEST QUOTE"}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
