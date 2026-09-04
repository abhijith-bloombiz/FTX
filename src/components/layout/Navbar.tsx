"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { navItems } from "@/config/navigation";
import { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { AnimatedHamburger } from "./AnimatedHamburger";

interface NavbarProps {
    locale: Locale;
    messages: any;
}

export function Navbar({ locale, messages }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const pathname = usePathname();

    // Smooth Sliding Underline State & Refs
    const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });

    const updateUnderlinePosition = useCallback((index: number) => {
        requestAnimationFrame(() => {
            const targetEl = navItemRefs.current[index];
            if (targetEl) {
                const left = targetEl.offsetLeft;
                const width = targetEl.offsetWidth;
                setUnderlineStyle({
                    left,
                    width,
                    opacity: 1,
                });
            }
        });
    }, []);

    const resetUnderline = useCallback(() => {
        const activeIndex = navItems.findIndex((item) => {
            const itemHref = `/${locale}${item.href}`;
            return item.href === ""
                ? pathname === `/${locale}`
                : pathname.startsWith(itemHref);
        });

        if (activeIndex !== -1) {
            updateUnderlinePosition(activeIndex);
        } else {
            setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    }, [pathname, locale, updateUnderlinePosition]);

    useEffect(() => {
        // Preload mobile navigation SVG masks in browser cache on mount for 0ms hamburger menu load
        const navKeys = ["home", "about", "services", "gallery", "packages", "contact"];
        navKeys.forEach((key) => {
            const img = new window.Image();
            img.src = `/fonts/nav/${key}.svg`;
        });

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        if (typeof window !== "undefined" && (window as any).__FTX_LOADER_DONE__) {
            setRevealed(true);
        }

        const handleLoaderComplete = () => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        };

        const fallbackTimer = setTimeout(() => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        }, 1800);

        if (typeof window !== "undefined") {
            window.addEventListener("ftx-loader-complete", handleLoaderComplete);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            clearTimeout(fallbackTimer);
            if (typeof window !== "undefined") {
                window.removeEventListener("ftx-loader-complete", handleLoaderComplete);
            }
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Recalculate underline on pathname or locale change and window resize
    useEffect(() => {
        resetUnderline();
        window.addEventListener("resize", resetUnderline);
        return () => window.removeEventListener("resize", resetUnderline);
    }, [pathname, locale, resetUnderline]);

    if (pathname?.includes("/admin")) {
        return null;
    }

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#080808]/95 sm:bg-[#080808]/75 sm:backdrop-blur-xl py-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
                    : "bg-gradient-to-b from-[#0e0e0e]/90 via-[#0e0e0e]/50 to-transparent sm:backdrop-blur-sm py-5"
                    }`}
            >
                {/* Glowing Bottom Border Light Line */}
                <div
                    className={`hidden md:block absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-500 ${scrolled
                        ? "bg-gradient-to-r from-transparent via-ftx-lime/60 to-transparent shadow-[0_0_10px_#a4d65e]"
                        : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        }`}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Brand Logo - 50ms entrance delay */}
                        <Link
                            href={`/${locale}`}
                            className="group flex items-center gap-3 transition-all duration-700 ease-out"
                            aria-label="FTX First Torque X Home"
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, -15px, 0)",
                                filter: revealed ? "blur(0px)" : "blur(4px)",
                                transitionDelay: "50ms",
                            }}
                        >
                            <div className="relative w-44 h-12 sm:w-56 sm:h-14">
                                <Image
                                    src="/brand/ftx-3d-logo.webp"
                                    alt="FTX – First Torque X"
                                    fill
                                    className="object-contain ltr:object-left rtl:object-right transition-all duration-300 group-hover:scale-102"
                                    priority
                                />
                                {/* Laser Light Beam Traveling strictly ALONG LOGO PNG CONTOURS on Hover */}
                                <div className="ftx-logo-laser">
                                    <div className="ftx-logo-laser-beam" />
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links with Styled SVG Typography */}
                        <nav
                            onMouseLeave={resetUnderline}
                            className="relative hidden md:flex items-center gap-7 pb-0.5 pt-1"
                        >
                            {navItems.map((item, idx) => {
                                const itemHref = `/${locale}${item.href}`;
                                const isActive =
                                    item.href === ""
                                        ? pathname === `/${locale}`
                                        : pathname.startsWith(itemHref);

                                const aspectClass = item.key === "contact" ? "aspect-[2030/775]" : "aspect-[2172/724]";

                                // home (17px), about (19px), gallery (24.5px), services (25px), packages (26.5px), contact (27.5px)
                                const heightClass =
                                    item.key === "home"
                                        ? "h-4 lg:h-[18px]"
                                        : item.key === "about"
                                            ? "h-4.5 lg:h-[19px]"
                                            : item.key === "gallery"
                                                ? "h-5.5 lg:h-[24.5px]"
                                                : item.key === "services"
                                                    ? "h-6 lg:h-[25px]"
                                                    : item.key === "packages"
                                                        ? "h-[27.5px] lg:h-[29px]"
                                                        : "h-7 lg:h-[28px]";

                                const underlineBottomClass =
                                    item.key === "home" || item.key === "about"
                                        ? "bottom-0"
                                        : item.key === "packages" || item.key === "contact"
                                            ? "bottom-[5px]"
                                            : "bottom-1 sm:bottom-[3px]";

                                const marginClass = "";

                                return (
                                    <Link
                                        key={item.key}
                                        ref={(el) => {
                                            navItemRefs.current[idx] = el;
                                        }}
                                        href={itemHref}
                                        onMouseEnter={() => updateUnderlinePosition(idx)}
                                        onClick={() => updateUnderlinePosition(idx)}
                                        className={`group relative flex items-center py-1.5 px-1 ${marginClass} transition-all duration-300`}
                                        style={{
                                            opacity: revealed ? 1 : 0,
                                            transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, -15px, 0)",
                                            filter: revealed ? "blur(0px)" : "blur(4px)",
                                            transitionDelay: `${100 + idx * 50}ms`,
                                        }}
                                    >
                                        {locale === "en" ? (
                                            <div
                                                className={`${heightClass} ${aspectClass} transition-all duration-300 ${isActive
                                                    ? "bg-ftx-lime drop-shadow-[0_0_10px_rgba(164,214,94,0.75)]"
                                                    : "bg-ftx-silver group-hover:bg-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
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
                                                className={`text-xs sm:text-sm font-heading font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                                                    ? "text-ftx-lime drop-shadow-[0_0_10px_rgba(164,214,94,0.75)]"
                                                    : "text-ftx-silver group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                                    }`}
                                            >
                                                {messages?.nav?.[item.key] || item.key}
                                            </span>
                                        )}

                                        {/* Smooth Expanding Underline Effect on Hover */}
                                        <span
                                            className={`absolute ${underlineBottomClass} left-0 right-0 h-[2px] bg-ftx-lime rounded-full shadow-[0_0_10px_#a4d65e] transition-transform duration-300 ease-out origin-center pointer-events-none ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 group-hover:scale-x-100 opacity-90"
                                                }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Controls (Language + Quote CTA) - 350ms */}
                        <div
                            className="hidden md:flex items-center gap-4 transition-all duration-700 ease-out"
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, -15px, 0)",
                                filter: revealed ? "blur(0px)" : "blur(4px)",
                                transitionDelay: "350ms",
                            }}
                        >
                            <LanguageSwitcher currentLocale={locale} />

                            <Link
                                href={`/${locale}/contact`}
                                className="ftx-btn-tech ftx-btn-specular group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-wider text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright transition-all duration-300 shadow-lime-glow"
                            >
                                <span>{messages.common.getQuote}</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>

                        {/* Mobile Menu Trigger */}
                        <div
                            className="flex md:hidden items-center gap-3 transition-all duration-700 ease-out"
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, -15px, 0)",
                                transitionDelay: "150ms",
                            }}
                        >
                            <LanguageSwitcher currentLocale={locale} />
                            <AnimatedHamburger
                                isOpen={mobileMenuOpen}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                locale={locale}
                messages={messages}
            />
        </>
    );
}
