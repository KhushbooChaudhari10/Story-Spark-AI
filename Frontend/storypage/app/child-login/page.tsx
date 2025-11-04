"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChildLoginPage() {
  const [childName, setChildName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handles child login form submission
  // Validates input, sends login request, and redirects upon success
  const handleChildLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Input validation to ensure a name is entered
    if (!childName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      // Sends login request to backend API with child name
      const res = await fetch("http://localhost:5000/api/users/children/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: childName }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store child details locally for later access (e.g., personalization)
        localStorage.setItem("childName", data.child.name);
        localStorage.setItem("childId", data.child._id);

        // Redirect to drawing page after successful login
        router.push("/drawing");
      } else {
        // Handle login errors returned from backend
        setError(data.message || "Login failed. Try again.");
      }
    } catch (err) {
      // Display fallback error message if network or server issue occurs
      setError("Server error. Please try again later.");
    }
  };

  return (
    // Full-page layout centered for focus and easy interaction
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      {/* Page title indicating the section’s purpose */}
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        🧒 Child Login
      </h1>

      {/* Login form section handling user input and submission */}
      <form
        onSubmit={handleChildLogin}
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-80"
      >
        {/* Input field for entering child's name */}
        <input
          type="text"
          placeholder="Enter your name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-yellow-500"
        />

        {/* Button that starts the drawing session after login */}
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold"
        >
          Start Drawing 🎨
        </button>

        {/* Error message display for invalid input or failed login */}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
