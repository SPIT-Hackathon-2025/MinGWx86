import React, { useRef, useEffect, useState } from 'react';
import { Canvas as ThreeCanvas, useThree, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { XR, Controllers, VRButton } from '@react-three/xr';
import { useStore } from '../store/useStore';
import { DesignElement } from '../types';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Player } from './Player';

const Light: React.FC<{ element: DesignElement }> = ({ element }) => {
  const { setSelectedElement, selectedElement, updateElementPosition, setOrbitControlsEnabled } = useStore();
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isSelected = selectedElement?.id === element.id;
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane());
  const intersection = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());

  useFrame(() => {
    if (isDragging && meshRef.current) {
      raycaster.current.setFromCamera(mouse.current, camera);
      if (raycaster.current.ray.intersectPlane(dragPlane.current, intersection.current)) {
        meshRef.current.position.copy(intersection.current);
        updateElementPosition(element.id, {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: meshRef.current.position.z
        });
      }
    }
  });

  const handlePointerDown = (e: THREE.Event) => {
    e.stopPropagation();
    setSelectedElement(element);
    setIsDragging(true);
    setOrbitControlsEnabled(false);
    document.body.style.cursor = 'grabbing';

    const normal = new THREE.Vector3(0, 1, 0);
    if (meshRef.current) {
      dragPlane.current.setFromNormalAndCoplanarPoint(
        normal,
        meshRef.current.position
      );
    }

    mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setOrbitControlsEnabled(true);
    document.body.style.cursor = 'grab';
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <group
      ref={meshRef}
      position={[element.position.x, element.position.y, element.position.z]}
      rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      scale={[element.scale.x, element.scale.y, element.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onPointerDown={handlePointerDown}
      onPointerOver={() => document.body.style.cursor = 'grab'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color={isSelected ? '#90cdf4' : element.color || '#ffffff'} 
          emissive={element.color || '#ffffff'}
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight
        color={element.color || '#ffffff'}
        intensity={element.intensity || 1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {isSelected && (
        <mesh position={[0, -0.3, 0]}>
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshBasicMaterial color="#90cdf4" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

const Wall: React.FC<{ element: DesignElement }> = ({ element }) => {
  const { setSelectedElement, selectedElement, updateElementPosition, updateElementRotation, setOrbitControlsEnabled } = useStore();
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isSelected = selectedElement?.id === element.id;
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane());
  const intersection = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());
  const rotationStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialRotation = useRef<THREE.Euler>(new THREE.Euler());

  useFrame(() => {
    if (isDragging && meshRef.current) {
      raycaster.current.setFromCamera(mouse.current, camera);
      if (raycaster.current.ray.intersectPlane(dragPlane.current, intersection.current)) {
        meshRef.current.position.copy(intersection.current);
        meshRef.current.position.y = Math.max(0, meshRef.current.position.y);
        updateElementPosition(element.id, {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: meshRef.current.position.z
        });
      }
    }

    if (isRotating && meshRef.current) {
      const deltaX = mouse.current.x - rotationStart.current.x;
      meshRef.current.rotation.y = initialRotation.current.y + deltaX * Math.PI;
      updateElementRotation(element.id, {
        x: meshRef.current.rotation.x,
        y: meshRef.current.rotation.y,
        z: meshRef.current.rotation.z
      });
    }
  });

  const handlePointerDown = (e: THREE.Event) => {
    e.stopPropagation();
    setSelectedElement(element);

    if ((e as any).altKey) {
      setIsRotating(true);
      setOrbitControlsEnabled(false);
      document.body.style.cursor = 'ew-resize';
      
      rotationStart.current = {
        x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1
      };
      
      if (meshRef.current) {
        initialRotation.current.copy(meshRef.current.rotation);
      }
    } else {
      setIsDragging(true);
      setOrbitControlsEnabled(false);
      document.body.style.cursor = 'grabbing';

      const normal = new THREE.Vector3(0, 1, 0);
      if (meshRef.current) {
        dragPlane.current.setFromNormalAndCoplanarPoint(
          normal,
          meshRef.current.position
        );
      }
    }

    mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
  };

  const handlePointerMove = (e: any) => {
    if (isDragging || isRotating) {
      mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setOrbitControlsEnabled(true);
    document.body.style.cursor = 'grab';
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [isDragging, isRotating]);

  return (
    <group
      ref={meshRef}
      position={[element.position.x, element.position.y, element.position.z]}
      rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      scale={[element.scale.x, element.scale.y, element.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onPointerDown={handlePointerDown}
      onPointerOver={() => document.body.style.cursor = 'grab'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 2.4, 0.2]} />
        <meshStandardMaterial 
          color={isSelected ? '#90cdf4' : '#e5e5e5'} 
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, -1.3, 0]}>
          <ringGeometry args={[2, 2.1, 32]} />
          <meshBasicMaterial color="#90cdf4" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

const FurnitureModel: React.FC<{ element: DesignElement }> = ({ element }) => {
  const { setSelectedElement, selectedElement, updateElementPosition, updateElementRotation, setOrbitControlsEnabled } = useStore();
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isSelected = selectedElement?.id === element.id;
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragPlane = useRef<THREE.Plane>(new THREE.Plane());
  const intersection = useRef<THREE.Vector3>(new THREE.Vector3());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2());
  const rotationStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialRotation = useRef<THREE.Euler>(new THREE.Euler());

  const gltf = element.model ? useLoader(GLTFLoader, element.model) : null;

  useFrame(() => {
    if (isDragging && meshRef.current) {
      raycaster.current.setFromCamera(mouse.current, camera);
      if (raycaster.current.ray.intersectPlane(dragPlane.current, intersection.current)) {
        meshRef.current.position.copy(intersection.current);
        meshRef.current.position.y = Math.max(0, meshRef.current.position.y);
        updateElementPosition(element.id, {
          x: meshRef.current.position.x,
          y: meshRef.current.position.y,
          z: meshRef.current.position.z
        });
      }
    }

    if (isRotating && meshRef.current) {
      const deltaX = mouse.current.x - rotationStart.current.x;
      const deltaY = mouse.current.y - rotationStart.current.y;
      
      const newRotation = new THREE.Euler(
        initialRotation.current.x,
        initialRotation.current.y + deltaX * Math.PI,
        initialRotation.current.z
      );

      meshRef.current.rotation.copy(newRotation);
      updateElementRotation(element.id, {
        x: newRotation.x,
        y: newRotation.y,
        z: newRotation.z
      });
    }
  });

  const handlePointerDown = (e: THREE.Event) => {
    e.stopPropagation();
    setSelectedElement(element);

    if ((e as any).altKey) {
      setIsRotating(true);
      setOrbitControlsEnabled(false);
      document.body.style.cursor = 'ew-resize';
      
      rotationStart.current = {
        x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1
      };
      
      if (meshRef.current) {
        initialRotation.current.copy(meshRef.current.rotation);
      }
    } else {
      setIsDragging(true);
      setOrbitControlsEnabled(false);
      document.body.style.cursor = 'grabbing';

      const normal = new THREE.Vector3(0, 1, 0);
      if (meshRef.current) {
        dragPlane.current.setFromNormalAndCoplanarPoint(
          normal,
          meshRef.current.position
        );
      }
    }

    mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
  };

  const handlePointerMove = (e: any) => {
    if (isDragging || isRotating) {
      mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setOrbitControlsEnabled(true);
    document.body.style.cursor = 'grab';
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [isDragging, isRotating]);

  const createMaterial = (color: string) => {
    return new THREE.MeshStandardMaterial({
      color: isSelected ? '#90cdf4' : color,
      roughness: 0.7,
      metalness: 0.2,
      envMapIntensity: 1,
    });
  };

  if (element.modelType === 'custom' && gltf) {
    return (
      <group
        ref={meshRef}
        position={[element.position.x, element.position.y, element.position.z]}
        rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
        scale={[element.scale.x, element.scale.y, element.scale.z]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
        onPointerDown={handlePointerDown}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <primitive object={gltf.scene} />
        {isSelected && (
          <mesh position={[0, -0.1, 0]}>
            <ringGeometry args={[1.2, 1.3, 32]} />
            <meshBasicMaterial color="#90cdf4" transparent opacity={0.5} />
          </mesh>
        )}
      </group>
    );
  }

  const getModelGeometry = () => {
    switch (element.modelType) {
      case 'sofa':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.4, 1]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
            <mesh position={[0, 0.8, -0.4]} castShadow>
              <boxGeometry args={[2, 0.6, 0.2]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
            <mesh position={[-0.9, 0.6, 0]} castShadow>
              <boxGeometry args={[0.2, 0.4, 1]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
            <mesh position={[0.9, 0.6, 0]} castShadow>
              <boxGeometry args={[0.2, 0.4, 1]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
          </group>
        );
      case 'chair':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial {...createMaterial('#4A4A4A')} />
            </mesh>
            <mesh position={[0, 0.9, -0.2]} castShadow>
              <boxGeometry args={[0.5, 0.8, 0.1]} />
              <meshStandardMaterial {...createMaterial('#4A4A4A')} />
            </mesh>
            {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.2, z]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                <meshStandardMaterial {...createMaterial('#2C2C2C')} />
              </mesh>
            ))}
          </group>
        );
      case 'table':
        return (
          <group>
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.1, 0.8]} />
              <meshStandardMaterial {...createMaterial('#D2691E')} />
            </mesh>
            {[[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].map(([x, z], i) => (
              <mesh key={i} position={[x, 0.35, z]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.7]} />
                <meshStandardMaterial {...createMaterial('#8B4513')} />
              </mesh>
            ))}
          </group>
        );
      case 'bed':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[2, 0.4, 1.6]} />
              <meshStandardMaterial {...createMaterial('#F5F5DC')} />
            </mesh>
            <mesh position={[0, 0.8, -0.7]} castShadow>
              <boxGeometry args={[2, 1, 0.2]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
            <mesh position={[0, 0.1, 0]} receiveShadow>
              <boxGeometry args={[2.1, 0.2, 1.7]} />
              <meshStandardMaterial {...createMaterial('#8B4513')} />
            </mesh>
          </group>
        );
      case 'lamp':
        return (
          <group>
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.3, 0.1]} />
              <meshStandardMaterial {...createMaterial('#2C2C2C')} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1.4]} />
              <meshStandardMaterial {...createMaterial('#2C2C2C')} />
            </mesh>
            <mesh position={[0, 1.4, 0]} castShadow>
              <coneGeometry args={[0.2, 0.3, 32]} />
              <meshStandardMaterial {...createMaterial('#FFFFFF')} emissive="#FFFFFF" emissiveIntensity={0.2} />
            </mesh>
            <pointLight position={[0, 1.3, 0]} intensity={0.5} color="#FFF5E0" castShadow />
          </group>
        );
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry />
            <meshStandardMaterial {...createMaterial('#ffffff')} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={[element.position.x, element.position.y, element.position.z]}
      rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      scale={[element.scale.x, element.scale.y, element.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onPointerDown={handlePointerDown}
      onPointerOver={() => document.body.style.cursor = 'grab'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      {getModelGeometry()}
      {isSelected && (
        <mesh position={[0, -0.1, 0]}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#90cdf4" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

const DesignElements: React.FC<{ elements: DesignElement[] }> = ({ elements }) => {
  return (
    <>
      {elements.map((element) => {
        if (element.type === 'wall') {
          return <Wall key={element.id} element={element} />;
        }
        if (element.type === 'light') {
          return <Light key={element.id} element={element} />;
        }
        return <FurnitureModel key={element.id} element={element} />;
      })}
    </>
  );
};

export const Canvas: React.FC = () => {
  const { 
    currentProject, 
    isARMode, 
    orbitControlsEnabled, 
    ambientLightIntensity,
    addElement, 
    setSelectedElement,
    setOrbitControlsEnabled 
  } = useStore();

  const handleBackgroundClick = (e: THREE.Event) => {
    if ((e.target as THREE.Mesh).name === 'ground') {
      setSelectedElement(null);
      setOrbitControlsEnabled(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const element = JSON.parse(data);
      addElement(element);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="w-full h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {isARMode && <VRButton />}
      <ThreeCanvas 
        camera={{ position: [0, 2, 5] }} 
        shadows
        className="w-full h-full"
      >
        {isARMode ? (
          <XR mode="AR">
            <Controllers />
            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {currentProject && <DesignElements elements={currentProject.elements} />}
          </XR>
        ) : (
          <>
            <Player />
            <ambientLight intensity={ambientLightIntensity} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -0.01, 0]} 
              receiveShadow
              name="ground"
              onClick={handleBackgroundClick}
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            <Grid infiniteGrid />
            {currentProject && <DesignElements elements={currentProject.elements} />}
            {orbitControlsEnabled && <OrbitControls makeDefault />}
          </>
        )}
      </ThreeCanvas>
    </div>
  );
};