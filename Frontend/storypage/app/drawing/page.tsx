"use client";

import DrawingPad from "@/components/Drawingpad";

export default function DrawingPage() {
<<<<<<< HEAD
  // Function triggered when the user finishes their drawing
  // Can be extended later to save data or navigate to another route
  const handleComplete = () => {
    console.log("✅ Drawing completed!");
    // Example: Redirect to the story generation page after drawing is done
    // router.push("/story");
  };

  // Renders the interactive drawing component
  // The component receives a callback to handle completion events
=======
  const handleComplete = () => {
    console.log("✅ Drawing completed!");
    // Optionally redirect to next step
    // router.push("/story");
  };

>>>>>>> 0301f8c5a6f0d363810d59767325b43dbc9658ad
  return <DrawingPad onComplete={handleComplete} />;
}
