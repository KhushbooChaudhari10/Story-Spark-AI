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

    // ✅ Fetch the child's drawings
    fetch(`http://localhost:5000/api/upload/child/${childId}`)
      .then((res) => res.json())
      .then((data) => {
        setDrawings(data.drawings || []);
        if (data.drawings?.length > 0) {
          setChildName(data.drawings[0]?.owner?.name || "Child");
        }
      })
      .catch(() => alert("Error fetching drawings"))
      .finally(() => setLoading(false));
  }, [childId]);

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 text-purple-700 underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        🖼️ {childName ? `${childName}'s Drawings` : "Drawings"}
      </h1>

      {loading ? (
        <p className="text-yellow-700">Loading drawings...</p>
      ) : drawings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {drawings.map((d) => (
            <div key={d._id} className="bg-white p-2 shadow rounded">
              <img
                src={d.imageUrl}
                alt="Drawing"
                className="rounded-md mb-2 w-full h-auto"
              />
              <p className="text-xs text-gray-500">
                {new Date(d.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No drawings found for this child.</p>
      )}
    </div>
  );
}
