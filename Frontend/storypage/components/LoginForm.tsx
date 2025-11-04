"use client";
import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
<<<<<<< HEAD
  // Keep local state for form fields so the parent does not rerender unnecessarily on every keystroke
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Trigger parent handler with validated credentials
  // This keeps login submission logic centralized in the page, not the form UI component
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent empty submissions — helps avoid unnecessary backend calls
=======
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
<<<<<<< HEAD

    // Pass only sanitized inputs upward — decouples UI input management from actual login processing
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    onLogin(email, password);
  };

  return (
<<<<<<< HEAD
    // The form uses simple controlled inputs so the component stays predictable and maintainable
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md"
    >
<<<<<<< HEAD
      {/* Email field — collects identity credentials */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
<<<<<<< HEAD

      {/* Password field — stored in state but never exposed elsewhere */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
<<<<<<< HEAD

      {/* Submit button triggers login without page refresh */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Login
      </button>
    </form>
  );
}
