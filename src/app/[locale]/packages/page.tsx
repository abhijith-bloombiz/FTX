"use client";

import { useState } from "react";
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

    const filteredPackages = packagesData.filter((pkg) => pkg.category === activeCategory);

    return (
        <div className="pt-24 pb-20 bg-ftx-black min-h-screen">
            {/* Global Header */}
            <PageHeader
                badge="TRANSPARENT PRICING & TIERS"
                titleLine1="PROTECTION"
                titleLine2="PACKAGES."
                subtitle="Choose from custom-tailored protection packages designed specifically for supercars, luxury sedans, and performance SUVs."
            />

            {/* Category Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <ScrollReveal type="editorial" className="flex items-center justify-center gap-3 mb-12 flex-wrap">
                    <button
                        onClick={() => setActiveCategory("ppf")}
                        className={`px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 ${activeCategory === "ppf"
                            ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-105"
                            : "bg-ftx-surface text-ftx-silver hover:text-white border border-ftx-surface-high"
                            }`}
                    >
                        Paint Protection Film (PPF)
                    </button>
                    <button
                        onClick={() => setActiveCategory("ceramic")}
                        className={`px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 ${activeCategory === "ceramic"
                            ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-105"
                            : "bg-ftx-surface text-ftx-silver hover:text-white border border-ftx-surface-high"
                            }`}
                    >
                        Ceramic Coating
                    </button>
                    <button
                        onClick={() => setActiveCategory("detailing")}
                        className={`px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase ftx-btn-tech transition-all duration-200 ${activeCategory === "detailing"
                            ? "bg-ftx-lime text-ftx-black shadow-lime-glow scale-105"
                            : "bg-ftx-surface text-ftx-silver hover:text-white border border-ftx-surface-high"
                            }`}
                    >
                        Detailing
                    </button>
                </ScrollReveal>

                {/* Packages Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    {filteredPackages.map((pkg, idx) => (
                        <ScrollReveal key={pkg.id} type="scale" delay={idx * 120} className="h-full">
                            <PackageCard
                                packageData={pkg}
                                locale={locale}
                                ctaText="REQUEST QUOTE"
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
