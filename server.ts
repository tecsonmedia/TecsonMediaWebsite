import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import session from "express-session";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        scope: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar.readonly"],
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
