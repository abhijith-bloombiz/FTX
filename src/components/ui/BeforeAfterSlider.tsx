"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
            style={{ contain: "paint" }}
            className={`relative w-full aspect-[16/8.5] select-none group focus:outline-none focus:ring-2 focus:ring-ftx-lime ftx-squircle-xl border border-ftx-surface-high ${className || "min-h-[340px] sm:min-h-[460px] max-h-[520px]"}`}
            aria-label="Before and after transformation slider. Use left and right arrow keys to adjust."
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                <Image
                    src={afterImage}
                    alt={`After: ${alt}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    quality={75}
                    loading="lazy"
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-ftx-black/80 border border-ftx-lime/50 text-[10px] font-mono font-bold text-ftx-lime tracking-widest rounded pointer-events-auto shadow-lg">
                    {afterLabel}
                </div>
            </div>

            {/* Before Image (Clipped overlay using GPU clip-path with translateZ hardware isolation) */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                    transform: "translateZ(0)",
                    willChange: isDragging ? "clip-path" : "auto",
                }}
            >
                <Image
                    src={beforeImage}
                    alt={`Before: ${alt}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    quality={75}
                    loading="lazy"
                    draggable={false}
                    className="object-cover pointer-events-none select-none"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-ftx-black/80 border border-ftx-surface-high text-[10px] font-mono font-bold text-ftx-silver tracking-widest rounded pointer-events-auto shadow-lg">
                    {beforeLabel}
                </div>
            </div>

            {/* Divider Bar & Handle: ONLY this element triggers dragging. The rest of the container permits smooth vertical scrolling */}
            <div
                className="absolute top-0 bottom-0 z-20 -translate-x-1/2 cursor-ew-resize touch-none select-none flex items-center justify-center w-12 sm:w-14"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                    handleMove(e.clientX);
                }}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    setIsDragging(true);
                    handleMove(e.touches[0].clientX);
                }}
                aria-label="Drag slider handle"
            >
                {/* Visual Vertical Glowing Lime Line */}
                <div className="w-1 h-full bg-ftx-lime shadow-lime-glow pointer-events-none" />

                {/* Circular Center Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-ftx-obsidian/95 border-2 border-ftx-lime rounded-full shadow-lime-glow flex items-center justify-center gap-0.5 text-ftx-lime backdrop-blur-md pointer-events-none">
                    <ChevronLeft
                        className="w-4 h-4 -mr-1 transition-transform will-change-transform transform-gpu"
                        style={{ animation: !isDragging ? "bounceLeft 1.4s ease-in-out infinite" : "none" }}
                    />
                    <ChevronRight
                        className="w-4 h-4 -ml-1 transition-transform will-change-transform transform-gpu"
                        style={{ animation: !isDragging ? "bounceRight 1.4s ease-in-out infinite" : "none" }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes bounceLeft {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-4px); }
                }
                @keyframes bounceRight {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}
