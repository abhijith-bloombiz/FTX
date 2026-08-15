"use client";

/**
 * HeroCanvas: Persistent WebGL Canvas for the FTX 3D Logo.
 * 
 * Renders the 3D logo persistent scene over the webpage at z-[1] (behind content containers):
 * Uses frameloop="demand" for optimal GPU performance.
 * Configured with pointer-events: none on container, canvas style, and gl.domElement
 * to ensure all DOM UI elements, text selection, links, buttons, and forms remain 100% interactive.
 */

import React, { Suspense, useState, useEffect, useRef, RefObject, Component, ErrorInfo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { LogoLighting } from "./LogoLighting";
import { LogoEnvironment } from "./LogoEnvironment";
import { LogoMotionController } from "./LogoMotionController";
import { CameraController } from "./CameraController";

interface HeroCanvasProps {
    mousePosRef?: RefObject<{ x: number; y: number }>;
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

// React Error Boundary for 3D Canvas rendering errors
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
            return null; // Gracefully fallback to 2D UI
        }
        return this.props.children;
    }
}

function CanvasFallback() {
    return null; // Silent clean fallback for persistent layout layer
}

export function HeroCanvas({
    mousePosRef,
    isMobile = false,
}: HeroCanvasProps) {
    const [mounted, setMounted] = useState(false);
    const [webglSupported, setWebglSupported] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        setWebglSupported(isWebGLAvailable());
    }, []);

    if (!mounted) return <CanvasFallback />;
    if (!webglSupported) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[1] pointer-events-none w-screen h-screen">
            <WebGLErrorBoundary>
                <Canvas
                    frameloop="demand"
                    shadows={false}
                    gl={{
                        antialias: !isMobile,
                        alpha: true,
                        powerPreference: "high-performance",
                        precision: "mediump",
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.1,
                        stencil: false,
                        depth: true,
                        preserveDrawingBuffer: false,
                        failIfMajorPerformanceCaveat: false,
                    }}
                    onCreated={({ gl }) => {
                        gl.domElement.style.pointerEvents = "none";
                        gl.domElement.addEventListener("webglcontextlost", (event) => {
                            event.preventDefault();
                            setWebglSupported(false);
                        });
                    }}
                    camera={{
                        position: isMobile ? [0, 0.1, 5.5] : [0, 0.1, 6.0],
                        fov: isMobile ? 48 : 42,
                        near: 0.5,
                        far: 50,
                    }}
                    dpr={[1, 1]}
                    style={{ width: "100%", height: "100%", pointerEvents: "none" }}
                >
                    <Suspense fallback={null}>
                        <LogoLighting isMobile={isMobile} />
                        <LogoEnvironment />
                        <LogoMotionController mousePosRef={mousePosRef} isMobile={isMobile} />
                        <CameraController isMobile={isMobile} />
                    </Suspense>
                </Canvas>
            </WebGLErrorBoundary>
        </div>
    );
}
