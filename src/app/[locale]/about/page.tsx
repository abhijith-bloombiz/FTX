import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Award, Wrench } from "lucide-react";
import { Locale } from "@/i18n/config";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

async function getMessages(locale: Locale) {
    return (await import(`@/i18n/messages/${locale}.json`)).default;
}

interface AboutPageProps {
    params: { locale: Locale };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
    const messages = await getMessages(locale);

    return (
        <div className="pt-24 pb-20 bg-ftx-black">
            {/* Synchronized Global Header */}
            <PageHeader
                badge={messages.about?.heroBadge || messages.nav?.about || "ABOUT FTX"}
                titleLine1="SURGICAL"
                titleLine2="PERFECTION."
                subtitle={messages.about?.heroSub || messages.intro?.p1}
            />

            {/* Studio Philosophy & Craftsmanship */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <ScrollReveal type="editorial" className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-ftx-surface border border-ftx-lime/40 text-[10px] font-mono text-ftx-lime uppercase rounded">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>THE FTX STANDARD</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
                            PRECISION AUTOMOTIVE ENGINEERING MEETS SURGICAL DETAILING
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm text-ftx-silver font-body leading-relaxed">
                            <p>{messages.intro.p1}</p>
                            <p>{messages.intro.p2}</p>
                            <p>
                                Founded by passionate automotive perfectionists, FTX – First Torque X was created to set a new global benchmark in supercar protection film installation, ceramic paint coating, and bespoke paint correction in Dubai.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                <div className="text-2xl font-mono font-black text-ftx-lime">100%</div>
                                <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">Dust-Free Bays</div>
                            </div>
                            <div className="p-4 bg-ftx-surface border border-ftx-surface-high ftx-squircle-md">
                                <div className="text-2xl font-mono font-black text-ftx-lime">1,500+</div>
                                <div className="text-[10px] font-mono text-ftx-silver uppercase mt-1">Supercars Protected</div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal type="image-mask" delay={150} className="lg:col-span-6 relative">
                        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-ftx-surface-high shadow-2xl">
                            <Image
                                src="/images/about/craftsmanship.jpg"
                                alt="FTX Studio Master Technicians"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Facilities & Equipment Highlights */}
            <section className="py-20 bg-ftx-obsidian">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal type="heading-inset" className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                            INFRASTRUCTURE
                        </span>
                        <h2 className="text-3xl font-heading font-black text-white uppercase mt-2">
                            CLIMATE-CONTROLLED PRECISION BAYS
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ScrollReveal type="editorial" delay={100}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/plotter.jpg"
                                        alt="Surgical Plotter Cutting"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">Surgical Plotter Cutting</h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        Computer-guided DAP software plots vehicle-specific templates so blades never touch your vehicle's factory paint.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal type="editorial" delay={200}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/hepa-bay.jpg"
                                        alt="HEPA Filtered Air"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">HEPA Filtered Air</h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        Positive air pressure studio bays eliminate airborne dust particles during the PPF installation process.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal type="editorial" delay={300}>
                            <div className="ftx-border-card ftx-squircle-lg group cursor-pointer bg-ftx-surface border border-ftx-surface-high flex flex-col justify-between h-full shadow-xl">
                                <div className="relative w-full aspect-[16/10] overflow-hidden">
                                    <Image
                                        src="/images/about/infrared.jpg"
                                        alt="Curing Infrared Lamps"
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ftx-surface via-ftx-surface/40 to-transparent opacity-90" />
                                    <div className="absolute top-4 left-4 p-2.5 ftx-squircle-sm bg-ftx-obsidian/90 border border-ftx-lime/40 text-ftx-lime group-hover:scale-110 transition-transform">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                                    <h3 className="text-lg font-heading font-bold text-white uppercase group-hover:text-ftx-lime transition-colors">Curing Infrared Lamps</h3>
                                    <p className="text-xs text-ftx-silver-muted font-body leading-relaxed">
                                        Shortwave infrared curing locks in ceramic coatings at optimal temperature matrices for maximum gloss and durability.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Book Visit Banner */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <ScrollReveal type="scale">
                    <div className="p-12 bg-gradient-to-r from-ftx-surface via-ftx-obsidian to-ftx-surface border border-ftx-lime/30 ftx-squircle-xl space-y-6">
                        <h2 className="text-3xl font-heading font-black text-white uppercase">
                            EXPERIENCE THE FTX STUDIO IN PERSON
                        </h2>
                        <p className="text-xs sm:text-sm text-ftx-silver max-w-xl mx-auto font-body">
                            Schedule a private consultation with our master detailers and inspect our active PPF & Ceramic projects.
                        </p>
                        <div>
                            <Link
                                href={`/${locale}/contact`}
                                className="ftx-btn-tech ftx-btn-specular inline-flex items-center gap-2 px-8 py-4 text-xs font-mono font-bold tracking-wider text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-colors shadow-lime-glow"
                            >
                                <span>{messages.contact.formTitle}</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
