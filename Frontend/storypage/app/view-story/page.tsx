"use client";
import { useEffect, useState } from "react";
import StoryPage from "@/components/StoryPage";

export default function ViewStory() {
  const [story, setStory] = useState<any>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("storybook");
    if (!localStorage.getItem("storybook")) {
      window.location.href = "/story-loading";
    } 
    setStory(JSON.parse(saved));  
  }, []);

  if (!story)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        📖 Loading your book...
      </div>
    );

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">✨ Your Story is Ready!</h1>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg"
          onClick={() => setStarted(true)}
        >
          ▶ Start Story
        </button>
      </div>
    );
  }

  return <StoryPage story={story} />;
}
