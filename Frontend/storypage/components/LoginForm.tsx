"use client";
import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  // Keep local state for form fields so the parent does not rerender unnecessarily on every keystroke
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Trigger parent handler with validated credentials
  // This keeps login submission logic centralized in the page, not the form UI component
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent empty submissions — helps avoid unnecessary backend calls
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    // Pass only sanitized inputs upward — decouples UI input management from actual login processing
    onLogin(email, password);
  };

  return (
    // The form uses simple controlled inputs so the component stays predictable and maintainable
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md"
    >
      {/* Email field — collects identity credentials */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password field — stored in state but never exposed elsewhere */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Submit button triggers login without page refresh */}
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Login
      </button>
    </form>
  );
}
