const fs = require('fs');
const path = require('path');
global.self = global;
global.window = global;
global.document = {
    createElementNS: () => ({ setAttribute: () => { }, style: {} }),
    createElement: () => ({ setAttribute: () => { }, style: {} })
};

const THREE = require('three');
const { GLTFLoader } = require('three-stdlib');

const glbPath = path.join(__dirname, '../public/3D-model/bmw3d.glb');
console.log('Loading GLB from:', glbPath);

const data = fs.readFileSync(glbPath);
const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

const loader = new GLTFLoader();
loader.parse(arrayBuffer, '', (gltf) => {
    const scene = gltf.scene;
    console.log('--- GLB SCENE STRUCT ---');

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    console.log('Bounding Box Min:', JSON.stringify(box.min));
    console.log('Bounding Box Max:', JSON.stringify(box.max));
    console.log('Dimensions (X, Y, Z):', size.x, size.y, size.z);
    console.log('Center (X, Y, Z):', center.x, center.y, center.z);
    console.log('Animations count:', gltf.animations ? gltf.animations.length : 0);

    const meshes = [];
    const wheelNodes = [];

    scene.traverse((child) => {
        if (child.name) {
            const nameLower = child.name.toLowerCase();
            if (nameLower.includes('wheel') || nameLower.includes('tire') || nameLower.includes('rim') || nameLower.includes('rad') || nameLower.includes('rad_')) {
                wheelNodes.push({ name: child.name, type: child.type });
            }
        }
        if (child.isMesh) {
            meshes.push({
                name: child.name,
                mat: Array.isArray(child.material) ? child.material.map(m => m.name) : child.material.name,
            });
        }
    });

    console.log(`Total Meshes: ${meshes.length}`);
    console.log('First 20 Meshes:', meshes.slice(0, 20));
    console.log('Potential Wheel Nodes:', wheelNodes);
}, (err) => {
    console.error('Error parsing GLB:', err);
});
