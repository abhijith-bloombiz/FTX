const fs = require('fs');
const path = require('path');

const webFile = path.join(__dirname, '../public/3D-model/ftx-logo-3d-web.glb');
const origFile = path.join(__dirname, '../public/3D-model/ftx-logo-3d.glb');

const webStats = fs.statSync(webFile);
const origStats = fs.statSync(origFile);

console.log('Original ftx-logo-3d.glb:', (origStats.size / 1024 / 1024).toFixed(2), 'MB');
console.log('Optimized ftx-logo-3d-web.glb:', (webStats.size / 1024 / 1024).toFixed(2), 'MB');
console.log('Reduction ratio:', ((1 - webStats.size / origStats.size) * 100).toFixed(2), '%');
