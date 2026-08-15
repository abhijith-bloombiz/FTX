"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { HeroBackground } from "@/components/hero3d/HeroBackground";
import { HeroContent } from "@/components/hero3d/HeroContent";
import { HeroTypography } from "@/components/hero3d/HeroTypography";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    const targetFrameRef = useRef<number>(0);
    const currentFrameRef = useRef<number>(0);
    const lastDrawnFrameRef = useRef<number>(-1);
    const animFrameIdRef = useRef<number | null>(null);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // High-DPI Cover-fit Canvas Drawing Function (Retina Sharp 2K/4K Resolution)
    const drawFrame = useCallback((img: HTMLImageElement) => {
        if (!canvasRef.current || !img) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (displayWidth && displayHeight) {
            const targetW = Math.round(displayWidth * dpr);
            const targetH = Math.round(displayHeight * dpr);
            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
            }
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        if (!canvasWidth || !canvasHeight) return;

        // Enable maximum image rendering clarity & high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const imgWidth = img.naturalWidth || 1920;
        const imgHeight = img.naturalHeight || 1080;

        const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.005;
        const width = imgWidth * scale;
        const height = imgHeight * scale;
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        ctx.globalAlpha = 1.0;
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

    // 2. Rapid Preloading of All 192 Frames
    useEffect(() => {
        const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

        const loadFrame = (index: number) => {
            if (loadedImages[index]) return;
            const img = new Image();
            const frameNum = String(index + 1).padStart(4, "0");
            img.src = `/video/frames/frame_${frameNum}.jpg`;

            if (index === 0) {
                img.onload = () => {
                    if (lastDrawnFrameRef.current === -1) {
                        drawFrame(img);
                        lastDrawnFrameRef.current = 0;
                    }
                };
            }
            loadedImages[index] = img;
        };

        imagesRef.current = loadedImages;

        // Stage 1: Load first 30 frames immediately for instant zero-latency start
        for (let i = 0; i < Math.min(30, TOTAL_FRAMES); i++) {
            loadFrame(i);
        }

        // Stage 2: Rapid background preloading in 40-frame concurrent bursts
        let nextBatch = 30;
        const burstLoad = () => {
            if (nextBatch >= TOTAL_FRAMES) return;
            const limit = Math.min(nextBatch + 40, TOTAL_FRAMES);
            for (let i = nextBatch; i < limit; i++) {
                loadFrame(i);
            }
            nextBatch = limit;
            if (nextBatch < TOTAL_FRAMES) {
                if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                    (window as any).requestIdleCallback(burstLoad);
                } else {
                    setTimeout(burstLoad, 16);
                }
            }
        };

        const timer = setTimeout(burstLoad, 30);
        return () => clearTimeout(timer);
    }, [drawFrame]);

    // 3. Smooth Inertia Lerping Render Loop (Crisp 60FPS Frame Interpolation)
    useEffect(() => {
        const renderLoop = () => {
            const target = targetFrameRef.current;
            const current = currentFrameRef.current;

            // Lerp towards target frame for smooth inertia without ghosting
            const diff = target - current;
            if (Math.abs(diff) > 0.005) {
                currentFrameRef.current += diff * 0.18;
            } else {
                currentFrameRef.current = target;
            }

            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));

            if (frameIndex !== lastDrawnFrameRef.current) {
                lastDrawnFrameRef.current = frameIndex;
                const images = imagesRef.current;
                let img = images[frameIndex];

                // Fallback to nearest loaded frame if target frame isn't ready
                if (!img || !img.complete) {
                    for (let offset = 1; offset < 10; offset++) {
                        const prev = images[frameIndex - offset];
                        if (prev && prev.complete) { img = prev; break; }
                        const next = images[frameIndex + offset];
                        if (next && next.complete) { img = next; break; }
                    }
                }

                if (img && img.complete) {
                    drawFrame(img);
                }
            }

            animFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return () => {
            if (animFrameIdRef.current !== null) {
                cancelAnimationFrame(animFrameIdRef.current);
            }
        };
    }, [drawFrame]);

    // 4. GSAP ScrollTrigger — Single Source of Truth for Hero Scroll & Typography
    useEffect(() => {
        if (!sectionRef.current || !pinWrapperRef.current) return;

        const section = sectionRef.current;
        const pinWrapper = pinWrapperRef.current;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                pin: pinWrapper,
                start: "top top",
                end: "+=2200px",
                scrub: 0.15,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress; // 0.0 (start) -> 1.0 (end)

                    // Update state for HeroTypography transformation
                    setScrollProgress(progress);

                    // Set target frame for smooth inertia interpolation [0, 191]
                    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
                },
            });

            const handleResizeRedraw = () => {
                const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
                const img = imagesRef.current[frameIndex];

                if (img && img.complete) {
                    if (canvasRef.current) {
                        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
                        const w = canvasRef.current.clientWidth;
                        const h = canvasRef.current.clientHeight;
                        if (w && h) {
                            canvasRef.current.width = Math.round(w * dpr);
                            canvasRef.current.height = Math.round(h * dpr);
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

    return (
        <section
            ref={sectionRef}
            id="hero-section"
            className="relative w-full bg-ftx-black select-none"
        >
            <div
                ref={pinWrapperRef}
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

                {/* 3. FTX Content & Headline UI Overlay (z-20) */}
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
