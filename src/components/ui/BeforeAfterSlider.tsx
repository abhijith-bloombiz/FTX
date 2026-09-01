"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
    alt?: string;
    className?: string;
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = "BEFORE",
    afterLabel = "AFTER",
    alt = "FTX Automotive Transformation",
    className = "",
}: BeforeAfterSliderProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPos(percentage);
    }, []);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!isDragging) return;
            handleMove(e.touches[0].clientX);
        },
        [isDragging, handleMove]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging) return;
            handleMove(e.clientX);
        },
        [isDragging, handleMove]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove, { passive: true });
            window.addEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            setSliderPos((prev) => Math.max(0, prev - 5));
        } else if (e.key === "ArrowRight") {
            setSliderPos((prev) => Math.min(100, prev + 5));
        }
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            dir="ltr"
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e.touches[0].clientX);
            }}
            className={`relative w-full aspect-[16/8.5] cursor-ew-resize select-none touch-none group focus:outline-none focus:ring-2 focus:ring-ftx-lime ftx-squircle-xl border border-ftx-surface-high ${className || "min-h-[340px] sm:min-h-[460px] max-h-[520px]"}`}
            aria-label="Before and after transformation slider. Use left and right arrow keys to adjust."
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                <Image
                    src={afterImage}
                    alt={`After: ${alt}`}
                    fill
                    quality={100}
                    priority
                    unoptimized
                    sizes="100vw"
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-ftx-black/80 backdrop-blur-sm border border-ftx-lime/50 text-[10px] font-mono font-bold text-ftx-lime tracking-widest rounded pointer-events-auto shadow-lg">
                    {afterLabel}
                </div>
            </div>

            {/* Before Image (Clipped overlay using GPU clip-path) */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
                <Image
                    src={beforeImage}
                    alt={`Before: ${alt}`}
                    fill
                    quality={100}
                    priority
                    unoptimized
                    sizes="100vw"
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-ftx-black/80 backdrop-blur-sm border border-ftx-surface-high text-[10px] font-mono font-bold text-ftx-silver tracking-widest rounded pointer-events-auto shadow-lg">
                    {beforeLabel}
                </div>
            </div>

            {/* Divider Bar & Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-ftx-lime shadow-lime-glow z-10 -translate-x-1/2 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-ftx-obsidian border-2 border-ftx-lime rounded-full shadow-lime-glow flex items-center justify-center text-ftx-lime">
                    <SlidersHorizontal className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
