import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to dispatch OTP email via Brevo SMTP / API
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { email, username, otpCode, isPasswordReset } = req.body;

      if (!email || !otpCode) {
        return res.status(400).json({ success: false, message: "Email and OTP code are required." });
      }

      const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@elitelogs.net";
      const senderName = process.env.BREVO_SENDER_NAME || "Elite Logs Market";

      if (!brevoApiKey) {
        console.warn("⚠️ BREVO_API_KEY is missing from environment. Set BREVO_API_KEY in secrets for live emails.");
        return res.json({
          success: true,
          delivered: false,
          message: "OTP code generated! To deliver live emails to users, set BREVO_API_KEY in AI Studio Secrets.",
          otpCode: otpCode
        });
      }

      const emailSubject = isPasswordReset 
        ? `🔑 ${otpCode} - Password Reset Verification Code | Elite Logs Market`
        : `🔑 ${otpCode} - Elite Logs Market Email Verification Code`;

      const emailHeader = isPasswordReset ? "PASSWORD RESET REQUEST" : "SECURE ACCOUNT VERIFICATION";
      const emailBodyText = isPasswordReset
        ? "We received a request to reset the password for your Elite Logs Market account. Please enter the One-Time OTP code below to verify your identity and set a new password:"
        : "Your registration at Elite Logs Market requires email confirmation. Please enter the One-Time Verification OTP code below to activate your account:";

      // Call Brevo (Sendinblue) Transactional Email API v3
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: email,
              name: username || email.split("@")[0],
            },
          ],
          subject: emailSubject,
          htmlContent: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0b0f; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(212, 175, 55, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #FFD700; font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 2px;">ELITE LOGS MARKET</h1>
                <p style="color: #a0a0ab; font-size: 13px; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">${emailHeader}</p>
              </div>
              
              <div style="background-color: rgba(255,255,255,0.03); border-radius: 8px; padding: 20px; border-left: 3px solid #D4AF37; margin-bottom: 24px;">
                <p style="font-size: 15px; color: #e4e4e7; margin: 0 0 10px 0;">Hello <strong style="color: #FFD700;">${username || email.split("@")[0]}</strong>,</p>
                <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0;">${emailBodyText}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(255,215,0,0.05)); border: 2px solid #D4AF37; padding: 16px 40px; border-radius: 10px; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #FFD700; text-shadow: 0 0 12px rgba(255,215,0,0.5); box-shadow: 0 0 25px rgba(212, 175, 55, 0.25);">
                  ${otpCode}
                </div>
                <p style="color: #71717a; font-size: 12px; margin-top: 12px;">This code expires shortly. Do not share this OTP with anyone.</p>
              </div>

              <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              <p style="font-size: 11px; color: #52525b; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Elite Logs Market. Powered by Firebase Auth & Brevo SMTP API.</p>
            </div>
          `,
        }),
      });

      if (!brevoRes.ok) {
        const errorData = await brevoRes.json().catch(() => ({}));
        console.error("Brevo API Response Error:", errorData);
        return res.status(500).json({
          success: false,
          message: errorData.message || "Failed to send email via Brevo SMTP API.",
        });
      }

      const responseData = await brevoRes.json();
      return res.json({
        success: true,
        delivered: true,
        message: `OTP verification email dispatched to ${email} via Brevo SMTP!`,
        messageId: responseData.messageId
      });

    } catch (err: any) {
      console.error("Server OTP Dispatch Error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error while processing OTP email." });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
