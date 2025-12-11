"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChildLoginPage() {
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChildLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!childName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/children/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: childName }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("childName", data.child.name);
        localStorage.setItem("childId", data.child._id);
        router.push("/drawing");
      } else {
        setError(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-white text-2xl font-bold drop-shadow-lg">
        📖✨ Story Spark
      </div>


      {/* Background Image */}
      <Image
        src="/child-login-background.png" // put your desired background here
        alt="story cloud"
        fill
        style={{ objectFit: "cover" }}
        className="opacity-90"
        priority
      />

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Sparkles ⭐ */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <span className="absolute top-16 left-10 text-yellow-300 text-xl animate-pulse">✨</span>
        <span className="absolute top-56 right-20 text-yellow-200 text-2xl animate-pulse">🌟</span>
        <span className="absolute bottom-32 left-28 text-purple-200 text-xl animate-pulse">💫</span>
      </div>

      {/* Form Card */}
      <div className="relative z-30 bg-purple-500 backdrop-blur-md border shadow-2xl rounded-2xl p-8 w-[340px] flex flex-col items-center gap-5">
        
        <h1 className="text-3xl font-extrabold text-purple-100 drop-shadow-md">
          🧒 Your Name?
        </h1>

        <input
          type="text"
          placeholder="Type here..."
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="w-full border-2 border-purple-300 rounded-xl p-2 text-lg focus:ring-2 focus:ring-purple-400 outline-none bg-purple-50"
        />

        <button
          type="submit"
          onClick={handleChildLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2.5 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 active:scale-95"
        >
          ✨ Start Story Magic
        </button>

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
      </div>
    </div>
  );
}
