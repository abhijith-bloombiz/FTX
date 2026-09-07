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

export const dynamic = "force-dynamic";

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
                if (sec.sectionKey === "intro" && sec.title?.[lang]) {
                    messages.intro = messages.intro || {};
                    messages.intro.title = sec.title[lang];
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
                if (sec.sectionKey === "services" && sec.title?.[lang]) {
                    messages.servicesSection = messages.servicesSection || {};
                    messages.servicesSection.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.servicesSection.badge = sec.subtitle[lang];
                }
                if (sec.sectionKey === "why_ftx" && sec.title?.[lang]) {
                    messages.whyFtx = messages.whyFtx || {};
                    messages.whyFtx.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.whyFtx.badge = sec.subtitle[lang];
                    if (sec.metadata?.card1Title?.[lang]) messages.whyFtx.v1Title = sec.metadata.card1Title[lang];
                    if (sec.metadata?.card1Desc?.[lang]) messages.whyFtx.v1Desc = sec.metadata.card1Desc[lang];
                    if (sec.metadata?.card1Image) messages.whyFtx.v1Image = sec.metadata.card1Image;

                    if (sec.metadata?.card2Title?.[lang]) messages.whyFtx.v2Title = sec.metadata.card2Title[lang];
                    if (sec.metadata?.card2Desc?.[lang]) messages.whyFtx.v2Desc = sec.metadata.card2Desc[lang];
                    if (sec.metadata?.card2Image) messages.whyFtx.v2Image = sec.metadata.card2Image;

                    if (sec.metadata?.card3Title?.[lang]) messages.whyFtx.v3Title = sec.metadata.card3Title[lang];
                    if (sec.metadata?.card3Desc?.[lang]) messages.whyFtx.v3Desc = sec.metadata.card3Desc[lang];
                    if (sec.metadata?.card3Image) messages.whyFtx.v3Image = sec.metadata.card3Image;

                    if (sec.metadata?.card4Title?.[lang]) messages.whyFtx.v4Title = sec.metadata.card4Title[lang];
                    if (sec.metadata?.card4Desc?.[lang]) messages.whyFtx.v4Desc = sec.metadata.card4Desc[lang];
                    if (sec.metadata?.card4Image) messages.whyFtx.v4Image = sec.metadata.card4Image;
                }
                if (sec.sectionKey === "gallery" && sec.title?.[lang]) {
                    messages.gallery = messages.gallery || {};
                    messages.gallery.heroTitle = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.gallery.heroSub = sec.subtitle[lang];
                }
                if (sec.sectionKey === "testimonials" && sec.title?.[lang]) {
                    messages.testimonials = messages.testimonials || {};
                    messages.testimonials.title = sec.title[lang];
                    if (sec.subtitle?.[lang]) messages.testimonials.badge = sec.subtitle[lang];
                }
                if (sec.sectionKey === "contact" && sec.title?.[lang]) {
                    messages.contact = messages.contact || {};
                    messages.contact.heroTitle = sec.title[lang];
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
        title: "First Torque X",
        description: isAr
            ? "استوديو دبي الرائد لحماية السيارات المتخصص في أفلام حماية الطلاء (PPF)، وتغليف السيراميك 9H+، وتصحيح الطلاء، والعناية الفائقة بالسيارات."
            : "Dubai's premier automotive protection studio specializing in Paint Protection Film (PPF), 9H+ Ceramic Coatings, Surgical Paint Correction, and Bespoke Car Detailing.",
        alternates: {
            canonical: `https://ftx.ae/${locale}`,
            languages: {
                en: "https://ftx.ae/en",
                ar: "https://ftx.ae/ar",
            },
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
        "image": "https://ftx.ae/images/gallery/ppf-studio-hero.jpg",
        "@id": "https://ftx.ae",
        "url": `https://ftx.ae/${locale}`,
        "telephone": "+971500000000",
        "priceRange": "$$$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Al Quoz Industrial Area 3",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "addressCountry": "AE",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.1328,
            "longitude": 55.2289,
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00",
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
                    {/* Atmospheric Lime Ambient Glow (Bottom Right) */}
                    <div
                        className="absolute bottom-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
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
