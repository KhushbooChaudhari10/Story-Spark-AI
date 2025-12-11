"use client";
import { useEffect, useState } from "react";

export default function StoryLoading() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function triggerStory() {
      const childId = localStorage.getItem("childId");
      const drawingUrl = localStorage.getItem("drawingUrl");
      const audioPrompt = localStorage.getItem("audioPrompt");

      if (!childId) return alert("No child selected");

      // 📌 If audio exists → PRIORITY = AUDIO
      let payload: any = { childId };

      if (audioPrompt) {
        payload.audioPrompt = audioPrompt;
        console.log("🎤 Using audio prompt for story...");
      } else if (drawingUrl) {
        payload.drawingUrl = drawingUrl;
        console.log("🖼 Using drawing for story...");
      } else {
        return alert("No drawing or audio prompt found!");
      }

      // 🧹 Clear old story
      localStorage.removeItem("storybook");
      localStorage.removeItem("storyId");

      try {
        await fetch("https://practice10.app.n8n.cloud/webhook/create-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        console.log("📨 Story Creation Trigger Sent!");
      } catch (err) {
        console.error("Fetch failed:", err);
        alert("Server unreachable, check n8n status!");
      }
    }

    triggerStory();

    // 🔁 Now we START polling DB every 3 seconds
    const interval = setInterval(async () => {
      const childId = localStorage.getItem("childId");
      if (!childId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/story/child/${childId}`);
        const data = await res.json();

        if (
          data?.storyData?.pages?.length > 0 &&
          data.storyData.pages.every(
            (p: any) =>
              p.background_url &&
              p.background_url.startsWith("http") &&
              !p.background_url.includes("Error") &&         
              p.narration_url &&
              p.narration_url.startsWith("http") &&
              (p.narration_url.endsWith(".mp3") || p.narration_url.endsWith(".wav"))              
          )
        )
  {
          // ⬇️  🟢 SAVE ONLY storyData (not full mongo document)
          localStorage.setItem("storybook", JSON.stringify({
            title: data.title,
            pages: data.storyData.pages
          }));

          localStorage.setItem("storyId", data._id);

          clearInterval(interval);
          window.location.href = "/view-story";
        }
      } catch (err) {
        console.log("Waiting for story...");
      }
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl">✨ Your Story is Being Created...</h1>
      <p>Please wait...</p>
    </div>
  );
}
