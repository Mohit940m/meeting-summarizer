const express = require("express");
const SibApiV3Sdk = require("sib-api-v3-sdk");


const router = express.Router();

// Configure Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Route: Send summary email
router.post("/send", async (req, res) => {
  const { recipients, summaryText } = req.body;

  if (!recipients || !summaryText) {
    return res.status(400).json({ error: "Recipients and summary text required" });
  }

  try {
    // Construct email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Meeting Summarizer", email: "noreply@yourdomain.com" };
    sendSmtpEmail.to = recipients.split(",").map((email) => ({ email: email.trim() }));
    sendSmtpEmail.subject = "AI-Generated Meeting Summary";
    sendSmtpEmail.htmlContent = `<html><body><pre>${summaryText}</pre></body></html>`;

    // Send email via Brevo
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.json({ success: true, message: "Email sent successfully!", data });
  } catch (error) {
    console.error("Brevo API error:", error.message);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

module.exports = router;