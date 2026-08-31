"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const instance = new Lenis(LENIS_CONFIG);
        lenisRef.current = instance;
        setLenis(instance);

        // Synchronize Lenis scroll ticks with GSAP ScrollTrigger
        instance.on("scroll", ScrollTrigger.update);

        // Use gsap.ticker for proper ScrollTrigger synchronization
        // This ensures ScrollTrigger pin calculations are in sync with Lenis
        gsap.ticker.add((time) => {
            instance.raf(time * 1000);
        });
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
            gsap.ticker.remove(instance.raf as any);
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
