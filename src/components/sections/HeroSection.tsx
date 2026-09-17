"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Locale } from "@/i18n/config";
import { HeroBackground } from "@/components/hero3d/HeroBackground";
import { HeroContent, HeroContentHandle } from "@/components/hero3d/HeroContent";
import { HeroTypography, HeroTypographyHandle } from "@/components/hero3d/HeroTypography";
import { useLenis } from "@/components/motion/SmoothScrollProvider";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
}

interface HeroSectionProps {
    locale: Locale;
    messages: any;
}

const TOTAL_FRAMES = 110;
const CRITICAL_LOAD_COUNT = 8; // 8 critical frames required for instant loader completion and zero-lag initial reveal

export function HeroSection({ locale, messages }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const typographyRef = useRef<HeroTypographyHandle>(null);
    const contentHandleRef = useRef<HeroContentHandle>(null);
    const scrollBtnRef = useRef<HTMLButtonElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const { lenis } = useLenis();

    // Frame Cache & High-Frequency Animation Refs (0ms React State Overhead)
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const inFlightPromisesRef = useRef<Map<number, Promise<HTMLImageElement | null>>>(new Map());
    const fetchedSetRef = useRef<Set<number>>(new Set());

    const targetFrameRef = useRef<number>(0);
    const currentFrameRef = useRef<number>(0);
    const animFrameIdRef = useRef<number | null>(null);
    const isHeroInViewRef = useRef<boolean>(true);
    const isRafRunningRef = useRef<boolean>(false);
    const startRafLoopRef = useRef<() => void>(() => {});

    const lastDrawnFrameIndexRef = useRef<number>(-1);
    const cachedBottomGradRef = useRef<{ height: number; grad: CanvasGradient } | null>(null);

    const [revealed, setRevealed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLowEnd, setIsLowEnd] = useState(false);

    // IntersectionObserver to pause heavy 60fps canvas re-renders when hero is off-screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isHeroInViewRef.current = entry.isIntersecting;
                if (entry.isIntersecting && startRafLoopRef.current) {
                    startRafLoopRef.current();
                } else if (!entry.isIntersecting && animFrameIdRef.current !== null) {
                    cancelAnimationFrame(animFrameIdRef.current);
                    animFrameIdRef.current = null;
                    isRafRunningRef.current = false;
                }
            },
            { threshold: 0 }
        );
        const target = sectionRef.current || pinWrapperRef.current;
        if (target) observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // High-DPI Cover-fit Canvas Drawing Pipeline (100% Native Resolution, Zero Mid-Frame Blending)
    const drawFrame = useCallback((img: HTMLImageElement) => {
        if (!canvasRef.current || !img || !img.complete || img.naturalWidth === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // 100% Native Hardware DPR on both Mobile & Desktop (up to 3x for Retina / High-DPI screens)
        const dpr = typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio || 1, 3)
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
        ctx.imageSmoothingQuality = "high";

        const imgWidth = img.naturalWidth || 1600;
        const imgHeight = img.naturalHeight || 900;

        ctx.fillStyle = "#070707";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 100% Cover scale calculation without arbitrary downscaling
        const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const width = imgWidth * scale;
        const height = imgHeight * scale;
        const x = (canvasWidth - width) / 2;
        const y = (canvasHeight - height) / 2;

        // 100% Crisp Frame Rendering - zero crossfade ghosting/blending
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, x, y, width, height);

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
    }, [isMobile]);

    // Fast Single-Frame Loader & Decoder with Shared In-Flight Promises & Auto-Draw
    const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
        if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null);
        if (imagesRef.current[index]) return Promise.resolve(imagesRef.current[index]);
        if (inFlightPromisesRef.current.has(index)) {
            return inFlightPromisesRef.current.get(index)!;
        }

        const img = new Image();
        const paddedIndex = String(index + 1).padStart(4, "0");
        img.src = `/video/frames/frame_${paddedIndex}.webp`;

        const onComplete = () => {
            inFlightPromisesRef.current.delete(index);
            if (img.naturalWidth > 0) {
                fetchedSetRef.current.add(index);
                imagesRef.current[index] = img;

                // If this is the initial frame (index 0) or the currently targeted frame, draw it immediately!
                if (index === 0 || index === Math.round(currentFrameRef.current)) {
                    drawFrame(img);
                }
                return img;
            }
            return null;
        };

        if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve(onComplete());
        }

        const promise = new Promise<HTMLImageElement | null>((resolve) => {
            if (img.decode) {
                img.decode().then(() => resolve(onComplete())).catch(() => resolve(onComplete()));
            } else {
                img.onload = () => resolve(onComplete());
                img.onerror = () => resolve(onComplete());
            }
        });

        inFlightPromisesRef.current.set(index, promise);
        return promise;
    }, [drawFrame]);

    // Memory Management (Generous Sliding Window with Directional Preloading)
    const manageMemoryAndQueue = useCallback((centerFrame: number, isForward: boolean) => {
        // Generous cache retention: 70+ frames on mobile, full retention on desktop
        // (Prevents aggressive frame purging/re-decoding cycles that cause mobile stutter)
        const backKeep = isMobile ? 32 : 55;
        const forwardKeep = isMobile ? 48 : 55;
        const minKeep = Math.max(0, centerFrame - backKeep);
        const maxKeep = Math.min(TOTAL_FRAMES - 1, centerFrame + forwardKeep);

        // 1. Release decoded images outside active window only on memory-constrained devices (keep index 0 as fallback safety)
        if (isMobile || isLowEnd) {
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                if (i !== 0 && (i < minKeep || i > maxKeep)) {
                    if (imagesRef.current[i]) {
                        imagesRef.current[i] = null;
                    }
                }
            }
        }

        // 2. Prioritize preloading ahead in current scroll direction
        const queue: number[] = [];
        const step = isForward ? 1 : -1;
        const forwardAhead = isMobile ? 24 : 35;
        const backAhead = isMobile ? 12 : 20;

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
            if (!imagesRef.current[idx] && !inFlightPromisesRef.current.has(idx)) {
                loadFrame(idx);
            }
        });
    }, [loadFrame, isMobile, isLowEnd]);

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

    // Adaptive Batch Preloader: Only load initial critical frames on mount; buffer rest in background
    useEffect(() => {
        let isCancelled = false;

        const loadInitialAndDeferred = async () => {
            // Batch 1: Load initial critical frames for instant hero entry (6 on mobile, 8 on desktop)
            const initialCount = isMobile ? 6 : CRITICAL_LOAD_COUNT;
            const batch1Promises: Promise<HTMLImageElement | null>[] = [];
            for (let i = 0; i < initialCount; i++) {
                batch1Promises.push(loadFrame(i));
            }
            await Promise.all(batch1Promises);

            if (isCancelled) return;

            // Draw initial frame immediately
            let firstImg = imagesRef.current[0];
            if (!firstImg) {
                firstImg = await loadFrame(0);
            }
            if (firstImg) {
                drawFrame(firstImg);
                lastDrawnFrameIndexRef.current = 0;
            }
            startRafLoopRef.current();

            // Signal loader readiness
            if (typeof window !== "undefined") {
                (window as any).__FTX_LOADER_DONE__ = true;
                window.dispatchEvent(new CustomEvent("ftx_loader_complete"));
            }

            // Both Mobile and Desktop: buffer remaining frames gently during idle time
            // On mobile, use gentle micro-batches with short breathers so touch responsiveness stays 100% fluid
            const scheduleIdle = (fn: () => void) => {
                if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                    (window as any).requestIdleCallback(fn, { timeout: 2000 });
                } else {
                    setTimeout(fn, 1200);
                }
            };

            scheduleIdle(async () => {
                if (isCancelled) return;
                const batchSize = isMobile ? 12 : 25;
                const totalBatches = Math.ceil(TOTAL_FRAMES / batchSize);

                for (let b = 0; b < totalBatches; b++) {
                    if (isCancelled) return;
                    const start = b * batchSize;
                    const end = Math.min(TOTAL_FRAMES, start + batchSize);
                    const batch: Promise<HTMLImageElement | null>[] = [];
                    for (let i = start; i < end; i++) {
                        if (!imagesRef.current[i]) {
                            batch.push(loadFrame(i));
                        }
                    }
                    if (batch.length > 0) {
                        await Promise.all(batch);
                        // On mobile, take a short breather between batches to keep the main thread free
                        if (isMobile) {
                            await new Promise((r) => setTimeout(r, 60));
                        }
                    }
                }
            });
        };

        loadInitialAndDeferred();

        return () => {
            isCancelled = true;
        };
    }, [drawFrame, loadFrame, isMobile]);

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
                // Adaptive velocity-aware lerp factor for smooth momentum glide on both mobile & desktop
                const lerpFactor = isMobile
                    ? (absDiff > 18 ? 0.36 : absDiff > 6 ? 0.28 : 0.22)
                    : (absDiff > 15 ? 0.44 : absDiff > 6 ? 0.35 : 0.28);
                currentFrameRef.current += diff * lerpFactor;
            }

            const val = Math.min(TOTAL_FRAMES - 1, Math.max(0, currentFrameRef.current));
            const frameIdx = Math.round(val);

            // Idle Canvas Redraw Guard: Skip canvas redraws when exact frame index is already drawn
            const isFrameIdle = absDiff < 0.001 && frameIdx === lastDrawnFrameIndexRef.current;

            if (!isFrameIdle) {
                let img = imagesRef.current[frameIdx];

                // Fallback decoding lookup if target frame is still decoding during fast scroll
                if (!img) {
                    for (let offset = 1; offset < 25; offset++) {
                        const prev = imagesRef.current[Math.max(0, frameIdx - offset)];
                        if (prev) { img = prev; break; }
                        const next = imagesRef.current[Math.min(TOTAL_FRAMES - 1, frameIdx + offset)];
                        if (next) { img = next; break; }
                    }
                    loadFrame(frameIdx);
                }

                if (img) {
                    drawFrame(img);
                    lastDrawnFrameIndexRef.current = frameIdx;
                }
            }

            if (frameIdx !== lastFrameIdx) {
                const isForward = target >= current;
                manageMemoryAndQueue(frameIdx, isForward);
                lastFrameIdx = frameIdx;
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
            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: section,
                pin: pinWrapper,
                start: "top top",
                end: isMobile ? "+=2000px" : "+=2200px",
                scrub: isMobile ? 0.45 : true,
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
                    if (scrollBtnRef.current) {
                        const opacity = Math.max(0, 1 - progress * 5);
                        scrollBtnRef.current.style.opacity = opacity.toString();
                        scrollBtnRef.current.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
                    }
                },
            });

            const handleResizeRedraw = () => {
                const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
                const img = imagesRef.current[frameIndex] || imagesRef.current[0];

                if (img && canvasRef.current) {
                    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 3) : 1;
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

    // ResizeObserver: Redraw canvas whenever its rendered dimensions change
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;

        const ro = new ResizeObserver(() => {
            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
            const img = imagesRef.current[frameIndex] || imagesRef.current[0];
            if (img && img.complete && img.naturalWidth > 0) {
                drawFrame(img);
            }
        });

        ro.observe(canvas);
        return () => ro.disconnect();
    }, [drawFrame]);

    // Redraw immediately upon reveal transition to guarantee canvas is painted
    useEffect(() => {
        if (revealed) {
            const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
            const img = imagesRef.current[frameIndex] || imagesRef.current[0];
            if (img && img.complete && img.naturalWidth > 0) {
                drawFrame(img);
            }
            startRafLoopRef.current();
        }
    }, [revealed, drawFrame]);

    const handleScrollToReveal = useCallback(() => {
        const introSection = document.getElementById("about") || document.getElementById("intro");
        const defaultTarget = scrollTriggerRef.current
            ? scrollTriggerRef.current.end
            : (sectionRef.current ? sectionRef.current.offsetTop + (isMobile ? 2000 : 2200) : 2200);

        if (lenis) {
            if (introSection) {
                lenis.scrollTo(introSection, {
                    offset: -60,
                    duration: 3.2,
                    easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
                });
            } else {
                lenis.scrollTo(defaultTarget - 60, {
                    duration: 3.2,
                    easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
                });
            }
        } else {
            const targetPos = introSection
                ? introSection.getBoundingClientRect().top + window.scrollY - 60
                : defaultTarget - 60;
            window.scrollTo({ top: targetPos, behavior: "smooth" });
        }
    }, [lenis, isMobile]);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative w-full h-[220vh] md:h-[260vh] bg-[#070707] overflow-visible"
        >
            <div
                ref={pinWrapperRef}
                className="top-0 left-0 w-full h-screen overflow-hidden bg-[#070707] flex items-center justify-center"
            >
                {/* Background 3D Glow & Ambient Mesh */}
                <HeroBackground />

                {/* Instant Zero-Delay Frame 1 Poster Fallback (guarantees zero black screen even before canvas context initializes) */}
                <img
                    src="/video/frames/frame_0001.webp"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                    style={{
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? "scale(1)" : "scale(1.03)",
                        transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: revealed ? "auto" : "opacity, transform",
                    }}
                />

                {/* High-DPI Cover-fit Canvas for Super-Optimized WebP Frames with Smooth 1.2s Reveal Transition */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                    style={{
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? "scale(1)" : "scale(1.03)",
                        transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: revealed ? "auto" : "opacity, transform",
                        imageRendering: "-webkit-optimize-contrast",
                    }}
                />

                {/* Glassy Giant Background Typography (Ref-based 0ms React re-renders) */}
                <HeroTypography ref={typographyRef} revealed={revealed} isMobile={isMobile} />

                {/* Foreground Hero Headline & CTA Buttons */}
                <HeroContent ref={contentHandleRef} locale={locale} messages={messages} revealed={revealed} />

                {/* Bottom Fade Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 bg-gradient-to-t from-[#070707] via-[#070707]/80 to-transparent pointer-events-none z-15" />

                {/* Scroll-to-Reveal Button */}
                {revealed && (
                    <button
                        ref={scrollBtnRef}
                        type="button"
                        onClick={handleScrollToReveal}
                        aria-label="Scroll to reveal"
                        className="absolute bottom-[76px] sm:bottom-8 left-1/2 -translate-x-1/2 z-40 group cursor-pointer select-none"
                        style={{
                            transition: "opacity 0.3s ease",
                        }}
                    >
                        {/* Pulsing ring */}
                        <span className="absolute inset-0 rounded-full border border-white/20 animate-ping" style={{ animationDuration: "2s" }} />

                        {/* Glassy pill */}
                        <span
                            className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 group-hover:border-white/50 transition-all duration-300 group-hover:scale-105 active:scale-95"
                            style={{
                                background: "transparent",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                            }}
                        >
                            {/* Chevron SVG with bounce animation */}
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 group-hover:text-white transition-colors duration-300 animate-bounce"
                                style={{ animationDuration: "1.8s" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}
