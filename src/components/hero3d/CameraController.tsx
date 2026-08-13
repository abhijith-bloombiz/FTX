"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface CameraControllerProps {
    isMobile?: boolean;
}

export function CameraController({ isMobile = false }: CameraControllerProps) {
    const { camera, invalidate } = useThree();

    useEffect(() => {
        const camX = isMobile ? -4.2 : -1;
        const camY = isMobile ? 1.8 : -0.4;
        const camZ = isMobile ? 5.8 : 8;

        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.6, 0);

        // Trigger initial frame render for on-demand mode
        invalidate();
    }, [camera, isMobile, invalidate]);

    return null;
}
