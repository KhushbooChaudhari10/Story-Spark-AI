"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { auth } from "@/firebaseConfig";
import AddChildForm from "@/components/AddChildForm";

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
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
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

  // 👩‍👧 Handle new child added from form
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

  // 🗑️ Handle delete child
  const handleDeleteChild = async (id: string) => {
    if (!confirm("Are you sure you want to delete this child?")) return;
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
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Parent Dashboard</h1>

      {/* ✅ Use Reusable Component */}
      <AddChildForm onAddChild={handleAddChild} />

      <div className="w-80">
        {loading ? (
          <p>Loading...</p>
        ) : children.length === 0 ? (
          <p className="text-gray-600 text-center">No children added yet.</p>
        ) : (
          <ul className="space-y-3">
            {children.map((child) => (
              <li
                key={child._id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <div>
                  <p
                    className="font-semibold text-purple-700 cursor-pointer hover:underline"
                    onClick={() => router.push(`/parent/child/${child._id}`)} // 👈 Updated
                  >
                    {child.name}
                  </p>
                  <p className="text-sm text-gray-600">Age: {child.age}</p>
                </div>
                <button
                  onClick={() => handleDeleteChild(child._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
