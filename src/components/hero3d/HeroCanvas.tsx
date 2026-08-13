"use client";

/**
 * PERFORMANCE-CRITICAL: On-demand rendering
 * 
 * The Canvas uses frameloop="demand" — it does NOT render 60 FPS continuously.
 * It only re-renders when invalidate() is called (on mouse movement or settling).
 * When the hero scrolls off-screen, frameloop switches to "never" (zero GPU work).
 */

import { Suspense, useState, useEffect, useRef, RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { HeroLighting } from "./HeroLighting";
import { ReflectiveGround } from "./ReflectiveGround";
import { CarModel } from "./CarModel";
import { CameraController } from "./CameraController";

interface HeroCanvasProps {
    mousePosRef: RefObject<{ x: number; y: number }>;
    isMobile?: boolean;
}

function CanvasFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="flex items-center gap-3 px-4 py-2 bg-ftx-obsidian/80 border border-ftx-lime/30 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-ftx-lime" />
                <span className="text-xs font-mono font-bold text-ftx-lime uppercase tracking-widest">
                    LOADING 3D VEHICLE...
                </span>
            </div>
        </div>
    );
}

export function HeroCanvas({
    mousePosRef,
    isMobile = false,
}: HeroCanvasProps) {
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Pause render loop completely when scrolled off-screen
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0, rootMargin: "100px" }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [mounted]);

    if (!mounted) return <CanvasFallback />;

    // Mobile: 1.0 DPR, Desktop: capped at 1.5
    const dpr: [number, number] = isMobile ? [1, 1] : [1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)];

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
            <Canvas
                frameloop={isVisible ? "demand" : "never"}
                shadows={false}
                gl={{
                    antialias: !isMobile,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                    stencil: false,
                    depth: true,
                    preserveDrawingBuffer: false,
                }}
                camera={{
                    position: isMobile ? [-4.2, 1.8, 5.8] : [-3.6, 1.4, 4.8],
                    fov: isMobile ? 48 : 42,
                    near: 0.5,
                    far: 50,
                }}
                dpr={dpr}
                style={{ width: "100%", height: "100%" }}
            >
                <Suspense fallback={null}>
                    <HeroLighting isMobile={isMobile} />
                    <ReflectiveGround />
                    <CarModel mousePosRef={mousePosRef} isMobile={isMobile} />
                    <CameraController isMobile={isMobile} />
                </Suspense>
            </Canvas>
        </div>
    );
}
