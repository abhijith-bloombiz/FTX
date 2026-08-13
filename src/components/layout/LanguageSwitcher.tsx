"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, localeNames } from "@/i18n/config";

interface LanguageSwitcherProps {
    currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const pathname = usePathname();

    // Replace locale in path
    const targetLocale: Locale = currentLocale === "en" ? "ar" : "en";

    const segments = pathname.split("/");
    segments[1] = targetLocale;
    const targetPath = segments.join("/");

    return (
        <Link
            href={targetPath}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-ftx-silver hover:text-ftx-lime border border-ftx-surface-high hover:border-ftx-lime/50 bg-ftx-obsidian/80 ftx-squircle-sm transition-all duration-200"
            aria-label={`Switch to ${localeNames[targetLocale]}`}
        >
            <span className={currentLocale === "en" ? "text-ftx-lime font-bold" : "text-ftx-silver/60"}>
                EN
            </span>
            <span className="text-ftx-silver/30">|</span>
            <span className={currentLocale === "ar" ? "text-ftx-lime font-bold font-arabic" : "text-ftx-silver/60 font-arabic"}>
                عربي
            </span>
        </Link>
    );
}
