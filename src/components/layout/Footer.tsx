"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Clock, Instagram, Youtube, Facebook } from "lucide-react";
import { navItems } from "@/config/navigation";
import { contactConfig } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { Locale } from "@/i18n/config";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface FooterProps {
    locale: Locale;
    messages: any;
}

export function Footer({ locale, messages }: FooterProps) {
    const pathname = usePathname();

    if (pathname?.includes("/admin")) {
        return null;
    }
    return (
        <footer className="relative bg-black text-ftx-silver border-t border-ftx-surface-high overflow-hidden">
            {/* Background Honeycomb Texture */}
            <div className="absolute inset-0 bg-honeycomb opacity-60 pointer-events-none z-0" />

            {/* Main Footer Links */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <ScrollReveal type="card" delay={0} duration={850}>
                        <div className="space-y-4">
                            <Link href={`/${locale}/admin/login`} className="inline-block" aria-label="Admin Portal">
                                <div className="relative w-44 h-12">
                                    <Image
                                        src="/brand/ftx-3d-logo.webp"
                                        alt="FTX – First Torque X"
                                        fill
                                        className="object-contain ltr:object-left rtl:object-right"
                                    />
                                </div>
                            </Link>

                            <p className="text-xs text-ftx-silver-muted leading-relaxed font-body">
                                {siteConfig.description[locale]}
                            </p>

                            {/* Social Media Links with FTX Squircle Custom Border Radius */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href={contactConfig.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 text-ftx-silver hover:text-ftx-black bg-ftx-surface hover:bg-ftx-lime border border-ftx-surface-high hover:border-ftx-lime ftx-squircle-sm transition-all duration-300 group hover:shadow-[0_0_20px_rgba(164,214,94,0.45)] relative overflow-hidden ftx-btn-specular"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-12" />
                                </a>
                                <a
                                    href={contactConfig.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 text-ftx-silver hover:text-ftx-black bg-ftx-surface hover:bg-ftx-lime border border-ftx-surface-high hover:border-ftx-lime ftx-squircle-sm transition-all duration-300 group hover:shadow-[0_0_20px_rgba(164,214,94,0.45)] relative overflow-hidden ftx-btn-specular"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6" />
                                </a>
                                <a
                                    href={contactConfig.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 text-ftx-silver hover:text-ftx-black bg-ftx-surface hover:bg-ftx-lime border border-ftx-surface-high hover:border-ftx-lime ftx-squircle-sm transition-all duration-300 group hover:shadow-[0_0_20px_rgba(164,214,94,0.45)] relative overflow-hidden ftx-btn-specular"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:rotate-6" />
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Quick Links */}
                    <ScrollReveal type="card" delay={100} duration={850}>
                        <div>
                            <h4 className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase mb-4 border-b border-ftx-surface-high/60 pb-2">
                                {messages.common.learnMore}
                            </h4>
                            <ul className="space-y-2.5">
                                {navItems.map((item) => (
                                    <li key={item.key}>
                                        <Link
                                            href={`/${locale}${item.href}`}
                                            className="text-xs font-mono text-ftx-silver hover:text-ftx-lime transition-colors duration-200 flex items-center gap-1.5"
                                        >
                                            <span className="text-ftx-lime/50">›</span>
                                            <span>{messages.nav[item.key]}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </ScrollReveal>

                    {/* Core Services */}
                    <ScrollReveal type="card" delay={200} duration={850}>
                        <div>
                            <h4 className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase mb-4 border-b border-ftx-surface-high/60 pb-2">
                                {messages.common.ourServices}
                            </h4>
                            <ul className="space-y-2.5 text-xs font-mono text-ftx-silver">
                                <li>
                                    <Link href={`/${locale}/services#ppf`} className="hover:text-ftx-lime transition-colors">
                                        {messages.servicesSection.ppfTitle}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/${locale}/services#ceramic`} className="hover:text-ftx-lime transition-colors">
                                        {messages.servicesSection.ceramicTitle}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/${locale}/services#detailing`} className="hover:text-ftx-lime transition-colors">
                                        {messages.servicesSection.detailingTitle}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/${locale}/packages`} className="hover:text-ftx-lime transition-colors">
                                        {messages.packages.heroTitle}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>

                    {/* Studio Contact Info */}
                    <ScrollReveal type="card" delay={300} duration={850}>
                        <div>
                            <h4 className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase mb-4 border-b border-ftx-surface-high/60 pb-2">
                                {messages.contact.visitStudio}
                            </h4>
                            <ul className="space-y-3 text-xs text-ftx-silver font-body">
                                <li className="flex items-start gap-2.5">
                                    <MapPin className="w-4 h-4 text-ftx-lime shrink-0 mt-0.5" />
                                    <span>{contactConfig.address[locale]}</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <Phone className="w-4 h-4 text-ftx-lime shrink-0" />
                                    <a href={`tel:${contactConfig.phoneRaw}`} className="font-mono hover:text-white transition-colors">
                                        {contactConfig.phone}
                                    </a>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <Mail className="w-4 h-4 text-ftx-lime shrink-0" />
                                    <a href={`mailto:${contactConfig.email}`} className="font-mono hover:text-white transition-colors">
                                        {contactConfig.email}
                                    </a>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Clock className="w-4 h-4 text-ftx-lime shrink-0 mt-0.5" />
                                    <span>{contactConfig.workingHours[locale]}</span>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="border-t border-ftx-surface-high/60 py-4 bg-black relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ftx-silver-muted">
                    <div>
                        © {new Date().getFullYear()} {siteConfig.name}. {messages.common.allRightsReserved}
                    </div>
                    <div className="flex items-center gap-6">
                        <span>AUTOMOTIVE PRECISION & PROTECTION</span>
                        <span className="text-ftx-lime font-bold">DUBAI STUDIO</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
