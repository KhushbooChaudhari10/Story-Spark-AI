"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-4xl font-bold text-purple-800 mb-8">
        🎨 Story Spark AI
      </h1>
      <p className="text-gray-700 mb-10 text-center max-w-md">
        Welcome! Please login or sign up to start creating stories with your imagination.
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => router.push("/login")}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="bg-white border-2 border-purple-700 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-100 transition"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push("/child-login")}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          Child Login
        </button>
      </div>
    </div>
  );
}
