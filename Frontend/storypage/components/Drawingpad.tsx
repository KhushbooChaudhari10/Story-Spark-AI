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
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  // giving quick fixed selection makes UI faster for kids — avoids manual color picking every time
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

  // syncs firebase auth state into this component — needed so uploads associate with correct child/parent session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ensures canvas related DOM refs exist before drawing logic attaches listeners
  useEffect(() => {
    setMounted(true);
  }, []);

  // protecting route — child should only reach here after logging in
  useEffect(() => {
    const childName = localStorage.getItem("childName");
    if (!childName) {
      alert("Please log in as a child first!");
      window.location.href = "/child-login";
    }
  }, []);

  // core drawing system — uses DOM canvas API directly instead of React state to avoid expensive re-renders
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const colorPicker = colorPickerRef.current;
    const brushSize = brushSizeRef.current;
    if (!canvas || !colorPicker || !brushSize) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // flag used so mousemove only draws after mousedown — this prevents accidental continuous strokes
    let drawing = false;

    const startDrawing = (e: MouseEvent) => {
      if (shapeMode !== "pen") return; // prevents pen logic interfering with shape placement
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

    // shape clicks create simpler “stamp based” drawing — easier for young kids to use
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
      // this function remains math-heavy — kept isolated so main drawing logic stays readable
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

    // attach raw canvas listeners — these allow real-time drawing without React rerender cost
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

  // instantly clears canvas state — used as quick reset during creativity exploration
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // upload the drawing to backend and notify parent when complete — onComplete triggers next screen
  const saveDrawing = async () => {
    const childId = localStorage.getItem("childId");
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
      localStorage.removeItem("storybook");
      localStorage.removeItem("storyId");
      try {
        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data?.drawing?.imageUrl) {
          localStorage.setItem("drawingUrl", data.drawing.imageUrl);
          localStorage.setItem("childId", childId);

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

//   const startRecording = async () => {
//   const childId = localStorage.getItem("childId");
//   if (!childId) return alert("No child selected!");

//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder);
//     setChunks([]);

//     recorder.ondataavailable = (e) => {
//       setChunks((prev) => [...prev, e.data]);
//     };

//     recorder.onstop = () => uploadAudio(childId);

//     recorder.start();
//     alert("🎙 Recording started... Click again to stop.");
//   } catch (err) {
//     alert("⚠️ Mic permission denied!");
//     console.error(err);
//   }
// };

// const stopRecording = () => {
//   if (mediaRecorder) {
//     mediaRecorder.stop();
//     alert("📤 Uploading audio...");
//   }
// };

// const uploadAudio = async (childId: string) => {
//   const blob = new Blob(chunks, { type: "audio/webm" });
//   const formData = new FormData();
//   formData.append("audio", blob, `voice_${Date.now()}.webm`);
//   formData.append("childId", childId);

//   const res = await fetch("http://localhost:5000/api/upload/audio", {
//     method: "POST",
//     body: formData
//   });

//   const data = await res.json();
//   if (res.ok) alert("🎉 Voice uploaded!");
//   else alert("❌ Upload failed: " + data.message);
// };

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const childId = localStorage.getItem("childId");
  if (!childId) return alert("No child selected");

  const file = e.target.files?.[0];
  if (!file) return alert("No image selected");

  const formData = new FormData();
  formData.append("drawing", file);
  formData.append("childId", childId);

  // 🧹 Clear old story
  localStorage.removeItem("storybook");
  localStorage.removeItem("storyId");

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (res.ok && data?.drawing?.imageUrl) {
      // 💾 Store image URL like saveDrawing() does
      localStorage.setItem("drawingUrl", data.drawing.imageUrl);
      localStorage.setItem("childId", childId);

      alert("🎉 Drawing uploaded successfully!");

      // 🚀 SAME FLOW as Save Drawing
      onComplete();
    } else {
      alert("❌ Upload failed: " + data.message);
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("⚠️ Upload error. Please try again later.");
  }
};


  if (!mounted) return null;
  
  return (
    <div
      className="flex flex-col items-center min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('drawingpad.png')",
      }}
    >
      <h1 className="text-4xl font-extrabold text-white tracking-wider mb-4 drop-shadow-lg">
        🧚‍♂️ Create Your Magic!
      </h1>


      {/* Toolbar */}
  <div className="flex flex-wrap items-center justify-center gap-4 mb-4 
      bg-gradient-to-r from-purple-600 to-pink-500 
      p-4 shadow-xl rounded-2xl w-full max-w-6xl border border-white/30 backdrop-blur-lg">

    {/* 🎨 Preset Colors */}
    <div className="flex gap-3">
      {presetColors.map((color) => (
        <button
          key={color}
          onClick={() => {
            setSelectedColor(color);
            if (colorPickerRef.current) colorPickerRef.current.value = color;
            setErasing(false);
          }}
          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-125
            ${selectedColor === color ? "ring-4 ring-yellow-300" : ""}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>

    {/* 🎨 Custom Picker */}
    <input
      type="color"
      ref={colorPickerRef}
      defaultValue={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
      className="w-10 h-10 border-2 border-white rounded-full shadow-md hover:scale-110 transition-all"
    />

    {/* ✏️ Brush Size */}
    <div className="flex items-center text-white">
      <label className="font-medium mr-2">Brush:</label>
      <input type="range" ref={brushSizeRef} min="1" max="20" defaultValue="5" 
        className="accent-yellow-300 cursor-pointer" />
    </div>

    {/* 🧼 Eraser */}
    <button
      onClick={() => setErasing(!erasing)}
      className={`px-4 py-2 rounded-xl text-white font-semibold shadow-md transition-all 
        ${erasing ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-purple-800 hover:bg-purple-700"}`}
    >
      {erasing ? "🧹 Erasing" : "✏️ Draw"}
    </button>

    {/* 🗑 Clear */}
    <button
      onClick={clearCanvas}
      className="px-4 py-2 bg-white/90 text-purple-700 rounded-xl font-semibold hover:bg-white shadow-lg"
    >
      🗑 Clear
    </button>

    {/* 📤 Upload */}
    <input type="file" accept="image/*" id="uploadImageInput" style={{ display: "none" }} onChange={handleImageUpload} />
    <button
      onClick={() => document.getElementById("uploadImageInput")?.click()}
      className="px-4 py-2 bg-yellow-200 text-purple-900 rounded-xl font-bold shadow-md hover:bg-yellow-300"
    >
      📁 Upload Drawing
    </button>
  </div>

      {/* Shape Buttons */}
  <div className="flex gap-3 mb-4">
    {[
      { shape: "pen", label: "✏️" },
      { shape: "circle", label: "⚪" },
      { shape: "rectangle", label: "⬛" },
      { shape: "line", label: "➖" },
      { shape: "triangle", label: "🔺" },
      { shape: "star", label: "⭐" },
      { shape: "ellipse", label: "🟣" },
    ].map((btn) => (
      <button
        key={btn.shape}
        onClick={() => setShapeMode(btn.shape)}
        className={`px-4 py-2 text-2xl rounded-xl shadow-md transition-transform 
          ${shapeMode === btn.shape
            ? "bg-yellow-400 text-purple-900 scale-110"
            : "bg-white text-purple-800 hover:bg-yellow-200 hover:scale-105"}`}
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
        className="border-2 border-purple-700 rounded-lg shadow-md bg-white/90 backdrop-blur-3xl"
      />

      {/* Save */}
        <button
          onClick={saveDrawing}
          className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                    text-white font-bold rounded-2xl shadow-lg 
                    hover:scale-110 hover:shadow-purple-400 active:scale-95 
                    transition-all flex items-center justify-center gap-2"
        >
          ✨ Make Magic!
        </button>

    </div>
  );
};

export default Drawingpad;
