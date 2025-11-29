"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ChildDrawingsPage() {
  const { childId } = useParams();
  const router = useRouter();

  const [drawings, setDrawings] = useState<any[]>([]);
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;

    // ✅ Fetch all drawings uploaded by a specific child
    fetch(`http://localhost:5000/api/upload/child/${childId}`)
      .then((res) => res.json())
      .then((data) => {
        // Store fetched drawings in state
        setDrawings(data.drawings || []);

        // Extract and display the child's name from the first drawing
        if (data.drawings?.length > 0) {
          setChildName(data.drawings[0]?.owner?.name || "Child");
        }
      })
      .catch(() => alert("⚠️ Error fetching drawings"))
      .finally(() => setLoading(false)); // Stop loading after API completes
  }, [childId]);

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      {/* 🔙 Back button to return to the parent dashboard */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-purple-700 underline"
      >
        ← Back to Dashboard
      </button>

      {/* 🖼️ Page title showing the child's name */}
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        🖼️ {childName ? `${childName}'s Drawings` : "Drawings"}
      </h1>

      {/* ⏳ Show loader while fetching data */}
      {loading ? (
        <p className="text-yellow-700">Loading drawings...</p>
      ) : drawings.length > 0 ? (
        // ✅ Display all drawings in a grid
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {drawings.map((d) => (
            <div key={d._id} className="bg-white p-2 shadow rounded">
              {/* 🖌️ Drawing image */}
              <img
                src={d.imageUrl}
                alt="Drawing"
                className="rounded-md mb-2 w-full h-auto"
              />

              {/* 🕓 Timestamp of creation */}
              <p className="text-xs text-gray-500">
                {new Date(d.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        // 🚫 Message when no drawings exist
        <p className="text-gray-600">No drawings found for this child.</p>
      )}
    </div>
  );
}
