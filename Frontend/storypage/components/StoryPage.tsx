"use client";
import { useEffect, useRef, useState } from "react";

export default function StoryPage({ story }: { story: any }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);

  // 🖼 Render page when index changes
  useEffect(() => {
    renderPage(story.pages[pageIndex]);
  }, [pageIndex]);

  function renderPage(page: any) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsPageReady(false);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = new Image();
    bg.src = page.background_url || "";

    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      drawText(ctx, page.text);
      setIsPageReady(true);
    };
  }

  function drawText(ctx: any, text: string) {
    ctx.font = "24px Comic Sans MS";
    ctx.fillStyle = "black";
    wrapText(ctx, text, 20, 450, 860, 30);
  }

  // 🎧 Auto-narrate when ready
  useEffect(() => {
    if (isPageReady && story.pages[pageIndex].narration_url) {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = 0;
      audio.play();

      // 👉 Flip page automatically after audio
      audio.onended = () => {
        if (pageIndex < story.pages.length - 1) {
          setTimeout(() => {
            setPageIndex((prev) => prev + 1);
          }, 600); // small pause after narration
        }
      };
    }
  }, [isPageReady, pageIndex]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-3xl font-bold text-gray-700">
        {story.title || "📚 Your Storybook"}
      </h2>

      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="border border-black rounded shadow-md"
      />

      {/* 🎧 Hidden autoplay audio */}
      <audio ref={audioRef} src={story.pages[pageIndex].narration_url} controls muted={false}/>

      <div className="flex gap-4 mt-4 font-bold">
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex(pageIndex - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
        >
          ⬅ Prev
        </button>

        <button
          disabled={pageIndex === story.pages.length - 1}
          onClick={() => setPageIndex(pageIndex + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-40"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

function wrapText(ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  for (let word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}
