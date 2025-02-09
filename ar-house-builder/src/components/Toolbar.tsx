import React, { useState, useRef } from 'react';
import { 
  Cuboid as Cube, 
  DoorOpen as Door, 
  AppWindow as Window, 
  Wallet as Wall, 
  Users, 
  Share2, 
  Save, 
  Video as Video3d, 
  Menu, 
  X,
  Download,
  Upload,
  Sun
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { exportScene } from '../utils/sceneExporter';
import { importGLBModel } from '../utils/modelImporter';

export const Toolbar: React.FC = () => {
  const { toggleARMode, isARMode, currentProject, addElement, ambientLightIntensity, setAmbientLightIntensity } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showLightControls, setShowLightControls] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (currentProject && currentProject.elements.length > 0) {
      exportScene(currentProject.elements);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.glb')) {
      try {
        const element = await importGLBModel(file);
        addElement(element);
      } catch (error) {
        console.error('Failed to import GLB model:', error);
        alert('Failed to import model. Please try again with a different file.');
      }
    } else {
      alert('Please select a GLB file.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".glb"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      <button 
        className="fixed left-4 top-20 md:hidden bg-white rounded-lg shadow-lg p-2 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className={`fixed left-0 md:left-4 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-2 space-y-4 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Furniture">
          <Cube className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Door">
          <Door className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Window">
          <Window className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Add Wall">
          <Wall className="w-6 h-6" />
        </button>
        <hr className="border-gray-200" />
        <div className="relative">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg w-full"
            title="Ambient Light"
            onClick={() => setShowLightControls(!showLightControls)}
          >
            <Sun className="w-6 h-6" />
          </button>
          {showLightControls && (
            <div className="absolute left-full ml-2 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
              <label className="text-sm text-gray-600 block mb-2">
                Ambient Light Intensity
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={ambientLightIntensity}
                onChange={(e) => setAmbientLightIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                {ambientLightIntensity.toFixed(1)}
              </div>
            </div>
          )}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Collaborators">
          <Users className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Share">
          <Share2 className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Save">
          <Save className="w-6 h-6" />
        </button>
        <button 
          className={`p-2 rounded-lg ${isARMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={toggleARMode}
          title="AR Mode"
        >
          <Video3d className="w-6 h-6" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg" 
          title="Import GLB Model"
          onClick={handleImportClick}
        >
          <Upload className="w-6 h-6" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg" 
          title="Export Scene"
          onClick={handleExport}
        >
          <Download className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};