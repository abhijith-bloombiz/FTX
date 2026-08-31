import { Suspense } from "react";
import { Locale, locales } from "@/i18n/config";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyFTX } from "@/components/sections/WhyFTX";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/ui/ContactForm";
import { ScrollScrubFloor } from "@/components/motion/ScrollScrubFloor";

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

interface HomePageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: HomePageProps) {
    const isAr = locale === "ar";
    return {
        title: isAr ? "FTX – فيرست تورك اكس | استوديو حماية العناية الفائقة بالسيارات دبي" : "FTX – First Torque X | Luxury Automotive Protection & Detailing Studio Dubai",
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
    const messages = await getMessages(locale);

    return (
        <>
            {/* 1. Cinematic Hero */}
            <HeroSection locale={locale} messages={messages} />

            {/* 2. Editorial Philosophy Intro (About) */}
            <IntroSection locale={locale} messages={messages} />

            {/* 3. Core Services Grid (Services) */}
            <ServicesGrid locale={locale} messages={messages} />

            {/* 4. Why FTX 4-Pillars (Packages) */}
            <WhyFTX locale={locale} messages={messages} />

            {/* 5. Interactive Before/After & Gallery Showcase (Our Work) */}
            <FeaturedWork locale={locale} messages={messages} />

            {/* 6. Client Testimonials */}
            <Testimonials locale={locale} messages={messages} />

            {/* 7. Book a Studio Visit / Quick Quote (Contacts) */}
            <section id="contact" className="py-10 sm:py-12 bg-black relative overflow-hidden">
                {/* Atmospheric Lime Ambient Glow (Bottom Left) */}
                <div
                    className="absolute bottom-0 left-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0"
                    style={{ background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
                />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-ftx-silver">Loading Form...</div>}>
                        <ContactForm locale={locale} messages={messages} />
                    </Suspense>
                </div>
            </section>
        </>
    );
}
