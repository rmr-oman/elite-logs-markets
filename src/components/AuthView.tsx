import React, { useState } from "react";
import { useAppState } from "../state";
import { EliteLogo } from "./EliteLogo";
import { LogIn, UserPlus, Mail, Lock, User, Sparkles, Shield, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff, Key, RefreshCw } from "lucide-react";

export const AuthView: React.FC = () => {
  const { loginUser, registerUser, loginWithGoogle, verifyUserOtp, resendUserOtp, requestPasswordResetOtp, verifyResetOtp, resetPasswordWithOtp, setView } = useAppState();
  const [mode, setMode] = useState<"login" | "register" | "forgot_password">("login");

  // Password Reset states
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetEmailInput, setResetEmailInput] = useState("");
  const [resetTargetEmail, setResetTargetEmail] = useState("");
  const [resetOtpInput, setResetOtpInput] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Password Reset rules validation
  const resetHasMinLength = resetNewPassword.length >= 8;
  const resetHasMixedCase = /[a-z]/.test(resetNewPassword) && /[A-Z]/.test(resetNewPassword);
  const resetHasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(resetNewPassword);
  const resetPasswordsMatch = resetNewPassword.length > 0 && resetNewPassword === resetConfirmPassword;

  // OTP Verification state
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        if (res.isAdmin) {
          window.location.href = "/admin.html";
        } else {
          setView("home");
        }
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };
  
  // Fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Statuses
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password rules validation helpers
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.requiresOtp) {
      // User account exists but is not verified yet
      setOtpEmail(res.email || email.trim());
      setIsOtpMode(true);
      setOtpError("Your account requires OTP verification before logging in. Please enter the 6-digit code sent to your email.");
      return;
    }

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        if (res.isAdmin) {
          window.location.href = "/admin.html";
        } else {
          setView("home");
        }
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    
    if (!hasMinLength) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (!hasMixedCase || !hasNumberOrSymbol) {
      setErrorMsg("Password must contain uppercase, lowercase letters, and at least one number or special character.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password and Confirm Password do not match.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    const res = await registerUser(username, email, password, referralCode || undefined);
    setIsLoading(false);

    if (res.success) {
      // Registration complete - navigate to verification notice mode
      setOtpEmail(res.email || email.trim());
      setIsOtpMode(true);
      setOtpSuccess(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResendOtp = async () => {
    setIsOtpVerifying(true);
    setOtpError(null);
    setOtpSuccess(null);

    const res = await resendUserOtp(otpEmail);
    setIsOtpVerifying(false);

    if (res.success) {
      setOtpSuccess(res.message);
    } else {
      setOtpError(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length < 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsOtpVerifying(true);
    setOtpError(null);
    setOtpSuccess(null);

    const res = await verifyUserOtp(otpEmail, otpInput.trim());
    setIsOtpVerifying(false);

    if (res.success) {
      setOtpSuccess(res.message);
      setTimeout(() => {
        setIsOtpMode(false);
        setView("home");
      }, 1500);
    } else {
      setOtpError(res.message);
    }
  };

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailInput.trim()) {
      setErrorMsg("Please enter your registered email address or username.");
      return;
    }
    setIsResetLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await requestPasswordResetOtp(resetEmailInput.trim());
    setIsResetLoading(false);

    if (res.success) {
      setResetTargetEmail(res.email || resetEmailInput.trim());
      setResetStep(2);
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpInput.trim() || resetOtpInput.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsResetLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await verifyResetOtp(resetTargetEmail, resetOtpInput.trim());
    setIsResetLoading(false);

    if (res.success) {
      setResetStep(3);
      setSuccessMsg(res.message + " Please enter your new password below.");
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetHasMinLength) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }
    if (!resetHasMixedCase || !resetHasNumberOrSymbol) {
      setErrorMsg("New password must contain uppercase, lowercase letters, and at least one number or special character.");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMsg("New password and Confirm password do not match.");
      return;
    }

    setIsResetLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await resetPasswordWithOtp(resetTargetEmail, resetOtpInput.trim(), resetNewPassword);
    setIsResetLoading(false);

    if (res.success) {
      setSuccessMsg(res.message + " Redirecting to login...");
      setTimeout(() => {
        setEmail(resetTargetEmail);
        setPassword("");
        setMode("login");
        setResetStep(1);
        setResetOtpInput("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setSuccessMsg("Password reset successfully! Please log in with your new password.");
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResendResetOtp = async () => {
    setIsResetLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await requestPasswordResetOtp(resetTargetEmail);
    setIsResetLoading(false);

    if (res.success) {
      setSuccessMsg(`A new password reset OTP code has been dispatched to ${resetTargetEmail}.`);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8" id="auth-container">
      {/* Back Button */}
      <button
        onClick={() => setView("home")}
        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Storefront
      </button>

      {/* Auth Card */}
      <div className="glass-card p-8 rounded-sm border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"></div>
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <EliteLogo className="w-16 h-16 mx-auto" />
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-wider text-white">
              {isOtpMode 
                ? "EMAIL OTP VERIFICATION" 
                : mode === "forgot_password"
                  ? "RESET YOUR PASSWORD"
                  : mode === "login" 
                    ? "Elite Cyber Access" 
                    : "Create Elite Account"}
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold mt-0.5">
              Elite Logs Market
            </p>
          </div>
          <p className="text-xs text-white/40">
            {isOtpMode
              ? `Account registration submitted! Enter the 6-digit OTP code sent to ${otpEmail}`
              : mode === "forgot_password"
                ? resetStep === 1
                  ? "Enter your registered email address or username to receive a 6-digit password reset OTP code"
                  : resetStep === 2
                    ? `Enter the 6-digit OTP verification code sent to ${resetTargetEmail}`
                    : `Choose a new strong password for ${resetTargetEmail}`
                : mode === "login" 
                  ? "Provide your authorization credentials to unlock your profile" 
                  : "Register below to secure high-speed automated checkout and digital balance loading"}
          </p>
        </div>

        {/* EMAIL VERIFICATION OTP VIEW */}
        {isOtpMode ? (
          <div className="space-y-5 font-mono">
            {otpError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="bg-neon-green/10 border border-neon-green/20 text-neon-green p-3 rounded-sm text-xs flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{otpSuccess}</span>
              </div>
            )}

            {/* Email OTP Banner */}
            <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neon-blue">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>EMAIL OTP DISPATCHED</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider bg-neon-blue/20 px-2 py-0.5 rounded font-mono">
                  Brevo REST API
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                A 6-digit registration OTP code has been sent to <strong className="text-white">{otpEmail}</strong>. Code expires in 5 minutes.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/30">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue focus:outline-none py-2.5 pl-9 pr-3 text-sm font-mono text-white text-center tracking-[0.3em] font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isOtpVerifying || otpInput.length < 6}
                className="w-full py-2.5 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-md cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
              >
                {isOtpVerifying ? "VERIFYING OTP..." : "VERIFY OTP & COMPLETE REGISTRATION"}
              </button>
            </form>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isOtpVerifying}
                className="w-full py-2.5 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-neon-blue hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isOtpVerifying ? "animate-spin" : ""}`} />
                <span>Resend OTP Code to Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(false);
                  setMode("register");
                  setOtpError(null);
                  setOtpSuccess(null);
                  setOtpInput("");
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
              >
                ← Back to Registration
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Alert Messages */}
            {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-sm text-xs flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMsg(null)}
                  className="text-red-400 hover:text-white transition-colors text-xs font-bold shrink-0 ml-1 cursor-pointer"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 bg-neon-green/10 border border-neon-green/20 text-neon-green p-3 rounded-sm text-xs flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccessMsg(null)}
                  className="text-neon-green hover:text-white transition-colors text-xs font-bold shrink-0 ml-1 cursor-pointer"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Google One-Click Sign In (Hidden during Password Reset) */}
            {mode !== "forgot_password" && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{mode === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
                </button>

                <div className="relative my-5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <span className="relative bg-[#0E0E12] px-3 text-[10px] uppercase font-mono text-white/40 tracking-widest">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>
            )}

            {/* Auth Forms */}
            {mode === "forgot_password" ? (
              resetStep === 1 ? (
                /* STEP 1: Enter Email/Username */
                <form onSubmit={handleRequestResetOtp} className="space-y-4 font-mono">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                      Registered Email Address or Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-white/30">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={resetEmailInput}
                        onChange={(e) => setResetEmailInput(e.target.value)}
                        placeholder="Enter your email address or username"
                        className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-9 pr-3 text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isResetLoading}
                    className="w-full py-2.5 bg-neon-blue hover:bg-neon-blue/90 text-black font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-md cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                  >
                    {isResetLoading ? "Sending Reset Code..." : "SEND RESET OTP CODE"}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back to Login Screen
                    </button>
                  </div>
                </form>
              ) : resetStep === 2 ? (
                /* STEP 2: Password Reset Link Sent Notice */
                <div className="space-y-4 font-mono">
                  <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-neon-blue">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        <span>RESET LINK SENT</span>
                      </span>
                      <span className="text-[9px] uppercase tracking-wider bg-neon-blue/20 px-2 py-0.5 rounded font-mono">
                        Firebase Native Auth
                      </span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-sans">
                      Password reset link sent to your email (<strong className="text-white">{resetTargetEmail}</strong>). Please check your inbox or spam folder to reset your password.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5 text-center">
                    <button
                      type="button"
                      onClick={handleResendResetOtp}
                      disabled={isResetLoading}
                      className="w-full py-2.5 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/40 text-neon-blue hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isResetLoading ? "animate-spin" : ""}`} />
                      <span>Resend Password Reset Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setResetStep(1);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                    >
                      Back to Login Screen
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 3: Enter New Password & Confirm Password */
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4 font-mono">
                  <div className="p-3.5 bg-neon-green/10 border border-neon-green/30 rounded-sm space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neon-green">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>OTP VERIFIED SUCCESSFULLY</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-white/80 font-sans">
                      Identity confirmed for <strong className="text-white">{resetTargetEmail}</strong>. Please enter your new password below.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                      NEW PASSWORD
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-white/30">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={showResetPassword ? "text" : "password"}
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="Min 8 characters with mixed case & symbol"
                        className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-9 pr-10 text-xs text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                      >
                        {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                      CONFIRM NEW PASSWORD
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-white/30">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={showResetConfirmPassword ? "text" : "password"}
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-9 pr-10 text-xs text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                        className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                      >
                        {showResetConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password rules indicator */}
                  {resetNewPassword.length > 0 && (
                    <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1 text-[10px] font-mono">
                      <div className={`flex items-center gap-1.5 ${resetHasMinLength ? "text-neon-green" : "text-white/40"}`}>
                        <span>{resetHasMinLength ? "✓" : "○"}</span>
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${resetHasMixedCase ? "text-neon-green" : "text-white/40"}`}>
                        <span>{resetHasMixedCase ? "✓" : "○"}</span>
                        <span>Uppercase & Lowercase letters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${resetHasNumberOrSymbol ? "text-neon-green" : "text-white/40"}`}>
                        <span>{resetHasNumberOrSymbol ? "✓" : "○"}</span>
                        <span>Number or Special character</span>
                      </div>
                      {resetConfirmPassword.length > 0 && (
                        <div className={`flex items-center gap-1.5 ${resetPasswordsMatch ? "text-neon-green" : "text-red-400"}`}>
                          <span>{resetPasswordsMatch ? "✓" : "✕"}</span>
                          <span>{resetPasswordsMatch ? "Passwords match" : "Passwords do not match"}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isResetLoading || !resetHasMinLength || !resetHasMixedCase || !resetHasNumberOrSymbol || !resetPasswordsMatch}
                    className="w-full py-2.5 bg-neon-green hover:bg-neon-green/90 text-black font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-md cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                  >
                    {isResetLoading ? "Saving Password..." : "SAVE NEW PASSWORD"}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back to Login Screen
                    </button>
                  </div>
                </form>
              )
            ) : mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Email Address or Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address or username"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-9 pr-3 text-xs font-mono text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot_password");
                        setResetEmailInput(email);
                        setResetStep(1);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[10px] text-neon-blue hover:underline font-bold transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-9 pr-10 text-xs font-mono text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-neon-blue hover:bg-neon-blue/90 text-black font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-md cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? "Authenticating..." : "Authorize Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Username (Handle)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-purple/40 focus:outline-none py-2 pl-9 pr-3 text-xs font-mono text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-purple/40 focus:outline-none py-2 pl-9 pr-3 text-xs font-mono text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 mixed characters"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-purple/40 focus:outline-none py-2 pl-9 pr-10 text-xs font-mono text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-white/30">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-purple/40 focus:outline-none py-2 pl-9 pr-10 text-xs font-mono text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Password requirements indicators */}
                {password.length > 0 && (
                  <div className="p-2.5 bg-black/30 rounded border border-white/5 space-y-1 text-[10px] font-mono">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-neon-green" : "text-white/40"}`}>
                      <span className="text-[10px]">{hasMinLength ? "✓" : "○"}</span>
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasMixedCase ? "text-neon-green" : "text-white/40"}`}>
                      <span className="text-[10px]">{hasMixedCase ? "✓" : "○"}</span>
                      <span>Uppercase (A-Z) & Lowercase (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? "text-neon-green" : "text-white/40"}`}>
                      <span className="text-[10px]">{hasNumberOrSymbol ? "✓" : "○"}</span>
                      <span>Number (0-9) or Special Character</span>
                    </div>
                    {confirmPassword.length > 0 && (
                      <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-neon-green" : "text-red-400"}`}>
                        <span className="text-[10px]">{passwordsMatch ? "✓" : "✕"}</span>
                        <span>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/40 tracking-wider flex items-center gap-1">
                    <span>Referral Code (Optional)</span>
                    <Sparkles className="h-3 w-3 text-neon-purple" />
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code if any"
                    className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-purple/40 focus:outline-none py-2 px-3 text-xs font-mono text-white"
                  />
                  <p className="text-[9px] text-white/30 leading-normal">
                    🎁 Using a referral code grants you an automatic $10.00 wallet credit immediately upon registration!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-md cursor-pointer select-none active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? "Generating Profile..." : "Create Account"}
                </button>
              </form>
            )}

            {/* Mode Switcher */}
            {mode !== "forgot_password" && (
              <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs">
                {mode === "login" ? (
                  <p className="text-white/40">
                    New to Elite Logs?{" "}
                    <button
                      onClick={() => { setMode("register"); setErrorMsg(null); }}
                      className="text-neon-purple hover:underline font-bold cursor-pointer"
                    >
                      Sign Up Here
                    </button>
                  </p>
                ) : (
                  <p className="text-white/40">
                    Already have an account?{" "}
                    <button
                      onClick={() => { setMode("login"); setErrorMsg(null); }}
                      className="text-neon-blue hover:underline font-bold cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
