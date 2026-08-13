"use client";

/**
 * 3D Car Model: Steering Front Tires Only around local pivots
 * 
 * - Car body remains 100% stationary (rotation.y = 0, rotation.x = 0.026).
 * - Front tire & rim meshes pivot locally around their bounding box center when mouse moves X.
 */

import { useRef, useMemo, useEffect, RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface CarModelProps {
    mousePosRef: RefObject<{ x: number; y: number }>;
    isMobile?: boolean;
}

interface FrontTirePivot {
    object: THREE.Object3D;
    center: THREE.Vector3;
    initialQuaternion: THREE.Quaternion;
}

const SETTLE_THRESHOLD = 0.0001;

export function CarModel({ mousePosRef, isMobile = false }: CarModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const frontTirePivotsRef = useRef<FrontTirePivot[]>([]);
    const { scene } = useGLTF("/3D-model/bmw3d.glb");
    const { invalidate } = useThree();

    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    // Smoothed steering state
    const currentSteerY = useRef(0);
    const isSettling = useRef(true);

    // Setup materials and locate front tires
    useEffect(() => {
        clonedScene.updateMatrixWorld(true);

        const tireCandidates: { object: THREE.Object3D; center: THREE.Vector3 }[] = [];

        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;

                const name = (child.name || "").toLowerCase();
                const mat = child.material as THREE.MeshStandardMaterial;

                if (mat) {
                    const matName = (mat.name || "").toLowerCase();

                    if (matName.includes("paint") || name.includes("paint")) {
                        mat.metalness = 0.85;
                        mat.roughness = 0.15;
                        mat.color = new THREE.Color("#0c1410");
                    } else if (matName.includes("window") || name.includes("window")) {
                        mat.transparent = true;
                        mat.opacity = 0.45;
                        mat.roughness = 0.05;
                        mat.metalness = 0.9;
                        mat.color = new THREE.Color("#0b120e");
                    } else if (matName.includes("chrome") || matName.includes("emblem")) {
                        mat.metalness = 0.95;
                        mat.roughness = 0.08;
                    } else if (matName.includes("tire")) {
                        mat.roughness = 0.85;
                        mat.metalness = 0.1;
                        mat.color = new THREE.Color("#111613");
                    } else if (matName.includes("rim")) {
                        mat.metalness = 0.9;
                        mat.roughness = 0.2;
                    }

                    mat.envMapIntensity = 0.8;
                }

                // Detect tire and rim nodes for front wheel group
                const nodeName = child.name || "";
                const parentName = child.parent ? child.parent.name : "";

                if (
                    nodeName.includes("BMW_E30_M3_TIRE") ||
                    nodeName.includes("BMW_E30_M3_RIM") ||
                    parentName.includes("BMW_E30_M3_TIRE") ||
                    parentName.includes("BMW_E30_M3_RIM")
                ) {
                    const targetObj = child.parent && child.parent !== clonedScene ? child.parent : child;

                    // Compute world center
                    const box = new THREE.Box3().setFromObject(targetObj);
                    const center = new THREE.Vector3();
                    box.getCenter(center);

                    if (!tireCandidates.some(c => c.object === targetObj)) {
                        tireCandidates.push({ object: targetObj, center });
                    }
                }
            }
        });

        // Sort by Z position (front wheels have greater Z in this model space)
        tireCandidates.sort((a, b) => b.center.z - a.center.z);

        // Pick top 4 nodes (front left & right tires/rims)
        const frontCandidates = tireCandidates.slice(0, 4);

        frontTirePivotsRef.current = frontCandidates.map(item => ({
            object: item.object,
            center: item.center.clone(),
            initialQuaternion: item.object.quaternion.clone()
        }));

        invalidate();
    }, [clonedScene, invalidate]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const mousePos = mousePosRef.current || { x: 0, y: 0 };

        // Max Steering Angle: ±20.0 degrees (~0.35 rad)
        const maxSteer = isMobile ? 0 : (20 * Math.PI) / 180;
        const targetSteer = mousePos.x * maxSteer;

        const dampFactor = Math.min(delta * 4.0, 0.15);
        const diffSteer = targetSteer - currentSteerY.current;

        currentSteerY.current += diffSteer * dampFactor;

        // Car body locked stationary
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0.026;

        // Rotate front tire nodes around local Y axis
        const qSteer = new THREE.Quaternion();
        qSteer.setFromAxisAngle(new THREE.Vector3(0, 1, 0), currentSteerY.current);

        frontTirePivotsRef.current.forEach(({ object, initialQuaternion }) => {
            object.quaternion.copy(initialQuaternion).multiply(qSteer);
        });

        if (Math.abs(diffSteer) > SETTLE_THRESHOLD) {
            isSettling.current = true;
            invalidate();
        } else {
            isSettling.current = false;
        }
    });

    return (
        <group ref={groupRef} position={[1, -0.53, 0.3]}>
            <primitive object={clonedScene} scale={1.0} position={[-0.8, -1.2, 0]} />
        </group>
    );
}

useGLTF.preload("/3D-model/bmw3d.glb");
