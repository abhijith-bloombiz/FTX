"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageSquare, X, ChevronRight } from "lucide-react";
import { navItems } from "@/config/navigation";
import { Locale } from "@/i18n/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { AnimatedHamburger } from "./AnimatedHamburger";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    locale: Locale;
    messages: any;
}

export function MobileMenu({ isOpen, onClose, locale, messages }: MobileMenuProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(isOpen);
    const [animateIn, setAnimateIn] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Synchronize animation and mount state with parent `isOpen` prop
    useEffect(() => {
        if (isOpen) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setMounted(true);
            document.body.style.overflow = "hidden";
            // Trigger dropping entrance animation on next frame
            const timer = setTimeout(() => setAnimateIn(true), 25);
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
            // Delay unmounting until reverse exit animation completes (450ms)
            timeoutRef.current = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = "unset";
            }, 450);
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [isOpen]);

    // Handle ESC key press to trigger close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!mounted && !isOpen) return null;

    return (
        <div className="fixed top-[74px] sm:top-[86px] left-0 right-0 bottom-0 z-40 md:hidden flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden">
            {/* 1. Backdrop Layer */}
            <div
                className={`fixed inset-0 top-[74px] sm:top-[86px] bg-[#060606]/98 backdrop-blur-md transition-opacity duration-300 ease-in-out ${animateIn ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Ambient Lime Accent Lighting Orb */}
            <div
                className={`fixed top-1/3 right-0 w-[280px] h-[280px] rounded-full pointer-events-none transition-all duration-500 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                style={{
                    background: "radial-gradient(circle, rgba(164, 214, 94, 0.14) 0%, transparent 70%)",
                }}
            />

            {/* 2. Main Navigation Links directly under top navbar */}
            <div className="relative z-10 px-6 py-8 flex-1 flex flex-col justify-center space-y-3">
                <nav className="flex flex-col space-y-2">
                    {navItems.map((item, idx) => {
                        const itemHref = `/${locale}${item.href}`;
                        const isActive =
                            item.href === ""
                                ? pathname === `/${locale}`
                                : pathname.startsWith(itemHref);

                        // Forward entrance delay vs Reverse exit delay choreography
                        const delayMs = animateIn
                            ? idx * 60 + 60
                            : (navItems.length - 1 - idx) * 40;

                        const aspectClass = item.key === "contact" ? "aspect-[2030/775]" : "aspect-[2172/724]";
                        // Scaled 1.5x for mobile menu items with custom fine-tuning
                        const heightClass =
                            item.key === "home"
                                ? "h-[27px] sm:h-[33px]"
                                : item.key === "about"
                                    ? "h-[29px] sm:h-[35px]"
                                    : item.key === "gallery"
                                        ? "h-[36px] sm:h-[42px]"
                                        : item.key === "services"
                                            ? "h-[36px] sm:h-[42px]"
                                            : item.key === "packages"
                                                ? "h-[40px] sm:h-[46px]"
                                                : "h-[42px] sm:h-[48px]";

                        return (
                            <div key={item.key} className={`overflow-hidden ${item.key === "home" ? "mb-2 sm:mb-2.5" : ""}`}>
                                <Link
                                    href={itemHref}
                                    onClick={onClose}
                                    className={`group flex items-center justify-between py-1 transition-all duration-400 ease-in-out transform ${animateIn
                                        ? "opacity-100 translate-y-0 filter-none"
                                        : "opacity-0 -translate-y-8 blur-sm"
                                        }`}
                                    style={{
                                        transitionDelay: `${delayMs}ms`,
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Sleek green line indicator replacing numbers 01..06 */}
                                        <span
                                            className={`w-1.5 sm:w-2 rounded-full bg-ftx-lime transition-all duration-300 ${isActive
                                                ? "h-10 sm:h-12 opacity-100 shadow-[0_0_14px_rgba(164,214,94,0.85)]"
                                                : "h-7 sm:h-8 opacity-40 group-hover:opacity-100 group-hover:h-10 sm:group-hover:h-12 shadow-[0_0_8px_rgba(164,214,94,0.5)]"
                                                }`}
                                        />
                                        {locale === "en" ? (
                                            <div
                                                className={`${heightClass} ${aspectClass} transition-all duration-300 group-hover:translate-x-2.5 ${isActive
                                                    ? "bg-ftx-lime drop-shadow-[0_0_15px_rgba(164,214,94,0.6)]"
                                                    : "bg-white group-hover:bg-ftx-lime"
                                                    }`}
                                                style={{
                                                    maskImage: `url('/fonts/nav/${item.key}.svg')`,
                                                    WebkitMaskImage: `url('/fonts/nav/${item.key}.svg')`,
                                                    maskSize: "contain",
                                                    WebkitMaskSize: "contain",
                                                    maskRepeat: "no-repeat",
                                                    WebkitMaskRepeat: "no-repeat",
                                                    maskPosition: "center",
                                                    WebkitMaskPosition: "center",
                                                }}
                                                aria-label={messages?.nav?.[item.key] || item.key}
                                            />
                                        ) : (
                                            <span
                                                className={`text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider transition-all duration-300 group-hover:translate-x-2.5 ${isActive
                                                    ? "text-ftx-lime drop-shadow-[0_0_15px_rgba(164,214,94,0.6)]"
                                                    : "text-white group-hover:text-ftx-lime"
                                                    }`}
                                            >
                                                {messages?.nav?.[item.key] || item.key}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-ftx-silver/40 group-hover:text-ftx-lime group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* 4. Bottom Section: Action CTAs with Left & Right Entrance Animations */}
            <div
                className={`relative z-10 px-6 pt-6 pb-8 border-t border-ftx-surface-high/60 space-y-3.5 overflow-hidden transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
                    }`}
                style={{
                    transitionDelay: animateIn
                        ? `${navItems.length * 60}ms`
                        : "0ms",
                }}
            >
                {/* 1st Button: Slides in from the left */}
                <div
                    className={`w-full transition-all duration-500 ease-out transform ${animateIn
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-full"
                        }`}
                    style={{
                        transitionDelay: animateIn
                            ? `${navItems.length * 60 + 60}ms`
                            : "40ms",
                    }}
                >
                    <Link
                        href={`/${locale}/contact`}
                        onClick={onClose}
                        className="w-full inline-flex items-center justify-center gap-2.5 py-4 text-xs font-mono font-bold tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright ftx-squircle-sm transition-all duration-300 shadow-lime-glow active:scale-98"
                    >
                        <span>{messages.common.getQuote}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* 2nd Button: Slides in from the right */}
                <div
                    className={`w-full transition-all duration-500 ease-out transform ${animateIn
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-full"
                        }`}
                    style={{
                        transitionDelay: animateIn
                            ? `${navItems.length * 60 + 140}ms`
                            : "0ms",
                    }}
                >
                    <a
                        href={getWhatsAppUrl({ locale })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high ftx-squircle-sm transition-all duration-300 active:scale-98"
                    >
                        <MessageSquare className="w-4 h-4 text-ftx-lime" />
                        <span>{messages.common.whatsappUs}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
