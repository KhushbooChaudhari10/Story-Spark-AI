"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative min-h-[94vh] overflow-hidden flex items-center justify-center p-0">

        {/* Background */}
        <Image
          src="/story-spark-hero.png"
          alt="hero image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-20 z-10">
          <span className="absolute top-20 left-10 text-yellow-200 text-xl">✨</span>
          <span className="absolute bottom-32 right-20 text-yellow-200 text-xl">⭐</span>
          <span className="absolute top-40 right-44 text-yellow-300 text-sm">🌟</span>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-30 max-w-sm w-full text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}
          >
            ✨ Story Spark AI
          </h1>

          <p
            className="text-lg sm:text-xl text-gray-200"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.5)" }}
          >
            Create your magical story with a single idea!
          </p>
        </div>

        {/* CTA BUTTON */}
        <div className="absolute bottom-10 left-0 right-0 p-4 sm:p-8 z-20 flex justify-center">
          <button
            onClick={() => router.push("/child-login")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 
            text-white px-12 py-4 rounded-xl text-xl font-bold 
            shadow-lg hover:shadow-2xl hover:scale-105 
            active:scale-95 transition duration-300"
          >
            Let’s Make a Story
          </button>
        </div>
      </div>

      {/* FOOTER BELOW HERO */}
      <Footer />
    </>
  );
}
