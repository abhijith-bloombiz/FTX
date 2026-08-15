"use client";

/**
 * 3D Logo Model: FTX Logo auto-centering, scale normalization, and PBR glass/metallic styling.
 * Loads /3D-model/ftx-logo-3d-web.glb (10.94 MB compressed web asset), centers model origin,
 * and applies single-pass high-performance metallic materials.
 */

import React, { useMemo, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import * as THREE from "three";

interface LogoModelProps {
    innerRef?: React.RefObject<THREE.Group>;
    scaleFactor?: number;
}

export function LogoModel({ innerRef, scaleFactor = 1.0 }: LogoModelProps) {
    const { scene } = useGLTF("/3D-model/ftx-logo-3d-web.glb", false, false, (loader) => {
        loader.setMeshoptDecoder(MeshoptDecoder);
    });

    // Deep clone scene to prevent reference mutations
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    // Compute bounding box, auto-center origin, and calculate normalized scale factor
    const { normalizedScale, centerOffset } = useMemo(() => {
        clonedScene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(clonedScene);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z) || 1.0;
        // Normalize base size to roughly ~2.2 units
        const baseNormalizedScale = (2.2 / maxDimension) * scaleFactor;

        return {
            normalizedScale: baseNormalizedScale,
            centerOffset: new THREE.Vector3(-center.x, -center.y, -center.z),
        };
    }, [clonedScene, scaleFactor]);

    // Apply high-performance, single-pass MeshStandardMaterial (eliminates heavy clearcoat shader loops)
    useEffect(() => {
        clonedScene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;

                // Replace heavy physical materials with single-pass standard material for 60 FPS performance
                const prevMat = child.material;
                const newMat = new THREE.MeshStandardMaterial({
                    color: prevMat.color ? prevMat.color : new THREE.Color("#ffffff"),
                    roughness: 0.2,
                    metalness: 0.85,
                    envMapIntensity: 1.0,
                    emissive: new THREE.Color("#0a1a0e"),
                    emissiveIntensity: 0.2,
                });

                child.material = newMat;
            }
        });
    }, [clonedScene]);

    return (
        <group ref={innerRef}>
            <group scale={normalizedScale} position={centerOffset}>
                <primitive object={clonedScene} />
            </group>
        </group>
    );
}

useGLTF.preload("/3D-model/ftx-logo-3d-web.glb", false, false, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
});
