"use client";

import { useEffect, useRef, useState } from "react";

interface GoogleMapEmbedProps {
    src: string;
    title: string;
    className?: string;
}

export function GoogleMapEmbed({ src, title, className = "" }: GoogleMapEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setShouldLoad(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "250px" }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`relative w-full h-full ${className}`}>
            {shouldLoad ? (
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
            ) : (
                <div className="w-full h-full bg-ftx-obsidian flex items-center justify-center text-xs font-mono text-ftx-silver">
                    Map loading...
                </div>
            )}
        </div>
    );
}
