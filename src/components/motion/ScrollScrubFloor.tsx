"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollScrubFloorProps {
    children: React.ReactNode;
    className?: string;
}

export function ScrollScrubFloor({ children, className = "" }: ScrollScrubFloorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [styleState, setStyleState] = useState<React.CSSProperties>({
        opacity: 0.15,
        transform: "perspective(1200px) rotateX(32deg) translate3d(0, 110px, -60px) scale(0.90)",
        filter: "blur(6px)",
        transformOrigin: "bottom center",
        willChange: "transform, opacity, filter",
    });

    useEffect(() => {
        let rafId: number;

        const updateScrollProgress = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start when top of element enters viewport (windowHeight)
            // Complete when element top reaches 30% of viewport height
            const start = windowHeight;
            const end = windowHeight * 0.3;
            const current = rect.top;

            let progress = (start - current) / (start - end);
            progress = Math.max(0, Math.min(1, progress));

            const rotateX = ((1 - progress) * 32).toFixed(2);
            const translateY = ((1 - progress) * 110).toFixed(2);
            const translateZ = ((1 - progress) * -60).toFixed(2);
            const scale = (0.90 + progress * 0.10).toFixed(3);
            const opacity = Math.min(1, 0.15 + progress * 0.85).toFixed(2);
            const blur = ((1 - progress) * 6).toFixed(1);

            setStyleState({
                opacity: Number(opacity),
                transform: `perspective(1200px) rotateX(${rotateX}deg) translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`,
                filter: `blur(${blur}px)`,
                transformOrigin: "bottom center",
                willChange: "transform, opacity, filter",
            });
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

    return (
        <div ref={ref} style={styleState} className={className}>
            {children}
        </div>
    );
}
