const fs = require('fs');

function inspectGlb(filePath) {
  console.log(`\n=== Inspecting GLB: ${filePath} ===`);
  const buffer = fs.readFileSync(filePath);
  
  // Read header
  const magic = buffer.toString('utf8', 0, 4);
  const version = buffer.readUInt32LE(4);
  const totalLength = buffer.readUInt32LE(8);
  
  if (magic !== 'glTF') {
    console.error('Not a valid glTF file');
    return;
  }
  
  // Read JSON chunk
  const chunkLength = buffer.readUInt32LE(12);
  const chunkType = buffer.toString('utf8', 16, 20);
  
  if (chunkType !== 'JSON') {
    console.error('First chunk is not JSON');
    return;
  }
  
  const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);
  
  console.log('Nodes count:', gltf.nodes ? gltf.nodes.length : 0);
  console.log('Meshes count:', gltf.meshes ? gltf.meshes.length : 0);
  console.log('Materials count:', gltf.materials ? gltf.materials.length : 0);
  
  console.log('\nMaterials:');
  if (gltf.materials) {
    gltf.materials.forEach((m, idx) => {
      console.log(`- [Material ${idx}]: ${m.name || 'Unnamed'}`);
    });
  }
  
  console.log('\nMeshes & Primitives:');
  if (gltf.meshes) {
    gltf.meshes.slice(0, 30).forEach((mesh, idx) => {
      console.log(`- [Mesh ${idx}]: ${mesh.name || 'Unnamed'}`);
      if (mesh.primitives) {
        mesh.primitives.forEach((prim) => {
          if (prim.material !== undefined && gltf.materials) {
            console.log(`   └ Material: ${gltf.materials[prim.material]?.name || prim.material}`);
          }
        });
      }
    });
    if (gltf.meshes.length > 30) {
      console.log(`... and ${gltf.meshes.length - 30} more meshes.`);
    }
  }

  console.log('\nRoot Nodes (first 10):');
  if (gltf.nodes) {
    gltf.nodes.slice(0, 15).forEach((node, idx) => {
      console.log(`- [Node ${idx}]: ${node.name || 'Unnamed'} (Mesh: ${node.mesh !== undefined ? node.mesh : 'none'}, Children: ${node.children ? node.children.length : 0})`);
    });
  }
}

inspectGlb('public/models/bin.glb');
inspectGlb('public/models/truck.glb');
