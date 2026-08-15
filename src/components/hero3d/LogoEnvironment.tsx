"use client";

/**
 * FTX 3D Logo Environment Mapping
 * Restrained HDRI preset for luxury glass and metallic surface reflections.
 */

import { Environment } from "@react-three/drei";

export function LogoEnvironment() {
    return (
        <Environment
            preset="city"
            environmentIntensity={0.8}
        />
    );
}
