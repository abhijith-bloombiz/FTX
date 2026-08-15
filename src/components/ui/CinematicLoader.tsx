"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * FTX Production-Quality Cinematic Loading Screen
 * Dual Configuration System:
 * - DESKTOP_CONFIGS: Canonical 1536x1024 master canvas (vw >= 768)
 * - MOBILE_CONFIGS: Dedicated 430x600 mobile canvas (vw < 768)
 */

const DEBUG_LOADER = false;
const DISABLE_AUTO_EXIT = false;

const DESKTOP_CANVAS = { width: 1536, height: 1024 };
const MOBILE_CANVAS = { width: 430, height: 600 };

// 1. DESKTOP CONFIGURATIONS (Ultra-smooth 2.2s magnetic assembly timelines)
const DESKTOP_CONFIGS = [
    {
        id: "F",
        src: "/images/FTX loading/F.png",
        left: 255,
        top: 364,
        width: 445,
        height: 292,
        initial: { x: -70, y: -20, scale: 0.92, rotate: -3, blur: 6, opacity: 0 },
        startTimeline: 0.12,
        endTimeline: 0.52,
        zIndex: 10,
    },
    {
        id: "T",
        src: "/images/FTX loading/T.png",
        left: 650,
        top: 384,
        width: 344,
        height: 246,
        initial: { x: 0, y: -65, scale: 1.06, rotate: 4, blur: 6, opacity: 0 },
        startTimeline: 0.20,
        endTimeline: 0.60,
        zIndex: 12,
    },
    {
        id: "X",
        src: "/images/FTX loading/X.png",
        left: 870,
        top: 383,
        width: 442,
        height: 246,
        initial: { x: 70, y: 25, scale: 0.92, rotate: -4, blur: 6, opacity: 0 },
        startTimeline: 0.28,
        endTimeline: 0.68,
        zIndex: 14,
    },
    {
        id: "carSilver",
        src: "/images/FTX loading/car-silver.png",
        left: 147,
        top: 86,
        width: 1222,
        height: 445,
        initial: { x: 0, y: -90, scale: 1.08, rotate: 0, blur: 8, opacity: 0 },
        startTimeline: 0.36,
        endTimeline: 0.74,
        zIndex: 15,
    },
    {
        id: "carGreen",
        src: "/images/FTX loading/car-green.png",
        left: 129,
        top: 179,
        width: 1318,
        height: 444,
        initial: { x: 0, y: 60, scale: 0.94, rotate: 0, blur: 8, opacity: 0 },
        startTimeline: 0.44,
        endTimeline: 0.82,
        zIndex: 16,
    },
    {
        id: "brandName",
        src: "/images/FTX loading/brand name.png",
        left: 170,
        top: 654,
        width: 1182,
        height: 142,
        initial: { x: 0, y: 65, scale: 0.95, rotate: 0, blur: 5, opacity: 0 },
        startTimeline: 0.52,
        endTimeline: 0.88,
        zIndex: 18,
    },
    {
        id: "text",
        src: "/images/FTX loading/text.png",
        left: -15,
        top: 780,
        width: 1520,
        height: 120,
        initial: { x: 0, y: 70, scale: 0.94, rotate: 0, blur: 5, opacity: 0 },
        startTimeline: 0.58,
        endTimeline: 0.94,
        zIndex: 20,
    },
];

// 2. DEDICATED MOBILE CONFIGURATIONS
const MOBILE_CONFIGS = [
    {
        id: "F",
        src: "/images/FTX loading/F.png",
        left: 70,
        top: 180,
        width: 130,
        height: 138,
        initial: { x: -35, y: -12, scale: 0.90, rotate: -2, blur: 4, opacity: 0 },
        startTimeline: 0.12,
        endTimeline: 0.52,
        zIndex: 10,
    },
    {
        id: "T",
        src: "/images/FTX loading/T.png",
        left: 170,
        top: 213,
        width: 110,
        height: 73,
        initial: { x: 0, y: -35, scale: 1.05, rotate: 2, blur: 4, opacity: 0 },
        startTimeline: 0.20,
        endTimeline: 0.60,
        zIndex: 12,
    },
    {
        id: "X",
        src: "/images/FTX loading/X.png",
        left: 233,
        top: 198,
        width: 130,
        height: 100,
        initial: { x: 35, y: 14, scale: 0.92, rotate: -2, blur: 4, opacity: 0 },
        startTimeline: 0.28,
        endTimeline: 0.68,
        zIndex: 14,
    },
    {
        id: "carSilver",
        src: "/images/FTX loading/car-silver.png",
        left: 40,
        top: 123,
        width: 350,
        height: 142,
        initial: { x: 0, y: -45, scale: 1.05, rotate: 0, blur: 6, opacity: 0 },
        startTimeline: 0.36,
        endTimeline: 0.74,
        zIndex: 15,
    },
    {
        id: "carGreen",
        src: "/images/FTX loading/car-green.png",
        left: 40,
        top: 153,
        width: 350,
        height: 130,
        initial: { x: 0, y: 30, scale: 0.94, rotate: 0, blur: 6, opacity: 0 },
        startTimeline: 0.44,
        endTimeline: 0.82,
        zIndex: 16,
    },
    {
        id: "brandName",
        src: "/images/FTX loading/brand name.png",
        left: 55,
        top: 285,
        width: 300,
        height: 40,
        initial: { x: 0, y: 35, scale: 0.94, rotate: 0, blur: 4, opacity: 0 },
        startTimeline: 0.52,
        endTimeline: 0.88,
        zIndex: 18,
    },
    {
        id: "text",
        src: "/images/FTX loading/text.png",
        left: 30,
        top: 318,
        width: 340,
        height: 35,
        initial: { x: 0, y: 40, scale: 0.94, rotate: 0, blur: 4, opacity: 0 },
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
    const [isMobileView, setIsMobileView] = useState(false);

    const masterCanvasRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const bgImgRef = useRef<HTMLImageElement>(null);
    const ambientGlowRef = useRef<HTMLDivElement>(null);
    const compRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

    const minAnimationDoneRef = useRef(false);
    const pageLoadedRef = useRef(false);
    const animationFrameIdRef = useRef<number | null>(null);

    const activeConfigs = isMobileView ? MOBILE_CONFIGS : DESKTOP_CONFIGS;
    const canvasBounds = isMobileView ? MOBILE_CANVAS : DESKTOP_CANVAS;

    // Responsive scale & view tracking
    useEffect(() => {
        const updateScale = () => {
            if (!masterCanvasRef.current) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const mobile = vw < 768;

            setIsMobileView(mobile);

            if (mobile) {
                // Mobile Canvas (430x600) scaled to fit mobile screen
                masterCanvasRef.current.style.width = `${MOBILE_CANVAS.width}px`;
                masterCanvasRef.current.style.height = `${MOBILE_CANVAS.height}px`;
                masterCanvasRef.current.style.transformOrigin = "50% 50%";

                const scale = Math.min(vw / MOBILE_CANVAS.width, vh / MOBILE_CANVAS.height) * 0.92;
                masterCanvasRef.current.style.transform = `scale(${scale})`;
            } else {
                // Desktop Canvas (1536x1024)
                masterCanvasRef.current.style.width = `${DESKTOP_CANVAS.width}px`;
                masterCanvasRef.current.style.height = `${DESKTOP_CANVAS.height}px`;
                masterCanvasRef.current.style.transformOrigin = "50% 50%";

                const scale = Math.min(vw / DESKTOP_CANVAS.width, vh / DESKTOP_CANVAS.height) * 0.65;
                masterCanvasRef.current.style.transform = `scale(${scale})`;
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

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

            // 0. Smooth Fade-In + Parallax Zoom for Background Image (bg.jpg)
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

            // 2. Animate Logo Components with Luxury Magnetic Deceleration & Blur Reveal
            const currentConfigs = window.innerWidth < 768 ? MOBILE_CONFIGS : DESKTOP_CONFIGS;

            currentConfigs.forEach((config) => {
                const imgEl = compRefs.current[config.id];
                if (!imgEl) return;

                if (p < config.startTimeline) {
                    const initOp = Math.max(0, (p / config.startTimeline) * 0.10);
                    imgEl.style.transform = `translate3d(${config.initial.x}px, ${config.initial.y}px, 0) scale(${config.initial.scale}) rotate(${config.initial.rotate}deg)`;
                    imgEl.style.opacity = initOp.toFixed(3);
                    imgEl.style.filter = `blur(${config.initial.blur}px)`;
                } else if (p >= config.endTimeline) {
                    const settleScale = p >= 0.80 && p <= 0.95
                        ? 1 + Math.sin((p - 0.80) / 0.15 * Math.PI) * 0.008
                        : 1;

                    imgEl.style.transform = `translate3d(0px, 0px, 0) scale(${settleScale.toFixed(4)}) rotate(0deg)`;
                    imgEl.style.opacity = "1";
                    imgEl.style.filter = "blur(0px)";
                } else {
                    const normalizedP = (p - config.startTimeline) / (config.endTimeline - config.startTimeline);
                    const easedP = luxuryExpoEaseOut(normalizedP);

                    const currentX = config.initial.x * (1 - easedP);
                    const currentY = config.initial.y * (1 - easedP);
                    const currentScale = config.initial.scale + (1 - config.initial.scale) * easedP;
                    const currentRotate = config.initial.rotate * (1 - easedP);
                    const currentBlur = config.initial.blur * (1 - easedP);
                    const currentOpacity = cubicBezierEaseInOut(normalizedP);

                    imgEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)}) rotate(${currentRotate.toFixed(2)}deg)`;
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
                {/* Mobile Viewport Background: bg-mob.png */}
                <img
                    src="/images/FTX loading/bg-mob.png"
                    alt="FTX Mobile Background"
                    className="w-full h-full object-cover object-center transform-gpu scale-[1.01] md:hidden"
                />
                {/* Desktop Viewport Background: bg.jpg */}
                <img
                    ref={bgImgRef}
                    src="/images/FTX loading/bg.jpg"
                    alt="FTX Desktop Background"
                    className="hidden md:block w-full h-full object-cover object-center transform-gpu transition-transform duration-75"
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

            {/* Layer 2: Master Composition Canvas Centered in Viewport */}
            <div
                ref={masterCanvasRef}
                className="relative pointer-events-none transform-gpu flex items-center justify-center transition-transform duration-75"
                style={{
                    width: `${canvasBounds.width}px`,
                    height: `${canvasBounds.height}px`,
                }}
            >
                {/* Logo Components Layered at Active Coords */}
                {activeConfigs.map((config) => (
                    <img
                        key={config.id}
                        ref={(el) => {
                            compRefs.current[config.id] = el;
                        }}
                        src={config.src}
                        alt={`FTX ${config.id}`}
                        className="absolute pointer-events-none will-change-transform"
                        style={{
                            left: `${config.left}px`,
                            top: `${config.top}px`,
                            width: `${config.width}px`,
                            height: `${config.height}px`,
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
