"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { HeroBackground } from "@/components/hero3d/HeroBackground";
import { HeroContent } from "@/components/hero3d/HeroContent";
import { HeroTypography, HeroTypographyRef } from "@/components/hero3d/HeroTypography";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
    locale: Locale;
    messages: any;
}

const TOTAL_FRAMES = 150;
const CRITICAL_LOAD_COUNT = 15; // Critical initial frames 1-15 for instant loader completion
const CACHE_WINDOW_BACK = 10;   // Keep decoded images up to 10 frames behind current scroll position
const CACHE_WINDOW_FORWARD = 35; // Keep decoded images up to 35 frames ahead of current scroll position

export function HeroSection({ locale, messages }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const typographyRef = useRef<HeroTypographyRef>(null);

    // Frame Cache & High-Frequency Animation Refs (0ms React State Overhead during scroll)
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const downloadedSetRef = useRef<Set<number>>(new Set());
    const inFlightRef = useRef<Set<number>>(new Set());

    const targetFrameRef = useRef<number>(0);
    const currentFrameRef = useRef<number>(0);
    const lastDrawnFrameRef = useRef<number>(-1);
    const animFrameIdRef = useRef<number | null>(null);
    const scrollProgressRef = useRef<number>(0);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    // Async Frame Load & Pre-decoding Helper (with deduplication)
    const loadFrame = useCallback(async (index: number): Promise<HTMLImageElement | null> => {
        if (index < 0 || index >= TOTAL_FRAMES) return null;
        if (imagesRef.current[index] && imagesRef.current[index]?.complete) {
            return imagesRef.current[index];
        }
        if (inFlightRef.current.has(index)) return null;

        inFlightRef.current.add(index);
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
                downloadedSetRef.current.add(index);
                return img;
            }
            return null;
        } catch {
            if (img.naturalWidth > 0) {
                imagesRef.current[index] = img;
                downloadedSetRef.current.add(index);
                return img;
            }
            return null;
        } finally {
            inFlightRef.current.delete(index);
        }
    }, []);

    // Sliding Window Memory Management — Prune uncompressed 8.3MB RGBA textures for distant frames
    const manageMemoryCache = useCallback((currentIdx: number) => {
        const backLimit = Math.max(0, currentIdx - CACHE_WINDOW_BACK);
        const forwardLimit = Math.min(TOTAL_FRAMES - 1, currentIdx + CACHE_WINDOW_FORWARD);

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            // Preserve initial critical frame 0 as safety fallback
            if (i === 0) continue;

            if (i < backLimit || i > forwardLimit) {
                if (imagesRef.current[i]) {
                    // Nullifying image releases decoded bitmap texture for GC while HTTP cache retains asset
                    imagesRef.current[i] = null;
                }
            }
        }
    }, []);

    // Scroll-Aware Priority Preloader
    const preloadPriorityQueue = useCallback((centerIndex: number, isForward: boolean) => {
        const priorityList: number[] = [];

        if (isForward) {
            for (let i = centerIndex; i <= Math.min(TOTAL_FRAMES - 1, centerIndex + 20); i++) {
                priorityList.push(i);
            }
            for (let i = centerIndex - 1; i >= Math.max(0, centerIndex - 5); i--) {
                priorityList.push(i);
            }
        } else {
            for (let i = centerIndex; i >= Math.max(0, centerIndex - 20); i--) {
                priorityList.push(i);
            }
            for (let i = centerIndex + 1; i <= Math.min(TOTAL_FRAMES - 1, centerIndex + 5); i++) {
                priorityList.push(i);
            }
        }

        const loadBatch = () => {
            const missing = priorityList.filter((idx) => !imagesRef.current[idx] && !inFlightRef.current.has(idx));
            if (missing.length === 0) return;
            const batch = missing.slice(0, 4);
            batch.forEach((idx) => loadFrame(idx));
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            (window as any).requestIdleCallback(loadBatch);
        } else {
            setTimeout(loadBatch, 10);
        }
    }, [loadFrame]);

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

        const loadCriticalFrames = async () => {
            const criticalPromises: Promise<HTMLImageElement | null>[] = [];
            for (let i = 0; i < CRITICAL_LOAD_COUNT; i++) {
                criticalPromises.push(loadFrame(i));
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

            // Stage 2: Background progressive loading queue in 10-frame idle bursts
            let nextIndex = CRITICAL_LOAD_COUNT;

            const processBackgroundQueue = () => {
                if (isCancelled || nextIndex >= TOTAL_FRAMES) return;
                const batchEnd = Math.min(nextIndex + 10, TOTAL_FRAMES);

                for (let i = nextIndex; i < batchEnd; i++) {
                    if (!imagesRef.current[i] && !inFlightRef.current.has(i)) {
                        loadFrame(i);
                    }
                }
                nextIndex = batchEnd;

                if (nextIndex < TOTAL_FRAMES) {
                    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                        (window as any).requestIdleCallback(processBackgroundQueue);
                    } else {
                        setTimeout(processBackgroundQueue, 30);
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
    }, [drawFrame, loadFrame]);

    // 3. Single rAF Hardware Accelerated Canvas Render Loop
    useEffect(() => {
        let lastTarget = 0;

        const renderLoop = () => {
            const target = targetFrameRef.current;
            const current = currentFrameRef.current;

            // Crisp responsive lerp with immediate snap threshold
            const diff = target - current;
            if (Math.abs(diff) < 0.15) {
                currentFrameRef.current = target;
            } else {
                currentFrameRef.current += diff * 0.45;
            }

            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));

            if (frameIndex !== lastDrawnFrameRef.current) {
                let img = imagesRef.current[frameIndex];

                // Scroll-Aware Fallback: Use nearest pre-decoded frame if target isn't ready
                if (!img) {
                    for (let offset = 1; offset < 15; offset++) {
                        const prev = imagesRef.current[frameIndex - offset];
                        if (prev) { img = prev; break; }
                        const next = imagesRef.current[frameIndex + offset];
                        if (next) { img = next; break; }
                    }
                    loadFrame(frameIndex);
                }

                if (img) {
                    lastDrawnFrameRef.current = frameIndex;
                    drawFrame(img);
                }

                // Prune decoded textures outside active sliding window for memory efficiency
                manageMemoryCache(frameIndex);

                // Priority preload upcoming frames in scroll direction
                const isForward = target >= lastTarget;
                preloadPriorityQueue(frameIndex, isForward);
                lastTarget = target;
            }

            // Imperatively update typography progress without forcing React component re-renders
            if (typographyRef.current) {
                const p = targetFrameRef.current / (TOTAL_FRAMES - 1);
                typographyRef.current.updateProgress(p);
            }

            animFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return () => {
            if (animFrameIdRef.current !== null) {
                cancelAnimationFrame(animFrameIdRef.current);
            }
        };
    }, [drawFrame, loadFrame, manageMemoryCache, preloadPriorityQueue]);

    // 4. GSAP ScrollTrigger — Single Source of Truth for Hero Scroll
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
                    scrollProgressRef.current = progress;
                    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
                },
            });

            const handleResizeRedraw = () => {
                const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
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
    }, [drawFrame]);

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

                {/* Glassy Giant Background Typography (Ref-updated with 0ms React state overhead) */}
                <HeroTypography ref={typographyRef} revealed={revealed} isMobile={isMobile} />

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
