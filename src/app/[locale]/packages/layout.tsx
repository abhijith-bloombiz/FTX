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
            canonical: `https://ftx.ae/${locale}/packages`,
            languages: {
                en: "https://ftx.ae/en/packages",
                ar: "https://ftx.ae/ar/packages",
            },
        },
        openGraph: {
            title: isAr
                ? "باقات حماية وتلميع السيارات | First Torque X"
                : "Automotive Protection Packages & Pricing | First Torque X",
            description: isAr
                ? "باقات حماية الطلاء والسيراميك والعناية الفائقة بالسيارات الفاخرة."
                : "Explore transparent, comprehensive automotive protection packages tailored for luxury vehicles.",
            url: `https://ftx.ae/${locale}/packages`,
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

export default function PackagesLayout({ children }: PackagesLayoutProps) {
    return <>{children}</>;
}
