import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

function App() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <Header />
      <main className="pt-16 h-[calc(100vh-4rem)]">
        <Canvas />
        <Toolbar />
        <Sidebar />
      </main>
    </div>
  );
}

export default App;