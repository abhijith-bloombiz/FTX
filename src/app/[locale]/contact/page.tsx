import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { ContactForm } from "@/components/ui/ContactForm";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ContactPageProps {
    params: { locale: Locale };
}

export default async function ContactPage({ params: { locale } }: ContactPageProps) {
    const messages = await getMessages(locale);

    return (
        <div className="pt-24 pb-0 bg-black min-h-screen relative overflow-hidden">
            {/* Atmospheric Lime Ambient Glow (Top Right) */}
            <div className="absolute top-20 -right-24 w-[600px] h-[600px] bg-ftx-lime/15 blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_top_right,rgba(164,214,94,0.15),transparent_70%)] pointer-events-none z-0" />
            {/* Global Header */}
            <PageHeader
                badge={messages.contact.formTitle || "STUDIO LOCATION & QUOTATION"}
                titleLine1={locale === "ar" ? "تواصل" : "GET IN"}
                titleLine2={locale === "ar" ? "معنا." : "TOUCH."}
                subtitle={messages.contact?.heroSub || "Get in touch with our studio team in Al Quoz, Dubai or submit a custom quote request below."}
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
                                            <div className="text-ftx-silver mt-1 leading-relaxed">{contactConfig.address[locale]}</div>
                                            <a
                                                href={contactConfig.mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-ftx-lime font-mono text-[10px] mt-1.5 hover:underline"
                                            >
                                                <span>{messages.contact?.openMaps || "Open in Google Maps"}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.telephone || "Telephone"}</div>
                                            <a href={`tel:${contactConfig.phoneRaw}`} className="font-mono text-ftx-silver hover:text-white mt-1 block">
                                                {contactConfig.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.emailStudio || "Email Studio"}</div>
                                            <a href={`mailto:${contactConfig.email}`} className="font-mono text-ftx-silver hover:text-white mt-1 block">
                                                {contactConfig.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono font-bold text-white uppercase">{messages.contact?.operatingHours || "Operating Hours"}</div>
                                            <div className="text-ftx-silver mt-1 leading-relaxed">{contactConfig.workingHours[locale]}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Direct WhatsApp CTA */}
                                <div className="pt-6 border-t border-ftx-surface-high">
                                    <a
                                        href={getWhatsAppUrl({ locale })}
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
                                <iframe
                                    title="FTX Studio Location Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14446.857640277353!2d55.2287957!3d25.1453086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e366f019%3A0xb3ff76c24389df94!2sAl%20Quoz%20Industrial%20Area%203%20-%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(120%)" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                                />
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Right Column: Contact & Quotation Form */}
                    <div className="lg:col-span-7">
                        <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-ftx-silver">Loading Form...</div>}>
                            <ContactForm locale={locale} messages={messages} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
