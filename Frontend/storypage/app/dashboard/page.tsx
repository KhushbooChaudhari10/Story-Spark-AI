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
<<<<<<< HEAD
    // Retrieves the user's Firebase ID token and fetches their associated children
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
    const fetchTokenAndChildren = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      setToken(idToken);
      await fetchChildren(idToken);
    };

    fetchTokenAndChildren();
  }, []);

<<<<<<< HEAD
  // Fetches the list of children from the backend using the user's ID token for authentication
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
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

<<<<<<< HEAD
  // Handles adding a new child to the parent's profile through a POST request
=======
  // 👩‍👧 Handle new child added from form
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
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

<<<<<<< HEAD
  // Handles deleting a child entry after confirmation
  // Updates the state locally to remove the deleted child
=======
  // 🗑️ Handle delete child
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
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
<<<<<<< HEAD
    // Main dashboard layout for parents
    // Displays existing children and includes form for adding new ones
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Parent Dashboard</h1>

      {/* Reusable component for adding new child entries */}
=======
    <div className="min-h-screen bg-purple-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Parent Dashboard</h1>

      {/* ✅ Use Reusable Component */}
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
      <AddChildForm onAddChild={handleAddChild} />

      <div className="w-80">
        {loading ? (
<<<<<<< HEAD
          // Loading state while fetching data
          <p>Loading...</p>
        ) : children.length === 0 ? (
          // Message shown when no children are registered yet
          <p className="text-gray-600 text-center">No children added yet.</p>
        ) : (
          // Render a list of children with action options
=======
          <p>Loading...</p>
        ) : children.length === 0 ? (
          <p className="text-gray-600 text-center">No children added yet.</p>
        ) : (
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
          <ul className="space-y-3">
            {children.map((child) => (
              <li
                key={child._id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <div>
<<<<<<< HEAD
                  {/* Clickable name to navigate to child-specific dashboard */}
                  <p
                    className="font-semibold text-purple-700 cursor-pointer hover:underline"
                    onClick={() => router.push(`/parent/child/${child._id}`)}
=======
                  <p
                    className="font-semibold text-purple-700 cursor-pointer hover:underline"
                    onClick={() => router.push(`/parent/child/${child._id}`)} // 👈 Updated
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
                  >
                    {child.name}
                  </p>
                  <p className="text-sm text-gray-600">Age: {child.age}</p>
                </div>
<<<<<<< HEAD

                {/* Button for deleting a child record */}
=======
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
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
