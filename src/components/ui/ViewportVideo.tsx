"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ViewportVideoProps {
    src: string;
    poster?: string;
    className?: string;
    priority?: boolean;
}

export function ViewportVideo({ src, poster, className, priority = false }: ViewportVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile, { passive: true });
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        const el = videoRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    // Defer play call to next tick for smooth thread rendering
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
    }, [src, isMobile]);

    if (isMobile && poster) {
        return (
            <Image
                src={poster}
                alt="Video Preview"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={className}
                priority={priority}
                unoptimized={typeof poster === "string" && poster.startsWith("/uploads/")}
            />
        );
    }

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
