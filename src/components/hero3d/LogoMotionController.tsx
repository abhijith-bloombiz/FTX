"use client";

/**
 * LogoMotionController: Global animation controller for the FTX 3D Logo.
 * 
 * Behavior:
 * - HERO SECTION (192 Frames): 3D Logo is strictly hidden (visible = false, scale = 0).
 *   Instantly hides on scroll-down into Hero or scroll-up back into Hero.
 * - INTRO SECTION (#about) & SUBSEQUENT SECTIONS (Services -> WhyFTX -> Gallery -> CTA -> Footer):
 *   The 3D logo emerges smoothly into view as the #about section enters viewport and travels on a 3D path.
 * 
 * Features:
 * - On-demand invalidate() triggering (WebGL scene rendering pauses when scrolling/movement settles)
 * - Element-based section viewport tracking
 * - Instant Hero visibility suppression
 * - 0 state updates per frame (Ref-driven Three.js render loop)
 * - Scroll velocity momentum & dynamic tilt
 * - Global mouse parallax & tilt
 * - prefers-reduced-motion compliance
 */

import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LogoModel } from "./LogoModel";

interface KeyframeState {
    progress: number;
    pos: [number, number, number];
    rot: [number, number, number];
    scale: number;
}

// Desktop Section Keyframes (Mapped to post-hero progress starting at #about section)
const DESKTOP_KEYFRAMES: KeyframeState[] = [
    { progress: 0.00, pos: [2.5, 0.3, -2.0], rot: [0.1, 0.5, 0], scale: 0.0 },         // #about Section Top: Scale 0 (hidden)
    { progress: 0.06, pos: [2.2, 0.25, -1.5], rot: [-0.15, 0.6, -0.1], scale: 0.85 },  // #about Section In View: Emerges on right
    { progress: 0.28, pos: [-2.5, -0.2, -1.0], rot: [0.3, -0.75, 0.2], scale: 0.88 },  // Services Grid (#services): Sweeps left
    { progress: 0.52, pos: [0, 0.25, 1.2], rot: [0.35, 0.4, 0.1], scale: 1.3 },       // Why FTX (#packages): Moves forward
    { progress: 0.72, pos: [2.1, -0.3, -0.8], rot: [-0.25, 0.85, -0.25], scale: 0.85 },// Featured Work (#work): Right side
    { progress: 0.88, pos: [-1.8, 0.2, 0.5], rot: [0.2, -0.45, 0.1], scale: 1.1 },      // Contact Form (#contact): Prominent left
    { progress: 1.00, pos: [0, -0.35, 0.2], rot: [0.0, 0.0, 0.0], scale: 0.95 },       // Footer: Centered final stance
];

// Mobile Section Keyframes
const MOBILE_KEYFRAMES: KeyframeState[] = [
    { progress: 0.00, pos: [0.9, 0.2, -1.5], rot: [0.1, 0.3, 0], scale: 0.0 },
    { progress: 0.06, pos: [0.9, 0.2, -0.8], rot: [-0.15, 0.4, -0.1], scale: 0.6 },
    { progress: 0.28, pos: [-0.9, -0.1, -0.6], rot: [0.2, -0.5, 0.15], scale: 0.6 },
    { progress: 0.52, pos: [0, 0.15, 0.6], rot: [0.25, 0.3, 0.05], scale: 0.9 },
    { progress: 0.72, pos: [0.9, -0.2, -0.5], rot: [-0.2, 0.5, -0.15], scale: 0.6 },
    { progress: 0.88, pos: [-0.7, 0.1, 0.3], rot: [0.15, -0.3, 0.05], scale: 0.75 },
    { progress: 1.00, pos: [0, -0.25, 0.1], rot: [0.0, 0.0, 0.0], scale: 0.7 },
];

interface LogoMotionControllerProps {
    mousePosRef?: React.RefObject<{ x: number; y: number }>;
    isMobile?: boolean;
}

function smoothstep(min: number, max: number, value: number): number {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
}

export function LogoMotionController({
    mousePosRef,
    isMobile = false,
}: LogoMotionControllerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { invalidate } = useThree();

    const internalMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Scroll state tracking
    const targetScroll = useRef(0);
    const currentScroll = useRef(0);
    const scrollVelocity = useRef(0);
    const lastScrollY = useRef(0);
    const isInHero = useRef(true);

    const [reducedMotion, setReducedMotion] = useState(false);

    // Global mouse tracking across all page sections
    useEffect(() => {
        if (typeof window === "undefined" || isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rawX = (e.clientX / window.innerWidth) * 2 - 1;
            const rawY = (e.clientY / window.innerHeight) * 2 - 1;
            const easedX = Math.sign(rawX) * Math.pow(Math.abs(rawX), 1.2);
            const easedY = Math.sign(rawY) * Math.pow(Math.abs(rawY), 1.2);

            if (mousePosRef && mousePosRef.current) {
                mousePosRef.current.x = easedX;
                mousePosRef.current.y = easedY;
            }
            if (internalMouseRef.current) {
                internalMouseRef.current.x = easedX;
                internalMouseRef.current.y = easedY;
            }
            invalidate();
        };

        const handleMouseLeave = () => {
            if (mousePosRef && mousePosRef.current) {
                mousePosRef.current.x = 0;
                mousePosRef.current.y = 0;
            }
            if (internalMouseRef.current) {
                internalMouseRef.current.x = 0;
                internalMouseRef.current.y = 0;
            }
            invalidate();
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isMobile, mousePosRef, invalidate]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener("change", handleMotionChange);

        // Section-based Scroll Tracker:
        // Calculates progress ONLY after the hero section (starting at #about section entry)
        const updateScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const aboutEl = document.getElementById("about");

            let norm = 0;

            if (aboutEl) {
                const rect = aboutEl.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const aboutTopDoc = scrollY + rect.top;

                // Start scroll threshold: when #about section top reaches viewport
                const startScroll = Math.max(0, aboutTopDoc - viewportHeight);
                const maxScrollableAfterHero = Math.max(1, document.documentElement.scrollHeight - viewportHeight - startScroll);

                if (scrollY < startScroll) {
                    norm = 0;
                    isInHero.current = true;
                } else {
                    norm = Math.min(1, Math.max(0, (scrollY - startScroll) / maxScrollableAfterHero));
                    isInHero.current = false;
                }
            } else {
                const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
                norm = Math.min(1, Math.max(0, scrollY / maxScroll));
                isInHero.current = false;
            }

            const deltaY = scrollY - lastScrollY.current;
            lastScrollY.current = scrollY;
            scrollVelocity.current = deltaY / 20;

            targetScroll.current = norm;
            invalidate();
        };

        window.addEventListener("scroll", updateScroll, { passive: true });
        updateScroll();

        return () => {
            mediaQuery.removeEventListener("change", handleMotionChange);
            window.removeEventListener("scroll", updateScroll);
        };
    }, [invalidate]);

    // R3F Render Loop — Continuous smooth damping & 3D path trajectory evaluation
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Instant hard cut-off whenever user is inside Hero section (scrolling down or scrolling back up)
        if (isInHero.current) {
            if (groupRef.current.visible) {
                groupRef.current.visible = false;
                groupRef.current.scale.set(0, 0, 0);
                currentScroll.current = 0;
            }
            return;
        }

        // 1. Smoothly Damp Scroll Progress & Velocity
        const scrollDamp = Math.min(delta * 4.5, 0.2);
        currentScroll.current += (targetScroll.current - currentScroll.current) * scrollDamp;
        scrollVelocity.current *= 0.88;

        const p = reducedMotion ? 0 : currentScroll.current;
        const keyframes = isMobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES;

        // 2. Find Section Keyframe Segment
        let idx = 0;
        while (idx < keyframes.length - 2 && keyframes[idx + 1].progress < p) {
            idx++;
        }

        const k1 = keyframes[idx];
        const k2 = keyframes[idx + 1] || k1;
        const segT = smoothstep(k1.progress, k2.progress, p);

        // Interpolated Target Position, Rotation, Scale
        const targetX = THREE.MathUtils.lerp(k1.pos[0], k2.pos[0], segT);
        const targetY = THREE.MathUtils.lerp(k1.pos[1], k2.pos[1], segT);
        const targetZ = THREE.MathUtils.lerp(k1.pos[2], k2.pos[2], segT);

        const targetRotX = THREE.MathUtils.lerp(k1.rot[0], k2.rot[0], segT);
        const targetRotY = THREE.MathUtils.lerp(k1.rot[1], k2.rot[1], segT);
        const targetRotZ = THREE.MathUtils.lerp(k1.rot[2], k2.rot[2], segT);

        const targetScale = THREE.MathUtils.lerp(k1.scale, k2.scale, segT);

        // Make visible when outside Hero section
        groupRef.current.visible = targetScale > 0.001;

        // 3. Mouse Parallax & Tilt Integration
        const activeMouse = (mousePosRef && mousePosRef.current) ? mousePosRef.current : internalMouseRef.current;
        const mouseTiltX = isMobile ? 0 : activeMouse.y * 0.25;
        const mouseTiltY = isMobile ? 0 : activeMouse.x * 0.35;
        const mouseShiftX = isMobile ? 0 : activeMouse.x * 0.3;
        const mouseShiftY = isMobile ? 0 : -activeMouse.y * 0.2;

        // 4. Idle Floating Oscillation (Subtle sine wave)
        const time = state.clock.getElapsedTime();
        const floatY = reducedMotion ? 0 : Math.sin(time * 1.4) * 0.07;
        const floatRoll = reducedMotion ? 0 : Math.cos(time * 1.1) * 0.03;

        // 5. Scroll Velocity Dynamic Tilt
        const velTilt = reducedMotion ? 0 : Math.max(-0.4, Math.min(0.4, scrollVelocity.current * 0.08));

        // 6. Apply Damped Transformations to 3D Group
        const dampFactor = Math.min(delta * 5.0, 0.2);

        groupRef.current.position.x += (targetX + mouseShiftX - groupRef.current.position.x) * dampFactor;
        groupRef.current.position.y += (targetY + mouseShiftY + floatY - groupRef.current.position.y) * dampFactor;
        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * dampFactor;

        groupRef.current.rotation.x += (targetRotX + mouseTiltX + velTilt - groupRef.current.rotation.x) * dampFactor;
        groupRef.current.rotation.y += (targetRotY + mouseTiltY - groupRef.current.rotation.y) * dampFactor;
        groupRef.current.rotation.z += (targetRotZ + floatRoll - groupRef.current.rotation.z) * dampFactor;

        const currentScale = groupRef.current.scale.x;
        const nextScale = currentScale + (targetScale - currentScale) * dampFactor;
        groupRef.current.scale.set(nextScale, nextScale, nextScale);

        // Only invalidate WebGL scene while active movement or scroll damping is occurring
        const scrollDelta = Math.abs(targetScroll.current - currentScroll.current);
        const velocityAbs = Math.abs(scrollVelocity.current);
        if (scrollDelta > 0.0002 || velocityAbs > 0.001) {
            invalidate();
        }
    });

    return (
        <LogoModel innerRef={groupRef} />
    );
}
