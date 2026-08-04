import React, { useState, useEffect } from "react";
import { useAppState } from "../state";
import { fileToDataUrl } from "../lib/imageUtils";
import { 
  Coins, 
  Share2, 
  ShoppingBag, 
  Key, 
  ExternalLink, 
  CheckCircle, 
  Plus, 
  LogOut,
  ChevronRight,
  Sparkles,
  User,
  Heart,
  Upload,
  Clock,
  AlertCircle,
  ShieldCheck,
  Camera,
  Save,
  Check,
  Eye,
  EyeOff,
  Wallet,
  Receipt,
  Mail,
  BarChart3,
  Users
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    logOut, 
    trackOrder, 
    setView,
    paymentGateways,
    topUpRequests,
    requestTopUp,
    updateUserProfile,
    resendVerificationEmail,
    activeDashboardTab: dashboardTab,
    setDashboardTab
  } = useAppState();

  const [topUpAmount, setTopUpAmount] = useState("50");
  const [selectedGatewayId, setSelectedGatewayId] = useState(paymentGateways[0]?.id || "");
  const [topUpTxnId, setTopUpTxnId] = useState("");
  const [topUpScreenshot, setTopUpScreenshot] = useState("");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [fundingSuccess, setFundingSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Profile Form States
  const [fullNameInput, setFullNameInput] = useState(currentUser.fullName || "");
  const [usernameInput, setUsernameInput] = useState(currentUser.username || "");
  const [phoneInput, setPhoneInput] = useState(currentUser.phone || "");
  const [countryInput, setCountryInput] = useState(currentUser.country || "Bangladesh 🇧🇩");
  const [bioInput, setBioInput] = useState(currentUser.bio || "");
  const [avatarUrlInput, setAvatarUrlInput] = useState(currentUser.avatarUrl || "");
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setFullNameInput(currentUser.fullName || "");
    setUsernameInput(currentUser.username || "");
    setPhoneInput(currentUser.phone || "");
    setCountryInput(currentUser.country || "Bangladesh 🇧🇩");
    setBioInput(currentUser.bio || "");
    setAvatarUrlInput(currentUser.avatarUrl || "");
  }, [currentUser]);

  // Security / Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email verification resend states
  const [resendMsg, setResendMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    setResendMsg(null);
    const res = await resendVerificationEmail();
    setIsResendingEmail(false);
    if (res.success) {
      setResendMsg({ type: "success", text: res.message });
    } else {
      setResendMsg({ type: "error", text: res.message });
    }
  };

  // Calculations for last 7 days tracking
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Top up tracking (last 7 days)
  const userTopUps = topUpRequests.filter(r => r.email === currentUser.email);
  const last7DaysTopUpTotal = userTopUps
    .filter(r => r.status === "Approved" && new Date(r.date) >= sevenDaysAgo)
    .reduce((sum, r) => sum + r.amount, 0);

  // Spending tracking (last 7 days)
  const userOrders = orders.filter(o => o.customerEmail === currentUser.email);
  const last7DaysSpendingTotal = userOrders
    .filter(o => new Date(o.date) >= sevenDaysAgo)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // Pending counts & lists
  const pendingOrdersList = userOrders.filter(o => o.status === "Pending" || o.status === "Processing");
  const pendingOrdersCount = pendingOrdersList.length;

  const pendingDepositsList = userTopUps.filter(r => r.status === "Pending");
  const pendingDepositsCount = pendingDepositsList.length;

  const selectedGateway = paymentGateways.find(g => g.id === selectedGatewayId) || paymentGateways[0];

  if (currentUser.isGuest) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6" id="dashboard-guest-view">
        <div className="inline-flex p-4 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-wider italic text-white">Access Restricted</h2>
        <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
          You are currently in guest mode. Log in or create an elite account to access your personalized digital wallet, referral rewards, deposit ledger, and complete order history.
        </p>
        <button
          onClick={() => setView("auth")}
          className="px-6 py-2.5 bg-neon-blue hover:bg-neon-blue/90 text-black font-black uppercase text-xs tracking-widest rounded-sm cursor-pointer select-none"
        >
          Authorize / Register
        </button>
      </div>
    );
  }

  const handleCopyReferral = () => {
    setCopiedReferral(true);
    navigator.clipboard.writeText(`https://elitelogsmarket.net/ref?code=${currentUser.referralCode}`);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleTopUpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (!topUpTxnId.trim()) return;

    requestTopUp({
      amount,
      paymentMethod: selectedGateway?.name || "bKash",
      transactionId: topUpTxnId,
      screenshotUrl: topUpScreenshot || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop"
    });

    setFundingSuccess(true);
    setTopUpTxnId("");
    setTopUpScreenshot("");
    setTimeout(() => setFundingSuccess(false), 4000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setTopUpScreenshot(dataUrl);
    } catch (err) {
      alert("Failed to process image file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg({ type: "error", text: "Please select a valid image file." });
      return;
    }

    setIsAvatarUploading(true);
    setProfileMsg(null);
    try {
      const dataUrl = await fileToDataUrl(file, 400, 400, 0.85);
      setAvatarUrlInput(dataUrl);
      const res = await updateUserProfile({ avatarUrl: dataUrl });
      if (res.success) {
        setProfileMsg({ type: "success", text: "Profile avatar updated successfully!" });
      }
    } catch (err) {
      setProfileMsg({ type: "error", text: "Failed to process image file." });
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleProfileInfoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!usernameInput.trim()) {
      setProfileMsg({ type: "error", text: "Username cannot be empty." });
      return;
    }

    const res = await updateUserProfile({
      fullName: fullNameInput.trim(),
      username: usernameInput.trim(),
      phone: phoneInput.trim(),
      country: countryInput.trim(),
      bio: bioInput.trim()
    });

    if (res.success) {
      setProfileMsg({ type: "success", text: "Personal profile updated successfully!" });
    } else {
      setProfileMsg({ type: "error", text: res.message });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!oldPassword.trim()) {
      setPasswordMsg({ type: "error", text: "Please enter your current (old) password." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setPasswordMsg({ type: "error", text: "Password must contain both uppercase and lowercase letters." });
      return;
    }
    if (!/[0-9!@#$%^&*]/.test(newPassword)) {
      setPasswordMsg({ type: "error", text: "Password must contain at least one number or special character." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    const res = await updateUserProfile({
      oldPasswordVal: oldPassword,
      passwordVal: newPassword
    });

    if (res.success) {
      setPasswordMsg({ type: "success", text: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ type: "error", text: res.message });
    }
  };

  // Password rules checks
  const hasMinLen = newPassword.length >= 8;
  const hasMixedCase = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
  const hasNumOrSpec = /[0-9!@#$%^&*]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="space-y-12 pb-20">
      
      {/* Title & User Header */}
      <div className="glass-card p-6 rounded-sm border border-white/10 space-y-6 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar image container with live upload trigger */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-neon-purple/50 bg-black/60 overflow-hidden flex items-center justify-center text-neon-purple shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.username} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="h-8 w-8 text-neon-purple" />
                )}
              </div>
              <label 
                title="Change Profile Picture"
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity"
              >
                <Camera className="h-5 w-5 text-neon-purple" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarFileChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black uppercase text-white tracking-wide">
                  {currentUser.fullName || currentUser.username}
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                  {currentUser.isAdmin ? "Master Administrator" : "Verified Client"}
                </span>
              </div>
              <p className="text-xs font-mono text-white/50 mt-1 flex items-center gap-3">
                <span>Email: {currentUser.email}</span>
                <span className="text-white/20">•</span>
                <span>Referral: <strong className="text-neon-purple">{currentUser.referralCode}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-sm text-right flex-1 md:flex-initial font-mono">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block font-mono">Wallet Balance</span>
              <span className="text-lg font-black font-mono text-neon-green">${currentUser.walletBalance.toFixed(2)}</span>
            </div>

            <button 
              onClick={logOut}
              className="flex items-center gap-1.5 px-4 py-3 rounded-sm border border-white/10 hover:border-red-500/30 text-white/50 hover:text-red-500 text-xs font-bold uppercase transition-all select-none cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-white/10 overflow-x-auto text-xs font-mono font-bold">
          <button
            onClick={() => setDashboardTab("overview")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "overview" ? "text-neon-blue font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4 text-neon-blue" />
            <span>Dashboard Overview</span>
            {dashboardTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
          </button>

          <button
            onClick={() => setDashboardTab("wallet")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "wallet" ? "text-neon-green font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <Wallet className="h-4 w-4 text-neon-green" />
            <span>Digital Wallet & Top-Up</span>
            {dashboardTab === "wallet" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-green"></div>}
          </button>

          <button
            onClick={() => setDashboardTab("orders")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "orders" ? "text-neon-blue font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <Receipt className="h-4 w-4 text-neon-blue" />
            <span>Order History ({orders.length})</span>
            {dashboardTab === "orders" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
          </button>

          <button
            onClick={() => setDashboardTab("profile")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "profile" ? "text-neon-purple font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <User className="h-4 w-4 text-neon-purple" />
            <span>Personal Profile</span>
            {dashboardTab === "profile" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-purple"></div>}
          </button>

          <button
            onClick={() => setDashboardTab("security")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "security" ? "text-amber-400 font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>Security</span>
            {dashboardTab === "security" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-400"></div>}
          </button>

          <button
            onClick={() => setDashboardTab("referral")}
            className={`pb-3 px-4 uppercase tracking-wider transition-colors relative cursor-pointer flex items-center gap-2 shrink-0 ${
              dashboardTab === "referral" ? "text-neon-purple font-black" : "text-white/40 hover:text-white"
            }`}
          >
            <Sparkles className="h-4 w-4 text-neon-purple" />
            <span>Referral Rewards</span>
            {dashboardTab === "referral" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-purple"></div>}
          </button>
        </div>
      </div>

      {/* TAB 0: DASHBOARD OVERVIEW (5 TRACKING CARDS) */}
      {dashboardTab === "overview" && (
        <div className="space-y-8 font-sans">
          
          {/* Top 5 Metrics Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            
            {/* (a) Last 7 Days Top up Tracking */}
            <div className="bg-gradient-to-br from-[#0D1510] to-[#0A0B0E] border border-neon-green/30 p-4 rounded-sm space-y-2 shadow-[0_0_20px_rgba(0,255,102,0.1)]">
              <div className="flex items-center justify-between text-white/50 text-[10px] font-mono font-bold uppercase">
                <span>(a) 7-Day Topups</span>
                <Clock className="h-4 w-4 text-neon-green" />
              </div>
              <div className="text-2xl font-black font-mono text-neon-green drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
                ${last7DaysTopUpTotal.toFixed(2)}
              </div>
              <p className="text-[10px] font-mono text-white/50">Calculated past 7 days approved deposits</p>
              <button
                onClick={() => setDashboardTab("wallet")}
                className="w-full mt-1 py-1.5 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 text-neon-green font-mono font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                Top up Wallet →
              </button>
            </div>

            {/* (b) Last 7 Days Spending Tracking */}
            <div className="bg-gradient-to-br from-[#120F1A] to-[#0A0B0E] border border-neon-purple/30 p-4 rounded-sm space-y-2 shadow-[0_0_20px_rgba(255,0,255,0.1)]">
              <div className="flex items-center justify-between text-white/50 text-[10px] font-mono font-bold uppercase">
                <span>(b) 7-Day Spending</span>
                <Receipt className="h-4 w-4 text-neon-purple" />
              </div>
              <div className="text-2xl font-black font-mono text-neon-purple drop-shadow-[0_0_8px_rgba(255,0,255,0.4)]">
                ${last7DaysSpendingTotal.toFixed(2)}
              </div>
              <p className="text-[10px] font-mono text-white/50">Calculated past 7 days store purchases</p>
              <button
                onClick={() => setDashboardTab("orders")}
                className="w-full mt-1 py-1.5 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-mono font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                Spending Log →
              </button>
            </div>

            {/* (c) Pending Order */}
            <div className="bg-gradient-to-br from-[#1A150D] to-[#0A0B0E] border border-amber-500/30 p-4 rounded-sm space-y-2 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <div className="flex items-center justify-between text-white/50 text-[10px] font-mono font-bold uppercase">
                <span>(c) Pending Order</span>
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-amber-400">{pendingOrdersCount}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                  pendingOrdersCount > 0 ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse" : "bg-white/5 text-white/40 border-white/10"
                }`}>
                  {pendingOrdersCount > 0 ? "Active Queue" : "Clear"}
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/50">Active orders waiting for delivery</p>
              <button
                onClick={() => setDashboardTab("orders")}
                className="w-full mt-1 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                View Orders →
              </button>
            </div>

            {/* (d) Pending Deposit */}
            <div className="bg-gradient-to-br from-[#0F141A] to-[#0A0B0E] border border-neon-blue/30 p-4 rounded-sm space-y-2 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
              <div className="flex items-center justify-between text-white/50 text-[10px] font-mono font-bold uppercase">
                <span>(d) Pending Deposit</span>
                <AlertCircle className="h-4 w-4 text-neon-blue" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-neon-blue">{pendingDepositsCount}</span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                  pendingDepositsCount > 0 ? "bg-neon-blue/20 text-neon-blue border-neon-blue/40 animate-pulse" : "bg-white/5 text-white/40 border-white/10"
                }`}>
                  {pendingDepositsCount > 0 ? "Awaiting Admin" : "None"}
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/50">Top-up claims under verification</p>
              <button
                onClick={() => setDashboardTab("wallet")}
                className="w-full mt-1 py-1.5 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-blue font-mono font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                Deposit Ledger →
              </button>
            </div>

            {/* (e) Referral History */}
            <div className="bg-gradient-to-br from-[#180F1A] to-[#0A0B0E] border border-neon-purple/30 p-4 rounded-sm space-y-2 shadow-[0_0_20px_rgba(255,0,255,0.1)]">
              <div className="flex items-center justify-between text-white/50 text-[10px] font-mono font-bold uppercase">
                <span>(e) Referral Code</span>
                <Sparkles className="h-4 w-4 text-neon-purple" />
              </div>
              <div className="text-lg font-black font-mono text-neon-purple truncate">
                {currentUser.referralCode}
              </div>
              <p className="text-[10px] font-mono text-white/50">Personal referral rewards program</p>
              <button
                onClick={handleCopyReferral}
                className="w-full mt-1 py-1.5 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/30 text-neon-purple font-mono font-bold text-[10px] uppercase rounded transition-all cursor-pointer"
              >
                {copiedReferral ? "Link Copied!" : "Copy Ref Link"}
              </button>
            </div>

          </div>

          {/* Detailed Tracking Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
            
            {/* Pending Orders Detail Panel */}
            <div className="glass-card p-5 rounded-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">Active Pending Orders ({pendingOrdersCount})</h3>
                </div>
                <button 
                  onClick={() => setDashboardTab("orders")}
                  className="text-[10px] text-neon-blue hover:underline font-bold"
                >
                  All Orders →
                </button>
              </div>

              {pendingOrdersList.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-xs bg-black/40 rounded border border-white/5 space-y-1">
                  <CheckCircle className="h-6 w-6 text-neon-green mx-auto mb-1 opacity-70" />
                  <p className="font-bold text-white/60">NO PENDING ORDERS IN QUEUE</p>
                  <p className="text-[10px]">All your orders have been delivered or processed.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {pendingOrdersList.map(order => (
                    <div key={order.id} className="p-3 bg-black/60 border border-amber-500/20 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>Order #{order.id.substring(0, 8)}</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50">{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-neon-green font-bold block">${order.totalPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-white/40">{order.items.length} Items</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Deposits Detail Panel */}
            <div className="glass-card p-5 rounded-sm border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-neon-blue" />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">Active Pending Deposits ({pendingDepositsCount})</h3>
                </div>
                <button 
                  onClick={() => setDashboardTab("wallet")}
                  className="text-[10px] text-neon-green hover:underline font-bold"
                >
                  Wallet Top-Up →
                </button>
              </div>

              {pendingDepositsList.length === 0 ? (
                <div className="p-6 text-center text-white/40 text-xs bg-black/40 rounded border border-white/5 space-y-1">
                  <CheckCircle className="h-6 w-6 text-neon-green mx-auto mb-1 opacity-70" />
                  <p className="font-bold text-white/60">NO PENDING DEPOSIT CLAIMS</p>
                  <p className="text-[10px]">All top-up transactions have been verified and credited.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {pendingDepositsList.map(req => (
                    <div key={req.id} className="p-3 bg-black/60 border border-neon-blue/20 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{req.paymentMethod}</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded">
                            PENDING VERIFICATION
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 font-mono">TXN ID: {req.transactionId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-neon-green font-bold block">${req.amount.toFixed(2)}</span>
                        <span className="text-[10px] text-white/40">{new Date(req.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Referral Link & Stats Box */}
          <div className="p-6 bg-gradient-to-r from-black via-[#120F1A] to-black border border-neon-purple/30 rounded-sm space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase text-neon-purple flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-neon-purple" />
                  <span>Referral Rewards Program</span>
                </h3>
                <p className="text-[11px] text-white/60 mt-1">
                  Share your personal referral link with friends and earn 5% bonus wallet credit on their first top-up!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://elitelogsmarket.net/ref?code=${currentUser.referralCode}`} 
                  className="bg-black/80 border border-white/20 text-white text-xs px-3 py-2 rounded max-w-xs font-mono select-all"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/90 text-black font-black uppercase text-xs rounded transition-all cursor-pointer shrink-0"
                >
                  {copiedReferral ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 1: PERSONAL PROFILE */}
      {dashboardTab === "profile" && (
        <div className="max-w-3xl mx-auto font-sans">
          <div className="glass-card p-6 rounded-sm border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <User className="h-4 w-4 text-neon-purple" />
                <span>Personal Profile Settings</span>
              </h3>
              <p className="text-[10px] font-mono text-white/40 mt-1">
                Update your account display name, contact phone number, country/region, and social identifiers.
              </p>
            </div>

            {profileMsg && (
              <div className={`p-3 rounded border text-xs font-mono flex items-center gap-2 ${
                profileMsg.type === "success" 
                  ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {profileMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileInfoSave} className="space-y-4 font-mono text-xs">
              
              {/* Profile Avatar Upload Control */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full border border-neon-purple/40 overflow-hidden bg-black flex items-center justify-center shrink-0">
                    {avatarUrlInput ? (
                      <img src={avatarUrlInput} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-neon-purple" />
                    )}
                  </div>
                  <div>
                    <span className="text-white font-bold block">Profile Picture Avatar</span>
                    <span className="text-[10px] text-white/40 block">Upload custom avatar image from device</span>
                  </div>
                </div>

                <label className="bg-neon-purple/20 hover:bg-neon-purple text-neon-purple hover:text-black border border-neon-purple/40 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer">
                  {isAvatarUploading ? "Uploading..." : "Upload Avatar"}
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Full Name / Display Name</label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Username</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50 font-bold text-neon-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Email Address (Verified)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-[#08080A] border border-white/5 rounded-sm p-2.5 text-xs text-white/40 cursor-not-allowed select-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+880 17XXXXXXXX"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">Country / Region</label>
                <input
                  type="text"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  placeholder="e.g. Bangladesh 🇧🇩 / United States 🇺🇸"
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">Bio / Social Contact Info</label>
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Telegram handle, Discord ID, or personal bio..."
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-black uppercase text-xs tracking-wider rounded-sm transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,255,0.2)] flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Information</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1.5: SECURITY SETTINGS */}
      {dashboardTab === "security" && (
        <div className="max-w-2xl mx-auto space-y-6 font-mono">
          
          {/* Password Update Card */}
          <div className="glass-card p-6 rounded-sm border border-white/10 space-y-5">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400" />
                <span>Security & Password Management</span>
              </h3>
              <p className="text-[10px] text-white/40 mt-1">
                Update your account password securely.
              </p>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded border text-xs flex items-center gap-2 ${
                passwordMsg.type === "success" 
                  ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {passwordMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">Current (Old) Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password..."
                    required
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm py-2.5 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm py-2.5 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {/* Password Strength Checklist */}
              <div className="p-3 bg-black/40 border border-white/5 rounded-sm space-y-1.5 text-[10px]">
                <span className="text-white/40 uppercase block font-bold mb-1">Password Requirements:</span>
                <div className={`flex items-center gap-1.5 ${hasMinLen ? "text-neon-green font-bold" : "text-white/40"}`}>
                  <Check className={`h-3 w-3 ${hasMinLen ? "text-neon-green" : "text-white/20"}`} />
                  <span>Minimum 8 characters long</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasMixedCase ? "text-neon-green font-bold" : "text-white/40"}`}>
                  <Check className={`h-3 w-3 ${hasMixedCase ? "text-neon-green" : "text-white/20"}`} />
                  <span>Uppercase & lowercase letters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumOrSpec ? "text-neon-green font-bold" : "text-white/40"}`}>
                  <Check className={`h-3 w-3 ${hasNumOrSpec ? "text-neon-green" : "text-white/20"}`} />
                  <span>At least 1 number or special character</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isMatch ? "text-neon-green font-bold" : "text-white/40"}`}>
                  <Check className={`h-3 w-3 ${isMatch ? "text-neon-green" : "text-white/20"}`} />
                  <span>Passwords match perfectly</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!oldPassword.trim() || !hasMinLen || !hasMixedCase || !hasNumOrSpec || !isMatch}
                className="w-full py-2.5 bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-600 text-black font-black uppercase text-xs tracking-wider rounded-sm transition-all cursor-pointer"
              >
                Update Account Password
              </button>
            </form>
          </div>

          {/* Account Security Badge */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-sm space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-neon-green" />
                <span>Account Health Score</span>
              </span>
              <span className="text-xs font-bold text-neon-green">100% SECURE</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-neon-green h-full w-full"></div>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Protected by AES-256 session tokens, Firebase Authentication, and SSL encryption.
            </p>
          </div>

          {/* Email Verification Status Card */}
          <div className="p-5 bg-black/50 border border-white/10 rounded-sm space-y-3 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-neon-blue" />
                <span>Firebase Email Verification</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-bold rounded">
                AUTHENTICATED
              </span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Verification link is dispatched to <strong className="text-white">{currentUser.email}</strong> via Firebase Authentication on registration.
            </p>
            {resendMsg && (
              <div className={`p-2.5 rounded text-[10px] font-mono flex items-center gap-2 ${
                resendMsg.type === "success" 
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/30" 
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}>
                {resendMsg.type === "success" ? <Check className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                <span>{resendMsg.text}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isResendingEmail}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Mail className="h-3.5 w-3.5 text-neon-blue" />
              <span>{isResendingEmail ? "Sending Link..." : "Resend Verification Email"}</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: DIGITAL WALLET & TOP-UP */}
      {dashboardTab === "wallet" && (
        <div className="space-y-8 font-mono">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Wallet Loader Box */}
            <div className="lg:col-span-8 glass-card p-6 rounded-sm border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Secured Digital Wallet</h3>
              <div className="flex items-center gap-2">
                <Coins className="h-7 w-7 text-neon-green" />
                <span className="text-3xl font-black font-mono text-white">
                  ${currentUser.walletBalance.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="bg-neon-blue/10 border border-neon-blue/20 rounded px-3 py-1.5 max-w-sm">
              <p className="text-[10px] text-neon-blue leading-normal font-bold">
                🔒 Top-up approval is manual. Send payment first, then submit Transaction ID. Admin will verify and credit your wallet.
              </p>
            </div>
          </div>

          {currentUser.isAdmin ? (
            <div className="bg-[#0E0E12]/80 border border-neon-purple/20 rounded-sm p-8 text-center space-y-4">
              <ShieldCheck className="h-10 w-10 text-neon-purple mx-auto animate-pulse" />
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Administrative Portal Account</h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
                As a Master Server Administrator, you have complete administrative credentials. Manual ledger deposit requests are restricted for administrative accounts.
              </p>
            </div>
          ) : (
            <form onSubmit={handleTopUpRequest} className="space-y-6">
            {/* Step 1: Gateway Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                1. Select Gateway
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentGateways.map((g) => {
                  const isSelected = selectedGatewayId === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGatewayId(g.id)}
                      className={`p-3 rounded border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected 
                          ? "bg-neon-blue/15 border-neon-blue/50 text-white" 
                          : "bg-black/25 border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider">{g.name}</span>
                      <span className="text-[9px] opacity-60 font-mono mt-1">{g.type}</span>
                      {isSelected && (
                        <div className="absolute right-1 top-1 bg-neon-blue text-black p-0.5 rounded-full">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Selected Gateway Instructions */}
            {selectedGateway && (
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Gateway Destination</span>
                  <span className="text-[9px] font-black uppercase bg-neon-green/10 border border-neon-green/20 text-neon-green px-1.5 py-0.5 rounded font-mono">
                    Active
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/50 font-medium">Send amount directly to:</p>
                    <p className="text-sm font-black font-mono text-neon-blue tracking-wide selection:bg-neon-blue selection:text-black">
                      {selectedGateway.details}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(selectedGateway.details)}
                    className="bg-white/5 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors"
                  >
                    Copy Address
                  </button>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed pt-1.5 border-t border-white/5 font-sans">
                  {selectedGateway.instructions}
                </p>
              </div>
            )}

            {/* Step 3: Transaction Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  2. Amount to Load ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/40 font-mono">$</span>
                  <input 
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="50"
                    min="5"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 pl-7 pr-3 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  3. Enter Transaction ID (TxnID)
                </label>
                <input 
                  type="text"
                  value={topUpTxnId}
                  onChange={(e) => setTopUpTxnId(e.target.value)}
                  placeholder="e.g. BK829A1X93 or Hash..."
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none py-2 px-3 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Step 4: Screenshot Upload from Device */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-white/60 tracking-wider">
                4. Screenshot of Payment / Proof (Upload from Device)
              </label>
              <div className="relative border border-dashed border-white/10 hover:border-neon-blue/40 rounded p-4 text-center cursor-pointer hover:bg-neon-blue/[0.01] transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Upload payment proof screenshot"
                />
                
                {isUploading ? (
                  <p className="text-xs text-neon-blue font-mono animate-pulse py-2">
                    Processing image file from device...
                  </p>
                ) : topUpScreenshot ? (
                  <div className="flex flex-col items-center gap-2 py-1">
                    <img 
                      src={topUpScreenshot} 
                      alt="Payment proof screenshot" 
                      className="h-28 max-w-full object-contain rounded border border-white/20 shadow-md"
                    />
                    <div className="flex items-center gap-2 text-neon-green text-xs font-mono font-bold">
                      <CheckCircle className="h-4 w-4" />
                      <span>Payment Proof Attached Successfully!</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopUpScreenshot("");
                        }}
                        className="text-white/40 hover:text-red-400 text-[10px] underline ml-2 z-20 cursor-pointer"
                      >
                        Remove / Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-2">
                    <Upload className="h-6 w-6 text-neon-blue group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-white/80 font-bold uppercase tracking-wider">
                      Click or Drag Payment Proof / Screenshot
                    </span>
                    <span className="text-[9px] text-white/40">
                      Upload PNG, JPG, or WEBP directly from your phone or PC
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-neon-blue hover:bg-neon-blue/95 text-black font-black rounded-sm text-xs uppercase tracking-widest select-none cursor-pointer transition-all shadow-md active:scale-[0.99]"
            >
              Submit Top-Up Request
            </button>

            {fundingSuccess && (
              <div className="bg-neon-green/10 border border-neon-green/20 rounded p-3 text-center">
                <p className="text-xs text-neon-green font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" /> 
                  Top-up request submitted! Waiting for Admin verification in the Master Control Desk.
                </p>
              </div>
            )}
          </form>
          )}
        </div>

        {/* Affiliate Referral Generator */}
        <div className="lg:col-span-4 glass-card p-6 rounded-sm border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Referral Program</h3>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-neon-purple" />
              <span>Invite Friends, Earn Commission!</span>
            </h4>
            <p className="text-[10px] text-white/40 leading-normal">
              Share your custom referral code. Each referral who loads at least $20 earns you a <strong>$10.00 wallet credit</strong> instantly. No limit.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-white/5 border border-white/10 rounded-sm p-2.5 text-xs font-mono text-white/60 flex-1 flex justify-between items-center overflow-x-auto">
              <span>Code: <strong>{currentUser.referralCode}</strong></span>
            </div>
            <button
              onClick={handleCopyReferral}
              className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 p-3 rounded-sm text-white hover:text-neon-purple select-none cursor-pointer transition-colors"
              title="Copy Invite Link"
            >
              {copiedReferral ? <CheckCircle className="h-4.5 w-4.5 text-neon-green" /> : <Share2 className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Wallet Top-Up Request Registry (User Side) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Deposit ledger entries</h3>
            <h4 className="text-lg font-black italic uppercase text-white tracking-wide mt-1">Wallet Top-Up History</h4>
          </div>
          <span className="text-xs font-mono text-white/30">{userTopUps.length} requests log</span>
        </div>

        {userTopUps.length > 0 ? (
          <div className="glass-card rounded-sm border border-white/5 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider font-semibold">
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">TxnID</th>
                  <th className="p-4">Amount Requested</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {userTopUps.map((req) => {
                  const isApproved = req.status === "Approved";
                  const isRejected = req.status === "Rejected";
                  return (
                    <tr key={req.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-bold text-white">{req.id}</td>
                      <td className="p-4 text-white/60">{new Date(req.date).toLocaleString()}</td>
                      <td className="p-4 font-bold text-white">{req.paymentMethod}</td>
                      <td className="p-4 text-white/60 selection:bg-neon-blue selection:text-black">{req.transactionId}</td>
                      <td className="p-4 font-black text-neon-green">${req.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                          isApproved 
                            ? "bg-neon-green/10 text-neon-green border-neon-green/20" 
                            : isRejected 
                              ? "bg-red-500/10 text-red-500 border-red-500/20" 
                              : "bg-neon-blue/10 text-neon-blue border-neon-blue/20 animate-pulse"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white/[0.01] border border-white/5 rounded-sm">
            <Clock className="h-8 w-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/40">No balance load requests initiated yet.</p>
          </div>
        )}
      </div>
    </div>
  )}

      {/* TAB 3: ORDER TRANSACTION HISTORY */}
      {dashboardTab === "orders" && (
        <div className="space-y-4 font-mono">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Historic escrow purchases</h3>
              <h4 className="text-lg font-black italic uppercase text-white tracking-wide mt-1">Transaction History</h4>
            </div>
            <span className="text-xs text-white/30">{orders.length} transactions match</span>
          </div>

          {orders.length > 0 ? (
            <div className="glass-card rounded-sm border border-white/5 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider font-semibold">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Acquisition Date</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total Paid</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Escrow Status</th>
                    <th className="p-4 text-right">Escrow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => {
                    const isCompleted = o.status === "Completed";
                    const isProcessing = o.status === "Processing";
                    
                    return (
                      <tr key={o.id} className="hover:bg-white/[0.01] transition-colors font-mono">
                        <td className="p-4 font-bold text-white">{o.id}</td>
                        <td className="p-4 text-white/60">{new Date(o.date).toLocaleDateString()}</td>
                        <td className="p-4 text-white/80 max-w-xs truncate">
                          {o.items.map(i => `${i.name} (${i.quantity}x)`).join(", ")}
                        </td>
                        <td className="p-4 font-bold text-white">${o.totalPrice.toFixed(2)}</td>
                        <td className="p-4 text-white/60">{o.paymentMethod}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            isCompleted 
                              ? "bg-neon-green/10 text-neon-green border-neon-green/20" 
                              : isProcessing 
                                ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20 animate-pulse" 
                                : "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => trackOrder(o.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-neon-blue hover:underline uppercase tracking-wider select-none cursor-pointer"
                          >
                            <span>{isCompleted ? "Acquire Logs" : "Track Order"}</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-sm">
              <ShoppingBag className="h-10 w-10 text-white/20 mx-auto mb-4" />
              <h4 className="font-bold text-white uppercase text-sm">No transaction records found</h4>
              <p className="text-xs text-white/40 max-w-sm mx-auto mt-1">
                You haven't checked out any items under this profile yet. Browse the marketplace to acquire premium assets.
              </p>
              <button 
                onClick={() => setView("shop")}
                className="mt-6 bg-white/5 border border-white/10 hover:border-white/20 px-6 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Shop Market
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REFERRAL REWARDS PROGRAM */}
      {dashboardTab === "referral" && (
        <div className="glass-card p-8 rounded-sm border border-white/5 space-y-6 max-w-2xl mx-auto font-sans">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/30 mb-2">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Elite Referral Program</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed font-mono">
              Earn <strong className="text-neon-green">$10.00 wallet balance</strong> for every user who registers with your invite code and tops up their digital wallet.
            </p>
          </div>

          <div className="p-6 bg-black/50 border border-white/10 rounded-sm space-y-4 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 uppercase">Your Unique Referral Code:</span>
              <span className="text-lg font-black text-neon-purple">{currentUser.referralCode}</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`https://elitelogsmarket.net/ref?code=${currentUser.referralCode}`}
                className="w-full bg-[#0E0E12] border border-white/10 rounded px-3 py-2 text-xs text-white/70 select-all"
              />
              <button
                onClick={handleCopyReferral}
                className="bg-neon-purple hover:bg-neon-purple/90 text-white font-bold px-4 py-2 text-xs uppercase rounded flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedReferral ? <CheckCircle className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span>{copiedReferral ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
