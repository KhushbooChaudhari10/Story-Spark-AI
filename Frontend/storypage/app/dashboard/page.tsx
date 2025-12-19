"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import AddChildForm from "@/components/AddChildForm";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface Child {
  _id: string;
  name: string;
  age: number;
}

export default function DashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndChildren = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      setToken(idToken);
      await fetchChildren(idToken);
    };
    fetchTokenAndChildren();
  }, []);

  const fetchChildren = async (idToken: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/children", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch children");
      const data = await res.json();
      setChildren(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (childData: { name: string; age: number }) => {
    if (!token) return alert("Unauthorized");

    try {
      const res = await fetch("http://localhost:5000/api/users/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(childData),
      });

      if (!res.ok) throw new Error("Failed to add child");
      const newChild = await res.json();
      setChildren([...children, newChild]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (!confirm("Are you sure you want to remove this child?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/children/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete child");
      setChildren(children.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-700 to-pink-500">
      <Navbar />

      {/* Background softly visible */}
      <Image
        src="/child-login-background.png"
        alt="bg"
        fill
        className="object-cover opacity-25"
      />

      {/* Sparkles */}
      <span className="absolute top-28 left-20 text-yellow-200 text-2xl animate-pulse">✨</span>
      <span className="absolute top-44 right-24 text-yellow-300 text-xl animate-bounce">⭐</span>

      {/* Dashboard Container */}
      <div className="relative z-20 max-w-3xl mx-auto mt-16 mb-20 px-6 py-10 rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg mb-8">
          Parent Dashboard
        </h1>

        {/* Create Story Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push("/child-login")}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            ✨ Create a New Story
          </button>
        </div>

        {/* Add Child Form */}
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-md">
            <AddChildForm onAddChild={handleAddChild} />
          </div>
        </div>

        {/* Children List */}
        <h2 className="text-2xl text-center font-semibold text-white mt-5 mb-3">
          Your Children
        </h2>

        {loading ? (
          <p className="text-white text-center">Loading…</p>
        ) : children.length === 0 ? (
          <p className="text-white/80 text-center italic">No children added yet.</p>
        ) : (
          <ul className="space-y-4">
            {children.map((child) => (
              <li
                key={child._id}
                className="flex justify-between items-center bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-md border border-white/40"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/parent/child/${child._id}`)}
                >
                  <p className="text-xl font-semibold text-purple-800">{child.name}</p>
                  <p className="text-sm text-gray-700">Age: {child.age}</p>
                </div>

                <button
                  onClick={() => handleDeleteChild(child._id)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-500-600 shadow-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
