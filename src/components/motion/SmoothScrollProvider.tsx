"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_CONFIG } from "./motion.constants";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Global safety guard for React Fiber commitDeletionEffects:
    // Prevents third-party scripts (e.g. Google Maps iframe, translate) from causing
    // "NotFoundError: Failed to execute 'removeChild' on 'Node'" unmount crashes.
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
            if (child.parentNode) {
                return child.parentNode.removeChild(child) as T;
            }
            return child;
        }
        return originalRemoveChild.call(this, child) as T;
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(node: T, child: Node | null): T {
        if (child && child.parentNode !== this) {
            return this.appendChild(node) as T;
        }
        return originalInsertBefore.call(this, node, child) as T;
    };
}

interface LenisContextValue {
    lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({
    lenis: null,
});

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    const pathname = usePathname();
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const lenisRef = useRef<Lenis | null>(null);

    // Reset scroll position on route changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
        ScrollTrigger.refresh();
    }, [pathname]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        // On mobile touch devices, allow the browser's native 120Hz/60Hz hardware compositor
        // to handle touch scrolling with zero latency, natural momentum, and zero stutter.
        const isMobileTouch = window.innerWidth < 768 && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
        if (isMobileTouch) {
            // Native smooth scroll for anchor clicks (#services, #gallery, etc.)
            const handleAnchorClick = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const anchor = target.closest("a");
                if (anchor && anchor.hash && anchor.hash.startsWith("#") && anchor.pathname === window.location.pathname) {
                    e.preventDefault();
                    const targetElement = document.querySelector(anchor.hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                }
            };

            document.addEventListener("click", handleAnchorClick);
            return () => {
                document.removeEventListener("click", handleAnchorClick);
            };
        }

        const instance = new Lenis(LENIS_CONFIG);
        lenisRef.current = instance;
        setLenis(instance);

        // Synchronize Lenis scroll ticks with GSAP ScrollTrigger
        instance.on("scroll", ScrollTrigger.update);

        // Use gsap.ticker for proper ScrollTrigger synchronization
        const tickerCallback = (time: number) => {
            instance.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        // Smooth scroll for anchor clicks (#services, #gallery, etc.)
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (anchor && anchor.hash && anchor.hash.startsWith("#") && anchor.pathname === window.location.pathname) {
                e.preventDefault();
                const targetElement = document.querySelector(anchor.hash);
                if (targetElement) {
                    instance.scrollTo(targetElement as HTMLElement, { offset: -90, duration: 1.2 });
                }
            }
        };

        document.addEventListener("click", handleAnchorClick);

        return () => {
            gsap.ticker.remove(tickerCallback);
            document.removeEventListener("click", handleAnchorClick);
            instance.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <LenisContext.Provider value={{ lenis }}>
            {children}
        </LenisContext.Provider>
    );
}
