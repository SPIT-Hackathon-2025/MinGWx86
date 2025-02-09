export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface DesignElement {
  id: string;
  type: 'furniture' | 'wall' | 'window' | 'door' | 'light';
  modelType?: 'sofa' | 'chair' | 'table' | 'bed' | 'lamp' | 'light' | 'custom';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  model?: string;
  color?: string;
  intensity?: number;
}

export interface Project {
  id: string;
  name: string;
  elements: DesignElement[];
  collaborators: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FurnitureItem {
  id: string;
  name: string;
  type: 'sofa' | 'chair' | 'table' | 'bed' | 'lamp' | 'light';
  thumbnail: string;
  scale: Vector3;
}