import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DesignElement } from '../types';

export const exportScene = (elements: DesignElement[]): void => {
  // Create a temporary scene
  const scene = new THREE.Scene();
  
  // Add all elements to the scene
  elements.forEach(element => {
    const group = new THREE.Group();
    group.position.set(element.position.x, element.position.y, element.position.z);
    group.rotation.set(element.rotation.x, element.rotation.y, element.rotation.z);
    group.scale.set(element.scale.x, element.scale.y, element.scale.z);

    if (element.type === 'wall') {
      const geometry = new THREE.BoxGeometry(4, 2.4, 0.2);
      const material = new THREE.MeshStandardMaterial({ 
        color: '#e5e5e5',
        roughness: 0.7,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    } else if (element.type === 'light') {
      const geometry = new THREE.SphereGeometry(0.2, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: element.color || '#ffffff',
        emissive: element.color || '#ffffff',
        emissiveIntensity: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      const light = new THREE.PointLight(
        element.color || '#ffffff',
        element.intensity || 1
      );
      group.add(mesh, light);
    } else if (element.type === 'furniture') {
      switch (element.modelType) {
        case 'sofa': {
          const base = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.4, 1),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          base.position.y = 0.3;
          
          const back = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.6, 0.2),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          back.position.set(0, 0.8, -0.4);
          
          const armLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.4, 1),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          armLeft.position.set(-0.9, 0.6, 0);
          
          const armRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.4, 1),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          armRight.position.set(0.9, 0.6, 0);
          
          group.add(base, back, armLeft, armRight);
          break;
        }
        case 'chair': {
          const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.5),
            new THREE.MeshStandardMaterial({ color: '#4A4A4A' })
          );
          seat.position.y = 0.4;
          
          const back = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.8, 0.1),
            new THREE.MeshStandardMaterial({ color: '#4A4A4A' })
          );
          back.position.set(0, 0.9, -0.2);
          
          group.add(seat, back);
          
          // Add legs
          [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([x, z]) => {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.05, 0.05, 0.4),
              new THREE.MeshStandardMaterial({ color: '#2C2C2C' })
            );
            leg.position.set(x, 0.2, z);
            group.add(leg);
          });
          break;
        }
        case 'table': {
          const top = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.1, 0.8),
            new THREE.MeshStandardMaterial({ color: '#D2691E' })
          );
          top.position.y = 0.7;
          group.add(top);

          [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].forEach(([x, z]) => {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.05, 0.05, 0.7),
              new THREE.MeshStandardMaterial({ color: '#8B4513' })
            );
            leg.position.set(x, 0.35, z);
            group.add(leg);
          });
          break;
        }
        case 'bed': {
          const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.4, 1.6),
            new THREE.MeshStandardMaterial({ color: '#F5F5DC' })
          );
          mattress.position.y = 0.3;

          const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1, 0.2),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          headboard.position.set(0, 0.8, -0.7);

          const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.1, 0.2, 1.7),
            new THREE.MeshStandardMaterial({ color: '#8B4513' })
          );
          frame.position.y = 0.1;

          group.add(mattress, headboard, frame);
          break;
        }
        case 'lamp': {
          const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 0.1),
            new THREE.MeshStandardMaterial({ color: '#2C2C2C' })
          );
          base.position.y = 0.1;

          const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.4),
            new THREE.MeshStandardMaterial({ color: '#2C2C2C' })
          );
          pole.position.y = 0.8;

          const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.3, 32),
            new THREE.MeshStandardMaterial({ 
              color: '#FFFFFF',
              emissive: '#FFFFFF',
              emissiveIntensity: 0.2
            })
          );
          shade.position.y = 1.4;

          const light = new THREE.PointLight('#FFF5E0', 0.5);
          light.position.y = 1.3;

          group.add(base, pole, shade, light);
          break;
        }
      }
    }
    
    scene.add(group);
  });

  // Export the scene as GLB
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (buffer) => {
      const blob = new Blob([buffer as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'scene.glb';
      link.click();
      
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('An error occurred while exporting the scene:', error);
    },
    { binary: true } // This makes it export as GLB instead of GLTF
  );
};