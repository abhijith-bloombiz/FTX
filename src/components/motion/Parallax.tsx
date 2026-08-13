"use client";

import React, { useEffect, useRef } from "react";
import { useLenis } from "./SmoothScrollProvider";

interface ParallaxProps {
    children: React.ReactNode;
    speed?: number; // e.g. 0.05 to 0.25 (subtle)
    className?: string;
}

export function Parallax({ children, speed = 0.1, className = "" }: ParallaxProps) {
    const { lenis } = useLenis();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (isMobile || prefersReducedMotion || !ref.current) {
            return;
        }

        let elementTop = 0;
        const updateElementTop = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                elementTop = rect.top + window.scrollY;
            }
        };
        updateElementTop();

        const handleScroll = (e: any) => {
            if (!ref.current) return;
            const scrollY = e.scroll !== undefined ? e.scroll : window.scrollY;
            const relativeScroll = scrollY - elementTop;
            const offsetY = relativeScroll * speed;
            ref.current.style.transform = `translate3d(0, ${offsetY}px, 0)`;
        };

        if (lenis) {
            lenis.on("scroll", handleScroll);
        } else {
            window.addEventListener("scroll", handleScroll, { passive: true });
        }

        window.addEventListener("resize", updateElementTop);

        return () => {
            if (lenis) {
                lenis.off("scroll", handleScroll);
            } else {
                window.removeEventListener("scroll", handleScroll);
            }
            window.removeEventListener("resize", updateElementTop);
        };
    }, [lenis, speed]);

    return (
        <div ref={ref} className={className} style={{ willChange: "transform" }}>
            {children}
        </div>
    );
}
