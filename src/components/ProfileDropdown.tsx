import React, { useState } from "react";
import { useAppState } from "../state";
import { 
  User, 
  Wallet, 
  CreditCard, 
  History, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Lock, 
  ShieldCheck, 
  Headset, 
  HelpCircle, 
  Send, 
  MessageSquare, 
  LogOut, 
  ChevronRight, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Globe, 
  Phone, 
  Mail, 
  Camera, 
  Sparkles,
  ChevronDown
} from "lucide-react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    orders, 
    topUpRequests, 
    setView, 
    setDashboardTab, 
    logOut, 
    supportSettings,
    sendChatMessage
  } = useAppState();

  const [activeSection, setActiveSection] = useState<string | null>("balance");

  const [replacementModalOpen, setReplacementModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [replacementReason, setReplacementReason] = useState<string>("");
  const [replacementSubmitted, setReplacementSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

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

  // Pending counts
  const pendingOrdersCount = userOrders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const pendingDepositsCount = userTopUps.filter(r => r.status === "Pending").length;

  const toggleSection = (sectionKey: string) => {
    setActiveSection(prev => prev === sectionKey ? null : sectionKey);
  };

  const handleNavigate = (view: string, tab?: "overview" | "wallet" | "profile" | "security" | "orders" | "referral") => {
    if (tab) {
      setDashboardTab(tab);
    }
    setView(view);
    onClose();
  };

  const handleAskReplacementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !replacementReason.trim()) return;

    const message = `🚨 [REPLACEMENT REQUEST]\nOrder ID: ${selectedOrderId}\nUser: ${currentUser.email}\nReason: ${replacementReason.trim()}`;
    await sendChatMessage(message);

    setReplacementSubmitted(true);
    setTimeout(() => {
      setReplacementSubmitted(false);
      setReplacementModalOpen(false);
      setSelectedOrderId("");
      setReplacementReason("");
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Dropdown Card */}
      <div className="relative w-full max-w-md bg-[#0D0E12] border border-[#D4AF37]/30 shadow-[0_10px_50px_rgba(0,0,0,0.9)] rounded-md overflow-hidden z-10 flex flex-col max-h-[90vh] font-sans">
        
        {/* Header Profile Summary */}
        <div className="bg-gradient-to-r from-black via-[#14161F] to-[#0D0E12] p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-neon-purple shadow-[0_0_12px_rgba(255,0,255,0.4)]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center text-neon-purple font-black text-lg">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-neon-green border-2 border-black" title="Online Session" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate font-mono">
                  {currentUser.fullName || currentUser.username}
                </h3>
                {currentUser.isAdmin && (
                  <span className="px-1.5 py-0.5 bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[8px] font-black uppercase rounded-xs">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/50 truncate font-mono">@{currentUser.username}</p>
              <p className="text-[10px] text-neon-blue/80 truncate font-mono">{currentUser.email}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Wallet Bar */}
        <div className="bg-neon-green/10 border-b border-neon-green/20 px-4 py-2.5 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-neon-green" />
            <span className="text-[11px] uppercase font-bold text-white/70">Wallet Balance:</span>
          </div>
          <span className="text-sm font-black text-neon-green drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
            ${currentUser.walletBalance.toFixed(2)} USD
          </span>
        </div>

        {/* List System Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar p-3 space-y-2.5 text-xs">

          {/* 01) BALANCE */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleSection("balance")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-neon-green font-black">01)</span>
                <Wallet className="h-4 w-4 text-neon-green" />
                <span className="uppercase tracking-wider">Balance</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${activeSection === "balance" ? "rotate-180 text-neon-green" : ""}`} />
            </button>

            {activeSection === "balance" && (
              <div className="p-2 space-y-1 bg-black/40 border-t border-white/5 font-mono text-[11px]">
                <button
                  onClick={() => handleNavigate("dashboard", "wallet")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-neon-green transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-green">(a)</span>
                    <CreditCard className="h-3.5 w-3.5 text-neon-green/70 group-hover:text-neon-green" />
                    <span>Add Balance</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-neon-green group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => handleNavigate("dashboard", "wallet")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-neon-green transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-green">(b)</span>
                    <History className="h-3.5 w-3.5 text-neon-blue/70 group-hover:text-neon-blue" />
                    <span>Balance TopUp History</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/60">
                    {userTopUps.length} Logs
                  </span>
                </button>

                <button
                  onClick={() => handleNavigate("dashboard", "orders")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-neon-green transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-green">(c)</span>
                    <BarChart3 className="h-3.5 w-3.5 text-neon-purple/70 group-hover:text-neon-purple" />
                    <span>Spending History</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-white/60">
                    {userOrders.length} Orders
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 02) DASHBOARD */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => handleNavigate("dashboard", "overview")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-neon-blue font-black">02)</span>
                <BarChart3 className="h-4 w-4 text-neon-blue" />
                <span className="uppercase tracking-wider group-hover:text-neon-blue transition-colors">
                  Dashboard
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* 03) PROFILE */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleSection("profile")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-neon-purple font-black">03)</span>
                <User className="h-4 w-4 text-neon-purple" />
                <span className="uppercase tracking-wider group-hover:text-neon-purple transition-colors">Profile</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${activeSection === "profile" ? "rotate-180 text-neon-purple" : ""}`} />
            </button>

            {activeSection === "profile" && (
              <div className="p-2 space-y-1 bg-black/40 border-t border-white/5 font-mono text-[11px]">
                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(a)</span>
                    <Camera className="h-3.5 w-3.5 text-neon-purple/70" />
                    <span>Profile Avatar</span>
                  </div>
                  <span className="text-[10px] text-neon-purple hover:underline font-bold">Edit Avatar</span>
                </div>

                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(b)</span>
                    <User className="h-3.5 w-3.5 text-white/40" />
                    <span>Name</span>
                  </div>
                  <span className="text-[10px] text-white/90 font-bold truncate max-w-[150px]">
                    {currentUser.fullName || "Not specified"}
                  </span>
                </div>

                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(c)</span>
                    <User className="h-3.5 w-3.5 text-white/40" />
                    <span>Username</span>
                  </div>
                  <span className="text-[10px] text-neon-purple font-bold">@{currentUser.username}</span>
                </div>

                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(d)</span>
                    <Mail className="h-3.5 w-3.5 text-white/40" />
                    <span>Email</span>
                  </div>
                  <span className="text-[10px] text-neon-blue font-bold truncate max-w-[150px]">{currentUser.email}</span>
                </div>

                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(e)</span>
                    <Phone className="h-3.5 w-3.5 text-white/40" />
                    <span>Phone number</span>
                  </div>
                  <span className="text-[10px] text-white/70">{currentUser.phone || "Not set"}</span>
                </div>

                <div 
                  onClick={() => handleNavigate("dashboard", "profile")}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(f)</span>
                    <Globe className="h-3.5 w-3.5 text-white/40" />
                    <span>Country / Region</span>
                  </div>
                  <span className="text-[10px] text-white/90 font-bold">{currentUser.country || "Bangladesh 🇧🇩"}</span>
                </div>
              </div>
            )}
          </div>

          {/* 04) SECURITY */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleSection("security")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-black">04)</span>
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="uppercase tracking-wider group-hover:text-amber-400 transition-colors">Security</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${activeSection === "security" ? "rotate-180 text-amber-400" : ""}`} />
            </button>

            {activeSection === "security" && (
              <div className="p-2 space-y-1 bg-black/40 border-t border-white/5 font-mono text-[11px]">
                <button
                  onClick={() => handleNavigate("dashboard", "security")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-amber-400 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-amber-400">(a)</span>
                    <Lock className="h-3.5 w-3.5 text-amber-400/80" />
                    <span>Change Password</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => handleNavigate("dashboard", "security")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-amber-400 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-amber-400">(b)</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-neon-green/80" />
                    <span>Two Factor Authentication</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    currentUser.twoFactorEnabled 
                      ? "bg-neon-green/20 text-neon-green border-neon-green/40" 
                      : "bg-white/5 text-white/40 border-white/10"
                  }`}>
                    {currentUser.twoFactorEnabled ? "ENABLED" : "DISABLED"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 05) HELP & SUPPORT */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => toggleSection("support")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-neon-blue font-black">05)</span>
                <Headset className="h-4 w-4 text-neon-blue" />
                <span className="uppercase tracking-wider">Help & Support</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${activeSection === "support" ? "rotate-180 text-neon-blue" : ""}`} />
            </button>

            {activeSection === "support" && (
              <div className="p-2 space-y-2 bg-black/40 border-t border-white/5 font-mono text-[11px]">
                
                {/* (a) Contact Admin */}
                <div className="p-2 rounded bg-white/5 space-y-1.5 border border-white/5">
                  <span className="text-neon-blue font-bold block text-[10px] uppercase">
                    (a) Contact Admin
                  </span>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    <a
                      href={supportSettings.whatsappLink || "https://wa.me/8801700000000"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-[10px] transition-all"
                    >
                      <MessageSquare className="h-3 w-3 shrink-0" />
                      <span>(1) WhatsApp</span>
                    </a>

                    <a
                      href={supportSettings.telegramLink || "https://t.me/elitelogsadmin"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold text-[10px] transition-all"
                    >
                      <Send className="h-3 w-3 shrink-0" />
                      <span>(2) Telegram</span>
                    </a>
                  </div>
                </div>

                {/* (b) Join Telegram Group */}
                <a
                  href={supportSettings.telegramGroupLink || supportSettings.telegramLink || "https://t.me/elitelogsofficial"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-cyan-400 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-cyan-400">(b)</span>
                    <Send className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Join Telegram Group</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/30 group-hover:text-cyan-400" />
                </a>

                {/* (c) Join WhatsApp Channel */}
                <a
                  href={supportSettings.whatsappChannelLink || supportSettings.whatsappLink || "https://whatsapp.com/channel/0029Va9EliteLogs"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-emerald-400 transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-emerald-400">(c)</span>
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Join WhatsApp Channel</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/30 group-hover:text-emerald-400" />
                </a>

                {/* (d) Ask for Replacement */}
                <button
                  type="button"
                  onClick={() => setReplacementModalOpen(true)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-white/80 hover:text-neon-purple transition-all cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px] font-bold group-hover:text-neon-purple">(d)</span>
                    <RefreshCw className="h-3.5 w-3.5 text-neon-purple" />
                    <span>Ask for Replacement</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-neon-purple/20 text-neon-purple border border-neon-purple/40 font-bold rounded">
                    Submit Request
                  </span>
                </button>

              </div>
            )}
          </div>

          {/* 06) FAQ & SUPPORT */}
          <div className="border border-white/10 rounded-sm bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => handleNavigate("faq")}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors text-left font-mono font-bold text-white cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-black">06)</span>
                <HelpCircle className="h-4 w-4 text-[#D4AF37]" />
                <span className="uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors">
                  FAQ & Support System
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

        </div>

        {/* Footer Logout Button */}
        <div className="p-3 bg-black/80 border-t border-white/10">
          <button
            onClick={() => {
              logOut();
              onClose();
            }}
            className="w-full py-2 px-3 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-black font-mono font-black text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </div>

      {/* Replacement Modal */}
      {replacementModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0D0E12] border border-neon-purple/40 p-5 rounded-md shadow-2xl font-mono text-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-neon-purple font-black uppercase text-sm">
                <RefreshCw className="h-4 w-4" />
                <span>ASK FOR PRODUCT REPLACEMENT</span>
              </div>
              <button 
                onClick={() => setReplacementModalOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {replacementSubmitted ? (
              <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-neon-green mx-auto" />
                <p className="font-bold text-neon-green text-xs">REPLACEMENT TICKET SUBMITTED!</p>
                <p className="text-[10px] text-white/70">
                  Our admin team will review your replacement query and contact you within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskReplacementSubmit} className="space-y-4">
                <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                  If you received invalid credentials or expired logs, select your order and describe the issue below.
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/70">
                    SELECT ORDER FOR REPLACEMENT
                  </label>
                  {userOrders.length === 0 ? (
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded text-white/40 text-[10px]">
                      No previous orders found for this account.
                    </div>
                  ) : (
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded p-2 text-xs text-white focus:border-neon-purple focus:outline-none"
                      required
                    >
                      <option value="">-- Choose an Order --</option>
                      {userOrders.map(o => (
                        <option key={o.id} value={o.id}>
                          Order #{o.id.substring(0, 8)} - ${o.totalPrice.toFixed(2)} ({new Date(o.date).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-white/70">
                    REASON FOR REPLACEMENT REQUEST
                  </label>
                  <textarea
                    rows={3}
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    placeholder="e.g., Google Voice account password incorrect / 2FA code invalid / expired session"
                    className="w-full bg-black/60 border border-white/15 rounded p-2 text-xs text-white focus:border-neon-purple focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplacementModalOpen(false)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/70 font-bold uppercase text-[10px] rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedOrderId || !replacementReason.trim()}
                    className="flex-1 py-2 bg-neon-purple hover:bg-neon-purple/90 text-black font-black uppercase text-[10px] rounded cursor-pointer disabled:opacity-40"
                  >
                    SUBMIT CLAIM
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
