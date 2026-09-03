"use client";

import { useEffect, useRef } from "react";

interface ViewportVideoProps {
    src: string;
    poster?: string;
    className?: string;
}

export function ViewportVideo({ src, poster, className }: ViewportVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.play().catch(() => { });
                } else {
                    el.pause();
                }
            },
            { threshold: 0.2 } // Play when 20% visible in viewport, pause when scrolled out
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            src={src}
            muted
            loop
            playsInline
            poster={poster}
            className={className}
        />
    );
}
