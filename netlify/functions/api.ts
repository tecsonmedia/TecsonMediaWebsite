import express, { Router } from "express";
import serverless from "serverless-http";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = Router();

app.use(express.json());

// Email transporter setup (same as server.ts)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", env: "netlify-function" });
});

// Booking Confirmation API
router.post("/booking/confirm", async (req, res) => {
  const { name, email, phone, address, propertyType, dateTime } = req.body;
  console.log(`[Booking] New request from ${name} (${email})`);

  try {
    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@tecsonmedia.com",
      to: "ptecsonmedia@gmail.com",
      subject: `New Booking Request: ${name}`,
      text: `
        New Booking Details:
        -------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Property Type: ${propertyType}
        Address: ${address}
        Preferred Date/Time: ${dateTime}
      `,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
          <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Property Type:</strong> ${propertyType}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Preferred Date/Time:</strong> ${dateTime}</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666;">
            Sent via Tecson Media Automated Booking System
          </div>
        </div>
      `,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Booking confirmed and email sent." });
    } else {
      console.warn("[Booking] SMTP credentials missing on Netlify.");
      res.json({ 
        success: true, 
        message: "Booking received! (Note: SMTP not configured in Netlify Environment Variables)." 
      });
    }
  } catch (error) {
    console.error("[Booking] Error processing confirmation:", error);
    res.status(500).json({ 
      error: "Failed to process booking confirmation",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.use("/api", router);

export const handler = serverless(app);
