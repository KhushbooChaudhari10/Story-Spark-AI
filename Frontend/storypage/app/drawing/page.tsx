"use client";

import DrawingPad from "@/components/Drawingpad";

export default function DrawingPage() {
  // Function triggered when the user finishes their drawing
  // Can be extended later to save data or navigate to another route
  const handleComplete = () => {
    console.log("✅ Drawing completed!");
    // Example: Redirect to the story generation page after drawing is done
    // router.push("/story");
  };

  // Renders the interactive drawing component
  // The component receives a callback to handle completion events
  return <DrawingPad onComplete={handleComplete} />;
}
