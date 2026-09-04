"use client";

import { useState } from "react";
import { Shield, RefreshCw, Droplet, Sparkles, Wand2, Car } from "lucide-react";

interface HighlightItem {
    icon: string;
    title: { en?: string; ar?: string } | string;
    description?: { en?: string; ar?: string } | string;
}

interface ServiceHighlightCardsProps {
    highlights: HighlightItem[];
    locale: "en" | "ar";
}

export function ServiceHighlightCards({ highlights, locale }: ServiceHighlightCardsProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const getHighlightIcon = (iconName: string) => {
        switch (iconName) {
            case "shield":
                return <Shield className="w-5 h-5 text-ftx-lime" />;
            case "refresh":
                return <RefreshCw className="w-5 h-5 text-ftx-lime" />;
            case "droplet":
                return <Droplet className="w-5 h-5 text-ftx-lime" />;
            case "sparkles":
                return <Sparkles className="w-5 h-5 text-ftx-lime" />;
            case "wand":
                return <Wand2 className="w-5 h-5 text-ftx-lime" />;
            case "car":
                return <Car className="w-5 h-5 text-ftx-lime" />;
            default:
                return <Shield className="w-5 h-5 text-ftx-lime" />;
        }
    };

    if (!highlights || highlights.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 items-stretch">
            {highlights.map((item, hIdx) => {
                const hlTitle = typeof item.title === "object" ? item.title[locale] || item.title.en || "" : item.title;
                const hlDesc = item.description
                    ? typeof item.description === "object"
                        ? item.description[locale] || item.description.en || ""
                        : item.description
                    : null;

                const isExpanded = expandedIndex === hIdx;
                const isLastOdd = highlights.length % 2 !== 0 && hIdx === highlights.length - 1;

                return (
                    <div
                        key={hIdx}
                        onClick={() => {
                            if (hlDesc) {
                                setExpandedIndex(isExpanded ? null : hIdx);
                            }
                        }}
                        onMouseEnter={() => {
                            if (hlDesc) setExpandedIndex(hIdx);
                        }}
                        onMouseLeave={() => {
                            if (hlDesc) setExpandedIndex(null);
                        }}
                        className={`group relative bg-ftx-surface/90 hover:bg-ftx-surface ftx-squircle-md p-3.5 border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between select-none ${isLastOdd ? "col-span-2 sm:col-span-1" : ""
                            } ${isExpanded ? "border-ftx-lime/70 bg-ftx-surface shadow-lime-glow/10" : "border-ftx-surface-high hover:border-ftx-lime/50"
                            }`}
                    >
                        <div>
                            <div className="mb-2">
                                <div className="p-1.5 rounded bg-ftx-lime/10 w-fit text-ftx-lime">
                                    {getHighlightIcon(item.icon)}
                                </div>
                            </div>
                            <h3 className={`text-xs sm:text-sm font-heading font-bold uppercase tracking-wide leading-tight transition-colors ${isExpanded ? "text-ftx-lime" : "text-white group-hover:text-ftx-lime"
                                }`}>
                                {hlTitle}
                            </h3>
                        </div>

                        {hlDesc && (
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded
                                    ? "max-h-60 opacity-100 mt-2.5 pt-2.5 border-t border-ftx-surface-high/70"
                                    : "max-h-0 opacity-0 mt-0 pt-0 border-t border-transparent"
                                    }`}
                            >
                                <p className="text-[11px] sm:text-xs text-ftx-silver-muted font-body leading-relaxed">
                                    {hlDesc}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
