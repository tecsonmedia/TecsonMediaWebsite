// Tecson Media - Real Estate Photography v1.0.1
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";

import nodemailer from "nodemailer";

dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set('trust proxy', 1);
  app.use(express.json());
  
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      env: process.env.NODE_ENV,
      time: new Date().toISOString(),
      cwd: process.cwd()
    });
  });

  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || "tecsonmedia-secret",
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: { 
      secure: true, 
      sameSite: 'none',
      httpOnly: true 
    }
  }));

  // Booking Confirmation API
  app.post("/api/booking/confirm", async (req, res) => {
    const { name, email, phone, address, propertyType, dateTime } = req.body;
    console.log(`[Booking] New request from ${name} (${email})`);

    try {
      // 1. Send Email to Admin
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

      // Try sending via SMTP if configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        console.log("[Booking] Attempting to send email via SMTP...");
        await transporter.sendMail(mailOptions);
        console.log("[Booking] Email sent successfully.");
        res.json({ success: true, message: "Booking confirmed and email sent." });
      } else {
        console.warn("[Booking] SMTP credentials missing. Email not sent.");
        console.log("[Booking] Details:", { name, email, phone, address, propertyType, dateTime });
        res.json({ 
          success: true, 
          message: "Booking received! (Note: SMTP not configured, check server logs for details)." 
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Running in DEVELOPMENT mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Running in PRODUCTION mode");
    const distPath = path.join(process.cwd(), "dist");
    console.log(`[Server] Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global error handler caught:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
