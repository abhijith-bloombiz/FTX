"use client";

/**
 * FTX 3D Logo Lighting Rig
 * Soft key light, green rim accent, controlled fill light, and ambient illumination
 * optimized for glass and metallic reflections.
 */

import React from "react";

interface LogoLightingProps {
    isMobile?: boolean;
}

export function LogoLighting({ isMobile = false }: LogoLightingProps) {
    return (
        <>
            {/* 1. Ambient fill for shadowed areas */}
            <ambientLight intensity={0.7} color="#0c120e" />

            {/* 2. Key Light (Soft white directional light) */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={isMobile ? 1.8 : 2.4}
                color="#ffffff"
                castShadow={false}
            />

            {/* 3. FTX Lime Green Rim Accent Light */}
            <spotLight
                position={[-6, 6, -5]}
                angle={0.6}
                penumbra={0.8}
                intensity={isMobile ? 2.5 : 4.0}
                color="#80FF00"
                distance={30}
            />

            {/* 4. Soft Bottom/Front Fill Light for Glass Transparency Details */}
            <directionalLight
                position={[-4, -3, 6]}
                intensity={0.8}
                color="#b8e994"
            />
        </>
    );
}
