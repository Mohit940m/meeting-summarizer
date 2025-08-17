const mongoose = require("mongoose");


const transcriptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  transcript: { type: String, required: true },
  prompt: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transcript", transcriptSchema);