import { useState } from "react";
import API from "../services/api";

export default function Home() {
  const [transcriptText, setTranscriptText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setTranscriptText(text);
  };

  const handleGenerate = async () => {
    if (!transcriptText || !customPrompt) return;
    setLoading(true);
    try {
      const res = await API.post("/api/summary/generate", { transcriptText, customPrompt });
      setSummary(res.data.summary || "");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) alert("Please login to generate a summary");
      else alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailRecipients || !summary) return;
    setEmailSending(true);
    try {
      await API.post("/api/email/send", { recipients: emailRecipients, summaryText: summary });
      alert("Email sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        AI Meeting Notes Summarizer & Sharer
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Upload Transcript (TXT)</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Or paste transcript</span>
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your meeting transcript here..."
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Custom Instruction</span>
            <input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              type="text"
              className="mt-1 block w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Summarize in bullet points for executives, highlight action items"
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !transcriptText || !customPrompt}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Summary"}
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700">Generated Summary (Editable)</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={18}
              className="mt-1 block w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your summary will appear here..."
            />
          </label>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="recipient1@example.com, recipient2@example.com"
              className="flex-1 rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendEmail}
              disabled={emailSending || !summary || !emailRecipients}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:opacity-50"
            >
              {emailSending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
