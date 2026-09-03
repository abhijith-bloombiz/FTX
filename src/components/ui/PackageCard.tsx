import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import { PackageItem } from "@/types/package";
import { Locale } from "@/i18n/config";

interface PackageCardProps {
    packageData: PackageItem;
    locale: Locale;
    ctaText: string;
}

export function PackageCard({ packageData, locale, ctaText }: PackageCardProps) {
    const { id, category, name, description, price, popular, features, badge } = packageData;

    const packageNameStr = typeof name === "object" ? (name[locale] || name.en || name.ar || "") : (name || "");
    const quoteHref = `/${locale}/contact?service=${encodeURIComponent(category || "")}&package=${encodeURIComponent(packageNameStr || id || "")}`;

    const badgeText = badge
        ? (typeof badge === "string" ? badge : badge[locale] || badge.en || "")
        : (popular ? (locale === "ar" ? "الأكثر شعبية" : "POPULAR CHOICE") : "");

    const showBadge = Boolean(popular || (badgeText && badgeText.trim() !== ""));

    return (
        <div
            className={`relative flex flex-col justify-between p-6 sm:p-8 ftx-squircle-xl !overflow-visible transition-all duration-500 hover:-translate-y-1.5 h-full ${popular
                ? "bg-ftx-obsidian border-2 border-ftx-lime shadow-lime-glow scale-[1.02] z-10"
                : "bg-ftx-surface/80 hover:bg-ftx-surface border border-ftx-surface-high hover:border-ftx-silver/40"
                }`}
        >
            {/* Badge highlight - Floating on top of top border */}
            {showBadge && (
                <div className="absolute -top-3.5 ltr:right-6 rtl:left-6 z-30 px-3 py-1 bg-ftx-lime text-ftx-black text-[10px] font-mono font-bold tracking-widest uppercase ftx-btn-tech shadow-lime-glow">
                    {badgeText}
                </div>
            )}

            <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white uppercase tracking-wide">
                    {name[locale]}
                </h3>

                <p className="text-xs text-ftx-silver-muted mt-2 font-body leading-relaxed min-h-[2.5rem]">
                    {description[locale]}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-ftx-surface-high">
                    <span className="text-xl sm:text-2xl font-mono font-extrabold text-ftx-lime">
                        {price[locale]}
                    </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                    {features[locale].map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-ftx-silver font-body leading-5">
                            <div className="w-5 h-5 rounded bg-ftx-lime/20 text-ftx-lime shrink-0 flex items-center justify-center mt-0.5">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                            <span className="pt-0.5">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Button */}
            <Link
                href={quoteHref}
                className={`ftx-btn-tech ftx-btn-specular group w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${popular
                    ? "bg-ftx-lime hover:bg-ftx-lime-bright text-ftx-black shadow-lime-glow"
                    : "bg-ftx-surface-high hover:bg-ftx-lime hover:text-ftx-black text-white"
                    }`}
            >
                <span>{ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
        </div>
    );
}
