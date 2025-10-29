"use client";

import React, { useRef, useState } from "react";

interface DrawingPadProps {
  onComplete: () => void;
}

const DrawingPad: React.FC<DrawingPadProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return alert("Empty canvas!");
      const formData = new FormData();
      formData.append("drawing", blob, `drawing_${Date.now()}.png`);

      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.imageUrl) {
          alert("🎉 Drawing uploaded successfully!");
          onComplete(); // move to StoryPage
        } else {
          alert("❌ Upload failed.");
        }
      } catch (err) {
        alert("⚠️ Upload error");
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        🎨 What’s in your mind today? Draw it here!
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        className="border-2 border-purple-800 rounded bg-white"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
      />

      <button
        onClick={saveDrawing}
        className="mt-6 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
      >
        💾 Save & Continue
      </button>
    </div>
  );
};

export default DrawingPad;
