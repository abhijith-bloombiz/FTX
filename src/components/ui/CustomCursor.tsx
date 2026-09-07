"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
    const pathname = usePathname();
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Position refs for 0-re-render RAF smoothing
    const mousePos = useRef({ x: -100, y: -100 });
    const ringPos = useRef({ x: -100, y: -100 });
    const rafId = useRef<number | null>(null);
    const isRafRunning = useRef(false);

    const [isFinePointer, setIsFinePointer] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsFinePointer(typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches);
    }, []);

    useEffect(() => {
        if (!mounted || !isFinePointer) return;

        const startRafIfNeeded = () => {
            if (isRafRunning.current) return;
            isRafRunning.current = true;
            rafId.current = requestAnimationFrame(render);
        };

        const render = () => {
            const lerpFactor = 0.22; // Damping speed

            const dx = mousePos.current.x - ringPos.current.x;
            const dy = mousePos.current.y - ringPos.current.y;

            ringPos.current.x += dx * lerpFactor;
            ringPos.current.y += dy * lerpFactor;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
            }

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
            }

            // Pause RAF loop when cursor ring has settled close to mouse position (< 0.1px)
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                ringPos.current.x = mousePos.current.x;
                ringPos.current.y = mousePos.current.y;
                isRafRunning.current = false;
                return;
            }

            rafId.current = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);
            startRafIfNeeded();
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        // Detect hover over interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const isInteractive = !!target.closest(
                'a, button, input, textarea, select, [role="button"], .ftx-btn-tech, [data-cursor="hover"]'
            );
            setIsHovered(isInteractive);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            if (rafId.current) cancelAnimationFrame(rafId.current);
            isRafRunning.current = false;
        };
    }, [mounted, isFinePointer]);

    // Ensure initial hydration pass matches server (null) 100%, and hide cursor on touch devices or admin pages
    if (!mounted || !isFinePointer || pathname?.includes("/admin")) return null;

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* 1. Fast Precision Center Dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-ftx-lime shadow-[0_0_8px_#80FF00] pointer-events-none will-change-transform"
            />

            {/* 2. Automotive HUD Ring with Crosshairs */}
            <div
                ref={ringRef}
                className={`fixed top-0 left-0 w-10 h-10 rounded-full border pointer-events-none will-change-transform transition-all duration-200 ease-out flex items-center justify-center ${isHovered
                    ? "scale-140 border-ftx-lime bg-ftx-lime/10 shadow-[0_0_15px_rgba(128,255,0,0.3)]"
                    : isClicked
                        ? "scale-90 border-ftx-lime/80 bg-ftx-lime/5"
                        : "scale-100 border-ftx-lime/35 bg-transparent"
                    }`}
            >
                {/* Crosshair ticks */}
                <span className="absolute top-0 w-1 h-[2px] bg-ftx-lime/60" />
                <span className="absolute bottom-0 w-1 h-[2px] bg-ftx-lime/60" />
                <span className="absolute left-0 h-1 w-[2px] bg-ftx-lime/60" />
                <span className="absolute right-0 h-1 w-[2px] bg-ftx-lime/60" />
            </div>
        </div>
    );
}
