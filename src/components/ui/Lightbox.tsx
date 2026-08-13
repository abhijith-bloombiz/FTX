"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/types/gallery";
import { Locale } from "@/i18n/config";

interface LightboxProps {
    item: GalleryItem | null;
    locale: Locale;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}

export function Lightbox({ item, locale, onClose, onPrev, onNext }: LightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && onPrev) onPrev();
            if (e.key === "ArrowRight" && onNext) onNext();
        };
        if (item) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [item, onClose, onPrev, onNext]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 bg-ftx-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-3 text-ftx-silver hover:text-ftx-lime bg-ftx-surface hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-colors"
                aria-label="Close image lightbox"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Prev / Next Controls */}
            {onPrev && (
                <button
                    onClick={onPrev}
                    className="absolute left-4 sm:left-8 z-10 p-3 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/80 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-colors"
                    aria-label="Previous vehicle"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {onNext && (
                <button
                    onClick={onNext}
                    className="absolute right-4 sm:right-8 z-10 p-3 text-ftx-silver hover:text-ftx-lime bg-ftx-surface/80 hover:bg-ftx-surface-high border border-ftx-surface-high rounded-full transition-colors"
                    aria-label="Next vehicle"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Main Content Box */}
            <div className="max-w-5xl w-full flex flex-col items-center">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] ftx-squircle-xl border border-ftx-surface-high shadow-2xl">
                    <Image
                        src={item.image}
                        alt={item.title[locale]}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="w-full mt-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-ftx-surface-high pt-4">
                    <div>
                        <span className="text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase">
                            {item.vehicle}
                        </span>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-white mt-1">
                            {item.title[locale]}
                        </h3>
                        <p className="text-xs text-ftx-silver-muted mt-1 max-w-2xl font-body">
                            {item.description[locale]}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-[10px] font-mono text-ftx-silver bg-ftx-surface border border-ftx-surface-high ftx-squircle-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
