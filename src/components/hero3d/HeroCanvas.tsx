"use client";

/**
 * PERFORMANCE-CRITICAL: On-demand rendering
 * 
 * The Canvas uses frameloop="demand" — it does NOT render 60 FPS continuously.
 * It only re-renders when invalidate() is called (on mouse movement or settling).
 * When the hero scrolls off-screen, frameloop switches to "never" (zero GPU work).
 */

import React, { Suspense, useState, useEffect, useRef, RefObject, Component, ErrorInfo } from "react";
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

// Check if WebGL context can actually be created on the device/browser
function isWebGLAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
}

// React Error Boundary for 3D Canvas rendering errors (e.g. WebGL Context lost/creation error)
class WebGLErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.warn("WebGL Context Creation or 3D Render Error caught by Boundary:", error);
    }

    render() {
        if (this.state.hasError) {
            return null; // Gracefully fallback to 2D scrubbed frame background
        }
        return this.props.children;
    }
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
    const [webglSupported, setWebglSupported] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
        setWebglSupported(isWebGLAvailable());
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
    if (!webglSupported) return null; // WebGL disabled/unsupported on device -> seamless 2D frame scrub fallback

    // Mobile: 1.0 DPR, Desktop: capped at 1.5
    const dpr: [number, number] = isMobile ? [1, 1] : [1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)];

    return (
        <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none">
            <WebGLErrorBoundary>
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
                        failIfMajorPerformanceCaveat: false,
                    }}
                    onCreated={({ gl }) => {
                        // Handle potential WebGL context loss dynamically
                        gl.domElement.addEventListener("webglcontextlost", (event) => {
                            event.preventDefault();
                            setWebglSupported(false);
                        });
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
            </WebGLErrorBoundary>
        </div>
    );
}
