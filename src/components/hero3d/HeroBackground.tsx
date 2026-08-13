"use client";

import { RefObject, useCallback, useEffect } from "react";

interface HeroBackgroundProps {
    revealed?: boolean;
    canvasRef?: RefObject<HTMLCanvasElement>;
}

export function HeroBackground({
    revealed = true,
    canvasRef,
}: HeroBackgroundProps) {
    // Canvas Resize Handler to maintain sharp crisp resolution
    const handleResize = useCallback(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const width = canvas.parentElement?.clientWidth || window.innerWidth;
        const height = canvas.parentElement?.clientHeight || window.innerHeight;

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }
    }, [canvasRef]);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-ftx-black">
            {/* 1. Scroll-Controlled HTML Canvas Layer */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full object-cover transition-opacity duration-1000"
                    style={{ opacity: revealed ? 1 : 0, pointerEvents: "none" }}
                />
            </div>

            {/* 2. Static Green Ambient Glow (Adds automotive depth) */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-ftx-lime/10 rounded-full blur-[160px] mix-blend-screen pointer-events-none transition-opacity duration-1000"
                style={{ opacity: revealed ? 0.75 : 0 }}
            />

            {/* 3. Subtle Atmosphere Overlay (Clean & natural without black edge bar) */}
            <div
                className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(128, 255, 0, 0.1) 0%, rgba(15, 23, 18, 0.25) 70%, transparent 100%)`,
                }}
            />
        </div>
    );
}
