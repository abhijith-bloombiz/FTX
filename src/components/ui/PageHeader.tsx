"use client";

import { useEffect, useState } from "react";

interface PageHeaderProps {
    badge?: string;
    title?: string;
    titleLine1?: string;
    titleLine2?: string;
    subtitle?: string;
    singleLine?: boolean;
}

export function PageHeader({ badge, title = "", titleLine1, titleLine2, subtitle, singleLine = true }: PageHeaderProps) {
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).__FTX_LOADER_DONE__) {
            setRevealed(true);
        }

        const handleLoaderComplete = () => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        };

        const timer = setTimeout(() => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        }, 150);

        if (typeof window !== "undefined") {
            window.addEventListener("ftx-loader-complete", handleLoaderComplete);
        }

        return () => {
            clearTimeout(timer);
            if (typeof window !== "undefined") {
                window.removeEventListener("ftx-loader-complete", handleLoaderComplete);
            }
        };
    }, []);

    // Derive line1 and line2 if not provided explicitly
    let l1 = titleLine1;
    let l2 = titleLine2;

    if (!l1 || !l2) {
        const parts = title.trim().split(" ");
        if (parts.length <= 1) {
            l1 = parts[0] || "";
            l2 = "";
        } else if (parts.length === 2) {
            l1 = parts[0];
            l2 = parts[1];
        } else {
            const mid = Math.ceil(parts.length / 2);
            l1 = parts.slice(0, mid).join(" ");
            l2 = parts.slice(mid).join(" ");
        }
    }

    // Ensure line 2 ends with a dot if non-empty and doesn't already have punctuation
    if (l2 && !l2.endsWith(".") && !l2.endsWith("!") && !l2.endsWith("?")) {
        l2 += ".";
    }

    return (
        <section className="relative pt-4 sm:pt-6 pb-0 bg-ftx-black overflow-hidden">
            {/* Ambient Radial Glow */}
            <div
                className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ftx-lime/5 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
                style={{ opacity: revealed ? 1 : 0 }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 sm:pb-10 border-b border-ftx-surface-high/60">
                    {/* Left Column: Badge & Single-Line / Multi-Line Headline */}
                    <div className="space-y-4 max-w-3xl">
                        {badge && (
                            <div
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-ftx-lime uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                style={{
                                    opacity: revealed ? 1 : 0,
                                    transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(-20px, 0, 0)",
                                    transitionDelay: "150ms",
                                }}
                            >
                                <span className="w-5 h-0.5 bg-ftx-lime inline-block" />
                                <span>{badge}</span>
                            </div>
                        )}

                        <div className="overflow-hidden py-1">
                            <h1
                                className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tight leading-tight transition-all duration-850 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                style={{
                                    opacity: revealed ? 1 : 0,
                                    transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, 105%, 0)",
                                    transitionDelay: "280ms",
                                }}
                            >
                                <span>{l1}</span>
                                {l2 && (
                                    singleLine ? (
                                        <>
                                            {" "}
                                            <span className="text-ftx-lime">{l2}</span>
                                        </>
                                    ) : (
                                        <>
                                            <br />
                                            <span className="text-ftx-lime">{l2}</span>
                                        </>
                                    )
                                )}
                            </h1>
                        </div>
                    </div>

                    {/* Right Column: Subtitle Description */}
                    {subtitle && (
                        <p
                            className="text-xs sm:text-sm lg:text-base text-ftx-silver max-w-md font-body leading-relaxed transition-all duration-850 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)",
                                transitionDelay: "420ms",
                            }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
