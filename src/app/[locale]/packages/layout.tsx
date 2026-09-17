import { Metadata } from "next";
import { Locale } from "@/i18n/config";

interface PackagesLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "باقات حماية وتلميع السيارات والأسعار | First Torque X"
            : "Automotive Protection Packages & Pricing | First Torque X",
        description: isAr
            ? "استكشف باقات حماية وتلميع السيارات المتكاملة من FTX: باقات حماية الطلاء الكاملة والجزئية، ودرع السيراميك 9H+، وباقات العناية الفائقة."
            : "Explore comprehensive vehicle protection packages from FTX: Full-Body & Track PPF, 9H+ Ceramic Shield, and Signature Detailing packages.",
        alternates: {
            canonical: `https://firsttorquex.com/${locale}/packages`,
            languages: {
                en: "https://firsttorquex.com/en/packages",
                ar: "https://firsttorquex.com/ar/packages",
                "x-default": "https://firsttorquex.com/en/packages",
            },
        },
        openGraph: {
            title: isAr
                ? "باقات حماية وتلميع السيارات | First Torque X"
                : "Automotive Protection Packages & Pricing | First Torque X",
            description: isAr
                ? "باقات حماية الطلاء والسيراميك والعناية الفائقة بالسيارات الفاخرة."
                : "Explore transparent, comprehensive automotive protection packages tailored for luxury vehicles.",
            url: `https://firsttorquex.com/${locale}/packages`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/images/pillars/protection.jpg",
                    width: 1200,
                    height: 630,
                    alt: "FTX Protection Packages & Pricing",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr ? "باقات حماية السيارات | First Torque X" : "Protection Packages | First Torque X",
            description: isAr
                ? "باقات حماية الطلاء والسيراميك والعناية الفائقة بالسيارات الفاخرة."
                : "Explore luxury automotive protection packages tailored for exotic cars.",
            images: ["/images/pillars/protection.jpg"],
        },
    };
}

export default function PackagesLayout({ children, params: { locale } }: PackagesLayoutProps) {
    const isAr = locale === "ar";
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `https://firsttorquex.com/${locale}/packages`,
                "name": isAr ? "باقات حماية وتلميع السيارات | First Torque X" : "Protection Packages & Pricing | First Torque X",
                "description": isAr
                    ? "استكشف باقات حماية وتلميع السيارات المتكاملة من FTX: باقات حماية الطلاء الكاملة والجزئية، ودرع السيراميك 9H+، وباقات العناية الفائقة."
                    : "Comprehensive automotive protection packages from FTX: Full-Body & Track PPF, 9H+ Ceramic Shield, and Signature Detailing packages.",
                "isPartOf": {
                    "@id": "https://firsttorquex.com/#website"
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
                        "name": isAr ? "الباقات والأسعار" : "Packages",
                        "item": `https://firsttorquex.com/${locale}/packages`
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
