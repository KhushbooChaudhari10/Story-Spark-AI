"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import DrawingPad from "../app/drawing/page"; 
import StoryPage from "@/components/StoryPage";

export default function Home() {
  const [showStory, setShowStory] = useState(false);

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      {!showStory ? (
        <DrawingPad onComplete={() => setShowStory(true)} />
      ) : (
        <StoryPage />
      )}
    </main>
  );
}
