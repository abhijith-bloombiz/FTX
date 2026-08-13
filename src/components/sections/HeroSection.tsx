"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { HeroBackground } from "@/components/hero3d/HeroBackground";
import { HeroContent } from "@/components/hero3d/HeroContent";
import { HeroTypography } from "@/components/hero3d/HeroTypography";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const HeroCanvas = dynamic(
    () => import("@/components/hero3d/HeroCanvas").then((mod) => mod.HeroCanvas),
    { ssr: false }
);

interface HeroSectionProps {
    locale: Locale;
    messages: any;
}

const TOTAL_FRAMES = 192;

export function HeroSection({ locale, messages }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const imagesRef = useRef<HTMLImageElement[]>([]);
    const lastFrameIndexRef = useRef<number>(-1);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const mousePosRef = useRef({ x: 0, y: 0 });

    // Cover-fit Canvas Drawing Function (aspect-ratio preserving, never distorts)
    const drawFrame = useCallback((img: HTMLImageElement) => {
        if (!canvasRef.current || !img) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (displayWidth && displayHeight) {
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
            }
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        if (!canvasWidth || !canvasHeight) return;

        const imgWidth = img.naturalWidth || 1920;
        const imgHeight = img.naturalHeight || 1080;

        const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.01;
        const width = imgWidth * scale;
        const height = imgHeight * scale;
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        ctx.drawImage(img, x, y, width, height);
    }, []);

    // 1. Initial Setup & Mobile Detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();

        if (typeof window !== "undefined" && (window as any).__FTX_LOADER_DONE__) {
            setRevealed(true);
        }

        const handleLoaderComplete = () => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        };

        const fallbackTimer = setTimeout(() => {
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
            }
            setRevealed(true);
        }, 1800);

        if (typeof window !== "undefined") {
            window.addEventListener("ftx-loader-complete", handleLoaderComplete);
            window.addEventListener("resize", checkMobile);
        }

        return () => {
            clearTimeout(fallbackTimer);
            if (typeof window !== "undefined") {
                window.removeEventListener("ftx-loader-complete", handleLoaderComplete);
                window.removeEventListener("resize", checkMobile);
            }
        };
    }, []);

    // 2. Progressive Batch Preloading for 192 Frames (Sub-second Vercel Network Load)
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

        // Helper to load a single frame index
        const loadFrame = (index: number) => {
            if (loadedImages[index]) return;
            const img = new Image();
            const frameNum = String(index + 1).padStart(4, "0");
            img.src = `/video/frames/frame_${frameNum}.jpg`;

            if (index === 0) {
                img.onload = () => {
                    if (lastFrameIndexRef.current === -1 || lastFrameIndexRef.current === 0) {
                        drawFrame(img);
                        lastFrameIndexRef.current = 0;
                    }
                };
            }
            loadedImages[index] = img;
        };

        // Stage 1: Load initial 10 frames immediately for instant rendering
        for (let i = 0; i < Math.min(10, TOTAL_FRAMES); i++) {
            loadFrame(i);
        }

        imagesRef.current = loadedImages;

        // Stage 2: Progressive background loading in non-blocking batches of 15 frames
        let nextFrameBatch = 10;
        const intervalId = setInterval(() => {
            if (nextFrameBatch >= TOTAL_FRAMES) {
                clearInterval(intervalId);
                return;
            }
            const endBatch = Math.min(nextFrameBatch + 15, TOTAL_FRAMES);
            for (let i = nextFrameBatch; i < endBatch; i++) {
                loadFrame(i);
            }
            nextFrameBatch = endBatch;
        }, 80);

        return () => clearInterval(intervalId);
    }, [drawFrame]);

    // 3. GSAP ScrollTrigger — Single Source of Truth for Hero Scroll & Typography
    useEffect(() => {
        if (!sectionRef.current || !pinWrapperRef.current) return;

        const section = sectionRef.current;
        const pinWrapper = pinWrapperRef.current;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                pin: pinWrapper,
                start: "top top",
                end: "+=3000px",
                scrub: 0.1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress; // 0.0 (start) -> 1.0 (end)

                    // Update state for HeroTypography transformation
                    setScrollProgress(progress);

                    // Map ScrollTrigger progress to frame indices [0, 191]
                    const frameIndex = progress >= 1
                        ? 191
                        : Math.floor(progress * TOTAL_FRAMES);

                    if (frameIndex !== lastFrameIndexRef.current) {
                        lastFrameIndexRef.current = frameIndex;
                        const img = imagesRef.current[frameIndex];
                        if (img) {
                            if (img.complete) {
                                drawFrame(img);
                            } else {
                                img.onload = () => drawFrame(img);
                            }
                        }
                    }
                },
            });

            const handleResizeRedraw = () => {
                const currentIndex = Math.max(0, lastFrameIndexRef.current);
                const img = imagesRef.current[currentIndex];
                if (img && img.complete) {
                    if (canvasRef.current) {
                        const w = canvasRef.current.clientWidth;
                        const h = canvasRef.current.clientHeight;
                        if (w && h) {
                            canvasRef.current.width = w;
                            canvasRef.current.height = h;
                        }
                    }
                    drawFrame(img);
                }
            };

            window.addEventListener("resize", handleResizeRedraw);

            const timer = setTimeout(() => {
                ScrollTrigger.refresh();
                handleResizeRedraw();
            }, 400);

            return () => {
                window.removeEventListener("resize", handleResizeRedraw);
                clearTimeout(timer);
            };
        }, section);

        return () => ctx.revert();
    }, [drawFrame]);

    // Mouse Tracking for 3D Car Interaction
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const rawY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        const easedX = Math.sign(rawX) * Math.pow(Math.abs(rawX), 1.2);
        const easedY = Math.sign(rawY) * Math.pow(Math.abs(rawY), 1.2);

        mousePosRef.current = { x: easedX, y: easedY };
    };

    const handleMouseLeave = () => {
        mousePosRef.current = { x: 0, y: 0 };
    };

    return (
        <section
            ref={sectionRef}
            id="hero-section"
            className="relative w-full bg-ftx-black select-none"
        >
            <div
                ref={pinWrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-screen flex items-center justify-center overflow-hidden"
            >
                {/* 1. Scroll-Controlled Frame-Based HTML Canvas Background (z-0) */}
                <HeroBackground
                    revealed={revealed}
                    canvasRef={canvasRef}
                />

                {/* 2. Scroll-Driven Large Background Typography (z-5) */}
                <HeroTypography
                    progress={scrollProgress}
                    revealed={revealed}
                />

                {/* 3. Interactive 3D Vehicle WebGL Canvas (z-10) */}
                <HeroCanvas
                    mousePosRef={mousePosRef}
                    isMobile={isMobile}
                />

                {/* 4. FTX Content & Headline UI Overlay (z-20) */}
                <HeroContent
                    locale={locale}
                    messages={messages}
                    scrollProgress={scrollProgress}
                    revealed={revealed}
                    contentRef={contentRef}
                />
            </div>
        </section>
    );
}
