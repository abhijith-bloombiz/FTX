"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
    delay?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
    threshold = 0.2, // 20% viewport trigger
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
    delay = 0,
}: ScrollRevealOptions = {}) {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Check prefers-reduced-motion
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
                    if (delay > 0) {
                        const timer = setTimeout(() => {
                            setIsVisible(true);
                        }, delay);
                        return () => clearTimeout(timer);
                    } else {
                        setIsVisible(true);
                    }
                    if (triggerOnce) {
                        observer.unobserve(node);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, delay]);

    return { ref, isVisible };
}
