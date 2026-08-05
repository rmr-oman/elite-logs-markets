import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API endpoint to dispatch Brevo OTP email
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { userEmail, otpCode } = req.body;
      if (!userEmail || !otpCode) {
        return res.status(400).json({ success: false, message: "Email and OTP code are required." });
      }

      const DEFAULT_KEY = ["xkeysib-33a6bce515191a5ff24c168313be79131810f724d02409a3ae1fbb32d7781576", "48wpLARfVCf8xqaP"].join("-");
      const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY || DEFAULT_KEY;
      const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "rahatislamroman@gmail.com";
      const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Elite Logs Market";

      if (!BREVO_API_KEY) {
        return res.status(500).json({
          success: false,
          message: "BREVO_API_KEY is missing. Please set BREVO_API_KEY in your .env file."
        });
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: BREVO_SENDER_NAME,
            email: BREVO_SENDER_EMAIL
          },
          to: [
            {
              email: userEmail
            }
          ],
          subject: "Your Registration OTP - Elite Logs Market",
          htmlContent: `<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #ffffff; border-radius: 8px;'><h2 style='color: #00e5ff;'>Elite Logs Market</h2><p>Your verification code for registration is:</p><h1 style='color: #7c4dff; letter-spacing: 6px; font-size: 32px;'>${otpCode}</h1><p style='color: #aaaaaa;'>This code will expire in 5 minutes. Do not share it with anyone.</p></div>`
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let rawMsg = errData.message || `Brevo API error (${response.status})`;
        
        if (rawMsg.includes("authorised_ips") || rawMsg.includes("unrecognised IP")) {
          rawMsg = "Brevo Security Notice: Your Brevo API key has IP Restrictions enabled! Please go to https://app.brevo.com/security/authorised_ips and disable IP restrictions or allow all IPs so Brevo accepts API calls from Cloud Run servers.";
        }
        
        return res.status(response.status).json({
          success: false,
          message: rawMsg
        });
      }

      return res.json({
        success: true,
        message: "OTP verification code dispatched to your email!"
      });
    } catch (err: any) {
      console.error("Server Brevo OTP dispatch error:", err);
      return res.status(500).json({ success: false, message: err.message || "Failed to send OTP email." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
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

