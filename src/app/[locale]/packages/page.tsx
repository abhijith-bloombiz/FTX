"use client";

import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
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
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close mobile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div className="absolute top-20 -right-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_top_right,rgba(164,214,94,0.15),transparent_70%)] pointer-events-none z-0" />
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

            {/* Category Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
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
                            className={`absolute ltr:right-0 rtl:left-0 top-full mt-2 z-50 min-w-[240px] bg-ftx-surface/95 backdrop-blur-md border border-ftx-surface-high ftx-squircle-lg p-2 shadow-2xl space-y-1.5 ftx-dropdown-anim ltr:origin-top-right rtl:origin-top-left ${isOpen
                                ? "opacity-100 scale-100 translate-y-0 duration-250 pointer-events-auto"
                                : "opacity-0 scale-[0.96] -translate-y-2 duration-200 pointer-events-none"
                                }`}
                        >
                            {categories.map((cat, idx) => {
                                const isActive = activeCategory === cat.id;
                                const delay = isOpen ? idx * 45 : (categories.length - 1 - idx) * 35;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setIsOpen(false);
                                        }}
                                        style={{ transitionDelay: `${delay}ms` }}
                                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech ftx-dropdown-anim flex items-center justify-between ${isOpen
                                            ? "opacity-100 translate-x-0 duration-250"
                                            : "opacity-0 -translate-x-2.5 duration-200 pointer-events-none"
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

                {/* Desktop Category Filter Tabs (hidden sm:flex) */}
                <ScrollReveal type="editorial" className="hidden sm:flex items-center justify-center gap-3 mb-4 sm:mb-6 flex-wrap">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 border ${isActive
                                    ? "bg-ftx-lime text-ftx-black border-ftx-lime shadow-lime-glow"
                                    : "bg-ftx-surface text-ftx-silver hover:text-white border-ftx-surface-high hover:bg-ftx-surface-high"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </ScrollReveal>

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
