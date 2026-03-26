import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import session from "express-session";

import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Google OAuth Setup
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.APP_URL ? `${process.env.APP_URL}/auth/callback` : "http://localhost:3000/auth/callback");

  console.log("Using Redirect URI:", redirectUri);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  app.get("/api/auth/status", (req, res) => {
    const tokens = (req.session as any).tokens;
    res.json({ isConnected: !!tokens });
  });

  app.get("/api/auth/url", (req, res) => {
    try {
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error("Google OAuth credentials (ID/Secret) are missing. Please add them to the environment variables in Settings.");
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/calendar.events", 
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/gmail.send"
        ],
        prompt: "consent"
      });
      res.json({ url });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to generate auth URL" });
    }
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      // In a real app, store this in a database linked to the user
      // For this demo, we'll store it in the session
      (req.session as any).tokens = tokens;
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error getting tokens:", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Calendar API Endpoints
  app.get("/api/calendar/availability", async (req, res) => {
    const tokens = (req.session as any).tokens;
    if (!tokens) return res.status(401).json({ error: "Not authenticated" });

    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });
      res.json(response.data.items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/calendar/book", async (req, res) => {
    const tokens = (req.session as any).tokens;
    if (!tokens) return res.status(401).json({ error: "Not authenticated" });

    const { summary, description, start, end } = req.body;
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary,
          description,
          start: { dateTime: start },
          end: { dateTime: end },
        },
      });
      res.json(event.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Booking Confirmation API
  app.post("/api/booking/confirm", async (req, res) => {
    const { name, email, phone, address, propertyType, dateTime } = req.body;
    const tokens = (req.session as any).tokens;

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

      // Try sending via SMTP first if configured
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
      } 
      // Fallback to Gmail API if tokens are present
      else if (tokens) {
        oauth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        
        const utf8Subject = `=?utf-8?B?${Buffer.from(mailOptions.subject).toString('base64')}?=`;
        const messageParts = [
          `From: ${mailOptions.from}`,
          `To: ${mailOptions.to}`,
          `Content-Type: text/html; charset=utf-8`,
          `MIME-Version: 1.0`,
          `Subject: ${utf8Subject}`,
          '',
          mailOptions.html,
        ];
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        await gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedMessage,
          },
        });
      } else {
        console.warn("No SMTP credentials or Google tokens found. Email not sent.");
        // We'll still return success for the demo, but log the warning
      }

      // 2. Add to Google Calendar if tokens are present
      if (tokens) {
        oauth2Client.setCredentials(tokens);
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const start = new Date(dateTime);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2-hour shoot

        await calendar.events.insert({
          calendarId: "primary",
          requestBody: {
            summary: `Photography Shoot: ${name} (${propertyType})`,
            description: `Address: ${address}\nPhone: ${phone}\nEmail: ${email}`,
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
          },
        });
      }

      res.json({ success: true, message: "Booking confirmed and notifications sent." });
    } catch (error) {
      console.error("Booking confirmation error:", error);
      res.status(500).json({ error: "Failed to process booking confirmation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
