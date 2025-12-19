"use client";
import HTMLFlipBook from "react-pageflip";
import { Baloo_2 } from "next/font/google";

import { useEffect, useRef, useState } from "react";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function StoryPage({ story }: { story: any }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  // 🎧 Auto-play narration when page changes
  useEffect(() => {
    const audioUrl = story.pages[pageIndex]?.narration_url;
    if (!audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = audioUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.warn("Autoplay blocked");
    });

    audio.onended = () => {
      if (pageIndex < story.pages.length - 1) {
        setPageIndex((p) => p + 1);
      }
    };
  }, [pageIndex]);

  return (
    <div className="flex flex-col items-center p-6">
      <div 
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/child-login-background.png')" }} 
      />
      <h2 className="relative z-20 text-3xl font-bold text-white text-center mb-4">
        {story.title || "📖 Your Storybook"}
      </h2>

      {/* Audio for narration */}
      <audio ref={audioRef} />

      {/* Flipbook */}
      <HTMLFlipBook
        width={900}
        height={750}
        size="stretch"
        minWidth={400}
        maxWidth={900}
        minHeight={300}
        maxHeight={700}
        showCover={false}
        className="shadow-xl relative z-20"
        onFlip={(e: any) => {
          setPageIndex(e.data);
        }}
      >
        
        {story.pages.map((page: any, idx: number) => (
          <div
            key={idx}
            className="page bg-violet-300 rounded shadow-md p-4 flex flex-col"
          >
            <img
              src={page.background_url}
              alt="page bg"
              className="w-full h-[75%] object-contain rounded"
              sizes = "100vw"
            />
            <p className="mt-4 text-purple-900 text-xl text-center leading-relaxed tracking-wide font-[Baloo_2]">{page.text}</p>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
