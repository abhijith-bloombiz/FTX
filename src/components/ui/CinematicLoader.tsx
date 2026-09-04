"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * FTX Luxury Cinematic Loading Screen
 * High Performance Pre-Decoded Engine & Modern Automotive HUD:
 * - 5-Second Default Animation Timeline (5000ms)
 * - Dynamic Frame Readiness Gate: Only completes and exits after critical Hero Section frames are ready
 * - Pre-decodes loader WebP assets in parallel on mount
 * - Monospace HUD percentage counter (00% -> 100%) and specular light beam sweep
 * - Liquid scale & blur exit transition synced seamlessly with Hero canvas reveal
 */

const DEBUG_LOADER = false;
const DISABLE_AUTO_EXIT = false;
const DEFAULT_ANIMATION_DURATION = 3500; // 3.5 seconds cinematic animation duration

// Container-relative logo component configurations (1536x1024 base ratio)
const LOADER_CONFIGS = [
    {
        id: "F",
        src: "/images/FTX loading/F.webp",
        left: "16.60%",
        top: "35.55%",
        width: "28.97%",
        height: "28.52%",
        initial: { xPct: -14, yPct: -6, scale: 0.94, rotate: -3, blur: 5, opacity: 0 },
        startTimeline: 0.08,
        endTimeline: 0.48,
        zIndex: 10,
    },
    {
        id: "T",
        src: "/images/FTX loading/T.webp",
        left: "42.32%",
        top: "37.50%",
        width: "22.40%",
        height: "24.02%",
        initial: { xPct: 0, yPct: -22, scale: 1.05, rotate: 3, blur: 5, opacity: 0 },
        startTimeline: 0.16,
        endTimeline: 0.56,
        zIndex: 12,
    },
    {
        id: "X",
        src: "/images/FTX loading/X.webp",
        left: "56.64%",
        top: "37.40%",
        width: "28.78%",
        height: "24.02%",
        initial: { xPct: 14, yPct: 8, scale: 0.94, rotate: -3, blur: 5, opacity: 0 },
        startTimeline: 0.24,
        endTimeline: 0.64,
        zIndex: 14,
    },
    {
        id: "carSilver",
        src: "/images/FTX loading/car-silver.webp",
        left: "9.57%",
        top: "8.40%",
        width: "79.56%",
        height: "43.46%",
        initial: { xPct: 0, yPct: -16, scale: 1.06, rotate: 0, blur: 6, opacity: 0 },
        startTimeline: 0.32,
        endTimeline: 0.70,
        zIndex: 15,
    },
    {
        id: "carGreen",
        src: "/images/FTX loading/car-green.webp",
        left: "8.40%",
        top: "17.48%",
        width: "85.81%",
        height: "43.36%",
        initial: { xPct: 0, yPct: 12, scale: 0.95, rotate: 0, blur: 6, opacity: 0 },
        startTimeline: 0.40,
        endTimeline: 0.78,
        zIndex: 16,
    },
    {
        id: "brandName",
        src: "/images/FTX loading/brand name.webp",
        left: "11.07%",
        top: "63.87%",
        width: "76.95%",
        height: "13.87%",
        initial: { xPct: 0, yPct: 35, scale: 0.96, rotate: 0, blur: 4, opacity: 0 },
        startTimeline: 0.48,
        endTimeline: 0.84,
        zIndex: 18,
    },
    {
        id: "text",
        src: "/images/FTX loading/text.webp",
        left: "-0.98%",
        top: "76.17%",
        width: "98.96%",
        height: "11.72%",
        initial: { xPct: 0, yPct: 45, scale: 0.95, rotate: 0, blur: 4, opacity: 0 },
        startTimeline: 0.54,
        endTimeline: 0.92,
        zIndex: 20,
    },
];

// Luxury Exponential Ease-Out for smooth magnetic deceleration
function luxuryExpoEaseOut(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -8.5 * t);
}

function cubicBezierEaseInOut(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CinematicLoader() {
    const pathname = usePathname();
    const [shouldRender, setShouldRender] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [progressPct, setProgressPct] = useState(0);
    const [statusText, setStatusText] = useState("INITIALIZING");

    const masterCanvasRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const bgImgRef = useRef<HTMLImageElement>(null);
    const ambientGlowRef = useRef<HTMLDivElement>(null);
    const shimmerRef = useRef<HTMLDivElement>(null);
    const compRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

    const minAnimationDoneRef = useRef(false);
    const framesLoadedRef = useRef(false);
    const animationFrameIdRef = useRef<number | null>(null);

    // 1. Instant Parallel Image Preloading on Mount
    useEffect(() => {
        const navSvgAssets = ["home", "about", "services", "gallery", "packages", "contact"].map((k) => `/fonts/nav/${k}.svg`);
        const assetsToPreload = [
            "/images/FTX loading/bg.webp",
            "/images/FTX loading/bg-mob.webp",
            "/brand/ftx-3d-logo.webp",
            ...LOADER_CONFIGS.map((c) => c.src),
            ...navSvgAssets,
            // Preload critical initial Hero 3D car frames in parallel while loader plays
            ...Array.from({ length: 8 }, (_, i) => `/video/frames/frame_${String(i + 1).padStart(4, "0")}.webp`),
        ];

        assetsToPreload.forEach((url) => {
            const img = new Image();
            img.src = url;
            if (img.decode) {
                img.decode().catch(() => { });
            }
        });
    }, []);

    // 2. High-Performance 60fps Animation Engine with Dynamic Frame Lock
    useEffect(() => {
        if (DEBUG_LOADER) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const checkFramesLoaded = () => {
            if (typeof window !== "undefined" && (window as any).__FTX_LOADER_DONE__) {
                framesLoadedRef.current = true;
            }
        };

        const handleFramesReady = () => {
            framesLoadedRef.current = true;
            checkReadyToExit();
        };

        checkFramesLoaded();

        if (!framesLoadedRef.current) {
            window.addEventListener("load", handleFramesReady);
            window.addEventListener("ftx_loader_complete", handleFramesReady);
        }

        const startTime = performance.now();

        const checkReadyToExit = () => {
            if (DISABLE_AUTO_EXIT) return;
            if (minAnimationDoneRef.current && framesLoadedRef.current) {
                triggerExitTransition();
            }
        };

        const triggerExitTransition = () => {
            setStatusText("SYSTEM READY");
            setIsExiting(true);
            if (typeof window !== "undefined") {
                (window as any).__FTX_SPLASH_DONE__ = true;
                window.dispatchEvent(new CustomEvent("ftx_splash_done"));
            }
            setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = originalOverflow;
            }, 400);
        };

        // 60fps RAF Animation Loop
        const updateAnimation = (now: number) => {
            checkFramesLoaded();

            const elapsed = now - startTime;
            let rawProgress = elapsed / DEFAULT_ANIMATION_DURATION;

            // If 5s duration has finished but critical hero frames are still decoding, hold at 99%
            if (rawProgress >= 1.0) {
                if (framesLoadedRef.current || prefersReducedMotion) {
                    rawProgress = 1.0;
                    if (!minAnimationDoneRef.current) {
                        minAnimationDoneRef.current = true;
                        checkReadyToExit();
                    }
                } else {
                    rawProgress = 0.99;
                    setStatusText("DECODING FRAMES");
                }
            }

            const p = prefersReducedMotion ? 1.0 : Math.min(1.0, rawProgress);

            // Update percentage HUD
            const currentPct = Math.round(p * 100);
            setProgressPct(currentPct);

            if (p < 0.35) {
                setStatusText("INITIALIZING");
            } else if (p < 0.85) {
                setStatusText("ASSEMBLING LOGO");
            } else if (p < 0.99) {
                setStatusText("LOADING FRAMES");
            } else if (framesLoadedRef.current) {
                setStatusText("SYSTEM READY");
            }

            // 0. Background Fade-In + Parallax Zoom
            if (bgRef.current) {
                const bgOpacity = prefersReducedMotion ? 1.0 : luxuryExpoEaseOut(Math.min(1, p / 0.30));
                bgRef.current.style.opacity = bgOpacity.toFixed(3);
            }
            if (bgImgRef.current) {
                const bgScale = 1.06 - luxuryExpoEaseOut(p) * 0.05;
                bgImgRef.current.style.transform = `scale(${bgScale.toFixed(4)})`;
            }

            // 1. Ambient Background Pulse
            if (ambientGlowRef.current) {
                const glowIntensity = p < 0.25
                    ? p * 2.8
                    : 0.6 + Math.sin(now * 0.003) * 0.12;
                ambientGlowRef.current.style.opacity = glowIntensity.toFixed(3);
            }

            // 2. Pure White Laser Light Beam Sweep Across Full Logo Width (left: -25% to 115%)
            if (shimmerRef.current) {
                if (p >= 0.55 && p <= 0.95) {
                    const shimmerP = (p - 0.55) / 0.40;
                    // Sweep left position across container width (-25% to 115%)
                    const leftPct = (shimmerP * 140 - 25).toFixed(1);
                    let opacity = 0;
                    if (shimmerP < 0.12) {
                        opacity = shimmerP / 0.12;
                    } else if (shimmerP > 0.88) {
                        opacity = (1 - shimmerP) / 0.12;
                    } else {
                        opacity = 1;
                    }
                    shimmerRef.current.style.opacity = opacity.toFixed(3);
                    shimmerRef.current.style.left = `${leftPct}%`;
                } else {
                    shimmerRef.current.style.opacity = "0";
                }
            }

            // 3. Container-Relative Component Assembly
            LOADER_CONFIGS.forEach((config) => {
                const imgEl = compRefs.current[config.id];
                if (!imgEl) return;

                if (p < config.startTimeline) {
                    const initOp = Math.max(0, (p / config.startTimeline) * 0.08);
                    imgEl.style.transform = `translate3d(${config.initial.xPct}%, ${config.initial.yPct}%, 0) scale(${config.initial.scale}) rotate(${config.initial.rotate}deg)`;
                    imgEl.style.opacity = initOp.toFixed(3);
                    imgEl.style.filter = `blur(${config.initial.blur}px)`;
                } else if (p >= config.endTimeline) {
                    const settleScale = p >= 0.82 && p <= 0.96
                        ? 1 + Math.sin((p - 0.82) / 0.14 * Math.PI) * 0.006
                        : 1;

                    imgEl.style.transform = `translate3d(0%, 0%, 0) scale(${settleScale.toFixed(4)}) rotate(0deg)`;
                    imgEl.style.opacity = "1";
                    imgEl.style.filter = "blur(0px)";
                } else {
                    const normalizedP = (p - config.startTimeline) / (config.endTimeline - config.startTimeline);
                    const easedP = luxuryExpoEaseOut(normalizedP);

                    const currentX = config.initial.xPct * (1 - easedP);
                    const currentY = config.initial.yPct * (1 - easedP);
                    const currentScale = config.initial.scale + (1 - config.initial.scale) * easedP;
                    const currentRotate = config.initial.rotate * (1 - easedP);
                    const currentBlur = config.initial.blur * (1 - easedP);
                    const currentOpacity = cubicBezierEaseInOut(normalizedP);

                    imgEl.style.transform = `translate3d(${currentX.toFixed(2)}%, ${currentY.toFixed(2)}%, 0) scale(${currentScale.toFixed(4)}) rotate(${currentRotate.toFixed(2)}deg)`;
                    imgEl.style.opacity = currentOpacity.toFixed(3);
                    imgEl.style.filter = `blur(${currentBlur.toFixed(1)}px)`;
                }
            });

            if (!minAnimationDoneRef.current || !framesLoadedRef.current) {
                animationFrameIdRef.current = requestAnimationFrame(updateAnimation);
            }
        };

        animationFrameIdRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            window.removeEventListener("load", handleFramesReady);
            window.removeEventListener("ftx_loader_complete", handleFramesReady);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    if (!shouldRender || pathname?.includes("/admin")) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading First Torque X"
            className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070707] overflow-hidden select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isExiting ? "opacity-0 scale-[1.07] blur-lg pointer-events-none" : "opacity-100 scale-100"
                }`}
        >
            {/* Layer 1: Background Image & Radial Gradient Mask */}
            <div
                ref={bgRef}
                className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-0 transition-opacity duration-500 ease-out flex items-center justify-center bg-[#070707]"
            >
                <picture className="absolute inset-0 w-full h-full block">
                    <source media="(max-width: 767px)" srcSet="/images/FTX%20loading/bg-mob.webp" />
                    <img
                        ref={bgImgRef}
                        src="/images/FTX loading/bg.webp"
                        alt="FTX Loading Background"
                        className="w-full h-full object-cover object-center transform-gpu transition-transform duration-75"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/90" />
            </div>

            {/* Layer 2: Atmospheric Ambient Radial Glow */}
            <div
                ref={ambientGlowRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(164, 214, 94, 0.16) 0%, rgba(164, 214, 94, 0.02) 50%, transparent 70%)",
                    opacity: DEBUG_LOADER ? 1 : 0,
                }}
            />

            {/* Layer 3: Master Responsive Box */}
            <div
                ref={masterCanvasRef}
                className="relative pointer-events-none transform-gpu w-[64vw] sm:w-[42vw] md:w-[32vw] lg:w-[26vw] max-w-[430px] aspect-[1536/1024] flex items-center justify-center transition-transform duration-75"
            >
                {/* Pure White Laser Light Beam (Strictly PNG-Masked to Logo Contour - Zero Background Spillover) */}
                <div
                    className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
                    style={{
                        maskImage: "url('/brand/ftx-3d-logo.webp')",
                        WebkitMaskImage: "url('/brand/ftx-3d-logo.webp')",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                    }}
                >
                    <div
                        ref={shimmerRef}
                        className="absolute top-0 bottom-0 w-[50px] sm:w-[70px] pointer-events-none opacity-0 transform-gpu"
                        style={{
                            background: "linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)",
                            filter: "drop-shadow(0 0 12px #ffffff) brightness(2.2)",
                            mixBlendMode: "screen",
                            transform: "skewX(-20deg)",
                            left: "-25%",
                        }}
                    />
                </div>

                {/* Logo Components Layered at Container Percentage Coords */}
                {LOADER_CONFIGS.map((config) => (
                    <img
                        key={config.id}
                        ref={(el) => {
                            compRefs.current[config.id] = el;
                        }}
                        src={config.src}
                        alt={`FTX ${config.id}`}
                        className="absolute pointer-events-none will-change-transform"
                        style={{
                            left: config.left,
                            top: config.top,
                            width: config.width,
                            height: config.height,
                            zIndex: config.zIndex,
                            opacity: DEBUG_LOADER ? 1 : 0,
                            transform: DEBUG_LOADER ? "none" : undefined,
                            filter: DEBUG_LOADER ? "none" : undefined,
                            objectFit: "contain",
                        }}
                    />
                ))}
            </div>

        </div>
    );
}
