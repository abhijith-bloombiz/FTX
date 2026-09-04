"use client";

import { useEffect, useRef, useState } from "react";

interface ViewportVideoProps {
    src: string;
    poster?: string;
    className?: string;
}

export function ViewportVideo({ src, poster, className }: ViewportVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    // Defer play call to next tick for smooth mobile thread rendering
                    requestAnimationFrame(() => {
                        if (videoRef.current) {
                            videoRef.current.play().catch(() => { });
                        }
                    });
                } else {
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }
            },
            { threshold: 0.15, rootMargin: "50px" }
        );

        observer.observe(el);

        return () => {
            if (el) {
                el.pause();
            }
            observer.disconnect();
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            src={shouldLoad ? src : undefined}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            className={className}
        />
    );
}
