"use client";

import React, { useState, useEffect } from "react";
import { Phone, X, MessageCircle } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { Locale, isRtl } from "@/i18n/config";

interface FloatingContactWidgetProps {
    locale: Locale;
}

export function FloatingContactWidget({ locale }: FloatingContactWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const rtl = isRtl(locale);

    useEffect(() => {
        const handleScroll = () => {
            const path = window.location.pathname;
            const isHomePage =
                path === "/" ||
                path === `/${locale}` ||
                path === `/${locale}/`;

            let threshold = 100;
            if (isHomePage) {
                const heroEl = document.getElementById("hero-section");
                if (heroEl) {
                    // Pin distance is 3000px, frame scrub completes around 2500px - 2800px
                    threshold = Math.max(2400, heroEl.offsetHeight - window.innerHeight - 200);
                } else {
                    threshold = 2400;
                }
            }

            setIsVisible(window.scrollY >= threshold);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [locale]);

    const whatsappUrl = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
        locale === "ar"
            ? "مرحباً، أود الاستفسار عن خدمات FTX لحماية وتلميع السيارات."
            : "Hello, I would like to inquire about FTX automotive protection & detailing services."
    )}`;

    return (
        <div
            className={`fixed bottom-6 ${rtl ? "left-6" : "right-6"} z-50 flex flex-col items-center gap-3 transition-all duration-500 ease-out ${isVisible
                ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                : "opacity-0 translate-y-8 pointer-events-none scale-90"
                }`}
        >
            {/* Expanded Stacked Action Buttons */}
            <div
                className={`flex flex-col items-center gap-3 transition-all duration-300 ${isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                    : "opacity-0 translate-y-4 pointer-events-none scale-90"
                    }`}
            >
                {/* 1. Phone Button (Red Circle) */}
                <a
                    href={`tel:${contactConfig.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Call FTX"
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group relative"
                >
                    <Phone className="w-5 h-5 fill-white text-white" />
                    {/* Tooltip */}
                    <span
                        className={`absolute ${rtl ? "right-14" : "left-auto right-14"
                            } px-2.5 py-1 bg-ftx-obsidian border border-ftx-surface-high text-white text-[11px] font-mono font-bold whitespace-nowrap rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
                    >
                        {locale === "ar" ? "اتصل بنا" : "Call Us"}
                    </span>
                </a>

                {/* 2. WhatsApp Button (Green Circle) */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="w-12 h-12 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 group relative"
                >
                    <svg
                        className="w-6 h-6 fill-white"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    {/* Tooltip */}
                    <span
                        className={`absolute ${rtl ? "right-14" : "left-auto right-14"
                            } px-2.5 py-1 bg-ftx-obsidian border border-ftx-surface-high text-white text-[11px] font-mono font-bold whitespace-nowrap rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
                    >
                        {locale === "ar" ? "واتساب" : "WhatsApp"}
                    </span>
                </a>
            </div>

            {/* 3. Bottom Toggle Button (Dark Circle with X or Message Icon) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Quick Contact"
                className="w-12 h-12 rounded-full bg-[#334155] hover:bg-[#475569] text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group relative border border-white/10"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white transition-transform duration-300 rotate-0 hover:rotate-90" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white transition-transform duration-300 scale-105" />
                )}
            </button>
        </div>
    );
}
