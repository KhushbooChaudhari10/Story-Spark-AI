"use client";
import React, { useState } from "react";

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  // track form input locally — avoids re-rendering the parent until submit happens
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // validate minimal required fields before passing data upward
  // keeps the parent free from handling basic UI validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // push the collected signup data to parent handler
    // parent decides what to do with it (Firebase + backend)
    onSignup(name, email, password);
  };

  return (
    // lightweight controlled form — easier to theme + reuse in auth pages
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md"
    >
      {/* name used to personalize the user profile */}
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* email is required for Firebase authentication login identity */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* store password briefly in state — never exposed outside component */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* trigger user creation pipeline */}
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Sign Up
      </button>
    </form>
  );
}
