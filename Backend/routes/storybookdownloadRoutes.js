const express = require("express");
const Storybook = require("../models/Storybook");
const fetch = global.fetch;
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const router = express.Router();

router.get("/download/:id", async (req, res) => {
  try {
    // 1️⃣ Fetch storybook from DB
    const storybook = await Storybook.findById(req.params.id);
    if (!storybook) {
      return res.status(404).json({ message: "Storybook not found" });
    }

    // 2️⃣ Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // ===============================
    // 📌 COVER PAGE
    // ===============================
    const coverPage = pdfDoc.addPage([600, 800]);

    coverPage.drawText(
      storybook.title || "Your Magical Storybook",
      {
        x: 60,
        y: 700,
        size: 36,
        font,
        color: rgb(0.3, 0.1, 0.5),
      }
    );

    coverPage.drawText("By Story Spark AI ", {
      x: 60,
      y: 650,
      size: 18,
      font,
      color: rgb(0.4, 0.2, 0.6),
    });

    // ===============================
    // 📌 STORY PAGES (SAFE LOOP)
    // ===============================
    const pages = storybook.storyData?.pages || [];

    for (const page of pages) {
      // Skip invalid pages safely
      if (
        !page.background_url ||
        !page.background_url.startsWith("http")
      ) {
        console.warn("⚠️ Skipping invalid background:", page.background_url);
        continue;
      }

      try {
        const pdfPage = pdfDoc.addPage([600, 800]);

        // Fetch image
        const imgRes = await fetch(page.background_url);
        const contentType = imgRes.headers.get("content-type");
        const imgBytes = await imgRes.arrayBuffer();

        // Handle JPG / PNG safely
        let image;
        if (contentType && contentType.includes("png")) {
          image = await pdfDoc.embedPng(imgBytes);
        } else {
          image = await pdfDoc.embedJpg(imgBytes);
        }

        // Draw image
        pdfPage.drawImage(image, {
          x: 50,
          y: 350,
          width: 500,
          height: 350,
        });

        // Draw text
        pdfPage.drawText(page.text || "", {
          x: 60,
          y: 300,
          size: 14,
          font,
          color: rgb(0.2, 0.1, 0.3),
          maxWidth: 480,
          lineHeight: 16,
        });

      } catch (imgErr) {
        // ⚠️ One bad image should NOT kill PDF
        console.error("❌ Image processing failed:", imgErr);
        continue;
      }
    }

    // ===============================
    // 📌 SEND FINAL PDF
    // ===============================
    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="storybook.pdf"'
    );

    return res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error("❌ PDF generation error:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
});

module.exports = router;
