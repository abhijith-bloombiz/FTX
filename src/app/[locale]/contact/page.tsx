import { Suspense } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, ExternalLink } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { ContactForm } from "@/components/ui/ContactForm";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollScrubFloor } from "@/components/motion/ScrollScrubFloor";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface ContactPageProps {
    params: { locale: Locale };
}

export default async function ContactPage({ params: { locale } }: ContactPageProps) {
    const messages = await getMessages(locale);

    return (
        <div className="pt-24 pb-20 bg-ftx-black min-h-screen">
            {/* Global Header */}
            <PageHeader
                badge={messages.contact.subtitle || "STUDIO LOCATION & QUOTATION"}
                titleLine1="GET IN"
                titleLine2="TOUCH."
                subtitle="Get in touch with our studio team in Al Quoz, Dubai or submit a custom quote request below."
            />

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Contact Cards & Studio Info */}
                    <ScrollReveal type="editorial" className="lg:col-span-5 space-y-8">
                        <div className="bg-ftx-surface border border-ftx-surface-high p-8 ftx-squircle-xl ftx-border-card space-y-6">
                            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wide border-b border-ftx-surface-high pb-4">
                                {messages.contact.visitStudio}
                            </h2>

                            <div className="space-y-4 text-xs font-body">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-white uppercase">Studio Location</div>
                                        <div className="text-ftx-silver mt-0.5">{contactConfig.address[locale]}</div>
                                        <a
                                            href={contactConfig.mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-ftx-lime font-mono text-[10px] mt-1 hover:underline"
                                        >
                                            <span>Open in Google Maps</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-white uppercase">Telephone</div>
                                        <a href={`tel:${contactConfig.phoneRaw}`} className="font-mono text-ftx-silver hover:text-white">
                                            {contactConfig.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-white uppercase">Email Studio</div>
                                        <a href={`mailto:${contactConfig.email}`} className="font-mono text-ftx-silver hover:text-white">
                                            {contactConfig.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 ftx-squircle-sm bg-ftx-obsidian text-ftx-lime border border-ftx-lime/30 shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-mono font-bold text-white uppercase">Operating Hours</div>
                                        <div className="text-ftx-silver mt-0.5">{contactConfig.workingHours[locale]}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Direct WhatsApp CTA */}
                            <div className="pt-4 border-t border-ftx-surface-high">
                                <a
                                    href={getWhatsAppUrl({ locale })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ftx-btn-tech ftx-btn-specular w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-mono font-bold text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-colors shadow-lime-glow"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{messages.common.whatsappUs}</span>
                                </a>
                            </div>
                        </div>

                        {/* Map Card */}
                        <div className="bg-ftx-surface border border-ftx-surface-high p-6 ftx-squircle-lg ftx-border-card text-center space-y-3">
                            <div className="text-xs font-mono font-bold text-ftx-lime uppercase">
                                AL QUOZ INDUSTRIAL AREA 3, DUBAI
                            </div>
                            <p className="text-xs text-ftx-silver-muted font-body">
                                Climate-Controlled Supercar Enclosure & VIP Waiting Lounge
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Right Column: Contact & Quotation Form */}
                    <div className="lg:col-span-7">
                        <ScrollScrubFloor>
                            <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-ftx-silver">Loading Form...</div>}>
                                <ContactForm locale={locale} messages={messages} />
                            </Suspense>
                        </ScrollScrubFloor>
                    </div>
                </div>
            </div>
        </div>
    );
}
