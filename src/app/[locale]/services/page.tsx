import { getCmsServices, getCmsPackages } from "@/lib/cms";
import { Locale, locales } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServicesListClient } from "@/components/sections/ServicesListClient";

export const revalidate = 60;

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ServicesPageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: ServicesPageProps) {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "خدمات حماية وتلميع السيارات | أفلام PPF وطلاء السيراميك | First Torque X"
            : "Automotive Protection Services | PPF, Ceramic Coating & Detailing | First Torque X",
        description: isAr
            ? "استكشف خدمات FTX المتخصصة في أفلام حماية الطلاء PPF، وطلاء السيراميك 9H+، والتلميع الساطع، والعناية الفائقة بالسيارات الفاخرة."
            : "Explore FTX's premier automotive protection services: Self-Healing Paint Protection Film (PPF), 9H+ Nano Ceramic Coating, Surgical Paint Correction & Concierge Detailing.",
        alternates: {
            canonical: `https://firsttorquex.com/${locale}/services`,
            languages: {
                en: "https://firsttorquex.com/en/services",
                ar: "https://firsttorquex.com/ar/services",
                "x-default": "https://firsttorquex.com/en/services",
            },
        },
        openGraph: {
            title: isAr
                ? "خدمات حماية وتلميع السيارات | First Torque X"
                : "Automotive Protection Services | First Torque X",
            description: isAr
                ? "أفلام حماية الطلاء PPF، وتغليف السيراميك 9H+، والتلميع الجراحي للسيارات الفاخرة."
                : "Premier Paint Protection Film (PPF), 9H+ Ceramic Coatings, and Paint Correction services.",
            url: `https://firsttorquex.com/${locale}/services`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/images/gallery/gt3rs-ppf.jpg",
                    width: 1200,
                    height: 630,
                    alt: "FTX Paint Protection Film Service",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr ? "خدمات FTX لحماية السيارات" : "Automotive Protection Services | First Torque X",
            description: isAr
                ? "أفلام حماية الطلاء PPF، وتغليف السيراميك 9H+، وتصحيح الطلاء."
                : "Bespoke Paint Protection Film, Ceramic Coating & Surgical Detailing.",
            images: ["/images/gallery/gt3rs-ppf.jpg"],
        },
    };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
    const [messages, servicesData, packagesData] = await Promise.all([
        getMessages(locale),
        getCmsServices(),
        getCmsPackages(),
    ]);

    const isAr = locale === "ar";
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "serviceType": "Automotive Protection & Detailing",
                "provider": {
                    "@type": "AutomotiveBusiness",
                    "name": "First Torque X",
                    "url": "https://firsttorquex.com",
                    "image": "https://firsttorquex.com/brand/ftx-3d-logo.webp",
                    "telephone": "+966 54 951 1812",
                    "priceRange": "$$$$",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Jubail – King Faisal West Road, Opposite Lulu Hypermarket",
                        "addressLocality": "Jubail",
                        "addressRegion": "Eastern Province",
                        "addressCountry": "SA"
                    }
                },
                "areaServed": "Saudi Arabia",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "FTX Protection Services",
                    "itemListElement": (servicesData || []).map((s: any) => ({
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": typeof s.title === "object" ? s.title[locale] || s.title.en : s.title,
                            "description": typeof s.description === "object" ? s.description[locale] || s.description.en : s.description,
                        }
                    }))
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": isAr ? "الرئيسية" : "Home",
                        "item": `https://firsttorquex.com/${locale}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": isAr ? "خدماتنا" : "Services",
                        "item": `https://firsttorquex.com/${locale}/services`
                    }
                ]
            }
        ]
    };

    return (
        <div className="pt-[88px] sm:pt-[96px] pb-0 bg-black min-h-screen relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div
                className="absolute top-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0 hidden sm:block"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            {/* Global Header */}
            <PageHeader
                badge={messages.servicesSection?.badge || messages.common.ourServices || (locale === "ar" ? "خدماتنا" : "OUR SERVICES")}
                titleLine1={locale === "ar" ? "خدمات" : "PRECISION"}
                titleLine2={locale === "ar" ? "احترافية." : "SERVICES."}
                subtitle={messages.servicesPage?.heroSub || messages.hero?.description}
            />

            {/* Interactive Services List with Details Actions */}
            <ServicesListClient services={servicesData} packages={packagesData} locale={locale} messages={messages} />
        </div>
    );
}
