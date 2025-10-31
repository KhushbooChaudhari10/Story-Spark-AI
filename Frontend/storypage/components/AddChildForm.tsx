"use client";
import React, { useState } from "react";

interface AddChildFormProps {
  onAddChild: (childData: { name: string; age: number }) => void;
}

export default function AddChildForm({ onAddChild }: AddChildFormProps) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!childName || !childAge) {
      alert("Please fill all fields");
      return;
    }

    onAddChild({
      name: childName,
      age: Number(childAge),
    });

    // Reset form
    setChildName("");
    setChildAge("");
  };

  return (
    <div className="mb-6 space-y-3 max-w-md border p-4 rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-2 text-center text-purple-800">Add Child</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Child Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Child Age"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          ➕ Add Child
        </button>
      </form>
    </div>
  );
}
