"use client";

import { useEffect, useRef } from "react";

interface GoogleMapEmbedProps {
    src: string;
    title: string;
    className?: string;
}

export function GoogleMapEmbed({ src, title, className = "" }: GoogleMapEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Ensure touchmove/touchstart events inside the map container don't block scroll
        const handleTouch = (e: TouchEvent) => {
            // Passive touch handler hook
        };

        container.addEventListener("touchstart", handleTouch, { passive: true });
        container.addEventListener("touchmove", handleTouch, { passive: true });

        return () => {
            container.removeEventListener("touchstart", handleTouch);
            container.removeEventListener("touchmove", handleTouch);
        };
    }, []);

    return (
        <div ref={containerRef} className={`relative w-full h-full ${className}`}>
            <iframe
                title={title}
                src={src}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(120%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-85 transition-opacity duration-300 group-hover:opacity-100"
            />
        </div>
    );
}
