export const BREVO_API_KEY = (import.meta as any).env?.VITE_BREVO_API_KEY || (import.meta as any).env?.BREVO_API_KEY || "";

export async function sendOTPEmail(userEmail: string, otpCode: string): Promise<{ success: boolean; message: string }> {
  // Primary secure method: Dispatch via backend server endpoint
  try {
    const serverRes = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, otpCode })
    });
    const serverData = await serverRes.json();
    if (serverData.success) {
      return serverData;
    } else {
      console.warn("Server API OTP dispatch failed, attempting direct Brevo API...", serverData.message);
    }
  } catch (err) {
    console.warn("Server API unreachable, attempting direct Brevo API fallback...", err);
  }

  // Fallback direct Brevo API call if server is unreachable
  if (!BREVO_API_KEY) {
    return {
      success: false,
      message: "BREVO_API_KEY is not configured in client environment."
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Elite Logs Market",
          email: "rahatislamroman@gmail.com"
        },
        to: [
          {
            email: userEmail
          }
        ],
        subject: "Your Registration OTP - Elite Logs Market",
        htmlContent: "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #121212; color: #ffffff; border-radius: 8px;'><h2 style='color: #00e5ff;'>Elite Logs Market</h2><p>Your verification code for registration is:</p><h1 style='color: #7c4dff; letter-spacing: 6px; font-size: 32px;'>"+otpCode+"</h1><p style='color: #aaaaaa;'>This code will expire in 5 minutes. Do not share it with anyone.</p></div>"
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errData.message || `Brevo API error (${response.status}): ${response.statusText}`
      };
    }

    return {
      success: true,
      message: "OTP verification code dispatched to your email!"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send OTP email due to network error."
    };
  }
}
