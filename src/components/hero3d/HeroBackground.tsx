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
    // Canvas Resize Handler to maintain sharp crisp resolution (only if canvasRef is provided)
    const handleResize = useCallback(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const width = canvas.parentElement?.clientWidth || window.innerWidth;
        const height = canvas.parentElement?.clientHeight || window.innerHeight;

        const targetW = Math.round(width * dpr);
        const targetH = Math.round(height * dpr);

        if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
        }
    }, [canvasRef]);

    useEffect(() => {
        if (!canvasRef?.current) return;
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize, canvasRef]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 bg-ftx-black">
            {/* 1. Scroll-Controlled HTML Canvas Layer (only if canvasRef provided) */}
            {canvasRef && (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="block w-full h-full object-cover transition-opacity duration-1000"
                        style={{
                            opacity: revealed ? 1 : 0,
                            pointerEvents: "none",
                            imageRendering: "-webkit-optimize-contrast",
                        }}
                    />
                </div>
            )}

            {/* 2. Static Green Ambient Glow (High performance radial gradient without 160px GPU blur pass) */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none transition-opacity duration-1000"
                style={{
                    opacity: revealed ? 0.75 : 0,
                    background: "radial-gradient(circle, rgba(164, 214, 94, 0.12) 0%, rgba(164, 214, 94, 0.03) 45%, transparent 70%)",
                }}
            />

            {/* 3. Subtle Atmosphere Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(164, 214, 94, 0.08) 0%, rgba(15, 23, 18, 0.20) 70%, transparent 100%)`,
                }}
            />
        </div>
    );
}
