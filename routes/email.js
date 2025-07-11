const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { to, subject, message, name } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Original email from client to you
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email address
      subject: `Portfolio Contact: ${subject}`,
      text: `From: ${name} (${to})\n\nMessage: ${message}`,
      html: `<p><strong>From:</strong> ${name} (${to})</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`
    };

    // Auto-reply email to the client
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Thank you for your message! [CyberTech Portfolio]",
      html: `
        <div style="background-color: #0a0e17; color: #00b4d8; font-family: 'Arial', sans-serif; padding: 20px; border-radius: 10px; border: 1px solid #00b4d8; box-shadow: 0 0 15px #00b4d8;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #00b4d8; text-shadow: 0 0 5px #00b4d8;">TRANSMISSION RECEIVED</h1>
            <div style="height: 2px; background: linear-gradient(to right, transparent, #00b4d8, transparent); margin: 15px auto;"></div>
          </div>
          
          <p style="color: #7ae7ff; margin-bottom: 15px;">Hello <span style="color: #ffffff; font-weight: bold;">${name}</span>,</p>
          
          <p style="color: #7ae7ff; margin-bottom: 15px;">Thank you for reaching out through my portfolio. Your message has been successfully received and logged into my system.</p>
          
          <p style="color: #7ae7ff; margin-bottom: 15px;">I'll review your inquiry and respond as soon as possible. Typically, you can expect to hear back from me within 24-48 hours.</p>
          
          <div style="background-color: #091428; border-left: 3px solid #00b4d8; padding: 15px; margin: 20px 0; color: #ffffff;">
            <p style="margin: 0;">// Message details:</p>
            <p style="margin: 5px 0;">// Subject: ${subject}</p>
            <p style="margin: 0;">// Timestamp: ${new Date().toISOString()}</p>
          </div>
          
          <p style="color: #7ae7ff; margin-bottom: 15px;">Until then, feel free to explore more of my portfolio.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <div style="height: 1px; background: linear-gradient(to right, transparent, #00b4d8, transparent); margin: 15px auto;"></div>
            <p style="color: #00b4d8; font-size: 12px;">This is an automated response. Please do not reply to this email.</p>
            <p style="color: #00b4d8; font-weight: bold;">[Your Portfolio Name]</p>
          </div>
        </div>
      `
    };

    // Send original email to you
    await transporter.sendMail(mailOptions);
    
    // Send auto-reply to the client
    await transporter.sendMail(autoReplyOptions);
    
    res.status(200).json({ message: "Message received and confirmation sent!" });
  } catch (error) {
    console.error("Error processing emails:", error);
    res.status(500).json({ error: "Failed to process emails" });
  }
});

module.exports = router;
