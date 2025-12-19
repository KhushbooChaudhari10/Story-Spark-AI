"use client";
import { useEffect, useState } from "react";
import StoryPage from "@/components/StoryPage";

export default function ViewStory() {
  const [story, setStory] = useState<any>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("storybook");

    if (!saved) {
      window.location.href = "/story-loading";
      return;
    }

    setStory(JSON.parse(saved));
  }, []);

  // 🌙 Loading fallback
  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 text-white">
        📖 Loading your book...
      </div>
    );
  }

  // ✨ PRE-STORY SCREEN
  if (!started) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* 🌌 Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/story_loading.png')" }}
        />
        <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm" />

        {/* ✨ Floating magic */}
        <span className="absolute top-20 left-12 text-yellow-300 text-2xl animate-pulse">✨</span>
        <span className="absolute bottom-32 right-20 text-yellow-200 text-xl animate-bounce">⭐</span>
        <span className="absolute top-1/3 right-1/3 text-yellow-100 text-lg animate-ping">🌟</span>

        {/* 📘 Card */}
        <div className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">

          <h1 className="text-4xl font-extrabold text-white drop-shadow mb-3">
            ✨ Your Story is Ready!
          </h1>

          <p className="text-purple-100 mb-8">
            Open the book and begin the magic 📖
          </p>

          {/* ▶ Start Story */}
          <button
            className="w-full mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition"
            onClick={() => setStarted(true)}
          >
            ▶ Start the Story
          </button>

          {/* 📥 Download PDF */}
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/storybook/download/${story._id}`,
                "_blank"
              )
            }
          >
            📥 Download Storybook (PDF)
          </button>
        </div>
      </div>
    );
  }

  // 📖 STORY VIEW
  return <StoryPage story={story} />;
}
