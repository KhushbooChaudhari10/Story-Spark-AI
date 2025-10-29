"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [childName, setChildName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else window.location.href = "/login";
    });
    return () => unsub();
  }, []);

  const addChild = async () => {
    const token = await user.getIdToken();
    await fetch("http://localhost:5000/api/children", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: childName }),
    });
    setChildName("");
    alert("Child added successfully!");
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800">👨‍👩‍👧 Parent Dashboard</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Add Child */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Child Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addChild}
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Child
        </button>
      </div>

      {/* Child List */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Your Children</h2>
        {children.length === 0 ? (
          <p>No children yet. Add one above!</p>
        ) : (
          <ul>
            {children.map((child) => (
              <li key={child._id} className="p-2 border mb-2 rounded">
                {child.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
