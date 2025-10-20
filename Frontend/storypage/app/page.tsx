"use client";
import Navbar from "@/components/Navbar";
import StoryPage from "@/components/StoryPage";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <StoryPage />
    </main>
  );
}
