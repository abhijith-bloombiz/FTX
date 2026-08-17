"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * FTX Production-Quality Cinematic Loading Screen
 * Fully Container-Relative Responsive System:
 * - All image parts use percentage coordinates & dimensions relative to the master container (1536x1024 ratio).
 * - Adjusting ONLY the container element (width / max-width / aspect-ratio) controls responsiveness across all devices seamlessly.
 */

const DEBUG_LOADER = false;
const DISABLE_AUTO_EXIT = false;

// Unified Loader Composition Configurations (Container % based)
const LOADER_CONFIGS = [
    {
        id: "F",
        src: "/images/FTX loading/F.webp",
        left: "16.60%",
        top: "35.55%",
        width: "28.97%",
        height: "28.52%",
        initial: { xPct: -15.73, yPct: -6.85, scale: 0.92, rotate: -3, blur: 6, opacity: 0 },
        startTimeline: 0.12,
        endTimeline: 0.52,
        zIndex: 10,
    },
    {
        id: "T",
        src: "/images/FTX loading/T.webp",
        left: "42.32%",
        top: "37.50%",
        width: "22.40%",
        height: "24.02%",
        initial: { xPct: 0, yPct: -26.42, scale: 1.06, rotate: 4, blur: 6, opacity: 0 },
        startTimeline: 0.20,
        endTimeline: 0.60,
        zIndex: 12,
    },
    {
        id: "X",
        src: "/images/FTX loading/X.webp",
        left: "56.64%",
        top: "37.40%",
        width: "28.78%",
        height: "24.02%",
        initial: { xPct: 15.84, yPct: 10.16, scale: 0.92, rotate: -4, blur: 6, opacity: 0 },
        startTimeline: 0.28,
        endTimeline: 0.68,
        zIndex: 14,
    },
    {
        id: "carSilver",
        src: "/images/FTX loading/car-silver.webp",
        left: "9.57%",
        top: "8.40%",
        width: "79.56%",
        height: "43.46%",
        initial: { xPct: 0, yPct: -20.22, scale: 1.08, rotate: 0, blur: 8, opacity: 0 },
        startTimeline: 0.36,
        endTimeline: 0.74,
        zIndex: 15,
    },
    {
        id: "carGreen",
        src: "/images/FTX loading/car-green.webp",
        left: "8.40%",
        top: "17.48%",
        width: "85.81%",
        height: "43.36%",
        initial: { xPct: 0, yPct: 13.51, scale: 0.94, rotate: 0, blur: 8, opacity: 0 },
        startTimeline: 0.44,
        endTimeline: 0.82,
        zIndex: 16,
    },
    {
        id: "brandName",
        src: "/images/FTX loading/brand name.webp",
        left: "11.07%",
        top: "63.87%",
        width: "76.95%",
        height: "13.87%",
        initial: { xPct: 0, yPct: 45.77, scale: 0.95, rotate: 0, blur: 5, opacity: 0 },
        startTimeline: 0.52,
        endTimeline: 0.88,
        zIndex: 18,
    },
    {
        id: "text",
        src: "/images/FTX loading/text.webp",
        left: "-0.98%",
        top: "76.17%",
        width: "98.96%",
        height: "11.72%",
        initial: { xPct: 0, yPct: 58.33, scale: 0.94, rotate: 0, blur: 5, opacity: 0 },
        startTimeline: 0.58,
        endTimeline: 0.94,
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
    const [shouldRender, setShouldRender] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    const masterCanvasRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const bgImgRef = useRef<HTMLImageElement>(null);
    const ambientGlowRef = useRef<HTMLDivElement>(null);
    const compRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

    const minAnimationDoneRef = useRef(false);
    const pageLoadedRef = useRef(false);
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (DEBUG_LOADER) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const handleLoad = () => {
            pageLoadedRef.current = true;
            checkReadyToExit();
        };

        if (document.readyState === "complete") {
            pageLoadedRef.current = true;
        } else {
            window.addEventListener("load", handleLoad);
        }

        // 2.2s Min Animation Duration for smooth, magnetic assembly sequence
        const MIN_ANIMATION_DURATION = prefersReducedMotion ? 400 : 2200;
        const startTime = performance.now();

        const checkReadyToExit = () => {
            if (DISABLE_AUTO_EXIT) return;
            if (minAnimationDoneRef.current) {
                triggerExitTransition();
            }
        };

        const triggerExitTransition = () => {
            setIsExiting(true);
            setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = originalOverflow;
            }, 750);
        };

        // 60fps RAF Animation Engine
        const updateAnimation = (now: number) => {
            const elapsed = now - startTime;
            let rawProgress = elapsed / MIN_ANIMATION_DURATION;

            if (rawProgress >= 1.0) {
                rawProgress = 1.0;
                if (!minAnimationDoneRef.current) {
                    minAnimationDoneRef.current = true;
                    checkReadyToExit();
                }
            }

            const p = prefersReducedMotion ? 1.0 : rawProgress;

            // 0. Smooth Fade-In + Parallax Zoom for Background Image
            if (bgRef.current) {
                const bgOpacity = prefersReducedMotion ? 1.0 : luxuryExpoEaseOut(Math.min(1, p / 0.40));
                bgRef.current.style.opacity = bgOpacity.toFixed(3);
            }
            if (bgImgRef.current) {
                const bgScale = 1.06 - luxuryExpoEaseOut(p) * 0.05;
                bgImgRef.current.style.transform = `scale(${bgScale.toFixed(4)})`;
            }

            // 1. Ambient Background Glow
            if (ambientGlowRef.current) {
                const glowIntensity = p < 0.2
                    ? p * 2.5
                    : p < 0.75
                        ? 0.5 + Math.sin(p * Math.PI * 4) * 0.15
                        : 0.8 + Math.sin(now * 0.002) * 0.08;
                ambientGlowRef.current.style.opacity = glowIntensity.toFixed(3);
            }

            // 2. Animate Logo Components with Container-Relative Translate & Blur Reveal
            LOADER_CONFIGS.forEach((config) => {
                const imgEl = compRefs.current[config.id];
                if (!imgEl) return;

                if (p < config.startTimeline) {
                    const initOp = Math.max(0, (p / config.startTimeline) * 0.10);
                    imgEl.style.transform = `translate3d(${config.initial.xPct}%, ${config.initial.yPct}%, 0) scale(${config.initial.scale}) rotate(${config.initial.rotate}deg)`;
                    imgEl.style.opacity = initOp.toFixed(3);
                    imgEl.style.filter = `blur(${config.initial.blur}px)`;
                } else if (p >= config.endTimeline) {
                    const settleScale = p >= 0.80 && p <= 0.95
                        ? 1 + Math.sin((p - 0.80) / 0.15 * Math.PI) * 0.008
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

            if (rawProgress < 1.0 || !minAnimationDoneRef.current) {
                animationFrameIdRef.current = requestAnimationFrame(updateAnimation);
            } else {
                const holdLoop = (t: number) => {
                    if (ambientGlowRef.current) {
                        const breathe = 0.8 + Math.sin(t * 0.002) * 0.08;
                        ambientGlowRef.current.style.opacity = breathe.toFixed(3);
                    }
                    if (!pageLoadedRef.current) {
                        animationFrameIdRef.current = requestAnimationFrame(holdLoop);
                    }
                };
                animationFrameIdRef.current = requestAnimationFrame(holdLoop);
            }
        };

        animationFrameIdRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            window.removeEventListener("load", handleLoad);
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading First Torque X"
            className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#070707] overflow-hidden select-none transition-all duration-750 ease-out ${isExiting ? "opacity-0 scale-[1.04] blur-md pointer-events-none" : "opacity-100 scale-100"
                }`}
        >
            {/* Layer 1: Responsive Background Layer with Smooth Fade-In & Parallax Scale */}
            <div
                ref={bgRef}
                className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-0 transition-opacity duration-700 ease-out"
            >
                <img
                    ref={bgImgRef}
                    src="/images/FTX loading/bg.webp"
                    alt="FTX Loading Background"
                    className="w-full h-full object-cover object-center transform-gpu transition-transform duration-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
            </div>

            {/* Atmospheric Ambient Pulse */}
            <div
                ref={ambientGlowRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(164, 214, 94, 0.15) 0%, rgba(164, 214, 94, 0.03) 45%, transparent 70%)",
                    opacity: DEBUG_LOADER ? 1 : 0,
                }}
            />

            {/* Layer 2: Master Container Box — +0.5x size boost on mobile (75vw) for optimal mobile impact */}
            <div
                ref={masterCanvasRef}
                className="relative pointer-events-none transform-gpu w-[75vw] sm:w-[50vw] md:w-[38vw] lg:w-[32vw] max-w-[550px] aspect-[1536/1024] flex items-center justify-center transition-transform duration-75"
            >
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
