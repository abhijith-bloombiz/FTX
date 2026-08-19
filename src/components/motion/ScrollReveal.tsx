"use client";

import React, { useEffect, useRef, useState } from "react";

export type ScrollRevealType =
    | "card"
    | "editorial"
    | "image-mask"
    | "horizontal"
    | "scale"
    | "heading-inset"
    | "rise-from-floor";

interface ScrollRevealProps {
    children: React.ReactNode;
    type?: ScrollRevealType;
    direction?: "left" | "right";
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function ScrollReveal({
    children,
    type = "card",
    direction = "left",
    delay = 0,
    duration = 850,
    threshold = 0.15,
    once = false,
    className = "",
    style = {},
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (once) {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        if (ref.current) observer.unobserve(ref.current);
                    }
                } else {
                    setIsVisible(entry.isIntersecting);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", checkMobile);
        };
    }, [threshold, once]);

    const getStyles = (): React.CSSProperties => {
        const baseTransition: React.CSSProperties = {
            transitionProperty: "transform, opacity, filter, clip-path",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${delay}ms`,
            willChange: "transform, opacity, filter",
            ...style,
        };

        if (isVisible) {
            return {
                ...baseTransition,
                opacity: 1,
                transform: "perspective(1200px) rotateX(0deg) translate3d(0, 0, 0) scale(1)",
                filter: undefined,
                willChange: "auto",
                transformOrigin: "bottom center",
                clipPath: type === "heading-inset" ? "inset(0 0 0 0)" : undefined,
            };
        }

        switch (type) {
            case "rise-from-floor":
                const floorY = isMobile ? "60px" : "110px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `perspective(1200px) rotateX(28deg) translate3d(0, ${floorY}, -50px) scale(0.92)`,
                    filter: "blur(6px)",
                    transformOrigin: "bottom center",
                };

            case "card":
                // Phenomenon Studio Card Entrance: translateY 80px (45px mobile) + scale 0.96 (0.98 mobile)
                const cardY = isMobile ? "45px" : "80px";
                const cardScale = isMobile ? "0.98" : "0.96";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${cardY}, 0) scale(${cardScale})`,
                };

            case "editorial":
                const editY = isMobile ? "25px" : "45px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${editY}, 0)`,
                };

            case "image-mask":
                // Image settle from scale 1.06 to 1.0
                return {
                    ...baseTransition,
                    opacity: 0.7,
                    transform: "scale(1.06)",
                    clipPath: "inset(0 0 0 0)",
                };

            case "horizontal":
                // direction === "left" means slide in FROM LEFT TO RIGHT (initialX: -150px)
                // direction === "right" means slide in FROM RIGHT TO LEFT (initialX: 150px)
                const isFromLeft = direction === "left";
                const initialX = isFromLeft
                    ? (isMobile ? "-60px" : "-150px")
                    : (isMobile ? "60px" : "150px");
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(${initialX}, 0, 0) scale(0.97)`,
                };

            case "scale":
                const scaleVal = isMobile ? "0.97" : "0.94";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, 30px, 0) scale(${scaleVal})`,
                };

            case "heading-inset":
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: "translate3d(0, 35px, 0)",
                    filter: "blur(4px)",
                };

            default:
                return baseTransition;
        }
    };

    return (
        <div ref={ref} style={getStyles()} className={className}>
            {children}
        </div>
    );
}
