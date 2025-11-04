"use client";

import React, { useEffect, useRef } from "react";
import storyData from "@/data/story.json";

<<<<<<< HEAD
// Type safety ensures future JSON updates fail fast if schema changes
=======
// 🧱 Define TypeScript types for better safety
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
type Illustration = {
  action: "paint_character" | "paint_background";
  character?: string;
  background?: string;
  x?: number;
  y?: number;
  color?: string;
};

type Story = {
  title: string;
  text: string;
  illustrations: Illustration[];
};

const StoryPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    // drawing depends entirely on DOM canvas API, so effect runs only once after mount
=======
    
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

<<<<<<< HEAD
    // story JSON acts as a mini “scene graph”
    // changing it updates illustration without needing code rewrite
    const story: Story = storyData as Story;

    // always reset canvas before rendering — avoids visual stacking if page reloads in SPA
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // illustration instructions are declarative, not imperative
    // each item in JSON controls the render output in a structured way
    story.illustrations.forEach((item) => {
      if (item.action === "paint_background") {
        // background is drawn first — sets context so characters look grounded in a world

        // sky layer
        ctx.fillStyle = "#9be7ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ground layer
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

        // repeating shapes gives environment richness without manual placement per element
=======
    const story: Story = storyData as Story;

    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements from JSON
    story.illustrations.forEach((item) => {
      if (item.action === "paint_background") {
        // 🌳 Draw sky
        ctx.fillStyle = "#9be7ff"; // light blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 🌿 Draw ground
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

        // 🌲 Draw multiple trees
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        for (let i = 0; i < 5; i++) {
          const treeX = 100 + i * 150;
          const treeY = canvas.height - 150;

<<<<<<< HEAD
          // trunk
          ctx.fillStyle = "#8B4513";
          ctx.fillRect(treeX, treeY - 60, 20, 60);

          // foliage
=======
          // tree trunk
          ctx.fillStyle = "#8B4513"; // brown
          ctx.fillRect(treeX, treeY - 60, 20, 60);

          // leaves (triangle)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
          ctx.fillStyle = "green";
          ctx.beginPath();
          ctx.moveTo(treeX - 30, treeY - 60);
          ctx.lineTo(treeX + 10, treeY - 140);
          ctx.lineTo(treeX + 50, treeY - 60);
          ctx.closePath();
          ctx.fill();
        }

<<<<<<< HEAD
        // small irregular bird placement keeps scenery playful instead of overly “grid-like”
=======
        // 🐦 Draw some birds (simple "V" shapes)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const birdX = 80 + i * 200;
          const birdY = 80 + Math.random() * 40;
          ctx.beginPath();
          ctx.moveTo(birdX, birdY);
          ctx.lineTo(birdX + 10, birdY - 10);
          ctx.lineTo(birdX + 20, birdY);
          ctx.stroke();
        }
      }

<<<<<<< HEAD
      if (item.action === "paint_character" && item.character === "fox") {
        // fox character uses relative geometry rather than static sprites
        // this makes it easier later to animate / reposition via JSON

=======

      if (item.action === "paint_character" && item.character === "fox") {
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        const x = item.x || 250;
        const groundY = canvas.height - 120;
        const y = groundY;

<<<<<<< HEAD
        // body
=======
        // 🦊 Body
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.ellipse(x, y - 25, 45, 20, 0, 0, Math.PI * 2);
        ctx.fill();

<<<<<<< HEAD
        // head placement computed relative to body rather than fixed coordinates
        const headX = x + 25;
        const headY = y - 25;

        // head shape
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX + 30, headY - 15);
        ctx.quadraticCurveTo(headX + 45, headY, headX + 30, headY + 15);
        ctx.closePath();
        ctx.fill();

        // muzzle patch
=======
        // Head origin (top-left of body + small offset)
        const headX = x + 25;
        const headY = y - 25;

        // 🦊 Head
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.moveTo(headX, headY); // start at body-neck
        ctx.lineTo(headX + 30, headY - 15); // top
        ctx.quadraticCurveTo(headX + 45, headY, headX + 30, headY + 15); // muzzle curve
        ctx.closePath();
        ctx.fill();

        // 🦊 White muzzle (relative to head)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(headX + 25, headY + 5);
        ctx.quadraticCurveTo(headX + 35, headY - 5, headX + 28, headY + 10);
        ctx.fill();

<<<<<<< HEAD
        // ears placed relative to head to maintain scaling consistency if character size changes later
=======
        // 🦊 Ears (relative to head)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.moveTo(headX + 5, headY - 10);
        ctx.lineTo(headX + 10, headY - 35);
        ctx.lineTo(headX + 15, headY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(headX + 15, headY - 10);
        ctx.lineTo(headX + 20, headY - 35);
        ctx.lineTo(headX + 25, headY - 10);
        ctx.closePath();
        ctx.fill();

<<<<<<< HEAD
        // eyes + nose
=======
        // 🦊 Eyes (relative to head)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(headX + 18, headY - 5, 2, 0, Math.PI * 2);
        ctx.fill();

<<<<<<< HEAD
=======
        // 🦊 Nose (relative to head)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.beginPath();
        ctx.arc(headX + 30, headY + 8, 3, 0, Math.PI * 2);
        ctx.fill();

<<<<<<< HEAD
        // tail uses curve shapes for a more organic, cartoon feel
=======

        // 🦊 Tail (curvy, bushy, white tip)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.moveTo(x - 35, y - 20);
        ctx.quadraticCurveTo(x - 80, y - 80, x - 60, y - 15);
        ctx.lineTo(x - 55, y - 10);
        ctx.quadraticCurveTo(x - 85, y - 60, x - 50, y - 25);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(x - 60, y - 25);
        ctx.quadraticCurveTo(x - 55, y - 30, x - 50, y - 20);
        ctx.fill();

<<<<<<< HEAD
        // legs left minimal to keep visual style simple + child-friendly
=======
        // 🐾 Legs (thin and slightly bent)
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
        ctx.fillStyle = "black";
        ctx.fillRect(x - 20, y - 5, 4, 15);
        ctx.fillRect(x + 5, y - 5, 4, 15);
      }
<<<<<<< HEAD
    });

    // title printed after background so it's always visible on top
=======


    });

>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    ctx.fillStyle = "black";
    ctx.font = "32px Comic Sans MS";
    ctx.fillText(story.title, 20, 50);

<<<<<<< HEAD
    // story text printed near bottom so drawings appear visually “above the narration”
=======
    // Draw text
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    ctx.fillStyle = "black";
    ctx.font = "24px Comic Sans MS";
    ctx.fillText(story.text, 20, canvas.height - 40);
  }, []);

  return (
<<<<<<< HEAD
    // wrapper ensures canvas stays centered and responsive visually with padding around scene
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    <div className="flex flex-col items-center p-6">
      <canvas
        ref={canvasRef}
        width={900}
        height={650}
        className="border border-gray-700 rounded"
      />
    </div>
  );
};

export default StoryPage;
