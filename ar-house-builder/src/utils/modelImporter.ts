import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DesignElement } from '../types';

export const importGLBModel = (file: File): Promise<DesignElement> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }

      const arrayBuffer = event.target.result as ArrayBuffer;
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          // Calculate bounding box to set appropriate scale
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDimension; // Scale to reasonable size

          const element: DesignElement = {
            id: `imported-${Date.now()}`,
            type: 'furniture',
            modelType: 'custom',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: scale, y: scale, z: scale },
            model: URL.createObjectURL(file)
          };

          resolve(element);
        },
        (error) => {
          reject(error);
        }
      );
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};