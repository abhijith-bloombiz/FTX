import Image from "next/image";
import Link from "next/link";
import { Shield, RefreshCw, Droplet, Sparkles, Wand2, Car, ArrowUpRight } from "lucide-react";
import { servicesData } from "@/data/services";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ServicesPageProps {
    params: { locale: Locale };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
    const messages = await getMessages(locale);

    const getHighlightIcon = (iconName: string) => {
        switch (iconName) {
            case "shield":
                return <Shield className="w-5 h-5 text-ftx-lime" />;
            case "refresh":
                return <RefreshCw className="w-5 h-5 text-ftx-lime" />;
            case "droplet":
                return <Droplet className="w-5 h-5 text-ftx-lime" />;
            case "sparkles":
                return <Sparkles className="w-5 h-5 text-ftx-lime" />;
            case "wand":
                return <Wand2 className="w-5 h-5 text-ftx-lime" />;
            case "car":
                return <Car className="w-5 h-5 text-ftx-lime" />;
            default:
                return <Sparkles className="w-5 h-5 text-ftx-lime" />;
        }
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
                badge={messages.servicesSection?.badge || messages.common.ourServices || (locale === "ar" ? "خدماتنا" : "OUR SERVICES")}
                titleLine1={locale === "ar" ? "خدمات" : "PRECISION"}
                titleLine2={locale === "ar" ? "احترافية." : "SERVICES."}
                subtitle={messages.servicesPage?.heroSub || messages.hero?.description}
            />

            {/* Services List Breakdown */}
            <div className="space-y-0">
                {servicesData.map((service, index) => {
                    const isEven = index % 2 === 0;

                    const packageButtonText =
                        service.id === "ppf"
                            ? locale === "ar"
                                ? "استكشف باقات الـ PPF"
                                : "EXPLORE PPF PACKAGES"
                            : service.id === "ceramic"
                                ? locale === "ar"
                                    ? "عرض خيارات السيراميك"
                                    : "VIEW CERAMIC OPTIONS"
                                : locale === "ar"
                                    ? "استكشف باقات التلميع"
                                    : "EXPLORE DETAILING PACKAGES";

                    return (
                        <section
                            key={service.id}
                            id={service.id}
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
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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
                                                alt={service.title[locale]}
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
                                                {service.title[locale]}
                                            </h2>

                                            <p className="text-xs sm:text-sm text-ftx-silver-muted font-body leading-relaxed mt-4">
                                                {service.description[locale]}
                                            </p>
                                        </div>

                                        {/* 2-Column Feature Highlight Cards */}
                                        {service.highlights && service.highlights.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                                {service.highlights.map((item, hIdx) => (
                                                    <div
                                                        key={hIdx}
                                                        className="bg-ftx-surface/90 hover:bg-ftx-surface ftx-squircle-md p-5 border border-ftx-surface-high space-y-2.5 transition-colors duration-200"
                                                    >
                                                        <div className="p-2 rounded bg-ftx-lime/10 w-fit">
                                                            {getHighlightIcon(item.icon)}
                                                        </div>
                                                        <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wide">
                                                            {item.title[locale]}
                                                        </h3>
                                                        <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                                            {item.description[locale]}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* High-Visibility Tech Action Button */}
                                        <div className="pt-4">
                                            <Link
                                                href={`/${locale}/packages`}
                                                className="ftx-btn-tech ftx-btn-specular inline-flex items-center justify-between gap-3 px-8 py-4 text-xs font-mono font-bold tracking-widest uppercase bg-ftx-lime hover:bg-ftx-lime-bright text-ftx-black shadow-lime-glow transition-all duration-200"
                                            >
                                                <span>{packageButtonText}</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
