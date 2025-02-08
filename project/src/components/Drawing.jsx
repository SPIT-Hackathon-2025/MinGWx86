import React, { useRef, useState, useEffect } from 'react';

const Drawing = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [ctx, setCtx] = useState(null);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = '#000';
    setCtx(context);
  }, []);

  // Handle the drawing logic
  const startDrawing = (e) => {
    const { clientX, clientY } = e.touches ? e.touches[0] : e; // For mobile touch or mouse
    const x = clientX - canvasRef.current.offsetLeft;
    const y = clientY - canvasRef.current.offsetTop;
    setLastX(x);
    setLastY(y);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { clientX, clientY } = e.touches ? e.touches[0] : e; // For mobile touch or mouse
    const x = clientX - canvasRef.current.offsetLeft;
    const y = clientY - canvasRef.current.offsetTop;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastX(x);
    setLastY(y);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 20} // Make it responsive for mobile screen size
        height={window.innerHeight * 0.6} // Mobile friendly size
        style={{ border: '1px solid #000', touchAction: 'none' }} // touchAction: none to prevent pinch/zoom on touch devices
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <button onClick={saveDrawing} style={{ marginTop: '10px', padding: '10px', fontSize: '16px' }}>
        Save Drawing
      </button>
    </div>
  );
};

export default Drawing;
