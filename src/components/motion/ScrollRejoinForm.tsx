"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRejoinFormProps {
    children: React.ReactNode;
    className?: string;
}

export function ScrollRejoinForm({ children, className = "" }: ScrollRejoinFormProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let rafId: number;

        const updateScrollProgress = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start animation when top of form is near bottom of screen (windowHeight * 0.95)
            // Complete animation when form is centered in screen (windowHeight * 0.35)
            const start = windowHeight * 0.95;
            const end = windowHeight * 0.35;
            const current = rect.top;

            let rawP = (start - current) / (start - end);
            const clampedP = Math.max(0, Math.min(1, rawP));

            // Smooth cubic-bezier power curve for silky momentum
            const easedP = Math.pow(clampedP, 0.85);

            setProgress(easedP);
        };

        const onScroll = () => {
            rafId = requestAnimationFrame(updateScrollProgress);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateScrollProgress();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // Interpolated values based on progress (0 -> 1)
    const factor = 1 - progress;

    // Header shift (Top down)
    const headerY = -25 * factor;

    // Left column shift (Left in)
    const leftX = -45 * factor;

    // Right column shift (Right in)
    const rightX = 45 * factor;

    // Bottom fields shift (Bottom up)
    const bottomY = 35 * factor;

    // General opacity & blur
    const opacity = (0.2 + progress * 0.8).toFixed(2);
    const blur = (factor * 6).toFixed(1);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <style jsx global>{`
                .rejoin-header {
                    transform: translate3d(0, ${headerY.toFixed(1)}px, 0);
                    opacity: ${opacity};
                    filter: blur(${blur}px);
                    transition: transform 0.05s ease-out, opacity 0.05s ease-out, filter 0.05s ease-out;
                    will-change: transform, opacity, filter;
                }
                .rejoin-left {
                    transform: translate3d(${leftX.toFixed(1)}px, 0, 0);
                    opacity: ${opacity};
                    filter: blur(${blur}px);
                    transition: transform 0.05s ease-out, opacity 0.05s ease-out, filter 0.05s ease-out;
                    will-change: transform, opacity, filter;
                }
                .rejoin-right {
                    transform: translate3d(${rightX.toFixed(1)}px, 0, 0);
                    opacity: ${opacity};
                    filter: blur(${blur}px);
                    transition: transform 0.05s ease-out, opacity 0.05s ease-out, filter 0.05s ease-out;
                    will-change: transform, opacity, filter;
                }
                .rejoin-bottom {
                    transform: translate3d(0, ${bottomY.toFixed(1)}px, 0);
                    opacity: ${opacity};
                    filter: blur(${blur}px);
                    transition: transform 0.05s ease-out, opacity 0.05s ease-out, filter 0.05s ease-out;
                    will-change: transform, opacity, filter;
                }
            `}</style>
            {children}
        </div>
    );
}
