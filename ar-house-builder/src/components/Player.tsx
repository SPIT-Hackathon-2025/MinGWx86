import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const Player: React.FC = () => {
  const { camera } = useThree();
  const moveSpeed = 0.1;
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // Create movement vector
    const moveVector = new THREE.Vector3(0, 0, 0);

    // Forward/Backward
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
      moveVector.z -= moveSpeed;
    }
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
      moveVector.z += moveSpeed;
    }

    // Left/Right
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
      moveVector.x -= moveSpeed;
    }
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
      moveVector.x += moveSpeed;
    }

    // Up/Down
    if (keysPressed.current['q']) {
      moveVector.y += moveSpeed;
    }
    if (keysPressed.current['e']) {
      moveVector.y -= moveSpeed;
    }

    // Apply movement directly to camera position
    camera.position.add(moveVector);
  });

  return null;
};