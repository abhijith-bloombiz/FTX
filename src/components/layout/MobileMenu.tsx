"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageSquare, X, ChevronRight } from "lucide-react";
import { navItems } from "@/config/navigation";
import { contactConfig } from "@/config/contact";
import { Locale } from "@/i18n/config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

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
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-between select-none overflow-y-auto">
            {/* 1. Backdrop Glass Blur Layer */}
            <div
                className={`fixed inset-0 bg-[#060606]/95 backdrop-blur-2xl transition-opacity duration-500 ease-in-out ${animateIn ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Ambient Lime Accent Lighting Orb */}
            <div
                className={`fixed top-1/4 right-0 w-[400px] h-[400px] bg-ftx-lime/10 rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${animateIn ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
            />

            {/* 2. Header Bar with Close Button */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-ftx-surface-high/60">
                <div
                    className={`text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase transition-all duration-400 ease-out ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                >
                    NAVIGATION MENU
                </div>

                <button
                    onClick={onClose}
                    className={`p-2.5 text-ftx-silver hover:text-white bg-ftx-surface/80 active:scale-95 border border-ftx-surface-high ftx-squircle-sm transition-all duration-400 ease-out ${animateIn ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                        }`}
                    aria-label="Close navigation menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* 3. Main Navigation Links with Staggered Entrance & Reverse Exit Animation */}
            <div className="relative z-10 px-6 py-8 flex-1 flex flex-col justify-center space-y-3">
                <nav className="flex flex-col space-y-2">
                    {navItems.map((item, idx) => {
                        const itemHref = `/${locale}${item.href}`;
                        const isActive =
                            item.href === ""
                                ? pathname === `/${locale}`
                                : pathname.startsWith(itemHref);

                        const indexNum = String(idx + 1).padStart(2, "0");

                        // Forward entrance delay vs Reverse exit delay choreography
                        const delayMs = animateIn
                            ? idx * 60 + 60
                            : (navItems.length - 1 - idx) * 40;

                        return (
                            <div key={item.key} className="overflow-hidden py-1">
                                <Link
                                    href={itemHref}
                                    onClick={onClose}
                                    className={`group flex items-center justify-between py-2 transition-all duration-400 ease-in-out transform ${animateIn
                                        ? "opacity-100 translate-y-0 filter-none"
                                        : "opacity-0 -translate-y-8 blur-sm"
                                        }`}
                                    style={{
                                        transitionDelay: `${delayMs}ms`,
                                    }}
                                >
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-xs font-mono text-ftx-lime/70 font-bold tracking-widest">
                                            {indexNum}
                                        </span>
                                        <span
                                            className={`text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight transition-all duration-300 group-hover:translate-x-2.5 ${isActive
                                                ? "text-ftx-lime drop-shadow-[0_0_15px_rgba(164,214,94,0.4)]"
                                                : "text-white group-hover:text-ftx-lime"
                                                }`}
                                        >
                                            {messages.nav[item.key]}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isActive ? (
                                            <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-ftx-silver/40 group-hover:text-ftx-lime group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* 4. Bottom Section: Action CTAs with Exit Animation */}
            <div
                className={`relative z-10 px-6 pt-6 pb-8 border-t border-ftx-surface-high/60 space-y-3.5 transition-all duration-400 ease-in-out ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                style={{
                    transitionDelay: animateIn
                        ? `${navItems.length * 60 + 100}ms`
                        : "0ms",
                }}
            >
                <Link
                    href={`/${locale}/contact`}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-4 text-xs font-mono font-bold tracking-widest text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-all duration-300 shadow-lime-glow active:scale-98"
                >
                    <span>{messages.common.getQuote}</span>
                    <ArrowUpRight className="w-4 h-4" />
                </Link>

                <a
                    href={getWhatsAppUrl({ locale })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 text-xs font-mono font-bold tracking-widest text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high ftx-squircle-sm transition-all duration-300 active:scale-98"
                >
                    <MessageSquare className="w-4 h-4 text-ftx-lime" />
                    <span>{messages.common.whatsappUs}</span>
                </a>

                <div className="pt-2 text-center text-[10px] font-mono text-ftx-silver/40 tracking-wider">
                    {contactConfig.phone} • {contactConfig.email}
                </div>
            </div>
        </div>
    );
}
