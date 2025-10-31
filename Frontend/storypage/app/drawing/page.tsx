"use client";

import DrawingPad from "@/components/Drawingpad";

export default function DrawingPage() {
  const handleComplete = () => {
    console.log("✅ Drawing completed!");
    // Optionally redirect to next step
    // router.push("/story");
  };

  return <DrawingPad onComplete={handleComplete} />;
}
