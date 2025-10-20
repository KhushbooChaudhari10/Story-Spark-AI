"use client";

import React, { useEffect, useRef } from "react";
import storyData from "@/data/story.json";

// 🧱 Define TypeScript types for better safety
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
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
        for (let i = 0; i < 5; i++) {
          const treeX = 100 + i * 150;
          const treeY = canvas.height - 150;

          // tree trunk
          ctx.fillStyle = "#8B4513"; // brown
          ctx.fillRect(treeX, treeY - 60, 20, 60);

          // leaves (triangle)
          ctx.fillStyle = "green";
          ctx.beginPath();
          ctx.moveTo(treeX - 30, treeY - 60);
          ctx.lineTo(treeX + 10, treeY - 140);
          ctx.lineTo(treeX + 50, treeY - 60);
          ctx.closePath();
          ctx.fill();
        }

        // 🐦 Draw some birds (simple "V" shapes)
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


      if (item.action === "paint_character" && item.character === "fox") {
        const x = item.x || 250;
        const groundY = canvas.height - 120;
        const y = groundY;

        // 🦊 Body
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.ellipse(x, y - 25, 45, 20, 0, 0, Math.PI * 2);
        ctx.fill();

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
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(headX + 25, headY + 5);
        ctx.quadraticCurveTo(headX + 35, headY - 5, headX + 28, headY + 10);
        ctx.fill();

        // 🦊 Ears (relative to head)
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

        // 🦊 Eyes (relative to head)
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(headX + 18, headY - 5, 2, 0, Math.PI * 2);
        ctx.fill();

        // 🦊 Nose (relative to head)
        ctx.beginPath();
        ctx.arc(headX + 30, headY + 8, 3, 0, Math.PI * 2);
        ctx.fill();


        // 🦊 Tail (curvy, bushy, white tip)
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

        // 🐾 Legs (thin and slightly bent)
        ctx.fillStyle = "black";
        ctx.fillRect(x - 20, y - 5, 4, 15);
        ctx.fillRect(x + 5, y - 5, 4, 15);
      }


    });

    ctx.fillStyle = "black";
    ctx.font = "32px Comic Sans MS";
    ctx.fillText(story.title, 20, 50);

    // Draw text
    ctx.fillStyle = "black";
    ctx.font = "24px Comic Sans MS";
    ctx.fillText(story.text, 20, canvas.height - 40);
  }, []);

  return (
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
