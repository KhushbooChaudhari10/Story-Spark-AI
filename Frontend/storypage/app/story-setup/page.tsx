"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StorySetupPage() {
  const router = useRouter();
  const [childName, setChildName] = useState<string | null>(null);
  const [sceneCount, setSceneCount] = useState<number>(5); // default = medium

  useEffect(() => {
    const name = localStorage.getItem("childName");
    if (!name) {
      router.push("/child-login");
    } else {
      setChildName(name);
    }
  }, [router]);

  const startDrawing = () => {
    localStorage.setItem("scene_count", String(sceneCount));
    router.push("/drawing");
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background */}
      <Image
        src="/child-login-background.png"
        alt="storybook background"
        fill
        priority
        className="object-cover opacity-90"
      />

      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Content */}
      <div className="relative z-20 bg-purple-500/90 backdrop-blur-md 
                      border border-white/30 shadow-2xl rounded-3xl 
                      p-10 w-[360px] flex flex-col items-center gap-6 text-center">

        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
          🌈 Welcome, {childName}!
        </h1>

        <p className="text-lg text-purple-100 font-medium">
          Let’s make a story 🌟  
          <br />
          How long should it be?
        </p>

        {/* Scene Selector */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => setSceneCount(3)}
            className={`py-3 rounded-2xl text-lg font-bold transition-all
              ${sceneCount === 3
                ? "bg-yellow-300 text-purple-900 scale-105"
                : "bg-white text-purple-700 hover:bg-yellow-200"}`}
          >
            Short Story (3 pages)
          </button>

          <button
            onClick={() => setSceneCount(5)}
            className={`py-3 rounded-2xl text-lg font-bold transition-all
              ${sceneCount === 5
                ? "bg-yellow-300 text-purple-900 scale-105"
                : "bg-white text-purple-700 hover:bg-yellow-200"}`}
          >
            Medium Story (5 pages)
          </button>

          <button
            onClick={() => setSceneCount(7)}
            className={`py-3 rounded-2xl text-lg font-bold transition-all
              ${sceneCount === 7
                ? "bg-yellow-300 text-purple-900 scale-105"
                : "bg-white text-purple-700 hover:bg-yellow-200"}`}
          >
            Long Story (7 pages)
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={startDrawing}
          className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 
                     text-white font-extrabold rounded-2xl shadow-lg 
                     hover:scale-110 transition-all"
        >
          ✨ Start Drawing ✨
        </button>
      </div>
    </div>
  );
}
