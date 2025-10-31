"use client";

import React, { useRef, useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface DrawingPadProps {
  onComplete: () => void;
}

const Drawingpad: React.FC<DrawingPadProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);
  const brushSizeRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<any>(null);
  const [erasing, setErasing] = useState(false);
  const [shapeMode, setShapeMode] = useState("pen");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [mounted, setMounted] = useState(false);

  // 🎨 Preset colors
  const presetColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#800080",
    "#000000",
    "#FFFFFF",
  ];

  // ✅ Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Ensure hydration-safe mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  const childName = localStorage.getItem("childName");
  if (!childName) {
    alert("Please log in as a child first!");
    window.location.href = "/child-login";
  }
}, []);


  // ✅ Drawing logic
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const colorPicker = colorPickerRef.current;
    const brushSize = brushSizeRef.current;

    if (!canvas || !colorPicker || !brushSize) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const startDrawing = (e: MouseEvent) => {
      if (shapeMode !== "pen") return;
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = erasing ? "#fff" : colorPicker.value;
      ctx.lineWidth = Number(brushSize.value);
      ctx.lineCap = "round";
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e: MouseEvent) => {
      if (!drawing || shapeMode !== "pen") return;
      ctx.strokeStyle = erasing ? "#fff" : colorPicker.value;
      ctx.lineWidth = Number(brushSize.value);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const handleClick = (e: MouseEvent) => {
      if (shapeMode === "pen") return;

      const x = e.offsetX;
      const y = e.offsetY;
      ctx.fillStyle = erasing ? "#fff" : colorPicker.value;

      switch (shapeMode) {
        case "circle":
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "rectangle":
          ctx.fillRect(x - 40, y - 25, 80, 50);
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(x, y - 40);
          ctx.lineTo(x - 40, y + 40);
          ctx.lineTo(x + 40, y + 40);
          ctx.closePath();
          ctx.fill();
          break;
        case "star":
          drawStar(ctx, x, y, 5, 30, 15);
          break;
        case "ellipse":
          ctx.beginPath();
          ctx.ellipse(x, y, 60, 40, 0, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(x - 40, y);
          ctx.lineTo(x + 40, y);
          ctx.strokeStyle = colorPicker.value;
          ctx.lineWidth = Number(brushSize.value);
          ctx.stroke();
          break;
      }
    };

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("click", handleClick);
    };
  }, [mounted, erasing, shapeMode]);

  // 🧹 Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // 💾 Save Canvas to Backend
  // 💾 Save Canvas to Backend
const saveDrawing = async () => {
  const childId = localStorage.getItem("childId"); // ✅ stored at child login
  if (!childId) {
    alert("Please log in as a child first!");
    window.location.href = "/child-login";
    return;
  }

  const canvas = canvasRef.current;
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    if (!blob) return alert("Canvas is empty!");

    const formData = new FormData();
    formData.append("drawing", blob, `drawing_${Date.now()}.png`);
    formData.append("childId", childId);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("🎉 Drawing uploaded successfully!");
        onComplete();
      } else {
        alert("❌ Upload failed: " + data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("⚠️ Upload error. Please try again later.");
    }
  });
};


  if (!mounted) return null;

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('/c0d5f41f-cf89-4a0f-9fc3-066b2de8b3a1.jpg')",
      }}
    >
      <h1 className="text-3xl font-bold text-purple-800 mb-4">
        🎨 Drawing Pad
      </h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4 bg-purple-400 p-4 shadow-md rounded-lg w-full max-w-5xl">
        {/* Preset Colors */}
        <div className="flex gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                if (colorPickerRef.current)
                  colorPickerRef.current.value = color;
                setErasing(false);
              }}
              className={`w-8 h-8 rounded-full border ${
                selectedColor === color ? "outline-2 outline-black" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Custom Picker */}
        <input
          type="color"
          ref={colorPickerRef}
          defaultValue={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-10 h-10 border rounded"
        />

        {/* Brush Size */}
        <div className="flex items-center">
          <label className="font-medium mr-2 text-white">Brush:</label>
          <input
            type="range"
            ref={brushSizeRef}
            min="1"
            max="20"
            defaultValue="5"
          />
        </div>

        {/* Eraser */}
        <button
          onClick={() => setErasing(!erasing)}
          className={`px-4 py-2 rounded-lg text-white ${
            erasing ? "bg-red-700" : "bg-purple-700"
          }`}
        >
          {erasing ? "Eraser ON" : "Eraser OFF"}
        </button>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Clear
        </button>

        {/* Save */}
        <button
          onClick={saveDrawing}
          className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800"
        >
          💾 Save
        </button>
      </div>

      {/* Shape Buttons */}
      <div className="flex gap-2 mb-4">
        {[
          { shape: "pen", label: "✏️" },
          { shape: "circle", label: "⚪" },
          { shape: "rectangle", label: "⬛" },
          { shape: "line", label: "➖" },
          { shape: "triangle", label: "🔺" },
          { shape: "star", label: "⭐" },
          { shape: "ellipse", label: "⬭" },
        ].map((btn) => (
          <button
            key={btn.shape}
            onClick={() => setShapeMode(btn.shape)}
            className={`px-3 py-2 rounded ${
              shapeMode === btn.shape
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-400"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={450}
        className="border-2 border-purple-700 rounded-lg shadow-md bg-white/90 backdrop-blur-sm"
      />
    </div>
  );
};

export default Drawingpad;
