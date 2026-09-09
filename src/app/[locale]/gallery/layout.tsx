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
            canonical: `https://ftx.ae/${locale}/gallery`,
            languages: {
                en: "https://ftx.ae/en/gallery",
                ar: "https://ftx.ae/ar/gallery",
            },
        },
        openGraph: {
            title: isAr
                ? "معرض الأعمال والتحولات الفاخرة | First Torque X"
                : "Transformation Gallery & Supercar Showcase | First Torque X",
            description: isAr
                ? "شاهد أحدث أعمال حماية الطلاء والسيراميك والتلميع للسيارات الخارقة."
                : "Browse completed hypercar and luxury vehicle transformations at First Torque X.",
            url: `https://ftx.ae/${locale}/gallery`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/images/gallery/ppf-studio-hero.jpg",
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
            images: ["/images/gallery/ppf-studio-hero.jpg"],
        },
    };
}

export default function GalleryLayout({ children }: GalleryLayoutProps) {
    return <>{children}</>;
}
