<<<<<<< HEAD
// "use client";
// import { useEffect, useState } from "react";

// // 🧩 Type definition for a drawing object
// interface Drawing {
//   _id: string;
//   imageUrl: string;
//   createdAt: string;
//   owner?: {
//     name?: string;
//     age?: number;
//   };
// }

// export default function ParentDrawingsPage() {
//   // ✅ State variables to manage data, loading, and error states
//   const [drawings, setDrawings] = useState<Drawing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // 🧒 Retrieve the currently selected child's ID from local storage
//     const childId = localStorage.getItem("childId");

//     // 🚨 Handle case where no child is selected
//     if (!childId) {
//       setError("No child selected. Please go back to dashboard.");
//       setLoading(false);
//       return;
//     }

//     // 📦 Fetch all drawings created by the selected child from backend
//     fetch(`http://localhost:5000/api/upload/child/${childId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // ⚠️ Handle backend message if no drawings are available
//         if (data.message && data.message.includes("No drawings")) {
//           setError("No drawings found for this child.");
//         } else {
//           // ✅ Store retrieved drawings in state
//           setDrawings(data.drawings || []);
//         }
//       })
//       .catch(() => setError("Error fetching drawings")) // ❌ Network or server error
//       .finally(() => setLoading(false)); // ⏳ Stop loading indicator
//   }, []);

//   // ⏳ Show loading state
//   if (loading) return <p className="p-6">Loading...</p>;

//   // ❌ Show error message if any issue occurs
//   if (error) return <p className="p-6 text-red-600">{error}</p>;

//   return (
//     <div className="p-6 bg-yellow-100 min-h-screen">
//       {/* 🖼️ Title showing the child's name if available */}
//       <h1 className="text-3xl font-bold text-yellow-700 mb-6">
//         🖼️{" "}
//         {drawings[0]?.owner?.name
//           ? `${drawings[0].owner.name}'s Drawings`
//           : "Child's Drawings"}
//       </h1>

//       {/* 🎨 Display all drawings in a responsive grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {drawings.map((d) => (
//           <div key={d._id} className="bg-white p-2 shadow rounded">
//             {/* 🖌️ Drawing image */}
//             <img
//               src={d.imageUrl}
//               alt={d.owner?.name || "Drawing"}
//               className="rounded-md mb-2"
//             />

//             {/* 👤 Child name (optional) */}
//             <p className="font-semibold text-sm">{d.owner?.name}</p>

//             {/* 🕓 Timestamp of when drawing was uploaded */}
//             <p className="text-xs text-gray-500">
//               {new Date(d.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
=======
"use client";
import { useEffect, useState } from "react";

interface Drawing {
  _id: string;
  imageUrl: string;
  createdAt: string;
  owner?: {
    name?: string;
    age?: number;
  };
}

export default function ParentDrawingsPage() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const childId = localStorage.getItem("childId");
    if (!childId) {
      setError("No child selected. Please go back to dashboard.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/upload/child/${childId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message && data.message.includes("No drawings")) {
          setError("No drawings found for this child.");
        } else {
          setDrawings(data.drawings || []);
        }
      })
      .catch(() => setError("Error fetching drawings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-yellow-100 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        🖼️ {drawings[0]?.owner?.name
          ? `${drawings[0].owner.name}'s Drawings`
          : "Child's Drawings"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {drawings.map((d) => (
          <div key={d._id} className="bg-white p-2 shadow rounded">
            <img
              src={d.imageUrl}
              alt={d.owner?.name || "Drawing"}
              className="rounded-md mb-2"
            />
            <p className="font-semibold text-sm">{d.owner?.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(d.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
