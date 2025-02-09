import { create } from 'zustand';
import { DesignElement, Project, User, FurnitureItem } from '../types';

interface Store {
  currentProject: Project | null;
  currentUser: User | null;
  selectedElement: DesignElement | null;
  isARMode: boolean;
  isDragging: boolean;
  orbitControlsEnabled: boolean;
  ambientLightIntensity: number;
  setCurrentProject: (project: Project) => void;
  setCurrentUser: (user: User) => void;
  setSelectedElement: (element: DesignElement | null) => void;
  toggleARMode: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setOrbitControlsEnabled: (enabled: boolean) => void;
  setAmbientLightIntensity: (intensity: number) => void;
  addElement: (element: DesignElement) => void;
  updateElementPosition: (id: string, position: { x: number; y: number; z: number }) => void;
  updateElementRotation: (id: string, rotation: { x: number; y: number; z: number }) => void;
  updateLightIntensity: (id: string, intensity: number) => void;
  updateLightColor: (id: string, color: string) => void;
}

export const useStore = create<Store>((set) => ({
  currentProject: {
    id: 'default',
    name: 'New Project',
    elements: [],
    collaborators: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  currentUser: null,
  selectedElement: null,
  isARMode: false,
  isDragging: false,
  orbitControlsEnabled: true,
  ambientLightIntensity: 0.5,
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  toggleARMode: () => set((state) => ({ isARMode: !state.isARMode })),
  setIsDragging: (isDragging) => set({ isDragging }),
  setOrbitControlsEnabled: (enabled) => set({ orbitControlsEnabled: enabled }),
  setAmbientLightIntensity: (intensity) => set({ ambientLightIntensity: intensity }),
  addElement: (element) => set((state) => ({
    currentProject: state.currentProject ? {
      ...state.currentProject,
      elements: [...state.currentProject.elements, element]
    } : null
  })),
  updateElementPosition: (id, position) => set((state) => ({
    currentProject: state.currentProject ? {
      ...state.currentProject,
      elements: state.currentProject.elements.map(el =>
        el.id === id ? { ...el, position } : el
      )
    } : null
  })),
  updateElementRotation: (id, rotation) => set((state) => ({
    currentProject: state.currentProject ? {
      ...state.currentProject,
      elements: state.currentProject.elements.map(el =>
        el.id === id ? { ...el, rotation } : el
      )
    } : null
  })),
  updateLightIntensity: (id, intensity) => set((state) => ({
    currentProject: state.currentProject ? {
      ...state.currentProject,
      elements: state.currentProject.elements.map(el =>
        el.id === id ? { ...el, intensity } : el
      )
    } : null
  })),
  updateLightColor: (id, color) => set((state) => ({
    currentProject: state.currentProject ? {
      ...state.currentProject,
      elements: state.currentProject.elements.map(el =>
        el.id === id ? { ...el, color } : el
      )
    } : null
  }))
}));

export const furnitureLibrary: FurnitureItem[] = [
  {
    id: 'light-1',
    name: 'Ceiling Light',
    type: 'light',
    thumbnail: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 'sofa-1',
    name: 'Modern Sofa',
    type: 'sofa',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 'chair-1',
    name: 'Dining Chair',
    type: 'chair',
    thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237',
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 'table-1',
    name: 'Coffee Table',
    type: 'table',
    thumbnail: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88',
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 'bed-1',
    name: 'Queen Bed',
    type: 'bed',
    thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    id: 'lamp-1',
    name: 'Floor Lamp',
    type: 'lamp',
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
    scale: { x: 1, y: 1, z: 1 }
  }
];