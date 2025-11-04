"use client";
import React, { useState } from "react";

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
<<<<<<< HEAD
  // track form input locally — avoids re-rendering the parent until submit happens
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

<<<<<<< HEAD
  // validate minimal required fields before passing data upward
  // keeps the parent free from handling basic UI validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

=======
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
<<<<<<< HEAD

    // push the collected signup data to parent handler
    // parent decides what to do with it (Firebase + backend)
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    onSignup(name, email, password);
  };

  return (
<<<<<<< HEAD
    // lightweight controlled form — easier to theme + reuse in auth pages
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md"
    >
<<<<<<< HEAD
      {/* name used to personalize the user profile */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <input
        type="text"
        placeholder="Full Name"
        className="border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
<<<<<<< HEAD

      {/* email is required for Firebase authentication login identity */}
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

      {/* store password briefly in state — never exposed outside component */}
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

      {/* trigger user creation pipeline */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Sign Up
      </button>
    </form>
  );
}
