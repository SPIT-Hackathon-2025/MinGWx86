import React, { useState } from 'react';
import { useStore, furnitureLibrary } from '../store/useStore';
import { Settings, RotateCw, Sun, ChevronRight, ChevronLeft } from 'lucide-react';
import { FurnitureItem } from '../types';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    selectedElement, 
    setSelectedElement, 
    updateElementPosition, 
    updateElementRotation,
    updateLightIntensity,
    updateLightColor
  } = useStore();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: FurnitureItem | 'wall') => {
    let newElement;
    
    if (item === 'wall') {
      newElement = {
        id: `wall-${Date.now()}`,
        type: 'wall',
        position: { x: 0, y: 1.2, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      };
    } else if (item.type === 'light') {
      newElement = {
        id: `light-${Date.now()}`,
        type: 'light',
        modelType: 'light',
        position: { x: 0, y: 3, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        color: '#ffffff',
        intensity: 1
      };
    } else {
      newElement = {
        id: `${item.type}-${Date.now()}`,
        type: 'furniture',
        modelType: item.type,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: item.scale,
        color: '#ffffff'
      };
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(newElement));
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (!selectedElement) return;
    const numValue = parseFloat(value) || 0;
    updateElementPosition(selectedElement.id, {
      ...selectedElement.position,
      [axis]: numValue
    });
  };

  const handleRotate = () => {
    if (!selectedElement) return;
    const currentRotation = selectedElement.rotation.y;
    updateElementRotation(selectedElement.id, {
      ...selectedElement.rotation,
      y: currentRotation + Math.PI / 4
    });
  };

  const handleIntensityChange = (value: string) => {
    if (!selectedElement) return;
    const intensity = parseFloat(value) || 0;
    updateLightIntensity(selectedElement.id, intensity);
  };

  const handleColorChange = (value: string) => {
    if (!selectedElement) return;
    updateLightColor(selectedElement.id, value);
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-20 md:hidden bg-white rounded-lg shadow-lg p-2 z-50"
      >
        {isOpen ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <div className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg p-4 overflow-y-auto transition-transform duration-300 w-64 md:w-64 ${
        isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Properties</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Library</h3>
            <div className="grid grid-cols-2 gap-2">
              {/* Wall item */}
              <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, 'wall')}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move hover:ring-2 hover:ring-blue-500 transition-all"
              >
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="w-3/4 h-1/4 bg-gray-400 rounded"></div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-white text-sm font-medium">Wall</span>
                </div>
              </div>
              
              {/* Furniture items */}
              {furnitureLibrary.map((item) => (
                <div
                  key={item.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-sm font-medium">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedElement && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Properties</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-600">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      placeholder="X"
                      value={selectedElement.position.x}
                      onChange={(e) => handlePositionChange('x', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Y"
                      value={selectedElement.position.y}
                      onChange={(e) => handlePositionChange('y', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Z"
                      value={selectedElement.position.z}
                      onChange={(e) => handlePositionChange('z', e.target.value)}
                    />
                  </div>
                </div>

                {selectedElement.type === 'light' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm text-gray-600">Light Properties</label>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500">Intensity</label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={selectedElement.intensity || 1}
                            onChange={(e) => handleIntensityChange(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Color</label>
                          <input
                            type="color"
                            value={selectedElement.color || '#ffffff'}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-full h-8 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <button
                  onClick={handleRotate}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate 45°</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};