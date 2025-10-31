"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        🧒 Child Login
      </h1>
      <form
        onSubmit={handleChildLogin}
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-80"
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
        />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold"
        >
          Start Drawing 🎨
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
