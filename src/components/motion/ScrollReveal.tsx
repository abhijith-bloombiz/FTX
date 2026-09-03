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
        const mobileCheck = window.innerWidth < 768;
        setIsMobile(mobileCheck);

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current && once) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold: mobileCheck ? 0.05 : threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [threshold, once]);

    const getStyles = (): React.CSSProperties => {
        const baseTransition: React.CSSProperties = {
            transitionProperty: "transform, opacity",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${delay}ms`,
            ...style,
        };

        if (isVisible) {
            return {
                ...baseTransition,
                opacity: 1,
                transform: "perspective(1200px) rotateX(0deg) translate3d(0, 0, 0) scale(1)",
                transformOrigin: "bottom center",
            };
        }

        switch (type) {
            case "rise-from-floor":
                const floorY = isMobile ? "60px" : "110px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `perspective(1200px) rotateX(28deg) translate3d(0, ${floorY}, -50px) scale(0.92)`,
                    transformOrigin: "bottom center",
                };

            case "card":
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
                return {
                    ...baseTransition,
                    opacity: 0.7,
                    transform: "scale(1.06)",
                };

            case "horizontal":
                const isFromLeft = direction === "left";
                const initialX = isFromLeft
                    ? (isMobile ? "-80px" : "-180px")
                    : (isMobile ? "80px" : "180px");
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(${initialX}, 0, 0) scale(0.96)`,
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
