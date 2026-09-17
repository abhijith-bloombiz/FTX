import { Metadata } from "next";
import { Locale } from "@/i18n/config";

interface GalleryLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "معرض الأعمال والتحولات الفاخرة | السيارات الخارقة | First Torque X"
            : "Transformation Gallery & Supercar Showcase | First Torque X",
        description: isAr
            ? "شاهد التحولات المذهلة قبل وبعد في استوديو FTX. أعمال حماية الطلاء PPF والسيراميك 9H+ وتصحيح الطلاء لأحدث السيارات الخارقة والفاخرة."
            : "Experience high-definition transformations and before/after comparisons of supercars and luxury vehicles protected with PPF and ceramic coatings at FTX.",
        alternates: {
            canonical: `https://firsttorquex.com/${locale}/gallery`,
            languages: {
                en: "https://firsttorquex.com/en/gallery",
                ar: "https://firsttorquex.com/ar/gallery",
                "x-default": "https://firsttorquex.com/en/gallery",
            },
        },
        openGraph: {
            title: isAr
                ? "معرض الأعمال والتحولات الفاخرة | First Torque X"
                : "Transformation Gallery & Supercar Showcase | First Torque X",
            description: isAr
                ? "شاهد أحدث أعمال حماية الطلاء والسيراميك والتلميع للسيارات الخارقة."
                : "Browse completed hypercar and luxury vehicle transformations at First Torque X.",
            url: `https://firsttorquex.com/${locale}/gallery`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/images/gallery/gt3rs-ppf.jpg",
                    width: 1200,
                    height: 630,
                    alt: "FTX Supercar Transformation Gallery",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr ? "معرض أعمال First Torque X" : "Transformation Gallery | First Torque X",
            description: isAr
                ? "شاهد أحدث أعمال حماية الطلاء والسيراميك والتلميع للسيارات الخارقة."
                : "Browse completed hypercar and luxury vehicle transformations at First Torque X.",
            images: ["/images/gallery/gt3rs-ppf.jpg"],
        },
    };
}

export default function GalleryLayout({ children, params: { locale } }: GalleryLayoutProps) {
    const isAr = locale === "ar";
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ImageGallery",
                "@id": `https://firsttorquex.com/${locale}/gallery`,
                "name": isAr ? "معرض أعمال وتطبيقات First Torque X" : "First Torque X Transformation Gallery",
                "description": isAr
                    ? "معرض صور وفيديوهات تحولات السيارات الفاخرة وأفلام حماية الطلاء PPF وتغليف السيراميك."
                    : "Showcase of luxury hypercar transformations, paint protection film installations, and bespoke detailing.",
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
                        "name": isAr ? "معرض الأعمال" : "Gallery",
                        "item": `https://firsttorquex.com/${locale}/gallery`
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
