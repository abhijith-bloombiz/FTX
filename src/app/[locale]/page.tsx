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
            <section id="contact" className="py-10 sm:py-12 bg-ftx-black relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollScrubFloor>
                        <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-ftx-silver">Loading Form...</div>}>
                            <ContactForm locale={locale} messages={messages} />
                        </Suspense>
                    </ScrollScrubFloor>
                </div>
            </section>
        </>
    );
}
