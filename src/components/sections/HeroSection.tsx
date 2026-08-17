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

const TOTAL_FRAMES = 150;
const CRITICAL_LOAD_COUNT = 15; // Critical frames 1-15 for instant loader completion

export function HeroSection({ locale, messages }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Frame Cache & High-Frequency Animation Refs (0ms React State Overhead)
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const loadingStatusRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

    const targetFrameRef = useRef<number>(0);
    const currentFrameRef = useRef<number>(0);
    const lastDrawnFrameRef = useRef<number>(-1);
    const animFrameIdRef = useRef<number | null>(null);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // High-DPI Cover-fit Canvas Drawing Pipeline
    const drawFrame = useCallback((img: HTMLImageElement) => {
        if (!canvasRef.current || !img || !img.complete || img.naturalWidth === 0) return;
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

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const imgWidth = img.naturalWidth || 1920;
        const imgHeight = img.naturalHeight || 1080;

        ctx.fillStyle = "#070707";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Full cover scale calculation
        const fullCoverScale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const fullW = imgWidth * fullCoverScale;
        const fullH = imgHeight * fullCoverScale;
        const fullX = (canvasWidth - fullW) / 2;
        const fullY = (canvasHeight - fullH) / 2;

        if (isMobile) {
            // YouTube Video Player Ambient Mode: Fill top & bottom blank space with soft blurred ambient video lighting
            ctx.save();
            ctx.filter = "blur(32px) brightness(0.65) contrast(1.1)";
            ctx.globalAlpha = 0.85;
            ctx.drawImage(img, fullX, fullY, fullW, fullH);
            ctx.restore();

            // Soft top & bottom linear edge gradient overlay for flawless visual transition
            const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            grad.addColorStop(0, "rgba(7,7,7,0.75)");
            grad.addColorStop(0.18, "rgba(7,7,7,0)");
            grad.addColorStop(0.82, "rgba(7,7,7,0)");
            grad.addColorStop(1, "rgba(7,7,7,0.75)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // Draw crisp foreground frame at current exact size
        const mobileScaleMultiplier = isMobile ? 0.88 : 1.005;
        const scale = fullCoverScale * mobileScaleMultiplier;
        const width = imgWidth * scale;
        const height = imgHeight * scale;
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, x, y, width, height);

        // Seamless Multi-Stop Bottom Blur Fade Gradient (100% Zero Seam Line Cut)
        const bottomFadeH = isMobile ? canvasHeight * 0.35 : canvasHeight * 0.22;
        const bottomFadeY = canvasHeight - bottomFadeH;

        const bottomGrad = ctx.createLinearGradient(0, bottomFadeY, 0, canvasHeight);
        bottomGrad.addColorStop(0, "rgba(7, 7, 7, 0)");
        bottomGrad.addColorStop(0.35, "rgba(7, 7, 7, 0.45)");
        bottomGrad.addColorStop(0.75, "rgba(7, 7, 7, 0.88)");
        bottomGrad.addColorStop(1, "rgb(7, 7, 7)");

        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, bottomFadeY, canvasWidth, bottomFadeH);
    }, [isMobile]);

    // Async Frame Load & Pre-decoding Helper
    const loadAndDecodeFrame = useCallback(async (index: number): Promise<HTMLImageElement | null> => {
        if (index < 0 || index >= TOTAL_FRAMES) return null;
        if (imagesRef.current[index]) return imagesRef.current[index];
        if (loadingStatusRef.current[index]) return null;

        loadingStatusRef.current[index] = true;
        const img = new Image();
        const paddedIndex = String(index + 1).padStart(4, "0");
        img.src = `/video/frames/frame_${paddedIndex}.webp`;

        try {
            if (img.decode) {
                await img.decode();
            } else {
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }
            if (img.naturalWidth > 0) {
                imagesRef.current[index] = img;
                return img;
            }
            return null;
        } catch {
            if (img.naturalWidth > 0) {
                imagesRef.current[index] = img;
                return img;
            }
            return null;
        } finally {
            loadingStatusRef.current[index] = false;
        }
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
            setRevealed(true);
        };

        window.addEventListener("ftx_loader_complete", handleLoaderComplete);
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("ftx_loader_complete", handleLoaderComplete);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    // 2. Stage 1 Critical Frame Loading & Stage 2 Progressive Background Queue
    useEffect(() => {
        let isCancelled = false;

        // Stage 1: Load and decode critical initial 15 frames for instant loader completion
        const loadCriticalFrames = async () => {
            const criticalPromises: Promise<HTMLImageElement | null>[] = [];
            for (let i = 0; i < CRITICAL_LOAD_COUNT; i++) {
                criticalPromises.push(loadAndDecodeFrame(i));
            }
            await Promise.all(criticalPromises);

            if (isCancelled) return;

            // Draw initial frame immediately
            const firstImg = imagesRef.current[0];
            if (firstImg) drawFrame(firstImg);

            // Signal loader readiness to CinematicLoader
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
                window.dispatchEvent(new CustomEvent("ftx_loader_complete"));
            }

            // Stage 2: Background progressive loading queue (15-frame bursts)
            let nextIndex = CRITICAL_LOAD_COUNT;

            const processBackgroundQueue = () => {
                if (isCancelled || nextIndex >= TOTAL_FRAMES) return;
                const batchEnd = Math.min(nextIndex + 15, TOTAL_FRAMES);

                for (let i = nextIndex; i < batchEnd; i++) {
                    loadAndDecodeFrame(i);
                }
                nextIndex = batchEnd;

                if (nextIndex < TOTAL_FRAMES) {
                    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                        (window as any).requestIdleCallback(processBackgroundQueue);
                    } else {
                        setTimeout(processBackgroundQueue, 20);
                    }
                }
            };

            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                (window as any).requestIdleCallback(processBackgroundQueue);
            } else {
                setTimeout(processBackgroundQueue, 50);
            }
        };

        loadCriticalFrames();

        return () => {
            isCancelled = true;
        };
    }, [drawFrame, loadAndDecodeFrame]);

    // 3. Single rAF Hardware Accelerated Canvas Render Loop
    useEffect(() => {
        const renderLoop = () => {
            const target = targetFrameRef.current;
            const current = currentFrameRef.current;

            // Crisp responsive lerp with immediate snap threshold
            const diff = target - current;
            if (Math.abs(diff) < 0.2) {
                currentFrameRef.current = target;
            } else {
                currentFrameRef.current += diff * 0.45;
            }

            const activeTotal = TOTAL_FRAMES;
            const frameIndex = Math.min(activeTotal - 1, Math.max(0, Math.round(currentFrameRef.current)));

            if (frameIndex !== lastDrawnFrameRef.current) {
                const images = imagesRef.current;
                let img = images[frameIndex];

                // Scroll-Aware Fallback: Use nearest pre-decoded frame if target isn't ready
                if (!img) {
                    for (let offset = 1; offset < 15; offset++) {
                        const prev = images[frameIndex - offset];
                        if (prev) { img = prev; break; }
                        const next = images[frameIndex + offset];
                        if (next) { img = next; break; }
                    }
                    // Prioritize decoding target frame and surrounding buffer immediately
                    loadAndDecodeFrame(frameIndex);
                    for (let b = 1; b <= 5; b++) {
                        if (frameIndex + b < TOTAL_FRAMES) loadAndDecodeFrame(frameIndex + b);
                    }
                }

                if (img) {
                    lastDrawnFrameRef.current = frameIndex;
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
    }, [drawFrame, isMobile, loadAndDecodeFrame]);

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
                end: "+=2400px",
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress; // 0.0 -> 1.0
                    setScrollProgress(progress);

                    const activeTotal = isMobile ? 160 : TOTAL_FRAMES;
                    targetFrameRef.current = progress * (activeTotal - 1);
                },
            });

            const handleResizeRedraw = () => {
                const activeTotal = isMobile ? 160 : TOTAL_FRAMES;
                const frameIndex = Math.min(activeTotal - 1, Math.max(0, Math.round(currentFrameRef.current)));
                const img = imagesRef.current[frameIndex] || imagesRef.current[0];

                if (img && canvasRef.current) {
                    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
                    const w = canvasRef.current.clientWidth;
                    const h = canvasRef.current.clientHeight;
                    if (w && h) {
                        canvasRef.current.width = Math.round(w * dpr);
                        canvasRef.current.height = Math.round(h * dpr);
                    }
                    drawFrame(img);
                }
            };

            window.addEventListener("resize", handleResizeRedraw);
            return () => window.removeEventListener("resize", handleResizeRedraw);
        }, section);

        return () => ctx.revert();
    }, [drawFrame, isMobile]);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative w-full h-[280vh] bg-[#070707] overflow-visible"
        >
            <div
                ref={pinWrapperRef}
                className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#070707] flex items-center justify-center"
            >
                {/* Background 3D Glow & Ambient Mesh */}
                <HeroBackground />

                {/* High-DPI Cover-fit Canvas for Super-Optimized WebP Frames */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                />

                {/* Glassy Giant Background Typography */}
                <HeroTypography progress={scrollProgress} isMobile={isMobile} />

                {/* Foreground Hero Headline & CTA Buttons */}
                <div ref={contentRef} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <HeroContent locale={locale} messages={messages} revealed={revealed} />
                </div>

                {/* Ultra-Smooth Bottom Blur Gradient Overlay (Eliminates Horizontal Seam Line) */}
                <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent pointer-events-none z-15 backdrop-blur-[2px]" />
            </div>
        </section>
    );
}
