"use client";
import { useEffect, useState } from "react";

export default function StoryLoading() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function triggerStory() {
      const childId = localStorage.getItem("childId");
      const drawingUrl = localStorage.getItem("drawingUrl");
      const scene_count = Number(localStorage.getItem("scene_count") || 5);
      const audioUrl = localStorage.getItem("audioUrl");

      if (!childId) return alert("No child selected");

      let payload: any = { childId, scene_count };

      if (audioUrl) {
        payload.audioUrl = audioUrl;
      }

      if (drawingUrl) {
        payload.drawingUrl = drawingUrl;
      }

      if (!audioUrl && !drawingUrl) {
          return alert("No drawing or audio prompt found!");
      }

      localStorage.removeItem("storybook");
      localStorage.removeItem("storyId");

      try {
        await fetch("http://localhost:5678/webhook/create-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        alert("Server unreachable, check n8n status!");
      }
    }

    triggerStory();

    const interval = setInterval(async () => {
      const childId = localStorage.getItem("childId");
      
      if (!childId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/story/child/${childId}`);
        const data = await res.json();

        if (
          data?.storyData?.pages?.length > 0 &&
          data.storyData.pages.every(
            (p: any) =>
              p.background_url?.startsWith("http") &&
              p.narration_url?.startsWith("http")
          )
        ) {
          localStorage.setItem(
            "storybook",
            JSON.stringify({
              _id: data._id,
              title: data.title,
              pages: data.storyData.pages,
            })
          );

          localStorage.setItem("storyId", data._id);
          clearInterval(interval);
          window.location.href = "/view-story";
        }
      } catch {
        console.log("Waiting for story...");
      }
    }, 3000);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* 🌌 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/story_loading.png')" }}
      />

      {/* 🎭 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-800/60 to-pink-700/50 backdrop-blur-sm" />

      {/* ✨ Floating sparkles */}
      <span className="absolute top-20 left-16 text-yellow-300 text-2xl animate-pulse">✨</span>
      <span className="absolute bottom-24 right-20 text-yellow-200 text-xl animate-bounce">⭐</span>
      <span className="absolute top-1/3 right-1/3 text-yellow-100 text-lg animate-ping">🌟</span>

      {/* 🧙 Main Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          ✨ Creating Your Story
        </h1>

        <p className="text-lg sm:text-xl text-purple-100 mb-10">
          Our magic is working behind the scenes…
        </p>

        {/* 🔄 Loader */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-5 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-5 h-5 bg-yellow-300 rounded-full animate-bounce" />
        </div>

        <p className="mt-8 text-purple-200 text-sm italic">
          This may take a minute. Please don’t close the page 🌈
        </p>
      </div>
    </div>
  );
}
