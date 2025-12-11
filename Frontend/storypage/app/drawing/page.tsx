"use client";

import Drawingpad from "@/components/Drawingpad";

export default function DrawingPage() {
  // Function triggered when the user finishes their drawing
  // Can be extended later to save data or navigate to another route
  const handleComplete = () => {
    window.location.href = "/story-loading";

    // Example: Redirect to the story generation page after drawing is done
    // router.push("/story");
  };

  // Renders the interactive drawing component
  // The component receives a callback to handle completion events
  return <Drawingpad onComplete={handleComplete} />;
}
