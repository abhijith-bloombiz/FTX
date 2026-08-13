"use client";

import React, { useId, useState, useEffect } from "react";

export interface LiquidGlassProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    filterId?: string;
    frost?: number;
    saturation?: number;
    redScale?: number;
    greenScale?: number;
    blueScale?: number;
}

export function LiquidGlass({
    children,
    className = "",
    style = {},
    filterId: customFilterId,
    frost = 0.1,
    saturation = 1.2,
    redScale = -20,
    greenScale = -24,
    blueScale = -28,
}: LiquidGlassProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const rawId = useId();
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filterId = customFilterId || `glass_filter_${cleanId}`;

    return (
        <div
            className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${className}`}
            suppressHydrationWarning
            style={
                {
                    "--glass-frost": frost,
                    "--glass-saturation": saturation,
                    "--filter-id": `url(#${filterId})`,
                    backgroundColor: `hsl(0 0% 0% / var(--glass-frost, ${frost}))`,
                    WebkitBackdropFilter: mounted ? `url(#${filterId}) saturate(${saturation})` : "blur(10px)",
                    backdropFilter: mounted ? `url(#${filterId}) saturate(${saturation})` : "blur(10px)",
                    boxShadow:
                        "inset 0 0 2px 1px lab(100% 0 0 / .35), inset 0 0 10px 4px lab(100% 0 0 / .15), inset 0 4px 16px lab(5.32203% 1.61424 -5.88284 / .0509804), inset 0 8px 24px lab(5.32203% 1.61424 -5.88284 / .0509804), inset 0 6px 56px lab(5.32203% 1.61424 -5.88284 / .0509804)",
                    ...style,
                } as React.CSSProperties
            }
        >
            {/* SVG Chromatic Aberration Displacement Filter - Mounted on Client Only */}
            {mounted && (
                <svg
                    className="pointer-events-none opacity-0 z-[-1] w-full h-full absolute inset-0"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <defs>
                        <filter
                            id={filterId}
                            colorInterpolationFilters="sRGB"
                            x="0%"
                            y="0%"
                            width="100%"
                            height="100%"
                        >
                            <feImage
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                preserveAspectRatio="none"
                                result="map"
                                href="data:image/png;base64,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"
                            />

                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="map"
                                id={`redchannel_${cleanId}`}
                                result="dispRed"
                                scale={redScale}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                            <feColorMatrix
                                in="dispRed"
                                type="matrix"
                                values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                                result="red"
                            />

                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="map"
                                id={`greenchannel_${cleanId}`}
                                result="dispGreen"
                                scale={greenScale}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                            <feColorMatrix
                                in="dispGreen"
                                type="matrix"
                                values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
                                result="green"
                            />

                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="map"
                                id={`bluechannel_${cleanId}`}
                                result="dispBlue"
                                scale={blueScale}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                            <feColorMatrix
                                in="dispBlue"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
                                result="blue"
                            />

                            <feBlend in="red" in2="green" mode="screen" result="rg" />
                            <feBlend in="rg" in2="blue" mode="screen" result="output" />
                            <feGaussianBlur in="output" stdDeviation="3" />
                        </filter>
                    </defs>
                </svg>
            )}

            {/* Glass Container Content */}
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
}
