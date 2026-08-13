"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Phone, MessageSquare } from "lucide-react";
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

    // Handle ESC key press to close menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 md:hidden bg-ftx-black/95 backdrop-blur-xl flex flex-col justify-between pt-24 pb-8 px-6 border-b border-ftx-surface-high animate-in fade-in duration-200">
            <div className="space-y-6">
                <div className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase border-b border-ftx-surface-high pb-2">
                    NAVIGATION MENU
                </div>

                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => {
                        const itemHref = `/${locale}${item.href}`;
                        const isActive =
                            item.href === ""
                                ? pathname === `/${locale}`
                                : pathname.startsWith(itemHref);

                        return (
                            <Link
                                key={item.key}
                                href={itemHref}
                                onClick={onClose}
                                className={`text-xl font-heading font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-between ${isActive ? "text-ftx-lime" : "text-ftx-silver hover:text-ftx-lime"
                                    }`}
                            >
                                <span>{messages.nav[item.key]}</span>
                                {isActive && <span className="w-2 h-2 rounded-full bg-ftx-lime shadow-lime-glow" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-ftx-surface-high">
                <Link
                    href={`/${locale}/contact`}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-mono font-bold text-ftx-black bg-ftx-lime hover:bg-ftx-lime-bright clip-button transition-colors duration-200"
                >
                    <span>{messages.common.getQuote}</span>
                    <ArrowUpRight className="w-4 h-4" />
                </Link>

                <a
                    href={getWhatsAppUrl({ locale })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold text-ftx-silver hover:text-white bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high ftx-squircle-sm transition-colors duration-200"
                >
                    <MessageSquare className="w-4 h-4 text-ftx-lime" />
                    <span>{messages.common.whatsappUs}</span>
                </a>

                <div className="text-center text-[10px] font-mono text-ftx-silver/50 tracking-wider">
                    {contactConfig.phone} • {contactConfig.email}
                </div>
            </div>
        </div>
    );
}
