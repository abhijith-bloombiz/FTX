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

export interface ScrollRevealProps {
    children: React.ReactNode;
    type?: ScrollRevealType;
    direction?: "left" | "right";
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
    reverse?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

let isMobileViewport = false;
if (typeof window !== "undefined") {
    isMobileViewport = window.innerWidth < 768;
    window.addEventListener(
        "resize",
        () => {
            isMobileViewport = window.innerWidth < 768;
        },
        { passive: true }
    );
}

export function ScrollReveal({
    children,
    type = "card",
    direction = "left",
    delay = 0,
    duration = 750,
    threshold = 0.1,
    once = false,
    reverse = true,
    className = "",
    style = {},
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [entryFrom, setEntryFrom] = useState<"bottom" | "top">("bottom");

    const ref = useRef<HTMLDivElement>(null);
    const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // If reverse is explicitly requested, once must be false; otherwise respect once prop
    const isOnce = reverse ? false : once;

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const isMob = typeof window !== "undefined" ? window.innerWidth < 768 : false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Determine arrival vector: did it enter from the top (scrolling up/reverse) or bottom (scrolling down)?
                    const topBoundary = (entry.rootBounds?.top ?? 0) + (window.innerHeight * 0.25);
                    const enteredFromTop = entry.boundingClientRect.top < topBoundary;
                    setEntryFrom(enteredFromTop ? "top" : "bottom");

                    setIsVisible(true);
                    setIsAnimating(true);

                    if (animTimerRef.current) clearTimeout(animTimerRef.current);
                    animTimerRef.current = setTimeout(() => {
                        setIsAnimating(false);
                    }, duration + delay + 60);

                    if (isOnce && node) {
                        observer.unobserve(node);
                    }
                } else if (!isOnce) {
                    // When leaving viewport, detect exit direction so reverse scroll starts from appropriate vector
                    const exitedTop = entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
                    setEntryFrom(exitedTop ? "top" : "bottom");

                    // Immediately reset off-screen without burning GPU transitions or CPU timers
                    setIsVisible(false);
                    setIsAnimating(false);
                    if (animTimerRef.current) clearTimeout(animTimerRef.current);
                }
            },
            {
                threshold: isMob ? 0.05 : threshold,
                rootMargin: isMob ? "40px 0px -20px 0px" : "100px 0px -35px 0px",
            }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
            if (animTimerRef.current) clearTimeout(animTimerRef.current);
        };
    }, [threshold, isOnce, duration, delay]);

    const getStyles = (): React.CSSProperties => {
        const isMobile = typeof window !== "undefined" ? isMobileViewport : false;

        // When entering: apply full duration, stagger delay, and silky deceleration curve
        // When exiting off-screen: 0ms duration to instantly reset and release GPU with zero overhead
        const baseTransition: React.CSSProperties = {
            transitionProperty: "transform, opacity",
            transitionDuration: isVisible ? `${duration}ms` : "0ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: isVisible ? `${delay}ms` : "0ms",
            willChange: isAnimating ? "transform, opacity" : "auto",
            ...style,
        };

        if (isVisible) {
            return {
                ...baseTransition,
                opacity: 1,
                transform: type === "rise-from-floor"
                    ? "perspective(1200px) rotateX(0deg) translate3d(0, 0, 0) scale(1)"
                    : "translate3d(0, 0, 0) scale(1)",
                transformOrigin: type === "horizontal"
                    ? (direction === "left" ? "center left" : "center right")
                    : "bottom center",
            };
        }

        // Off-screen / hidden states: direction-aware for silky forward & reverse scrolling
        const isFromTop = entryFrom === "top";

        switch (type) {
            case "rise-from-floor": {
                if (isFromTop) {
                    const floorY = isMobile ? "-36px" : "-50px";
                    return {
                        ...baseTransition,
                        opacity: 0,
                        transform: `perspective(1000px) rotateX(-12deg) translate3d(0, ${floorY}, -20px) scale(0.96)`,
                        transformOrigin: "top center",
                    };
                }
                const floorY = isMobile ? "45px" : "70px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `perspective(1000px) rotateX(18deg) translate3d(0, ${floorY}, -30px) scale(0.95)`,
                    transformOrigin: "bottom center",
                };
            }

            case "card": {
                if (isFromTop) {
                    const cardY = isMobile ? "-28px" : "-36px";
                    const cardScale = isMobile ? "0.97" : "0.96";
                    return {
                        ...baseTransition,
                        opacity: 0,
                        transform: `translate3d(0, ${cardY}, 0) scale(${cardScale})`,
                        transformOrigin: "top center",
                    };
                }
                const cardY = isMobile ? "36px" : "50px";
                const cardScale = isMobile ? "0.97" : "0.96";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${cardY}, 0) scale(${cardScale})`,
                    transformOrigin: "bottom center",
                };
            }

            case "editorial": {
                const editY = isFromTop
                    ? (isMobile ? "-20px" : "-28px")
                    : (isMobile ? "24px" : "32px");
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${editY}, 0)`,
                };
            }

            case "image-mask":
                return {
                    ...baseTransition,
                    opacity: 0.6,
                    transform: "scale(1.04)",
                };

            case "horizontal": {
                const isFromLeft = direction === "left";
                // Preserves the cinematic directional sweep on mobile with proportional translation
                const initialX = isMobile
                    ? (isFromLeft ? "-55px" : "55px")
                    : (isFromLeft ? "-100px" : "100px");
                const offsetY = isFromTop
                    ? (isMobile ? "-14px" : "-16px")
                    : (isMobile ? "14px" : "16px");
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(${initialX}, ${offsetY}, 0) scale(${isMobile ? 0.96 : 0.96})`,
                    transformOrigin: isFromLeft ? "center left" : "center right",
                };
            }

            case "scale": {
                const scaleVal = isMobile ? "0.96" : "0.94";
                const scaleY = isFromTop ? "-16px" : "20px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${scaleY}, 0) scale(${scaleVal})`,
                };
            }

            case "heading-inset": {
                const insetY = isFromTop ? "-18px" : "22px";
                return {
                    ...baseTransition,
                    opacity: 0,
                    transform: `translate3d(0, ${insetY}, 0)`,
                };
            }

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
