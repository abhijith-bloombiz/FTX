"use client";

/**
 * CameraController: Sets up camera position and framing for the FTX 3D Logo scene.
 * Provides separate framing for desktop and mobile viewports.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface CameraControllerProps {
    isMobile?: boolean;
}

export function CameraController({ isMobile = false }: CameraControllerProps) {
    const { camera, invalidate } = useThree();

    useEffect(() => {
        const camX = isMobile ? 0 : 0;
        const camY = isMobile ? 0.1 : 0.1;
        const camZ = isMobile ? 5.5 : 6.0;

        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0, 0);

        // Trigger initial frame render
        invalidate();
    }, [camera, isMobile, invalidate]);

    return null;
}
