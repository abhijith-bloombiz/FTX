"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ServiceHighlightCards } from "@/components/ui/ServiceHighlightCards";
import { ServiceDetailsModal } from "@/components/ui/ServiceDetailsModal";

import { packagesData as fallbackPackages } from "@/data/packages";

interface ServicesListClientProps {
    services: any[];
    packages?: any[];
    locale: Locale;
    messages: any;
}

export function ServicesListClient({ services, packages, locale, messages }: ServicesListClientProps) {
    const isAr = locale === "ar";
    const [activeDetailService, setActiveDetailService] = useState<any | null>(null);

    const packagesList = packages && packages.length > 0 ? packages : fallbackPackages;

    return (
        <>
            <div className="space-y-0">
                {services.map((service: any, index: number) => {
                    const isEven = index % 2 === 0;
                    const sId = (service.serviceId || service.id || "").toLowerCase().trim();
                    const sAlt = (service.id || "").toLowerCase().trim();

                    // Check if packages exist matching this service's category
                    const relatedPackages = packagesList.filter((pkg: any) => {
                        const pkgCat = (pkg.category || "").toLowerCase().trim();
                        return pkgCat === sId || pkgCat === sAlt;
                    });

                    const hasRelatedPackages = relatedPackages.length > 0;

                    const defaultButtonText =
                        hasRelatedPackages
                            ? (service.id === "ppf" || service.serviceId === "ppf"
                                ? isAr ? "استكشف باقات الـ PPF" : "EXPLORE PPF PACKAGES"
                                : service.id === "ceramic" || service.serviceId === "ceramic"
                                    ? isAr ? "عرض خيارات السيراميك" : "VIEW CERAMIC OPTIONS"
                                    : service.id === "detailing" || service.serviceId === "detailing"
                                        ? isAr ? "استكشف باقات التلميع" : "EXPLORE DETAILING PACKAGES"
                                        : isAr ? "استكشف الباقات" : "EXPLORE PACKAGES")
                            : (service.id === "underbody-rust-proof" || service.serviceId === "underbody-rust-proof"
                                ? isAr ? "احجز حماية أسفل الهيكل" : "BOOK UNDERBODY TREATMENT"
                                : service.id === "window-films" || service.serviceId === "window-films"
                                    ? isAr ? "احجز خدمة التظليل الحراري" : "BOOK WINDOW TINTING"
                                    : isAr ? "تواصل لحجز الخدمة" : "CONTACT TO BOOK");

                    const customButtonText =
                        typeof service.buttonText === "object" && service.buttonText
                            ? (locale === "ar" ? service.buttonText.ar : service.buttonText.en) || (isAr ? service.buttonText.ar : service.buttonText.en)
                            : typeof service.buttonText === "string" && service.buttonText.trim()
                                ? service.buttonText
                                : null;

                    const packageButtonText = customButtonText || defaultButtonText;

                    const targetServiceSlug = service.serviceId || service.id;
                    const buttonLink = hasRelatedPackages
                        ? `/${locale}/packages?category=${encodeURIComponent(targetServiceSlug)}`
                        : `/${locale}/contact?service=${encodeURIComponent(targetServiceSlug)}`;

                    const serviceTitle =
                        typeof service.title === "object"
                            ? service.title[locale] || service.title.en || service.title.ar
                            : service.title;

                    const serviceDesc =
                        typeof service.description === "object"
                            ? service.description[locale] || service.description.en || service.description.ar
                            : service.description;

                    return (
                        <section
                            key={service.id || service._id || index}
                            id={service.id || service.serviceId}
                            className="py-10 sm:py-12 bg-black relative overflow-hidden"
                        >
                            {/* Atmospheric Lime Ambient Glow (Alternating Left / Right) */}
                            <div
                                className={`absolute bottom-0 ${isEven ? "left-0" : "right-0"} w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0`}
                                style={{
                                    background: `radial-gradient(ellipse 80% 70% at ${isEven ? "0%" : "100%"} 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)`,
                                }}
                            />

                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                                    {/* Image Side - Directional Reveal Animation on Scroll */}
                                    <ScrollReveal
                                        type="horizontal"
                                        direction={isEven ? "left" : "right"}
                                        duration={850}
                                        className={`lg:col-span-6 relative ${isEven ? "lg:order-1" : "lg:order-2"
                                            }`}
                                    >
                                        <div className="relative w-full aspect-[4/3] ftx-squircle-xl overflow-hidden border border-ftx-surface-high shadow-2xl group">
                                            <Image
                                                src={service.image}
                                                alt={serviceTitle}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority={index === 0}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-ftx-black/80 via-transparent to-transparent" />

                                            {/* Big Corner Index Number Overlay */}
                                            <div
                                                className={`absolute bottom-4 ${isEven ? "left-6" : "right-6"
                                                    } text-6xl sm:text-7xl font-mono font-black text-ftx-lime/80 tracking-tighter drop-shadow-lg select-none`}
                                            >
                                                {service.number}
                                            </div>
                                        </div>
                                    </ScrollReveal>

                                    {/* Text & Features Side */}
                                    <ScrollReveal
                                        type="editorial"
                                        delay={120}
                                        className={`lg:col-span-6 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"
                                            }`}
                                    >
                                        <div>
                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-tight">
                                                {serviceTitle}
                                            </h2>

                                            <p className="text-xs sm:text-sm text-ftx-silver-muted font-body leading-relaxed mt-4">
                                                {serviceDesc}
                                            </p>
                                        </div>

                                        {/* Compact & Expandable Feature Highlight Cards */}
                                        <ServiceHighlightCards highlights={service.highlights} locale={locale} />

                                        {/* High-Visibility Tech Action Row with Explore Button & Details Icon Button */}
                                        <div className="pt-4 flex items-center justify-between gap-3 w-full">
                                            {/* Explore / Action Button */}
                                            <Link
                                                href={buttonLink}
                                                className="ftx-btn-tech ftx-btn-specular inline-flex items-center justify-between gap-3 px-8 py-4 text-xs font-mono font-bold tracking-widest uppercase bg-ftx-lime hover:bg-ftx-lime-bright text-ftx-black shadow-lime-glow transition-all duration-200"
                                            >
                                                <span>{packageButtonText}</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>

                                            {/* Details Icon Button placed on the right side */}
                                            <button
                                                type="button"
                                                onClick={() => setActiveDetailService(service)}
                                                className="ftx-squircle-sm w-12 h-12 inline-flex items-center justify-center border border-white/20 bg-ftx-surface hover:bg-ftx-surface-high hover:border-ftx-lime text-ftx-lime hover:text-ftx-lime-bright transition-all duration-200 group/detail shadow-lg cursor-pointer ms-auto shrink-0"
                                                title={isAr ? "عرض تفاصيل ومراحل الخدمة" : "View Service Details & Process"}
                                                aria-label={isAr ? "عرض تفاصيل ومراحل الخدمة" : "View Service Details & Process"}
                                            >
                                                <Info className="w-5 h-5 group-hover/detail:scale-115 transition-transform" />
                                            </button>
                                        </div>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Service Details Modal */}
            {activeDetailService && (
                <ServiceDetailsModal
                    service={activeDetailService}
                    locale={locale}
                    onClose={() => setActiveDetailService(null)}
                />
            )}
        </>
    );
}
