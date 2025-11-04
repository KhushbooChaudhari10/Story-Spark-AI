"use client";
import React, { useState } from "react";

interface AddChildFormProps {
  onAddChild: (childData: { name: string; age: number }) => void;
}

export default function AddChildForm({ onAddChild }: AddChildFormProps) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");

  // Handles form submission to create a new child record
  // This abstracts the state values into a single object passed up to parent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation before sending data to parent handler
    // Prevents empty entries from being created
    if (!childName || !childAge) {
      alert("Please fill all fields");
      return;
    }

    // Pass the cleaned and formatted data to parent dashboard
    // Parent component decides how to store and persist this
    onAddChild({
      name: childName,
      age: Number(childAge),
    });

    // Reset fields so the form stays ready for next entry
    setChildName("");
    setChildAge("");
  };

  return (
    // Simple card container to visually separate this input form from other dashboard content
    <div className="mb-6 space-y-3 max-w-md border p-4 rounded-lg bg-white shadow-sm">
      {/* Clear section heading to make the purpose of this panel obvious to the parent */}
      <h2 className="text-xl font-semibold mb-2 text-center text-purple-800">Add Child</h2>

      {/* Inputs and submit button grouped into one form to leverage native form behavior */}
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Name input — free-form text, which will be mapped to displayName later */}
        <input
          type="text"
          placeholder="Child Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Age input — numeric constraint helps maintain clean type consistency in DB */}
        <input
          type="number"
          placeholder="Child Age"
          value={childAge}
          onChange={(e) => setChildAge(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Submit button triggers parent handler to officially register the child */}
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
