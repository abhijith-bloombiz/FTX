import { notFound } from "next/navigation";
import { locales, isRtl, Locale } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CinematicLoader } from "@/components/ui/CinematicLoader";
import { PageTransition } from "@/components/layout/PageTransition";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FloatingContactWidget } from "@/components/ui/FloatingContactWidget";
import { HtmlLangSync } from "@/components/layout/HtmlLangSync";

async function getMessages(locale: Locale) {
    try {
        return (await import(`@/i18n/messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: { locale: Locale };
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: LocaleLayoutProps) {
    if (!locales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages(locale);
    const rtl = isRtl(locale);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AutoRepair",
                "@id": "https://firsttorquex.com/#autorepair",
                "name": "First Torque X",
                "alternateName": ["FTX", "FTX Detailing", "First Torque X Studio"],
                "image": "https://firsttorquex.com/brand/ftx-3d-logo.webp",
                "url": `https://firsttorquex.com/${locale}`,
                "telephone": "+966 54 951 1812",
                "email": "firsttorquex1@gmail.com",
                "priceRange": "$$$$",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jubail – King Faisal West Road, Opposite Lulu Hypermarket",
                    "addressLocality": "Jubail",
                    "addressRegion": "Eastern Province",
                    "addressCountry": "SA"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 26.9866,
                    "longitude": 49.6455
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "12:00",
                    "closes": "23:00"
                },
                "sameAs": [
                    "https://instagram.com/ftxdetailing",
                    "https://youtube.com/@ftxdetailing",
                    "https://facebook.com/ftxdetailing"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://firsttorquex.com/#website",
                "url": "https://firsttorquex.com",
                "name": "First Torque X",
                "description": "Premier luxury automotive protection and detailing center in Saudi Arabia.",
                "inLanguage": ["en", "ar"]
            },
            {
                "@type": "Organization",
                "@id": "https://firsttorquex.com/#organization",
                "name": "First Torque X",
                "url": "https://firsttorquex.com",
                "logo": "https://firsttorquex.com/brand/ftx-3d-logo.webp",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+966 54 951 1812",
                    "contactType": "customer service",
                    "areaServed": "SA",
                    "availableLanguage": ["en", "ar"]
                },
                "sameAs": [
                    "https://instagram.com/ftxdetailing",
                    "https://youtube.com/@ftxdetailing",
                    "https://facebook.com/ftxdetailing"
                ]
            }
        ]
    };

    return (
        <div dir={rtl ? "rtl" : "ltr"} className={`min-h-screen bg-ftx-black text-ftx-silver ${rtl ? 'font-arabic' : 'font-body'}`}>
            <HtmlLangSync locale={locale} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CustomCursor />
            <SmoothScrollProvider>
                <CinematicLoader />
                <Navbar locale={locale} messages={messages} />
                <main className="relative z-0 min-h-screen">
                    <PageTransition>{children}</PageTransition>
                </main>
                <Footer locale={locale} messages={messages} />
                <FloatingContactWidget locale={locale} />
            </SmoothScrollProvider>
        </div>
    );
}
