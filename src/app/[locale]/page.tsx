import { Suspense } from "react";
import { Locale, locales } from "@/i18n/config";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyFTX } from "@/components/sections/WhyFTX";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/ui/ContactForm";
import { TextReveal } from "@/components/motion/TextReveal";
import { ScrollScrubFloor } from "@/components/motion/ScrollScrubFloor";

import { connectToDatabase } from "@/lib/db";
import { PageSection } from "@/lib/models/PageSection";
import { getSectionsForPage } from "@/lib/sections";

import { getCmsServices } from "@/lib/cms";

export const revalidate = 60;

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: Locale) {
    if (!locales.includes(locale as Locale)) {
        return (await import(`@/i18n/messages/en.json`)).default;
    }
    try {
        return (await import(`@/i18n/messages/${locale}.json`)).default;
    } catch {
        return (await import(`@/i18n/messages/en.json`)).default;
    }
}

async function getDynamicMessages(locale: Locale) {
    const rawMessages = await getMessages(locale);
    const messages = JSON.parse(JSON.stringify(rawMessages));
    try {
        const dbSections = await getSectionsForPage("home");
        if (dbSections && dbSections.length > 0) {
            const isAr = locale === "ar";
            const lang = isAr ? "ar" : "en";

            dbSections.forEach((sec: any) => {
                if (sec.sectionKey === "intro") {
                    messages.intro = messages.intro || {};
                    if (sec.title?.[lang]) messages.intro.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.intro.badge = sec.subtitle[lang];
                    if (sec.content?.[lang]) {
                        const parts = sec.content[lang].split("\n").filter(Boolean);
                        messages.intro.p1 = parts[0] || sec.content[lang];
                        if (parts[1]) messages.intro.p2 = parts.slice(1).join(" ");
                    }
                    if (sec.metadata?.imageUrl) {
                        messages.intro.image = sec.metadata.imageUrl;
                    }
                    if (sec.metadata?.badgeTitle?.[lang]) {
                        messages.intro.badgeTitle = sec.metadata.badgeTitle[lang];
                    }
                    if (sec.metadata?.badgeSub?.[lang]) {
                        messages.intro.badgeSub = sec.metadata.badgeSub[lang];
                    }
                }
                if (sec.sectionKey === "services") {
                    messages.servicesSection = messages.servicesSection || {};
                    if (sec.title?.[lang]) messages.servicesSection.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.servicesSection.badge = sec.subtitle[lang];
                }
                if (sec.sectionKey === "why_ftx") {
                    messages.whyFtx = messages.whyFtx || {};
                    if (sec.title?.[lang]) messages.whyFtx.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.whyFtx.badge = sec.subtitle[lang];
                    if (sec.metadata?.card1Title?.[lang]) messages.whyFtx.v1Title = sec.metadata.card1Title[lang];
                    if (sec.metadata?.card1Desc?.[lang]) messages.whyFtx.v1Desc = sec.metadata.card1Desc[lang];
                    if (sec.metadata?.card1Image) messages.whyFtx.v1Image = sec.metadata.card1Image;

                    if (sec.metadata?.card2Title?.[lang]) messages.whyFtx.v2Title = sec.metadata.card2Title[lang];
                    if (sec.metadata?.card2Desc?.[lang]) messages.whyFtx.v2Desc = sec.metadata.card2Desc[lang];
                    if (sec.metadata?.card2Image) messages.whyFtx.v2Image = sec.metadata.card2Image;

                    if (sec.metadata?.card3Title?.[lang]) messages.whyFtx.v3Title = sec.metadata.card3Title[lang];
                    const rawCard3DescEn = sec.metadata?.card3Desc?.en;
                    const rawCard3DescAr = sec.metadata?.card3Desc?.ar;
                    const isCard3Corrupted = rawCard3DescEn && /[\u0600-\u06FF]/.test(rawCard3DescEn) && !rawCard3DescAr;
                    if (isAr) {
                        const val = rawCard3DescAr || (isCard3Corrupted ? rawCard3DescEn : undefined);
                        if (val) messages.whyFtx.v3Desc = val;
                    } else {
                        if (rawCard3DescEn && !isCard3Corrupted) messages.whyFtx.v3Desc = rawCard3DescEn;
                    }
                    if (sec.metadata?.card3Image) messages.whyFtx.v3Image = sec.metadata.card3Image;

                    if (sec.metadata?.card4Title?.[lang]) messages.whyFtx.v4Title = sec.metadata.card4Title[lang];
                    const rawCard4DescEn = sec.metadata?.card4Desc?.en;
                    const rawCard4DescAr = sec.metadata?.card4Desc?.ar;
                    const isCard4Corrupted = rawCard4DescEn && /[\u0600-\u06FF]/.test(rawCard4DescEn) && !rawCard4DescAr;
                    if (isAr) {
                        const val = rawCard4DescAr || (isCard4Corrupted ? rawCard4DescEn : undefined);
                        if (val) messages.whyFtx.v4Desc = val;
                    } else {
                        if (rawCard4DescEn && !isCard4Corrupted) messages.whyFtx.v4Desc = rawCard4DescEn;
                    }
                    if (sec.metadata?.card4Image) messages.whyFtx.v4Image = sec.metadata.card4Image;
                }
                if (sec.sectionKey === "gallery") {
                    messages.gallery = messages.gallery || {};
                    if (sec.title?.[lang]) messages.gallery.heroTitle = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.gallery.heroSub = sec.subtitle[lang];
                }
                if (sec.sectionKey === "testimonials") {
                    messages.testimonials = messages.testimonials || {};
                    if (sec.title?.[lang]) messages.testimonials.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.testimonials.badge = sec.subtitle[lang];
                }
                if (sec.sectionKey === "contact") {
                    messages.contact = messages.contact || {};
                    if (sec.title?.[lang]) messages.contact.heroTitle = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.contact.heroSub = sec.subtitle[lang];
                }
            });
        }
    } catch {
        // Soft fallback to static messages
    }
    return messages;
}

interface HomePageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: HomePageProps) {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "First Torque X | استوديو حماية السيارات الفاخرة | أفلام الحماية والسيراميك"
            : "First Torque X | Premier Automotive Protection Studio | PPF & Ceramic Coating",
        description: isAr
            ? "الاستوديو الرائد لحماية السيارات المتخصص في أفلام حماية الطلاء (PPF)، وتغليف السيراميك 9H+، وتصحيح الطلاء، والعناية الفائقة بالسيارات."
            : "Premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, Surgical Paint Correction, and Bespoke Car Detailing.",
        alternates: {
            canonical: `https://firsttorquex.com/${locale}`,
            languages: {
                en: "https://firsttorquex.com/en",
                ar: "https://firsttorquex.com/ar",
                "x-default": "https://firsttorquex.com/en",
            },
        },
        openGraph: {
            title: isAr
                ? "First Torque X | استوديو حماية السيارات الفاخرة"
                : "First Torque X | Premier Automotive Protection Studio",
            description: isAr
                ? "الاستوديو الرائد لحماية السيارات المتخصص في أفلام حماية الطلاء (PPF)، وتغليف السيراميك 9H+، وتصحيح الطلاء."
                : "Premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, and Surgical Detailing.",
            url: `https://firsttorquex.com/${locale}`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/brand/ftx-og-image.jpg",
                    width: 1200,
                    height: 630,
                    type: "image/jpeg",
                    alt: "First Torque X Automotive Protection Studio",
                },
                {
                    url: "/brand/ftx-og-square.jpg",
                    width: 600,
                    height: 600,
                    type: "image/jpeg",
                    alt: "First Torque X Automotive Protection Studio",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr
                ? "First Torque X | استوديو حماية السيارات الفاخرة"
                : "First Torque X | Premier Automotive Protection Studio",
            description: isAr
                ? "أفلام حماية الطلاء PPF، وطلاء السيراميك 9H+، وتصحيح الطلاء فائق الدقة."
                : "Premier automotive protection studio specializing in PPF, 9H+ Ceramic, and Surgical Detailing.",
            images: ["/brand/ftx-og-image.jpg"],
        },
    };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
    const messages = await getDynamicMessages(locale);
    const services = await getCmsServices();
    const homeSections = await getSectionsForPage("home");

    const isVisible = (key: string) => {
        const sec = homeSections?.find((s: any) => s.sectionKey === key);
        return sec ? sec.isVisible !== false : true;
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AutomotiveBusiness",
        "name": "FTX – FIRST TORQUE X",
        "image": "https://firsttorquex.com/images/gallery/gt3rs-ppf.jpg",
        "@id": "https://firsttorquex.com",
        "url": `https://firsttorquex.com/${locale}`,
        "telephone": "+966 54 951 1812",
        "priceRange": "$$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jubail – King Faisal West Road, Opposite Lulu Hypermarket",
            "addressLocality": "Jubail",
            "addressRegion": "Eastern Province",
            "addressCountry": "SA",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.9866,
            "longitude": 49.6455,
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "12:00",
            "closes": "23:00",
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Automotive Protection & Detailing Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Paint Protection Film (PPF)",
                        "description": "Ultra-clear self-healing thermoplastic protection against stone chips, scratches, and road debris."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "9H+ Ceramic Coating",
                        "description": "Permanent hydrophobic nano-ceramic shield for extreme optical gloss and UV defense."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Surgical Car Detailing",
                        "description": "Multi-stage paint correction, interior leather restoration, and engine bay detailing."
                    }
                }
            ]
        }
    };

    return (
        <>
            {/* Fast high-priority preload strictly for the Hero canvas on the homepage */}
            <link rel="preload" as="image" href="/video/frames/frame_0001.webp" type="image/webp" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* 1. Cinematic Hero */}
            {isVisible("hero") && <HeroSection locale={locale} messages={messages} />}

            {/* 2. Editorial Philosophy Intro (About) */}
            {isVisible("intro") && <IntroSection locale={locale} messages={messages} />}

            {/* 3. Core Services Grid (Services) */}
            {isVisible("services") && <ServicesGrid locale={locale} messages={messages} services={services} />}

            {/* 4. Why FTX 4-Pillars (Packages) */}
            {isVisible("why_ftx") && <WhyFTX locale={locale} messages={messages} />}

            {/* 5. Interactive Before/After & Gallery Showcase (Our Work) */}
            {isVisible("gallery") && <FeaturedWork locale={locale} messages={messages} />}

            {/* 6. Client Testimonials */}
            {isVisible("testimonials") && <Testimonials locale={locale} messages={messages} />}

            {/* 7. Book a Studio Visit / Quick Quote (Contacts) */}
            {isVisible("contact") && (
                <section id="contact" className="py-10 sm:py-12 bg-black relative overflow-hidden">
                    {/* Atmospheric Lime Ambient Glow (Bottom Right - Desktop Only for GPU Optimization) */}
                    <div
                        className="absolute bottom-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0 hidden sm:block"
                        style={{ background: "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                    />

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        {/* Header with Title */}
                        <div className="mb-8 sm:mb-10 text-left max-w-3xl space-y-3">
                            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                                <span>{messages.contact?.heroSub || (locale === "ar" ? "دقة فائقة" : "UNYIELDING PRECISION")}</span>
                            </div>
                            <TextReveal as="h2" className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight leading-tight sm:leading-[0.95]">
                                <span>{messages.contact?.heroTitle || (locale === "ar" ? "حجز استشارة" : "BOOK CONSULTATION")}</span>
                            </TextReveal>
                        </div>

                        <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-ftx-silver">Loading Form...</div>}>
                            <ContactForm locale={locale} messages={messages} initialServices={services} />
                        </Suspense>
                    </div>
                </section>
            )}
        </>
    );
}
