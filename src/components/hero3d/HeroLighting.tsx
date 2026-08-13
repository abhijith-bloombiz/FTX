"use client";

/**
 * Lighting rig with Environment map restored for metallic reflections.
 * Safe with frameloop="demand" — Environment is loaded once, not re-rendered per frame.
 */

import { Environment } from "@react-three/drei";

interface HeroLightingProps {
    isMobile?: boolean;
}

export function HeroLighting({ isMobile = false }: HeroLightingProps) {
    return (
        <>
            {/* 1. Ambient fill */}
            <ambientLight intensity={0.7} color="#0f1712" />

            {/* 2. Key Light */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={2.2}
                color="#ffffff"
            />

            {/* 3. Green Rim Accent */}
            <spotLight
                position={[-6, 5, -5]}
                angle={0.6}
                penumbra={0.8}
                intensity={4.0}
                color="#80FF00"
                distance={25}
            />

            {/* 4. Environment map for metallic reflections (loaded once, not per-frame) */}
            <Environment preset="city" environmentIntensity={0.8} />
        </>
    );
}
