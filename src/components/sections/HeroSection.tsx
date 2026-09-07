"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { HeroBackground } from "@/components/hero3d/HeroBackground";
import { HeroContent, HeroContentHandle } from "@/components/hero3d/HeroContent";
import { HeroTypography, HeroTypographyHandle } from "@/components/hero3d/HeroTypography";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
}

interface HeroSectionProps {
    locale: Locale;
    messages: any;
}

const TOTAL_FRAMES = 130;
const CRITICAL_LOAD_COUNT = 8; // 8 critical frames required for instant loader completion and zero-lag initial reveal

export function HeroSection({ locale, messages }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const typographyRef = useRef<HeroTypographyHandle>(null);
    const contentHandleRef = useRef<HeroContentHandle>(null);

    // Frame Cache & High-Frequency Animation Refs (0ms React State Overhead)
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const inFlightRef = useRef<Set<number>>(new Set());
    const fetchedSetRef = useRef<Set<number>>(new Set());

    const targetFrameRef = useRef<number>(0);
    const currentFrameRef = useRef<number>(0);
    const animFrameIdRef = useRef<number | null>(null);
    const isHeroInViewRef = useRef<boolean>(true);
    const isRafRunningRef = useRef<boolean>(false);
    const startRafLoopRef = useRef<() => void>(() => {});

    const lastDrawnFrameIndexRef = useRef<number>(-1);
    const lastDrawnBlendRatioRef = useRef<number>(-1);
    const cachedBottomGradRef = useRef<{ height: number; grad: CanvasGradient } | null>(null);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLowEnd, setIsLowEnd] = useState(false);

    // IntersectionObserver to pause heavy 60fps canvas re-renders when hero pin container is off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isHeroInViewRef.current = entry.isIntersecting;
                if (entry.isIntersecting && startRafLoopRef.current) {
                    startRafLoopRef.current();
                }
            },
            { threshold: 0 }
        );
        if (pinWrapperRef.current) observer.observe(pinWrapperRef.current);
        return () => observer.disconnect();
    }, []);

    // High-DPI Cover-fit Canvas Drawing Pipeline with Sub-Frame Crossfade Interpolation
    const drawFrame = useCallback((img: HTMLImageElement, nextImg?: HTMLImageElement | null, blendRatio: number = 0) => {
        if (!canvasRef.current || !img || !img.complete || img.naturalWidth === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // Hardware DPR Capping (Native devicePixelRatio capped at 1.0x on Low-End & 1.25x on Mobile & 2x on Desktop)
        const maxDpr = isLowEnd ? 1.0 : isMobile ? 1.25 : 2;
        const dpr = typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio || 1, maxDpr)
            : 1;

        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (displayWidth && displayHeight) {
            const targetW = Math.round(displayWidth * dpr);
            const targetH = Math.round(displayHeight * dpr);
            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
                cachedBottomGradRef.current = null; // Invalidate cached gradient on resize
            }
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        if (!canvasWidth || !canvasHeight) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = isMobile ? "medium" : "high";

        const imgWidth = img.naturalWidth || 1920;
        const imgHeight = img.naturalHeight || 1080;

        ctx.fillStyle = "#070707";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Full cover scale calculation
        const fullCoverScale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);

        const scaleMultiplier = isMobile ? 0.95 : 1.0;
        const scale = fullCoverScale * scaleMultiplier;
        const width = imgWidth * scale;
        const height = imgHeight * scale;
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, x, y, width, height);

        // Desktop Dual-Buffer Blend (Skipped on Mobile & Low-End for Maximum 60 FPS Fillrate)
        if (!isMobile && !isLowEnd && nextImg && nextImg.complete && nextImg.naturalWidth > 0 && blendRatio > 0.03) {
            ctx.globalAlpha = Math.min(1.0, Math.max(0, blendRatio));
            ctx.drawImage(nextImg, x, y, width, height);
            ctx.globalAlpha = 1.0;
        }

        const bottomFadeH = isMobile ? canvasHeight * 0.30 : canvasHeight * 0.22;
        const bottomFadeY = canvasHeight - bottomFadeH;

        // Cached Bottom Gradient Reuse (Prevents 60 FPS JS Heap Garbage Collection)
        if (!cachedBottomGradRef.current || cachedBottomGradRef.current.height !== canvasHeight) {
            const grad = ctx.createLinearGradient(0, bottomFadeY, 0, canvasHeight);
            grad.addColorStop(0, "rgba(7, 7, 7, 0)");
            grad.addColorStop(0.35, "rgba(7, 7, 7, 0.45)");
            grad.addColorStop(0.75, "rgba(7, 7, 7, 0.88)");
            grad.addColorStop(1, "rgb(7, 7, 7)");
            cachedBottomGradRef.current = { height: canvasHeight, grad };
        }

        ctx.fillStyle = cachedBottomGradRef.current.grad;
        ctx.fillRect(0, bottomFadeY, canvasWidth, bottomFadeH);
    }, [isMobile, isLowEnd]);

    // Fast Single-Frame Loader & Decoder with In-Flight Guard
    const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
        if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null);
        if (imagesRef.current[index]) return Promise.resolve(imagesRef.current[index]);
        if (inFlightRef.current.has(index)) return Promise.resolve(null);

        inFlightRef.current.add(index);
        const img = new Image();
        const paddedIndex = String(index + 1).padStart(4, "0");
        img.src = `/video/frames/frame_${paddedIndex}.webp`;

        const onComplete = () => {
            inFlightRef.current.delete(index);
            if (img.naturalWidth > 0) {
                fetchedSetRef.current.add(index);
                imagesRef.current[index] = img;
                return img;
            }
            return null;
        };

        if (img.complete) {
            return Promise.resolve(onComplete());
        }

        return new Promise<HTMLImageElement | null>((resolve) => {
            if (img.decode) {
                img.decode().then(() => resolve(onComplete())).catch(() => resolve(onComplete()));
            } else {
                img.onload = () => resolve(onComplete());
                img.onerror = () => resolve(onComplete());
            }
        });
    }, []);

    // Memory Management (Sliding Window Pruning with Fast Scroll Expansion)
    const manageMemoryAndQueue = useCallback((centerFrame: number, isForward: boolean) => {
        // Mobile VRAM optimization: Keep 14 frames (-4/+10) vs 50 frames (-15/+35) on Desktop
        const backKeep = isMobile ? 4 : 15;
        const forwardKeep = isMobile ? 10 : 35;
        const minKeep = Math.max(0, centerFrame - backKeep);
        const maxKeep = Math.min(TOTAL_FRAMES - 1, centerFrame + forwardKeep);

        // 1. Release decoded images outside active window (keep index 0 as fallback safety)
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            if (i !== 0 && (i < minKeep || i > maxKeep)) {
                if (imagesRef.current[i]) {
                    imagesRef.current[i] = null;
                }
            }
        }

        // 2. Prioritize preloading ahead in current scroll direction
        const queue: number[] = [];
        const step = isForward ? 1 : -1;
        const forwardAhead = isMobile ? 10 : 25;
        const backAhead = isMobile ? 4 : 8;

        for (let offset = 1; offset <= forwardAhead; offset++) {
            const targetIdx = centerFrame + offset * step;
            if (targetIdx >= 0 && targetIdx < TOTAL_FRAMES) {
                queue.push(targetIdx);
            }
        }

        for (let offset = 1; offset <= backAhead; offset++) {
            const targetIdx = centerFrame - offset * step;
            if (targetIdx >= 0 && targetIdx < TOTAL_FRAMES) {
                queue.push(targetIdx);
            }
        }

        // Load queued frames
        queue.forEach((idx) => {
            if (!imagesRef.current[idx] && !inFlightRef.current.has(idx)) {
                loadFrame(idx);
            }
        });
    }, [loadFrame, isMobile]);

    // Initial Mobile & Low-End Hardware Capability Check
    useEffect(() => {
        const checkHardware = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
            const memory = typeof navigator !== "undefined" ? (navigator as any).deviceMemory || 4 : 4;
            if (cores <= 4 || memory <= 4 || mobile) {
                setIsLowEnd(true);
            }
        };
        checkHardware();

        const handleSplashDone = () => {
            setRevealed(true);
        };

        if (typeof window !== "undefined" && (window as any).__FTX_SPLASH_DONE__) {
            setRevealed(true);
        }

        window.addEventListener("ftx_splash_done", handleSplashDone);
        window.addEventListener("resize", checkHardware);
        return () => {
            window.removeEventListener("ftx_splash_done", handleSplashDone);
            window.removeEventListener("resize", checkHardware);
        };
    }, []);

    // Adaptive Batch Preloader: Only load initial critical frames on mount; load rest on demand
    useEffect(() => {
        let isCancelled = false;

        const loadInitialAndDeferred = async () => {
            // Batch 1: Load initial critical frames for instant hero entry (4 on mobile, 8 on desktop)
            const initialCount = isMobile ? 4 : CRITICAL_LOAD_COUNT;
            const batch1Promises: Promise<HTMLImageElement | null>[] = [];
            for (let i = 0; i < initialCount; i++) {
                batch1Promises.push(loadFrame(i));
            }
            await Promise.all(batch1Promises);

            if (isCancelled) return;

            // Draw initial frame immediately
            const firstImg = imagesRef.current[0];
            if (firstImg) drawFrame(firstImg);

            // Signal loader readiness
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
                window.dispatchEvent(new CustomEvent("ftx_loader_complete"));
            }

            // On mobile / low-end, do NOT eagerly download remaining frames 26-129 upfront!
            // manageMemoryAndQueue will dynamically load frames as user scrolls into the section.
            if (isMobile || isLowEnd) return;

            // On desktop: gently buffer remaining frames during idle time
            const scheduleIdle = (fn: () => void) => {
                if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                    (window as any).requestIdleCallback(fn, { timeout: 2500 });
                } else {
                    setTimeout(fn, 1500);
                }
            };

            scheduleIdle(async () => {
                if (isCancelled) return;
                for (let b = 1; b < 5; b++) {
                    if (isCancelled) return;
                    const start = b * 26;
                    const end = Math.min(TOTAL_FRAMES, start + 26);
                    const batch: Promise<HTMLImageElement | null>[] = [];
                    for (let i = start; i < end; i++) {
                        batch.push(loadFrame(i));
                    }
                    await Promise.all(batch);
                }
            });
        };

        loadInitialAndDeferred();

        return () => {
            isCancelled = true;
        };
    }, [drawFrame, loadFrame, isMobile, isLowEnd]);

    // Single rAF Render & Animation Loop with Idle Sleep & Adaptive Velocity Smoothing
    useEffect(() => {
        let lastFrameIdx = -1;

        const renderLoop = () => {
            if (!isHeroInViewRef.current) {
                isRafRunningRef.current = false;
                return;
            }

            const target = targetFrameRef.current;
            const current = currentFrameRef.current;

            const diff = target - current;
            const absDiff = Math.abs(diff);

            if (absDiff < 0.015) {
                currentFrameRef.current = target;
            } else {
                // Adaptive velocity-aware lerp factor for fast scroll vs precision scroll
                const lerpFactor = isMobile
                    ? (absDiff > 15 ? 0.55 : absDiff > 6 ? 0.45 : 0.38)
                    : (absDiff > 15 ? 0.48 : absDiff > 6 ? 0.38 : 0.30);
                currentFrameRef.current += diff * lerpFactor;
            }

            const val = Math.min(TOTAL_FRAMES - 1, Math.max(0, currentFrameRef.current));
            const floorIdx = Math.floor(val);
            const ceilIdx = Math.min(TOTAL_FRAMES - 1, floorIdx + 1);
            const blendRatio = val - floorIdx;

            // Idle Canvas Redraw Guard: Skip canvas fillrate redraws when frame position is static
            const isFrameIdle = absDiff < 0.001 && floorIdx === lastDrawnFrameIndexRef.current && (isMobile || Math.abs(blendRatio - lastDrawnBlendRatioRef.current) < 0.01);

            if (!isFrameIdle) {
                let img1 = imagesRef.current[floorIdx];
                let img2 = imagesRef.current[ceilIdx];

                // Fallback decoding lookup if target frame is still decoding during extreme fast scroll
                if (!img1) {
                    for (let offset = 1; offset < 25; offset++) {
                        const prev = imagesRef.current[Math.max(0, floorIdx - offset)];
                        if (prev) { img1 = prev; break; }
                        const next = imagesRef.current[Math.min(TOTAL_FRAMES - 1, floorIdx + offset)];
                        if (next) { img1 = next; break; }
                    }
                    loadFrame(floorIdx);
                }

                if (img1) {
                    drawFrame(img1, img2, blendRatio);
                    lastDrawnFrameIndexRef.current = floorIdx;
                    lastDrawnBlendRatioRef.current = blendRatio;
                }
            }

            if (floorIdx !== lastFrameIdx) {
                const isForward = target >= current;
                manageMemoryAndQueue(floorIdx, isForward);
                lastFrameIdx = floorIdx;
            }

            // If settled and completely idle, put RAF to sleep to save 100% CPU/GPU and mobile battery!
            if (absDiff < 0.001) {
                isRafRunningRef.current = false;
                return;
            }

            animFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        startRafLoopRef.current = () => {
            if (isRafRunningRef.current) return;
            isRafRunningRef.current = true;
            animFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        // Initial launch to render initial frame
        startRafLoopRef.current();

        return () => {
            if (animFrameIdRef.current !== null) {
                cancelAnimationFrame(animFrameIdRef.current);
            }
            isRafRunningRef.current = false;
        };
    }, [drawFrame, loadFrame, manageMemoryAndQueue, isMobile]);

    // GSAP ScrollTrigger Integration — Zero React Re-renders
    useEffect(() => {
        if (!sectionRef.current || !pinWrapperRef.current) return;

        const section = sectionRef.current;
        const pinWrapper = pinWrapperRef.current;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                pin: pinWrapper,
                start: "top top",
                end: isMobile ? "+=1600px" : "+=2200px",
                scrub: true,
                anticipatePin: 1,
                fastScrollEnd: true,
                preventOverlaps: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress; // 0.0 -> 1.0
                    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
                    startRafLoopRef.current();
                    if (typographyRef.current) {
                        typographyRef.current.setProgress(progress);
                    }
                    if (contentHandleRef.current) {
                        contentHandleRef.current.setProgress(progress);
                    }
                },
            });

            const handleResizeRedraw = () => {
                const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
                const img = imagesRef.current[frameIndex] || imagesRef.current[0];

                if (img && canvasRef.current) {
                    const maxDpr = isLowEnd ? 1.0 : isMobile ? 1.25 : 2;
                    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, maxDpr) : 1;
                    const w = canvasRef.current.clientWidth;
                    const h = canvasRef.current.clientHeight;
                    if (w && h) {
                        canvasRef.current.width = Math.round(w * dpr);
                        canvasRef.current.height = Math.round(h * dpr);
                        cachedBottomGradRef.current = null;
                    }
                    drawFrame(img);
                }
                startRafLoopRef.current();
            };

            window.addEventListener("resize", handleResizeRedraw);
            return () => window.removeEventListener("resize", handleResizeRedraw);
        }, section);

        return () => ctx.revert();
    }, [drawFrame, isMobile, isLowEnd]);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative w-full h-[180vh] md:h-[260vh] bg-[#070707] overflow-visible"
        >
            <div
                ref={pinWrapperRef}
                className="top-0 left-0 w-full h-screen overflow-hidden bg-[#070707] flex items-center justify-center"
            >
                {/* Background 3D Glow & Ambient Mesh */}
                <HeroBackground />

                {/* High-DPI Cover-fit Canvas for Super-Optimized WebP Frames with Smooth 1.2s Reveal Transition */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                    style={{
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? "scale(1)" : "scale(1.03)",
                        transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: revealed ? "auto" : "opacity, transform",
                    }}
                />

                {/* Glassy Giant Background Typography (Ref-based 0ms React re-renders) */}
                <HeroTypography ref={typographyRef} revealed={revealed} isMobile={isMobile} />

                {/* Foreground Hero Headline & CTA Buttons */}
                <div ref={contentRef} className="relative z-10 w-full">
                    <HeroContent ref={contentHandleRef} locale={locale} messages={messages} revealed={revealed} />
                </div>

                {/* Bottom Fade Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent pointer-events-none z-15" />
            </div>
        </section>
    );
}
