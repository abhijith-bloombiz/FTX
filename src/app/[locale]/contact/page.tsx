import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { ContactForm } from "@/components/ui/ContactForm";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

import { getCmsPageSection, getCmsServices } from "@/lib/cms";

export const revalidate = 60;

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ContactPageProps {
    params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: ContactPageProps) {
    const isAr = locale === "ar";
    return {
        title: isAr
            ? "حجز استشارة وزيارة الاستوديو | تواصل معنا | First Torque X"
            : "Book a Studio Consultation | Contact Us | First Torque X",
        description: isAr
            ? "تواصل مع فريق خبراء FTX لحجز موعد استشارة دقيقة لسيارتك الفاخرة أو لطلب عرض سعر مخصص لأفلام الحماية والسيراميك."
            : "Schedule an appointment or request a bespoke quote with the FTX concierge team. Climate-controlled studio consultations for PPF, Ceramic Coating, and Detailing.",
        alternates: {
            canonical: `https://firsttorquex.com/${locale}/contact`,
            languages: {
                en: "https://firsttorquex.com/en/contact",
                ar: "https://firsttorquex.com/ar/contact",
                "x-default": "https://firsttorquex.com/en/contact",
            },
        },
        openGraph: {
            title: isAr
                ? "تواصل معنا | First Torque X"
                : "Contact Us | First Torque X Studio",
            description: isAr
                ? "احجز موعد استشارة وتعرف على باقات حماية وتلميع سيارتك."
                : "Book a personalized studio consultation for your vehicle with First Torque X.",
            url: `https://firsttorquex.com/${locale}/contact`,
            siteName: "First Torque X",
            images: [
                {
                    url: "/brand/ftx-3d-logo.webp",
                    width: 1200,
                    height: 630,
                    alt: "Contact Us | First Torque X Concierge",
                },
            ],
            locale: isAr ? "ar_AE" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: isAr ? "تواصل معنا | First Torque X" : "Contact Us | First Torque X",
            description: isAr
                ? "احجز موعد استشارة وتعرف على باقات حماية وتلميع سيارتك."
                : "Book a personalized studio consultation with First Torque X.",
            images: ["/brand/ftx-3d-logo.webp"],
        },
    };
}

export default async function ContactPage({ params: { locale } }: ContactPageProps) {
    const [messages, contactSection, services] = await Promise.all([
        getMessages(locale),
        getCmsPageSection("contact", "info"),
        getCmsServices(),
    ]);

    const headerTitle = contactSection?.title?.[locale] || (locale === "ar" ? "تواصل معنا" : "CONTACT US");
    const headerSubtitle = contactSection?.subtitle?.[locale] || messages.contact?.heroSub || "Get in touch with our studio team or submit a custom quote request below.";
    const headerDescription = contactSection?.content?.[locale];

    const isAr = locale === "ar";
    const address = isAr
        ? (contactSection?.metadata?.addressAr || contactSection?.metadata?.address?.ar || contactConfig.address[locale])
        : (contactSection?.metadata?.addressEn || contactSection?.metadata?.address?.en || contactConfig.address[locale]);

    const workingHours = isAr
        ? (contactSection?.metadata?.workingHoursAr || contactSection?.metadata?.workingHours?.ar || contactConfig.workingHours[locale])
        : (contactSection?.metadata?.workingHoursEn || contactSection?.metadata?.workingHours?.en || contactConfig.workingHours[locale]);

    const phone = contactSection?.metadata?.phone || contactConfig.phone;
    const phoneRaw = phone.replace(/\s+/g, "");
    const email = contactSection?.metadata?.email || contactConfig.email;
    const mapsUrl = contactSection?.metadata?.mapsUrl || contactConfig.mapsUrl;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": `https://firsttorquex.com/${locale}/contact`,
                "name": isAr ? "تواصل مع First Torque X" : "Contact First Torque X",
                "url": `https://firsttorquex.com/${locale}/contact`,
                "mainEntity": {
                    "@type": "AutomotiveBusiness",
                    "name": "First Torque X",
                    "image": "https://firsttorquex.com/brand/ftx-3d-logo.webp",
                    "telephone": phone,
                    "email": email,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": address,
                        "addressLocality": "Jubail",
                        "addressRegion": "Eastern Province",
                        "addressCountry": "SA"
                    }
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
                        "name": isAr ? "تواصل معنا" : "Contact",
                        "item": `https://firsttorquex.com/${locale}/contact`
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
            {/* Atmospheric Lime Ambient Glow (Bottom Right - Desktop Only for GPU Optimization) */}
            <div
                className="absolute bottom-0 right-0 w-full sm:w-[700px] h-[250px] sm:h-[350px] pointer-events-none z-0 hidden sm:block"
                style={{ background: "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(164, 214, 94, 0.32) 0%, rgba(164, 214, 94, 0.1) 45%, transparent 75%)" }}
            />
            {/* Global Header */}
            <PageHeader
                badge={contactSection?.subtitle?.[locale] || messages.contact.formTitle || "QUOTATION & INQUIRIES"}
                title={headerTitle}
                subtitle={headerDescription || headerSubtitle}
            />

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Contact Cards & Studio Info */}
                    <ScrollReveal type="editorial" className="lg:col-span-5 space-y-8">
                        <div className="bg-ftx-surface border border-ftx-surface-high ftx-squircle-xl overflow-hidden shadow-2xl hover:border-ftx-lime/50 transition-colors duration-300">
                            <div className="p-6 sm:p-10 space-y-8">
                                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase tracking-wide border-b border-ftx-surface-high pb-5">
                                    {messages.contact.visitStudio}
                                </h2>

                                <div className="space-y-6 text-xs font-body">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.location || "Studio Location"}</div>
                                            <div className="text-ftx-silver mt-1 leading-relaxed">{address}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.telephone || "Telephone"}</div>
                                            <a href={`tel:${phoneRaw}`} className="font-mono text-ftx-silver hover:text-white mt-1 block">
                                                {phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.emailStudio || "Email Studio"}</div>
                                            <a href={`mailto:${email}`} className="font-mono text-ftx-silver hover:text-white mt-1 block">
                                                {email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.operatingHours || "Operating Hours"}</div>
                                            <div className="text-ftx-silver mt-1 leading-relaxed">{workingHours}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Direct WhatsApp CTA */}
                                <div className="pt-6 border-t border-ftx-surface-high">
                                    <a
                                        href={getWhatsAppUrl({ locale, phoneNumber: phone })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ftx-btn-tech ftx-btn-specular w-full inline-flex items-center justify-center gap-2 py-4 px-6 text-xs font-mono font-bold text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-colors shadow-lime-glow"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{messages.common.whatsappUs}</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Google Map View Container */}
                        <div className="bg-ftx-surface border border-ftx-surface-high ftx-squircle-xl overflow-hidden shadow-2xl relative group hover:border-ftx-lime/50 transition-colors duration-300">
                            <div className="relative w-full h-[280px] sm:h-[320px] bg-ftx-obsidian">
                                <GoogleMapEmbed
                                    title="FTX Studio Location Map"
                                    src={mapsUrl}
                                />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Right Column: Contact & Quotation Form */}
                    <div className="lg:col-span-7">
                        <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-ftx-silver">Loading Form...</div>}>
                            <ContactForm locale={locale} messages={messages} initialServices={services} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
