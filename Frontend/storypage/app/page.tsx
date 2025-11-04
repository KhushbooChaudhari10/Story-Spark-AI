"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Nunito } from "next/font/google";

export default function HomePage() {
  const router = useRouter();

  return (
    // 🧭 The main layout container — keeps everything centered both vertically and horizontally
    // Using flex ensures the hero content always stays in the middle regardless of screen size.
    <div className="relative min-h-screen flex items-center justify-center p-4">
      
      {/* Full-screen background image
          Creates an immersive, visually appealing backdrop that fits any screen size.
          We use `layout="fill"` and `objectFit="cover"` to ensure the image covers the viewport without distortion.
      */}
      <Image
        src="/story-spark-hero.png" // Must match public folder structure
        alt="Story Spark AI hero graphic background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute z-0"
        priority
      />

      {/* Optional dark overlay (commented out)
           Used to increase text contrast on lighter background images, improving readability.
          Can be re-enabled if the background feels too bright.
      */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

      {/* Top-right action buttons (Login / Sign Up)
          Placed here for quick access — users expect account-related actions to be visible immediately.
          Using high contrast and hover states improves discoverability and interactivity.
      */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 z-20 flex gap-4">
        <button
          onClick={() => router.push("/login")} // Navigation through Next.js router for SPA-like transitions
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition text-md font-semibold shadow-md"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="bg-white text-purple-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition text-md font-semibold"
        >
          Sign Up
        </button>
      </div>

      {/* Central content section — focuses user attention on the brand and welcome message.
          Keeping it text-only ensures clarity and fast page load before user actions.
      */}
      <div className="relative z-20 max-w-sm w-full text-center">
        
        {/* Title with text shadow for improved legibility over dynamic backgrounds.
            Shadows prevent text from blending with bright parts of the image.
        */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}>
          Story Spark AI
        </h1>
        
        {/* Subtext — friendly, concise introduction
            Encourages user engagement without overwhelming them with information.
        */}
        <p className="text-lg sm:text-xl text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
          Welcome to your adventure!
        </p>
      </div>

      {/* Bottom CTA (Child Login)
           Designed for accessibility — separates child entry from main login flow.
          Full-width placement ensures high visibility and easy tap access on mobile devices.
      */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 z-20 flex justify-center">
        <button
          onClick={() => router.push("/child-login")}
          // Using consistent max-width ties the visual hierarchy with the centered text block.
          className="bg-purple-500 text-white px-10 py-4 rounded-lg hover:bg-purple-600 transition text-xl font-semibold shadow-lg max-w-sm w-full"
        >
          Child Login
        </button>
      </div>

    </div>
  );
}
