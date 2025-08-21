
const express = require("express");
const axios = require("axios");
const Transcript = require("../models/Transcript");
const checkJwt = require("../middleware/auth");

const router = express.Router();

// Generate summary using Gemini
router.post("/generate", checkJwt, async (req, res) => {
  const { transcriptText, customPrompt } = req.body;

  if (!transcriptText || !customPrompt) {
    return res.status(400).json({ error: "Transcript and prompt are required" });
  }

  try {
    // Call Gemini API
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              { text: `Transcript:\n${transcriptText}\n\nInstruction: ${customPrompt}` },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated";

    // Save in MongoDB linked to logged-in user
    const userId = req.user?.id;
    if (userId) {
      const newTranscript = new Transcript({
        userId,
        transcript: transcriptText,
        prompt: customPrompt,
        summary,
      });
      await newTranscript.save();
    }

    res.json({ success: true, summary });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ success: false, error: "Failed to generate summary" });
  }
});

module.exports = router;
