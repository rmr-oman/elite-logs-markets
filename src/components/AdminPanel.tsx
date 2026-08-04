import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../state";
import { Category, Product, OrderStatus, PRESET_CATEGORIES } from "../types";
import { fileToDataUrl } from "../lib/imageUtils";
import { 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Clipboard, 
  CheckCircle, 
  Edit, 
  Trash2, 
  Plus, 
  FileImage, 
  Database, 
  Eye, 
  Sparkles,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Upload,
  X,
  ArrowRight,
  Check,
  Coins,
  ExternalLink,
  User,
  Send,
  MessageSquare,
  HelpCircle,
  Users,
  Search,
  Key,
  EyeOff,
  Wallet,
  ShieldAlert,
  Camera,
  Save,
  AlertCircle
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    currentUser,
    setView,
    products, 
    orders, 
    updateOrderStatus, 
    addDeliveredCredentials, 
    addNewProduct, 
    editProduct,
    deleteProduct, 
    updateStock, 
    generateMockOrder,
    paymentGateways,
    addPaymentGateway,
    updatePaymentGateway,
    deletePaymentGateway,
    topUpRequests,
    approveTopUp,
    rejectTopUp,
    chatMessages,
    sendChatMessage,
    supportSettings,
    updateSupportSettings,
    faqs,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    registeredUsers,
    adjustUserBalance,
    toggleUserAdmin,
    updateUserProfile
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "gateways" | "topups" | "chats" | "faqs" | "users" | "admin-profile">("orders");
  const [selectedOrderScreenshot, setSelectedOrderScreenshot] = useState<string | null>(null);

  // Admin Profile states
  const [adminFullName, setAdminFullName] = useState(currentUser.fullName || "");
  const [adminUsername, setAdminUsername] = useState(currentUser.username || "");
  const [adminPhone, setAdminPhone] = useState(currentUser.phone || "");
  const [adminBio, setAdminBio] = useState(currentUser.bio || "");
  const [adminAvatarUrl, setAdminAvatarUrl] = useState(currentUser.avatarUrl || "");
  const [isAdminAvatarUploading, setIsAdminAvatarUploading] = useState(false);
  const [adminProfileMsg, setAdminProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [adminOldPassword, setAdminOldPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [adminPasswordMsg, setAdminPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setAdminFullName(currentUser.fullName || "");
    setAdminUsername(currentUser.username || "");
    setAdminPhone(currentUser.phone || "");
    setAdminBio(currentUser.bio || "");
    setAdminAvatarUrl(currentUser.avatarUrl || "");
  }, [currentUser]);

  const handleAdminAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAdminProfileMsg({ type: "error", text: "Please select a valid image file." });
      return;
    }

    setIsAdminAvatarUploading(true);
    setAdminProfileMsg(null);
    try {
      const dataUrl = await fileToDataUrl(file, 400, 400, 0.85);
      setAdminAvatarUrl(dataUrl);
      const res = await updateUserProfile({ avatarUrl: dataUrl });
      if (res.success) {
        setAdminProfileMsg({ type: "success", text: "Admin avatar updated successfully!" });
      }
    } catch (err) {
      setAdminProfileMsg({ type: "error", text: "Failed to process image file." });
    } finally {
      setIsAdminAvatarUploading(false);
    }
  };

  const handleAdminProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfileMsg(null);

    if (!adminUsername.trim()) {
      setAdminProfileMsg({ type: "error", text: "Username cannot be empty." });
      return;
    }

    const res = await updateUserProfile({
      fullName: adminFullName.trim(),
      username: adminUsername.trim(),
      phone: adminPhone.trim(),
      bio: adminBio.trim()
    });

    if (res.success) {
      setAdminProfileMsg({ type: "success", text: "Admin profile updated successfully!" });
    } else {
      setAdminProfileMsg({ type: "error", text: res.message });
    }
  };

  const handleAdminPasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPasswordMsg(null);

    if (!adminOldPassword.trim()) {
      setAdminPasswordMsg({ type: "error", text: "Please enter your current admin password." });
      return;
    }
    if (adminNewPassword.length < 8) {
      setAdminPasswordMsg({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }
    if (!/[A-Z]/.test(adminNewPassword) || !/[a-z]/.test(adminNewPassword)) {
      setAdminPasswordMsg({ type: "error", text: "Password must contain both uppercase and lowercase letters." });
      return;
    }
    if (!/[0-9!@#$%^&*]/.test(adminNewPassword)) {
      setAdminPasswordMsg({ type: "error", text: "Password must contain at least one number or special character." });
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    const res = await updateUserProfile({
      oldPasswordVal: adminOldPassword,
      passwordVal: adminNewPassword
    });

    if (res.success) {
      setAdminPasswordMsg({ type: "success", text: "Master Admin password updated successfully!" });
      setAdminOldPassword("");
      setAdminNewPassword("");
      setAdminConfirmPassword("");
    } else {
      setAdminPasswordMsg({ type: "error", text: res.message });
    }
  };

  // Password rules checks for Admin
  const adminHasMinLen = adminNewPassword.length >= 8;
  const adminHasMixedCase = /[A-Z]/.test(adminNewPassword) && /[a-z]/.test(adminNewPassword);
  const adminHasNumOrSpec = /[0-9!@#$%^&*]/.test(adminNewPassword);
  const adminIsMatch = adminNewPassword.length > 0 && adminNewPassword === adminConfirmPassword;

  // Users Vault states
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [editingBalanceEmail, setEditingBalanceEmail] = useState<string | null>(null);
  const [newBalanceInput, setNewBalanceInput] = useState<string>("");
  const [visiblePasswords, setVisiblePasswords] = useState<{ [email: string]: boolean }>({});

  // Live support states
  const [selectedChatConvId, setSelectedChatConvId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const adminMessagesEndRef = useRef<HTMLDivElement | null>(null);

  // Social & support channel settings states
  const [tgInput, setTgInput] = useState("");
  const [waInput, setWaInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (currentUser.isGuest || !currentUser.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 max-w-md mx-auto text-center font-sans">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm mb-5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="h-10 w-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-white">Access Unauthorized</h2>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          The console you requested is restricted to authenticated server administrators. Please authenticate using the credential portal.
        </p>
        <button
          onClick={() => setView("auth")}
          className="mt-6 px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_0_10px_rgba(255,0,255,0.3)] active:scale-95 cursor-pointer"
        >
          Proceed to Login
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (supportSettings) {
      setTgInput(supportSettings.telegramLink || "");
      setWaInput(supportSettings.whatsappLink || "");
    }
  }, [supportSettings]);

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    let finalTg = tgInput.trim();
    if (finalTg && !finalTg.startsWith("http://") && !finalTg.startsWith("https://")) {
      if (finalTg.startsWith("t.me/")) {
        finalTg = "https://" + finalTg;
      } else {
        finalTg = "https://t.me/" + finalTg;
      }
    }

    let finalWa = waInput.trim();
    if (finalWa && !finalWa.startsWith("http://") && !finalWa.startsWith("https://")) {
      if (finalWa.startsWith("wa.me/")) {
        finalWa = "https://" + finalWa;
      } else {
        const cleaned = finalWa.replace(/^\+/, "");
        finalWa = "https://wa.me/" + cleaned;
      }
    }

    await updateSupportSettings({
      telegramLink: finalTg || "https://t.me/",
      whatsappLink: finalWa || "https://wa.me/"
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  useEffect(() => {
    if (adminMessagesEndRef.current) {
      adminMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, selectedChatConvId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChatConvId) return;
    await sendChatMessage(replyText, selectedChatConvId);
    setReplyText("");
  };

  // New product form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState<Category>("Virtual Numbers / Messaging Apps");
  const [newProdSubCategory, setNewProdSubCategory] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("15.00");
  const [newProdStock, setNewProdStock] = useState("50");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdDelivery, setNewProdDelivery] = useState<"Instant" | "Manual">("Instant");
  const [newProdFeatures, setNewProdFeatures] = useState("");
  const [newProdCredentials, setNewProdCredentials] = useState("");
  const [newProdImage, setNewProdImage] = useState("");

  // Editing product states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState<Category>("Virtual Numbers / Messaging Apps");
  const [editProdSubCategory, setEditProdSubCategory] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdStock, setEditProdStock] = useState("");
  const [editProdDesc, setEditProdDesc] = useState("");
  const [editProdDelivery, setEditProdDelivery] = useState<"Instant" | "Manual">("Instant");
  const [editProdFeatures, setEditProdFeatures] = useState("");
  const [editProdImage, setEditProdImage] = useState("");

  // Manual Credentials text box state per order
  const [manualCredText, setManualCredText] = useState<{ [orderId: string]: string }>({});

  // FAQ Creator & Editor states
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState("General");

  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqQuestion, setEditFaqQuestion] = useState("");
  const [editFaqAnswer, setEditFaqAnswer] = useState("");
  const [editFaqCategory, setEditFaqCategory] = useState("General");

  // Calculations
  const totalRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((acc, o) => acc + o.totalPrice, 0);

  const totalAccountsSold = orders
    .filter(o => o.status === "Completed")
    .reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const processingCount = orders.filter(o => o.status === "Processing").length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const pendingTopupsCount = topUpRequests.filter(r => r.status === "Pending").length;

  const getDepositStats = () => {
    const now = new Date();
    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    topUpRequests
      .filter(r => r.status === "Approved")
      .forEach(r => {
        try {
          const reqDate = new Date(r.date);
          const diffTime = Math.abs(now.getTime() - reqDate.getTime());
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          if (diffDays <= 1) {
            daily += r.amount;
          }
          if (diffDays <= 7) {
            weekly += r.amount;
          }
          if (diffDays <= 30) {
            monthly += r.amount;
          }
        } catch (e) {
          console.error(e);
        }
      });

    return { daily, weekly, monthly };
  };

  const depositStats = getDepositStats();

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim()) return;

    const feats = newProdFeatures
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const defaultCreds = newProdCredentials
      .split("\n")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const defaultImage = newProdImage.trim() || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop";

    addNewProduct({
      name: newProdName,
      category: newProdCategory,
      subCategory: newProdSubCategory || "Verified Premium",
      price: parseFloat(newProdPrice) || 10.00,
      stock: parseInt(newProdStock) || 0,
      description: newProdDesc,
      deliveryType: newProdDelivery,
      features: feats.length > 0 ? feats : ["7-Day warranty", "High Authority IP PVA", "Instant release key"],
      imageUrl: defaultImage,
      defaultCredentials: defaultCreds,
      specs: {
        "Delivery Type": newProdDelivery,
        "Carrier Node": "Pristine High-Trust",
        "Warmed Age": "Fresh / Aged Logs",
        "Stock Security": "Fully Escrow Locked"
      }
    });

    // Reset fields
    setNewProdName("");
    setNewProdSubCategory("");
    setNewProdDesc("");
    setNewProdFeatures("");
    setNewProdCredentials("");
    setNewProdImage("");
  };

  const handleUpdateManualCredentials = (orderId: string) => {
    const credText = manualCredText[orderId];
    if (!credText || !credText.trim()) return;

    const credsList = credText
      .split("\n")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (credsList.length > 0) {
      addDeliveredCredentials(orderId, credsList);
      updateOrderStatus(orderId, "Completed");
      // Clear manual box input
      setManualCredText(prev => ({ ...prev, [orderId]: "" }));
    }
  };

  if (!currentUser || currentUser.isGuest || !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6" id="admin-restricted-view">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-wider italic text-white">Admin Access Restricted</h2>
        <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
          You do not have administrative privileges. Please log in with an administrator account to access the Master Control Desk.
        </p>
        <button
          onClick={() => setView("home")}
          className="px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-black font-black uppercase text-xs tracking-widest rounded-sm cursor-pointer select-none"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Admin Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neon-purple/20 border border-neon-purple text-neon-purple rounded-sm neon-glow-purple">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase text-white leading-tight">Master Admin Control Desk</h2>
            <p className="text-xs text-white/50 mt-1">Configure live support gateways, restock catalogs, and verify dynamic escrow balances.</p>
          </div>
        </div>
      </section>

      {/* KPI Stats Widgets Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">Completed Revenue</span>
            <span className="text-2xl font-black text-neon-green font-mono mt-1">${totalRevenue.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] text-white/50 font-mono">
            <span>Accounts Sold:</span>
            <span className="text-white font-extrabold">{totalAccountsSold} Items</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-between space-y-3">
          <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">User Deposit Ledger</span>
          <div className="space-y-1 font-mono text-[10px] text-white/60">
            <div className="flex justify-between">
              <span>Daily:</span>
              <span className="text-neon-green font-bold">${depositStats.daily.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Weekly:</span>
              <span className="text-neon-blue font-bold">${depositStats.weekly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly:</span>
              <span className="text-neon-purple font-bold">${depositStats.monthly.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">Pending Top-Ups</span>
            <span className="text-2xl font-black text-neon-blue font-mono mt-1">
              {pendingTopupsCount} Requests
            </span>
          </div>
          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] text-white/50 font-mono">
            <span>Status:</span>
            <span className={pendingTopupsCount > 0 ? "text-neon-blue animate-pulse font-extrabold" : "text-white/40"}>
              {pendingTopupsCount > 0 ? "Needs Review" : "Fully Approved"}
            </span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest block">Escrow Pipeline</span>
            <span className="text-2xl font-black text-neon-purple font-mono mt-1">
              {pendingCount + processingCount} Active
            </span>
          </div>
          <div className="border-t border-white/5 pt-2 grid grid-cols-2 gap-1 text-[9px] text-white/40 font-mono text-center">
            <div className="border-r border-white/5">
              <span className="block text-neon-blue font-bold">{pendingCount}</span>
              <span>Pending</span>
            </div>
            <div>
              <span className="block text-neon-green font-bold">{processingCount}</span>
              <span>Processing</span>
            </div>
          </div>
        </div>

      </div>

      {/* Support & Telegram Channels Configuration Card */}
      <section className="glass-card p-6 rounded-sm border border-white/5 bg-[#0A0A0E]/60">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
          <MessageSquare className="h-4 w-4 text-neon-blue" />
          <h3 className="text-xs font-black uppercase text-white tracking-widest">
            Home Support & Telegram Channels Handshake
          </h3>
        </div>
        <p className="text-[10px] text-white/40 mb-4 leading-relaxed font-sans">
          Update the real-time support group links displayed on the front page. You can input raw handles (e.g. <code className="text-neon-blue">my_channel</code>) or fully qualified links (e.g. <code className="text-neon-blue">https://t.me/my_channel</code>).
        </p>

        <form onSubmit={handleSaveSocialLinks} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              Telegram Channel / Handle
            </label>
            <div className="relative">
              <input
                type="text"
                value={tgInput}
                onChange={(e) => setTgInput(e.target.value)}
                placeholder="e.g. my_channel or https://t.me/my_channel"
                className="w-full bg-[#0E0E12] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 font-mono"
              />
            </div>
            <p className="text-[9px] text-white/30 font-mono">
              Live Link: <a href={supportSettings?.telegramLink} target="_blank" rel="noreferrer" className="text-neon-blue underline">{supportSettings?.telegramLink || "None"}</a>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
              WhatsApp Support Number / Link
            </label>
            <div className="relative">
              <input
                type="text"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                placeholder="e.g. +123456789 or https://wa.me/123456789"
                className="w-full bg-[#0E0E12] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 font-mono"
              />
            </div>
            <p className="text-[9px] text-white/30 font-mono">
              Live Link: <a href={supportSettings?.whatsappLink} target="_blank" rel="noreferrer" className="text-neon-blue underline">{supportSettings?.whatsappLink || "None"}</a>
            </p>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-white/5">
            <div className="text-left">
              {saveSuccess && (
                <span className="text-[10px] text-neon-green font-mono font-bold flex items-center gap-1.5 animate-pulse">
                  <Check className="h-3.5 w-3.5" />
                  Live Channels Handshake Synchronized successfully!
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto bg-neon-blue hover:bg-neon-blue/90 text-black font-black px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest transition-all select-none cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSaving ? "Syncing..." : "Update Live Support Links"}
            </button>
          </div>
        </form>
      </section>

      {/* Administrative Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "orders" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <span>Escrow Order Pipeline ({orders.length})</span>
          {activeTab === "orders" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "catalog" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <span>Catalog & Stock Manager ({products.length})</span>
          {activeTab === "catalog" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("gateways")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "gateways" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <span>Payment Gateways ({paymentGateways.length})</span>
          {activeTab === "gateways" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("topups")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "topups" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Top-Up Requests ({topUpRequests.length})</span>
            {pendingTopupsCount > 0 && (
              <span className="bg-neon-blue text-black px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black animate-pulse shadow-[0_0_8px_rgba(0,191,255,0.4)]">
                {pendingTopupsCount} Pending
              </span>
            )}
          </div>
          {activeTab === "topups" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("chats")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "chats" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>Support Chats ({Array.from(new Set(chatMessages.map(m => m.conversationId))).length})</span>
            {chatMessages.length > 0 && (
              <span className="bg-neon-purple text-white px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.4)]">
                Live
              </span>
            )}
          </div>
          {activeTab === "chats" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "faqs" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <span>FAQ & Support Editor ({faqs.length})</span>
          {activeTab === "faqs" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "users" ? "text-neon-blue" : "text-white/40 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Users Vault ({registeredUsers.length})</span>
          </div>
          {activeTab === "users" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-blue"></div>}
        </button>

        <button
          onClick={() => setActiveTab("admin-profile")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-colors relative ${
            activeTab === "admin-profile" ? "text-neon-purple font-black" : "text-white/40 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-neon-purple" />
            <span>Admin Profile & System Credentials</span>
          </div>
          {activeTab === "admin-profile" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-purple"></div>}
        </button>
      </div>

      {/* TABS BODY */}
      {activeTab === "orders" && (
        
        /*Tab 1: Order Pipeline Manager*/
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase text-white tracking-widest">Escrow Registry queue</h3>
            <span className="text-xs text-white/30 font-mono">Live Sync: Active</span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((o) => {
                const isCompleted = o.status === "Completed";
                const isProcessing = o.status === "Processing";
                const isPending = o.status === "Pending";

                return (
                  <div 
                    key={o.id}
                    className={`glass-card p-6 rounded-sm border transition-all ${
                      isPending ? "border-neon-blue/20" : isProcessing ? "border-neon-purple/20" : "border-white/5"
                    }`}
                  >
                    
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4 text-xs font-mono">
                      <div>
                        <span className="text-white/40 uppercase">Txn ID: </span>
                        <strong className="text-white font-bold">{o.id}</strong>
                        <span className="text-white/30 mx-2">•</span>
                        <span className="text-white/40 uppercase">Client: </span>
                        <span className="text-white font-bold">{o.customerName} ({o.customerEmail})</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Status update buttons */}
                        {isPending && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "Processing")}
                            className="bg-neon-purple/20 border border-neon-purple text-neon-purple hover:bg-neon-purple/30 text-[10px] font-bold uppercase px-3 py-1 rounded"
                          >
                            Set Processing
                          </button>
                        )}
                        {(isPending || isProcessing) && (
                          <button
                            onClick={() => updateOrderStatus(o.id, "Completed")}
                            className="bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30 text-[10px] font-bold uppercase px-3 py-1 rounded"
                          >
                            Auto Complete (Stock)
                          </button>
                        )}
                        <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase ${
                          isCompleted 
                            ? "bg-neon-green/10 text-neon-green border-neon-green/20" 
                            : isProcessing 
                              ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20" 
                              : "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle grid details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      
                      {/* Left: Items details and price */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase text-white/40 tracking-wider">Line items acquired</h4>
                        <ul className="space-y-1 text-white font-bold">
                          {o.items.map((i, index) => (
                            <li key={index}>• {i.name} (x{i.quantity})</li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-white/40 mt-1 uppercase font-mono">
                          Payment Gateway: <strong className="text-white font-bold">{o.paymentMethod}</strong>
                        </p>
                        <p className="text-[10px] text-white/40 uppercase font-mono">
                          Total Escrow: <strong className="text-neon-green font-bold">${o.totalPrice.toFixed(2)}</strong>
                        </p>
                      </div>

                      {/* Middle: Client details and receipt screenshot verification */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase text-white/40 tracking-wider">Verification credentials</h4>
                        <p className="text-white font-bold">Social Handle: {o.customerSocial}</p>
                        
                        {o.screenshotUrl && (
                          <div className="pt-2">
                            <button
                              onClick={() => setSelectedOrderScreenshot(o.screenshotUrl)}
                              className="inline-flex items-center gap-1.5 text-neon-blue hover:underline font-bold"
                            >
                              <FileImage className="h-4 w-4" />
                              <span>Inspect Receipt Screenshot</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Manual delivery logs input */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase text-white/40 tracking-wider flex justify-between">
                          <span>Delivered Credentials</span>
                          {isCompleted && <span className="text-neon-green font-semibold">Active</span>}
                        </h4>

                        {!isCompleted ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={manualCredText[o.id] || ""}
                              onChange={(e) => setManualCredText(prev => ({ ...prev, [o.id]: e.target.value }))}
                              placeholder="Insert released log credentials (one per line)"
                              className="w-full bg-white/5 border border-white/10 rounded focus:border-neon-blue/40 focus:outline-none p-2 text-xs text-white"
                            />
                            <button
                              onClick={() => handleUpdateManualCredentials(o.id)}
                              className="w-full bg-neon-blue hover:bg-neon-blue/95 text-black font-black py-1.5 rounded text-[10px] uppercase tracking-wider select-none cursor-pointer"
                            >
                              Deliver Keys & Set Completed
                            </button>
                          </div>
                        ) : (
                          <div className="bg-white/5 p-3 rounded text-[10px] text-white/60 font-mono divide-y divide-white/5 max-h-24 overflow-y-auto">
                            {o.deliveredCredentials && o.deliveredCredentials.map((cred, idx) => (
                              <p key={idx} className="py-1 break-all">{cred}</p>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-sm">
              <Clipboard className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-xs text-white/40 font-bold uppercase">No orders registered in sandbox database</p>
            </div>
          )}

        </div>
      )}

      {activeTab === "catalog" && (
        
        /*Tab 2: Catalog & Stock Manager*/
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Create New Product Form */}
          <div className="lg:col-span-5 glass-card p-6 rounded-sm border border-white/5 space-y-6">
            <h3 className="text-sm font-black uppercase text-white tracking-widest border-b border-white/5 pb-3">
              Add New Catalog Asset
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              {/* DYNAMIC PRODUCT NAME SECTION */}
              {newProdSubCategory === "Others" ? (
                <div className="space-y-1.5 p-3.5 bg-neon-blue/5 border border-neon-blue/20 rounded-sm">
                  <label className="block text-[10px] uppercase font-extrabold text-neon-blue tracking-wider">Custom Product Name</label>
                  <input 
                    type="text" 
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Enter unique product name here..."
                    required
                    className="w-full bg-[#050508] border border-neon-blue/30 rounded p-2 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue font-bold text-xs"
                  />
                  <p className="text-[8px] text-white/40 leading-snug">
                    Since you selected the <strong>"Others"</strong> sub-category option, please specify the exact Product Name manually.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-3 bg-white/[0.02] border border-white/5 rounded-sm flex justify-between items-center">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-white/40 tracking-wider">Product Name (Synced)</label>
                    <span className="text-white font-black uppercase text-xs tracking-wide block mt-0.5">
                      {newProdName || newProdSubCategory || "Select Sub-Category"}
                    </span>
                  </div>
                  <span className="text-[8px] bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-black">
                    Auto
                  </span>
                </div>
              )}

              {/* INTERACTIVE ARROW-FLOW CATEGORY & SUB-CATEGORY SYSTEM */}
              <div className="space-y-4 p-4 rounded-sm bg-white/[0.02] border border-white/5">
                <div>
                  <span className="block text-[10px] uppercase font-black text-[#00BFFF] tracking-widest mb-2.5">
                    Step 1: Choose Core Category
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_CATEGORIES.map((preset, index) => {
                      const isSelected = newProdCategory === preset.name;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setNewProdCategory(preset.name);
                            if (preset.subcategories.length > 0) {
                              const firstSub = preset.subcategories[0];
                              setNewProdSubCategory(firstSub);
                              setNewProdName(firstSub);
                            } else {
                              setNewProdSubCategory("Others");
                              setNewProdName("");
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-sm text-left transition-all select-none cursor-pointer border ${
                            isSelected
                              ? "bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_15px_rgba(0,191,255,0.15)]"
                              : "bg-black/40 border-white/5 hover:border-white/20 text-white/60 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{preset.emoji}</span>
                            <div>
                              <span className="text-[8px] font-bold block leading-none text-white/40 mb-0.5">Category {index + 1}</span>
                              <span className="text-[10px] font-black uppercase tracking-tight">{preset.name}</span>
                            </div>
                          </div>
                          {isSelected && <ArrowRight className="h-3.5 w-3.5 text-neon-blue animate-pulse" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Category section linked by beautiful visual arrow indicators */}
                <div className="relative pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="text-[10px] uppercase font-black text-neon-green tracking-widest">
                      Step 2: Select Sub-Category
                    </span>
                    <ArrowRight className="h-3 w-3 text-neon-green" />
                    <span className="text-[9px] font-mono text-white/40 italic">
                      {newProdCategory} sub-assets
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(() => {
                      const presetSubs = PRESET_CATEGORIES.find(c => c.name === newProdCategory)?.subcategories || [];
                      const allSubs = [...presetSubs, "Others"];
                      return allSubs.map((sub) => {
                        const isSelected = newProdSubCategory === sub;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setNewProdSubCategory(sub);
                              if (sub !== "Others") {
                                setNewProdName(sub);
                              } else {
                                setNewProdName("");
                              }
                            }}
                            className={`px-2.5 py-1.5 rounded-sm text-[9px] font-extrabold uppercase tracking-tight transition-all select-none cursor-pointer border flex items-center gap-1 ${
                              isSelected
                                ? "bg-neon-green/15 border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                                : "bg-black/30 border-white/5 text-white/50 hover:border-white/25 hover:text-white"
                            }`}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 text-neon-green" />}
                            <span>{sub}</span>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Manual override input fields just in case */}
                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5 bg-black/20 p-2.5 rounded-sm">
                  <div className="space-y-1">
                    <label className="block text-[8px] uppercase font-bold text-white/30">Custom Category (Override)</label>
                    <input 
                      type="text" 
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      placeholder="Or type custom category..."
                      className="w-full bg-[#050508] border border-white/10 rounded-sm p-1.5 text-white text-[9px] focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[8px] uppercase font-bold text-white/30">Custom Sub-Category (Override)</label>
                    <input 
                      type="text" 
                      value={newProdSubCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewProdSubCategory(val);
                        if (val !== "Others") {
                          setNewProdName(val);
                        }
                      }}
                      placeholder="Or type custom subcategory..."
                      className="w-full bg-[#050508] border border-white/10 rounded-sm p-1.5 text-white text-[9px] focus:outline-none focus:border-neon-blue font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-white/40">Price (USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="15.00"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-neon-blue font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-white/40">Initial Stock</label>
                  <input 
                    type="number" 
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="50"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-neon-blue font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-white/40">Delivery Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      checked={newProdDelivery === "Instant"}
                      onChange={() => setNewProdDelivery("Instant")}
                    />
                    <span>⚡ Instant Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      name="deliveryType" 
                      checked={newProdDelivery === "Manual"}
                      onChange={() => setNewProdDelivery("Manual")}
                    />
                    <span>⏳ Manual Delivery</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-white/40">Description</label>
                <textarea 
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Detailed product information..."
                  required
                  className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-white/40">Features (one per line)</label>
                <textarea 
                  rows={2}
                  value={newProdFeatures}
                  onChange={(e) => setNewProdFeatures(e.target.value)}
                  placeholder="7-Day replacement warranty&#10;USA Clean Phone PVA&#10;Premium carriers"
                  className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-white/40">Credentials Seed stock (one per line, for Auto-delivery)</label>
                <textarea 
                  rows={2}
                  value={newProdCredentials}
                  onChange={(e) => setNewProdCredentials(e.target.value)}
                  placeholder="gvoice_user_1:gvoice_pass_1:recovery_1@mail.com&#10;gvoice_user_2:gvoice_pass_2:recovery_2@mail.com"
                  className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue"
                />
              </div>

              {/* Product Image Selection & Upload Options */}
              <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-sm">
                <label className="block text-[10px] uppercase font-bold text-white/50 tracking-wider">Product Asset Image / Icon</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Box */}
                  <div className="flex flex-col justify-center items-center p-3 border border-dashed border-white/10 rounded bg-white/5 hover:bg-white/10 transition-all relative min-h-[90px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProdImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="h-5 w-5 text-neon-blue mb-1" />
                    <span className="text-[10px] font-bold text-white">Upload Image File</span>
                    <span className="text-[8px] text-white/40 text-center mt-0.5">JPG, PNG, GIF up to 5MB</span>
                  </div>

                  {/* Manual URL Input */}
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <input 
                        type="text" 
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="Or paste custom image URL..."
                        className="w-full bg-[#0B0B0F] border border-white/10 rounded p-2 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue font-mono text-[10px]"
                      />
                    </div>
                    <p className="text-[9px] text-white/40 leading-snug">
                      Drag & drop any product picture, choose a file, paste an external link, or select one of the templates below.
                    </p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-extrabold text-white/30 tracking-wider">Select Premium Presets</span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
                    {[
                      { name: "Google Voice / Call", url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=300&auto=format&fit=crop" },
                      { name: "Telegram / Social", url: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?q=80&w=300&auto=format&fit=crop" },
                      { name: "Discord Premium", url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=300&auto=format&fit=crop" },
                      { name: "VPN / Cyber SSH", url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=300&auto=format&fit=crop" },
                      { name: "Finance / bKash Nagad", url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=300&auto=format&fit=crop" }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewProdImage(preset.url)}
                        className={`px-2 py-1 rounded border text-[9px] font-bold uppercase transition-all whitespace-nowrap select-none cursor-pointer ${
                          newProdImage === preset.url 
                            ? "bg-neon-blue/10 border-neon-blue text-white" 
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                        }`}
                        title={preset.name}
                      >
                        {preset.name.split(" / ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {newProdImage && (
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded p-2 mt-1">
                    <div className="flex items-center gap-2">
                      <img src={newProdImage} alt="Selected preview" className="h-8 w-8 object-cover rounded bg-black border border-white/10" />
                      <div>
                        <span className="text-[9px] text-neon-green font-bold block uppercase">Asset Selected</span>
                        <span className="text-[8px] text-white/30 font-mono block max-w-[150px] truncate">{newProdImage}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewProdImage("")}
                      className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-500 transition-colors"
                      title="Clear Image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-neon-blue hover:bg-neon-blue/95 text-black font-black py-3 rounded-sm uppercase tracking-widest select-none cursor-pointer transition-all active:scale-95"
              >
                Create Catalog Item
              </button>

            </form>
          </div>

          {/* Right: Existing Catalog list with Restock tools */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-black uppercase text-white tracking-widest">
              Cataloged Stock level managers
            </h3>

            <div className="space-y-3">
              {products.map((p) => {
                const isWarn = p.stock <= 5;
                const isOut = p.stock <= 0;

                if (editingProductId === p.id) {
                  return (
                    <div 
                      key={p.id}
                      className="glass-card p-5 rounded-sm border border-neon-blue/30 space-y-4 text-xs font-sans"
                    >
                      <h4 className="font-extrabold uppercase text-white tracking-wider flex items-center gap-1.5">
                        <Edit className="h-4 w-4 text-neon-blue" />
                        <span>Edit Catalog Asset</span>
                      </h4>

                      <div className="space-y-3">
                        {/* DYNAMIC EDIT PRODUCT NAME SECTION */}
                        {editProdSubCategory === "Others" ? (
                          <div className="space-y-1 p-2 bg-neon-blue/5 border border-neon-blue/20 rounded-sm">
                            <label className="block text-[9px] uppercase font-bold text-neon-blue">Custom Product Name</label>
                            <input 
                              type="text" 
                              value={editProdName}
                              onChange={(e) => setEditProdName(e.target.value)}
                              placeholder="Enter custom product name..."
                              required
                              className="w-full bg-[#050508] border border-neon-blue/20 rounded p-1.5 text-white text-[11px] font-bold"
                            />
                            <p className="text-[8px] text-white/40">Since "Others" sub-category is active, enter a custom product name.</p>
                          </div>
                        ) : (
                          <div className="space-y-1 p-2 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center text-[10px]">
                            <div>
                              <span className="block text-[8px] uppercase font-bold text-white/40">Product Name (Synced)</span>
                              <span className="text-white font-black uppercase text-xs">
                                {editProdName || editProdSubCategory || "Select Sub-Category"}
                              </span>
                            </div>
                            <span className="text-[8px] bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-1 py-0.5 rounded font-mono uppercase tracking-widest font-black">
                              Auto
                            </span>
                          </div>
                        )}

                        {/* INTERACTIVE EDIT ARROW CATEGORY SYSTEM */}
                        <div className="space-y-3 p-3 bg-white/[0.01] border border-white/5 rounded-sm">
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-neon-blue tracking-wider mb-2">
                              Choose Core Category
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {PRESET_CATEGORIES.map((preset, index) => {
                                const isSelected = editProdCategory === preset.name;
                                return (
                                  <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => {
                                      setEditProdCategory(preset.name);
                                      if (preset.subcategories.length > 0) {
                                        const firstSub = preset.subcategories[0];
                                        setEditProdSubCategory(firstSub);
                                        setEditProdName(firstSub);
                                      } else {
                                        setEditProdSubCategory("Others");
                                        setEditProdName("");
                                      }
                                    }}
                                    className={`flex items-center justify-between p-2 rounded text-left transition-all select-none cursor-pointer border text-[10px] ${
                                      isSelected
                                        ? "bg-neon-blue/15 border-neon-blue/60 text-white"
                                        : "bg-black/30 border-white/5 text-white/50 hover:border-white/10"
                                    }`}
                                  >
                                    <span className="truncate">{preset.emoji} {preset.name}</span>
                                    {isSelected && <ArrowRight className="h-3 w-3 text-neon-blue flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            <span className="block text-[9px] uppercase font-bold text-neon-green tracking-wider mb-2">
                              Select Sub-Category →
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {(() => {
                                const presetSubs = PRESET_CATEGORIES.find(c => c.name === editProdCategory)?.subcategories || [];
                                const allSubs = [...presetSubs, "Others"];
                                return allSubs.map((sub) => {
                                  const isSelected = editProdSubCategory === sub;
                                  return (
                                    <button
                                      key={sub}
                                      type="button"
                                      onClick={() => {
                                        setEditProdSubCategory(sub);
                                        if (sub !== "Others") {
                                          setEditProdName(sub);
                                        } else {
                                          setEditProdName("");
                                        }
                                      }}
                                      className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase transition-all select-none cursor-pointer border flex items-center gap-1 ${
                                        isSelected
                                          ? "bg-neon-green/15 border-neon-green/60 text-neon-green"
                                          : "bg-black/30 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                                      }`}
                                    >
                                      {isSelected && <Check className="h-2 w-2 text-neon-green" />}
                                      <span>{sub}</span>
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                            <div>
                              <label className="block text-[8px] uppercase font-bold text-white/30 mb-1">Custom Category</label>
                              <input 
                                type="text" 
                                value={editProdCategory}
                                onChange={(e) => setEditProdCategory(e.target.value)}
                                className="w-full bg-[#050508] border border-white/10 rounded p-1 text-white text-[9px] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] uppercase font-bold text-white/30 mb-1">Custom Subcategory</label>
                              <input 
                                type="text" 
                                value={editProdSubCategory}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditProdSubCategory(val);
                                  if (val !== "Others") {
                                    setEditProdName(val);
                                  }
                                }}
                                className="w-full bg-[#050508] border border-white/10 rounded p-1 text-white text-[9px] font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] uppercase font-bold text-white/40">Price (USD)</label>
                            <input 
                              type="number" 
                              step="0.01"
                              value={editProdPrice}
                              onChange={(e) => setEditProdPrice(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded p-2 text-white font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[9px] uppercase font-bold text-white/40">Stock</label>
                            <input 
                              type="number" 
                              value={editProdStock}
                              onChange={(e) => setEditProdStock(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded p-2 text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[9px] uppercase font-bold text-white/40">Delivery Type</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-1.5 text-white">
                                <input 
                                  type="radio" 
                                  name={`editDelivery-${p.id}`}
                                  checked={editProdDelivery === "Instant"}
                                  onChange={() => setEditProdDelivery("Instant")}
                                />
                                <span className="text-[10px]">⚡ Instant</span>
                              </label>
                              <label className="flex items-center gap-1.5 text-white">
                                <input 
                                  type="radio" 
                                  name={`editDelivery-${p.id}`}
                                  checked={editProdDelivery === "Manual"}
                                  onChange={() => setEditProdDelivery("Manual")}
                                />
                                <span className="text-[10px]">⏳ Manual</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] uppercase font-bold text-white/40">Description</label>
                          <textarea 
                            rows={2}
                            value={editProdDesc}
                            onChange={(e) => setEditProdDesc(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] uppercase font-bold text-white/40">Features (one per line)</label>
                          <textarea 
                            rows={2}
                            value={editProdFeatures}
                            onChange={(e) => setEditProdFeatures(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-white"
                          />
                        </div>

                        {/* Image Option for edit mode */}
                        <div className="space-y-2 p-3 bg-white/[0.02] border border-white/5 rounded">
                          <label className="block text-[9px] uppercase font-bold text-white/40 font-bold">Edit Product Image</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex flex-col justify-center items-center p-2 border border-dashed border-white/10 rounded bg-white/5 hover:bg-white/10 transition-all relative min-h-[60px] cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setEditProdImage(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <Upload className="h-4 w-4 text-neon-blue mb-0.5" />
                              <span className="text-[9px] font-bold text-white">Upload Image File</span>
                            </div>

                            <input 
                              type="text" 
                              value={editProdImage}
                              onChange={(e) => setEditProdImage(e.target.value)}
                              placeholder="Or paste external image URL..."
                              className="w-full bg-[#0B0B0F] border border-white/10 rounded p-2 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-blue font-mono text-[9px] self-center"
                            />
                          </div>

                          {editProdImage && (
                            <div className="flex items-center gap-2 mt-1">
                              <img src={editProdImage} alt="Edit preview" className="h-8 w-8 object-cover rounded bg-black" />
                              <span className="text-[8px] text-white/30 truncate flex-1 font-mono">{editProdImage}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="px-4 py-1.5 rounded bg-white/5 border border-white/10 text-white/60 hover:text-white uppercase font-bold select-none cursor-pointer text-[10px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const feats = editProdFeatures
                              .split("\n")
                              .map(f => f.trim())
                              .filter(f => f.length > 0);

                            editProduct({
                              ...p,
                              name: editProdName,
                              category: editProdCategory,
                              subCategory: editProdSubCategory,
                              price: parseFloat(editProdPrice) || p.price,
                              stock: parseInt(editProdStock) || 0,
                              description: editProdDesc,
                              deliveryType: editProdDelivery,
                              features: feats,
                              imageUrl: editProdImage.trim() || p.imageUrl
                            });
                            setEditingProductId(null);
                          }}
                          className="px-4 py-1.5 rounded bg-neon-blue text-black uppercase font-black select-none cursor-pointer text-[10px]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={p.id}
                    className="glass-card p-4 rounded-sm border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <img className="h-10 w-10 object-cover rounded bg-white/5" src={p.imageUrl} alt={p.name} />
                      <div>
                        <h4 className="font-bold text-white leading-tight line-clamp-1">{p.name}</h4>
                        <span className="text-[9px] text-white/40 block mt-0.5">
                          Category: {p.category} | Price: <strong>${p.price.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      
                      {/* Adjust stock */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/40 uppercase">Stock:</span>
                        <input 
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateStock(p.id, parseInt(e.target.value) || 0)}
                          className="w-14 bg-white/5 border border-white/10 rounded py-1 px-1.5 text-center text-xs text-white font-mono"
                        />
                        {isOut ? (
                          <span className="text-red-500 font-bold text-[9px] uppercase tracking-wider">OUT</span>
                        ) : isWarn ? (
                          <span className="text-neon-purple font-bold text-[9px] uppercase tracking-wider">WARN</span>
                        ) : (
                          <span className="text-neon-green font-bold text-[9px] uppercase tracking-wider">SAFE</span>
                        )}
                      </div>

                      {/* Edit Details Button */}
                      <button
                        onClick={() => {
                          setEditingProductId(p.id);
                          setEditProdName(p.name);
                          setEditProdCategory(p.category);
                          setEditProdSubCategory(p.subCategory);
                          setEditProdPrice(p.price.toString());
                          setEditProdStock(p.stock.toString());
                          setEditProdDesc(p.description);
                          setEditProdDelivery(p.deliveryType);
                          setEditProdFeatures(p.features.join("\n"));
                          setEditProdImage(p.imageUrl);
                        }}
                        className="p-2 text-white/40 hover:text-neon-blue rounded bg-white/5 hover:bg-neon-blue/5 select-none cursor-pointer transition-colors"
                        title="Edit product details & upload/set image"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-white/40 hover:text-red-500 rounded bg-white/5 hover:bg-red-500/5 select-none cursor-pointer transition-colors"
                        title="Delete product from database"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeTab === "gateways" && (
        <div className="space-y-8">
          {/* Add Gateway Form */}
          <div className="glass-card p-8 rounded-sm border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-neon-blue" />
              <span>Define New Payment Gateway</span>
            </h3>

            <GatewayFormSection onAdd={addPaymentGateway} />
          </div>

          {/* List Gateways */}
          <div className="glass-card p-8 rounded-sm border border-white/5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Active Payment Gateways Pool</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentGateways.length === 0 ? (
                <p className="text-xs text-white/40">No payment gateways defined yet.</p>
              ) : (
                paymentGateways.map((g) => (
                  <GatewayItemCardSection
                    key={g.id}
                    gateway={g}
                    onUpdate={updatePaymentGateway}
                    onDelete={deletePaymentGateway}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "topups" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase text-white tracking-widest">Wallet Top-Up verification registry</h3>
            <span className="text-xs text-white/30 font-mono">Live Sync: Active</span>
          </div>

          <div className="glass-card p-6 rounded-sm border border-white/5 space-y-4">
            <p className="text-xs text-white/60 leading-relaxed max-w-3xl">
              Buyers send money to your specified payment gateways, then submit their transaction reference hashes or transaction IDs. 
              <strong> Verify the funds on your local account first</strong> before approving here. Once approved, the system automatically 
              credits the user's wallet balance instantly.
            </p>
          </div>

          {topUpRequests.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-sm">
              <Coins className="h-10 w-10 text-white/20 mx-auto mb-4" />
              <h4 className="font-bold text-white uppercase text-sm">No top-up requests found</h4>
              <p className="text-xs text-white/40 mt-1">Pending deposit submissions from users will populate here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topUpRequests.map((req) => {
                const isPending = req.status === "Pending";
                const isApproved = req.status === "Approved";
                const isRejected = req.status === "Rejected";

                return (
                  <div 
                    key={req.id}
                    className={`glass-card p-6 rounded-sm border transition-all ${
                      isPending ? "border-neon-blue/20" : isApproved ? "border-neon-green/10" : "border-white/5"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      {/* Left: Request Overview */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-black text-white">{req.id}</span>
                          <span className="text-[10px] text-white/30 font-mono">|</span>
                          <span className="text-[10px] text-white/40 font-mono">{new Date(req.date).toLocaleString()}</span>
                          <span className={`ml-auto lg:ml-0 px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-widest ${
                            isApproved 
                              ? "bg-neon-green/10 text-neon-green border-neon-green/20" 
                              : isRejected 
                                ? "bg-red-500/10 text-red-500 border-red-500/20" 
                                : "bg-neon-blue/10 text-neon-blue border-neon-blue/20 animate-pulse"
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.01] border border-white/5 p-3 rounded text-xs font-mono">
                          <div>
                            <span className="block text-[8px] uppercase font-bold text-white/40 font-sans">User Details</span>
                            <span className="text-white font-black">{req.username}</span>
                            <span className="block text-[10px] text-white/50">{req.email}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase font-bold text-white/40 font-sans">Gateway / Method</span>
                            <span className="text-white font-black uppercase text-xs">{req.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase font-bold text-white/40 font-sans">Transaction ID</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-neon-blue font-bold tracking-wide select-all truncate max-w-[120px]" title={req.transactionId}>
                                {req.transactionId}
                              </span>
                              <button
                                onClick={() => navigator.clipboard.writeText(req.transactionId)}
                                className="text-[9px] text-white/40 hover:text-white copy-btn"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase font-bold text-white/40 font-sans">Requested Credit</span>
                            <span className="text-neon-green font-black text-sm">${req.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Screenshot & Action Controls */}
                      <div className="flex flex-wrap items-center gap-4 lg:self-stretch justify-end">
                        {req.screenshotUrl && (
                          <button
                            onClick={() => setSelectedOrderScreenshot(req.screenshotUrl || null)}
                            className="text-xs font-bold text-white/60 hover:text-white border border-white/10 hover:border-white/25 rounded px-3 py-2 flex items-center gap-1.5 transition-colors"
                          >
                            <span>View Proof Receipt</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}

                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => rejectTopUp(req.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-extrabold px-4 py-2 rounded text-xs uppercase tracking-wider select-none cursor-pointer transition-all active:scale-[0.98]"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => approveTopUp(req.id)}
                              className="bg-neon-green hover:bg-neon-green/90 text-black font-black px-5 py-2 rounded text-xs uppercase tracking-widest select-none cursor-pointer transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            >
                              Approve Request
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] uppercase tracking-wider font-mono font-bold text-white/30 px-3 py-2 bg-white/5 border border-white/5 rounded">
                            Action Taken: {req.status}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "chats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[550px] bg-[#0A0A0E] border border-white/10 rounded-sm overflow-hidden font-sans">
          {/* Left: Chat Thread Directory */}
          <div className="border-r border-white/10 flex flex-col h-full bg-[#0E0E12]/50">
            <div className="p-4 border-b border-white/10 bg-white/[0.01]">
              <h4 className="text-xs font-black uppercase text-neon-blue tracking-widest">Active Support Threads</h4>
              <p className="text-[10px] text-white/40 mt-1">Select a client conversation thread to respond</p>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {Array.from(new Set(chatMessages.map(m => m.conversationId))).length === 0 ? (
                <div className="p-8 text-center text-xs text-white/30">
                  No active support conversations yet.
                </div>
              ) : (
                (Array.from(new Set(chatMessages.map(m => m.conversationId))) as string[]).map(convId => {
                  const threadMsgs = chatMessages.filter(m => m.conversationId === convId);
                  const lastMsg = threadMsgs[threadMsgs.length - 1];
                  const isSelected = selectedChatConvId === convId;
                  
                  return (
                    <button
                      key={convId}
                      onClick={() => setSelectedChatConvId(convId)}
                      className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-white/5 cursor-pointer ${
                        isSelected ? "bg-white/[0.03] border-l-2 border-neon-blue font-semibold" : ""
                      }`}
                    >
                      <div className="p-2 rounded bg-white/5 text-white/60">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate uppercase tracking-wider block">
                            {convId === "guest_support" ? "Guest Session" : convId.split("@")[0]}
                          </span>
                          <span className="text-[9px] text-white/30 font-mono">
                            {threadMsgs.length} msgs
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 truncate font-mono mt-1">
                          {lastMsg ? `${lastMsg.isAdmin ? "Admin: " : ""}${lastMsg.message}` : "No messages"}
                        </p>
                        <p className="text-[9px] text-white/30 truncate mt-0.5 font-mono">
                          {convId}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Chat Thread Reader & Responder */}
          <div className="md:col-span-2 flex flex-col h-full bg-[#0A0A0E]">
            {selectedChatConvId ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-white/10 bg-white/[0.01] flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-widest">
                      Thread ID: {selectedChatConvId === "guest_support" ? "Guest Support Chat" : selectedChatConvId}
                    </h4>
                    <p className="text-[10px] text-neon-blue font-mono mt-0.5">Real-time Connection: Open</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/30 px-2 py-0.5 rounded">
                    Support Escrow
                  </span>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0A0A0E]/80">
                  {chatMessages
                    .filter(m => m.conversationId === selectedChatConvId)
                    .map((msg, idx) => {
                      const isMe = msg.isAdmin;
                      return (
                        <div key={msg.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div className="flex items-center gap-2 mb-1 text-[9px] text-white/30">
                            <span className={`font-bold uppercase tracking-wider ${isMe ? "text-neon-purple" : "text-neon-blue"}`}>
                              {isMe ? "Admin" : msg.senderName}
                            </span>
                            <span className="font-mono">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-2 rounded text-xs max-w-[80%] break-all ${
                              isMe
                                ? "bg-neon-purple/10 border border-neon-purple/30 text-white"
                                : "bg-white/5 border border-white/10 text-white/95"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  <div ref={adminMessagesEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-white/10 bg-white/[0.01] flex gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${selectedChatConvId}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-neon-blue/40 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-neon-blue hover:bg-neon-blue/90 text-black font-black rounded-sm flex items-center justify-center gap-1 text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="h-10 w-10 text-white/10 mb-2 animate-pulse" />
                <h4 className="text-xs font-black uppercase text-white/40 tracking-widest">No Thread Selected</h4>
                <p className="text-[10px] text-white/30 mt-1 max-w-xs leading-normal">
                  Click on any active support conversation in the directory on the left to read messages and reply instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "faqs" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          
          {/* Left Column: FAQ Creator/Editor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-sm border border-white/5 bg-[#0A0A0E]/60 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <HelpCircle className="h-4.5 w-4.5 text-neon-blue" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {editingFaqId ? "Edit Existing FAQ" : "Publish New FAQ Entry"}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    FAQ Category / Topic
                  </label>
                  <input
                    type="text"
                    value={editingFaqId ? editFaqCategory : newFaqCategory}
                    onChange={(e) => {
                      if (editingFaqId) setEditFaqCategory(e.target.value);
                      else setNewFaqCategory(e.target.value);
                    }}
                    placeholder="e.g. Orders, Refunds, Accounts, General"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    Question
                  </label>
                  <input
                    type="text"
                    value={editingFaqId ? editFaqQuestion : newFaqQuestion}
                    onChange={(e) => {
                      if (editingFaqId) setEditFaqQuestion(e.target.value);
                      else setNewFaqQuestion(e.target.value);
                    }}
                    placeholder="e.g. How long does WhatsApp delivery take?"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    Answer Markdown / Text
                  </label>
                  <textarea
                    value={editingFaqId ? editFaqAnswer : newFaqAnswer}
                    onChange={(e) => {
                      if (editingFaqId) setEditFaqAnswer(e.target.value);
                      else setNewFaqAnswer(e.target.value);
                    }}
                    placeholder="Provide a detailed, helpful answer for the user..."
                    rows={6}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 resize-none font-sans leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {editingFaqId ? (
                    <>
                      <button
                        onClick={async () => {
                          if (!editFaqQuestion.trim() || !editFaqAnswer.trim()) return;
                          await updateFaqItem(editingFaqId, editFaqQuestion.trim(), editFaqAnswer.trim(), editFaqCategory.trim());
                          setEditingFaqId(null);
                          setEditFaqQuestion("");
                          setEditFaqAnswer("");
                          setEditFaqCategory("General");
                        }}
                        className="flex-1 py-2.5 bg-neon-blue hover:bg-neon-blue/90 text-black font-black text-xs uppercase tracking-widest rounded-sm transition-all select-none cursor-pointer"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingFaqId(null);
                          setEditFaqQuestion("");
                          setEditFaqAnswer("");
                          setEditFaqCategory("General");
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-xs text-white uppercase tracking-wider transition-all select-none cursor-pointer"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
                        await addFaqItem(newFaqQuestion.trim(), newFaqAnswer.trim(), newFaqCategory.trim());
                        setNewFaqQuestion("");
                        setNewFaqAnswer("");
                        setNewFaqCategory("General");
                      }}
                      className="w-full py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-all select-none cursor-pointer shadow-[0_0_10px_rgba(255,0,255,0.2)]"
                    >
                      Publish FAQ Entry
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: FAQ Database Index & List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Live FAQ Database</h3>
                <p className="text-[10px] text-white/40">Manage global client-facing knowledgebase entries</p>
              </div>
              <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">
                {faqs.length} Total FAQs
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {faqs.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-sm">
                  <p className="text-xs text-white/30">No FAQs available. Create the first knowledgebase entry on the left.</p>
                </div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq.id} className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-sm space-y-3 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-black uppercase bg-neon-blue/10 text-neon-blue px-2 py-0.5 rounded-full">
                          {faq.category}
                        </span>
                        <h4 className="text-xs font-extrabold text-white leading-normal pt-1">{faq.question}</h4>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingFaqId(faq.id || null);
                            setEditFaqQuestion(faq.question);
                            setEditFaqAnswer(faq.answer);
                            setEditFaqCategory(faq.category);
                          }}
                          className="p-1.5 bg-white/5 hover:bg-neon-blue/15 border border-white/5 hover:border-neon-blue/30 rounded text-white/70 hover:text-neon-blue transition-all cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to permanently delete this FAQ entry?")) {
                              if (faq.id) await deleteFaqItem(faq.id);
                            }
                          }}
                          className="p-1.5 bg-white/5 hover:bg-red-500/15 border border-white/5 hover:border-red-500/30 rounded text-white/70 hover:text-red-500 transition-all cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-sans line-clamp-3 select-none whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      )}

      {/* Users Vault Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Header & Stats bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A0A0E]/80 p-5 rounded-sm border border-white/5">
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-neon-blue" />
                <span>Registered Users Vault</span>
              </h3>
              <p className="text-[10px] text-white/40 mt-1 font-mono">
                View all registered accounts, manage wallet funds, toggle administrator rights, and verify referral codes.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 font-mono text-[11px]">
              <div className="text-right">
                <span className="text-[9px] text-white/40 uppercase block">Total Accounts</span>
                <span className="text-neon-blue font-bold">{registeredUsers.length} Users</span>
              </div>
              <div className="border-l border-white/10 h-8"></div>
              <div className="text-right">
                <span className="text-[9px] text-white/40 uppercase block">Vault Liquidity</span>
                <span className="text-neon-green font-bold">
                  ${registeredUsers.reduce((sum, u) => sum + (u.walletBalance || 0), 0).toFixed(2)}
                </span>
              </div>
              <div className="border-l border-white/10 h-8"></div>
              <div className="text-right">
                <span className="text-[9px] text-white/40 uppercase block">Admins</span>
                <span className="text-neon-purple font-bold">
                  {registeredUsers.filter(u => u.isAdmin).length} Active
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search username, email, or referral code..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full bg-[#0E0E12] border border-white/10 rounded-sm py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-neon-blue/50 font-mono"
              />
            </div>
            <span className="text-[10px] text-white/40 font-mono">
              Showing {registeredUsers.filter(u => 
                u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                (u.referralCode && u.referralCode.toLowerCase().includes(userSearchTerm.toLowerCase()))
              ).length} of {registeredUsers.length} user records
            </span>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredUsers
              .filter(u => 
                u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                (u.referralCode && u.referralCode.toLowerCase().includes(userSearchTerm.toLowerCase()))
              )
              .map((u) => {
                const isEditingThisBalance = editingBalanceEmail === u.email;
                const isPwVisible = visiblePasswords[u.email] || false;

                return (
                  <div key={u.email} className="glass-card p-5 rounded-sm border border-white/5 space-y-4 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start gap-3 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-sm border ${
                          u.isAdmin 
                            ? "bg-neon-purple/20 border-neon-purple/40 text-neon-purple" 
                            : "bg-white/5 border-white/10 text-neon-blue"
                        }`}>
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-mono">{u.username}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                              u.isAdmin 
                                ? "bg-neon-purple/20 text-neon-purple border-neon-purple/30 shadow-[0_0_8px_rgba(255,0,255,0.2)]" 
                                : "bg-white/5 text-white/50 border-white/10"
                            }`}>
                              {u.isAdmin ? "ADMIN" : "USER"}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 font-mono select-all mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      {/* Admin role toggle button */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to ${u.isAdmin ? "REVOKE" : "GRANT"} Administrator access for ${u.username}?`)) {
                            await toggleUserAdmin(u.email, !u.isAdmin);
                          }
                        }}
                        className={`text-[9px] uppercase font-mono font-bold px-2 py-1 rounded border transition-all cursor-pointer ${
                          u.isAdmin
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10"
                        }`}
                        title={u.isAdmin ? "Demote to standard user" : "Promote to Master Admin"}
                      >
                        {u.isAdmin ? "Demote User" : "Make Admin"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      {/* Wallet Balance Section */}
                      <div className="p-3 bg-black/40 border border-white/5 rounded-sm space-y-1">
                        <span className="text-[9px] text-white/40 uppercase flex items-center gap-1">
                          <Wallet className="h-3 w-3 text-neon-green" />
                          <span>Wallet Balance</span>
                        </span>

                        {isEditingThisBalance ? (
                          <div className="space-y-2 pt-1">
                            <input
                              type="number"
                              step="0.01"
                              value={newBalanceInput}
                              onChange={(e) => setNewBalanceInput(e.target.value)}
                              className="w-full bg-[#121218] border border-neon-green/50 rounded px-2 py-1 text-xs text-neon-green focus:outline-none font-mono"
                              placeholder="0.00"
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={async () => {
                                  const val = parseFloat(newBalanceInput);
                                  if (!isNaN(val) && val >= 0) {
                                    await adjustUserBalance(u.email, val);
                                    setEditingBalanceEmail(null);
                                  }
                                }}
                                className="bg-neon-green text-black px-2 py-0.5 text-[9px] font-bold rounded uppercase cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingBalanceEmail(null)}
                                className="bg-white/10 text-white/70 px-2 py-0.5 text-[9px] font-bold rounded uppercase cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center pt-0.5">
                            <span className="text-sm font-black text-neon-green">
                              ${(u.walletBalance || 0).toFixed(2)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingBalanceEmail(u.email);
                                setNewBalanceInput((u.walletBalance || 0).toString());
                              }}
                              className="text-[9px] text-neon-blue hover:underline uppercase font-bold cursor-pointer"
                            >
                              Adjust
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Referral Code */}
                      <div className="p-3 bg-black/40 border border-white/5 rounded-sm space-y-1">
                        <span className="text-[9px] text-white/40 uppercase">Referral Code</span>
                        <p className="text-xs font-bold text-neon-purple pt-1">
                          {u.referralCode || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Password View */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <Key className="h-3 w-3 text-white/40" />
                        <span className="text-white/40">Password:</span>
                        <span className="text-white font-mono">
                          {isPwVisible ? u.passwordVal : "••••••••"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setVisiblePasswords(prev => ({
                            ...prev,
                            [u.email]: !prev[u.email]
                          }));
                        }}
                        className="text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        {isPwVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 8: ADMIN PROFILE & SECURITY SYSTEM */}
      {activeTab === "admin-profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          
          {/* Left Column: Admin Profile Settings */}
          <div className="lg:col-span-7 glass-card p-6 rounded-sm border border-white/5 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-neon-purple" />
                <span>Master Administrator Profile Settings</span>
              </h3>
              <p className="text-[10px] font-mono text-white/40 mt-1">
                Configure your administrative identity, contact numbers, display handle, and profile avatar.
              </p>
            </div>

            {adminProfileMsg && (
              <div className={`p-3 rounded border text-xs font-mono flex items-center gap-2 ${
                adminProfileMsg.type === "success" 
                  ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {adminProfileMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{adminProfileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAdminProfileSave} className="space-y-4 font-mono text-xs">
              
              {/* Profile Avatar Upload Control */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full border-2 border-neon-purple/50 overflow-hidden bg-black flex items-center justify-center shrink-0">
                    {adminAvatarUrl ? (
                      <img src={adminAvatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <ShieldCheck className="h-6 w-6 text-neon-purple" />
                    )}
                  </div>
                  <div>
                    <span className="text-white font-bold block">Administrator Avatar</span>
                    <span className="text-[10px] text-white/40 block">Upload custom avatar image from device (PNG, JPG)</span>
                  </div>
                </div>

                <label className="bg-neon-purple/20 hover:bg-neon-purple text-neon-purple hover:text-black border border-neon-purple/40 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer">
                  {isAdminAvatarUploading ? "Uploading..." : "Upload Avatar"}
                  <input type="file" accept="image/*" onChange={handleAdminAvatarFileChange} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Admin Full Name</label>
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="e.g. Master Admin Roman"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Admin Handle / Username</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50 font-bold text-neon-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Admin Email Address (Locked)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-[#08080A] border border-white/5 rounded-sm p-2.5 text-xs text-white/40 cursor-not-allowed select-all font-bold text-neon-blue"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Phone / WhatsApp Contact</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+880 17XXXXXXXX"
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 uppercase font-bold">Administrative Notes / Bio</label>
                <textarea
                  rows={2}
                  value={adminBio}
                  onChange={(e) => setAdminBio(e.target.value)}
                  placeholder="Master Admin Desk contact info..."
                  className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-purple/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-white font-black uppercase text-xs tracking-wider rounded-sm transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,255,0.2)] flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Admin Profile</span>
              </button>
            </form>
          </div>

          {/* Right Column: Master Password Update & System Badge */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Master Password Card */}
            <div className="glass-card p-6 rounded-sm border border-white/5 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-neon-blue" />
                  <span>Master Password & Credential Update</span>
                </h3>
                <p className="text-[10px] font-mono text-white/40 mt-1">
                  Update your server administrator access password.
                </p>
              </div>

              {adminPasswordMsg && (
                <div className={`p-3 rounded border text-xs font-mono flex items-center gap-2 ${
                  adminPasswordMsg.type === "success" 
                    ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {adminPasswordMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                  <span>{adminPasswordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleAdminPasswordSave} className="space-y-4 font-mono text-xs">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Current Admin Password</label>
                  <div className="relative">
                    <input
                      type={adminShowPassword ? "text" : "password"}
                      value={adminOldPassword}
                      onChange={(e) => setAdminOldPassword(e.target.value)}
                      placeholder="Enter current admin password..."
                      required
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-sm py-2.5 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-neon-blue/50"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowPassword(!adminShowPassword)}
                      className="absolute right-2.5 top-2.5 text-white/40 hover:text-white cursor-pointer"
                    >
                      {adminShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">New Password</label>
                  <div className="relative">
                    <input
                      type={adminShowPassword ? "text" : "password"}
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Enter new admin password..."
                      className="w-full bg-[#0E0E12] border border-white/10 rounded-sm py-2.5 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-neon-blue/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-white/50 uppercase font-bold">Confirm New Password</label>
                  <input
                    type={adminShowPassword ? "text" : "password"}
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Re-enter new admin password..."
                    className="w-full bg-[#0E0E12] border border-white/10 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-neon-blue/50"
                  />
                </div>

                {/* Password Strength Checklist */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-sm space-y-1.5 text-[10px]">
                  <span className="text-white/40 uppercase block font-bold mb-1">Password System Requirements:</span>
                  <div className={`flex items-center gap-1.5 ${adminHasMinLen ? "text-neon-green font-bold" : "text-white/40"}`}>
                    <Check className={`h-3 w-3 ${adminHasMinLen ? "text-neon-green" : "text-white/20"}`} />
                    <span>Minimum 8 characters long</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${adminHasMixedCase ? "text-neon-green font-bold" : "text-white/40"}`}>
                    <Check className={`h-3 w-3 ${adminHasMixedCase ? "text-neon-green" : "text-white/20"}`} />
                    <span>Uppercase & lowercase letters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${adminHasNumOrSpec ? "text-neon-green font-bold" : "text-white/40"}`}>
                    <Check className={`h-3 w-3 ${adminHasNumOrSpec ? "text-neon-green" : "text-white/20"}`} />
                    <span>At least 1 number or special character</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${adminIsMatch ? "text-neon-green font-bold" : "text-white/40"}`}>
                    <Check className={`h-3 w-3 ${adminIsMatch ? "text-neon-green" : "text-white/20"}`} />
                    <span>Passwords match perfectly</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!adminOldPassword.trim() || !adminHasMinLen || !adminHasMixedCase || !adminHasNumOrSpec || !adminIsMatch}
                  className="w-full py-2.5 bg-neon-blue disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neon-blue/90 text-black font-black uppercase text-xs tracking-wider rounded-sm transition-all cursor-pointer"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

            {/* Admin Privilege Summary Card */}
            <div className="p-5 bg-black/50 border border-neon-purple/20 rounded-sm space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-neon-purple" />
                  <span>Access Privileges</span>
                </span>
                <span className="text-[10px] font-bold text-neon-purple px-2 py-0.5 rounded border border-neon-purple/30 bg-neon-purple/10">
                  ROOT / MASTER
                </span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Full write-permissions over catalog, escrow approval, wallet balance adjustments, and user vaults.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Screen Shot Modal Dialog popup */}
      {selectedOrderScreenshot && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-cyber-bg border border-white/10 rounded p-6 max-w-lg w-full space-y-4 text-center">
            <h3 className="text-sm font-bold uppercase text-white tracking-widest">Escrow Payment Receipt Verification</h3>
            
            <div className="aspect-video w-full overflow-hidden rounded border border-white/10 bg-black">
              <img className="w-full h-full object-cover" src={selectedOrderScreenshot} alt="Payment Receipt Screenshot" />
            </div>

            <p className="text-[11px] text-white/50 italic leading-normal">
              Transaction matches registered escrow lines. Double check references with bKash, Nagad or TRC20 hashes.
            </p>

            <button
              onClick={() => setSelectedOrderScreenshot(null)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-6 py-2.5 rounded text-xs uppercase font-extrabold tracking-wider select-none cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const GatewayFormSection: React.FC<{ onAdd: (g: any) => void }> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !details) return;
    onAdd({
      name,
      type: type || "Payment Reference",
      details,
      instructions: instructions || "Transfer funds to the reference details above.",
      active: true
    });
    setName("");
    setType("");
    setDetails("");
    setInstructions("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
      <div className="space-y-2">
        <label className="block text-white/50 uppercase font-bold tracking-wider">Gateway Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)}
          placeholder="e.g. USDT (TRC20), Nagad, bKash"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue/40"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-white/50 uppercase font-bold tracking-wider">Gateway Type/Label</label>
        <input 
          type="text" 
          value={type} 
          onChange={e => setType(e.target.value)}
          placeholder="e.g. TRC20 Wallet Address, Agent Number"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue/40"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label className="block text-white/50 uppercase font-bold tracking-wider">Details / Number / Address</label>
        <input 
          type="text" 
          value={details} 
          onChange={e => setDetails(e.target.value)}
          placeholder="e.g. TYZ1pXfBf6tY3L7b2B8M9wX3U4H5oE6rWz or +880..."
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue/40 font-mono"
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label className="block text-white/50 uppercase font-bold tracking-wider">Checkout Instructions</label>
        <textarea 
          value={instructions} 
          onChange={e => setInstructions(e.target.value)}
          placeholder="Capture a payment confirmation screenshot and upload..."
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-neon-blue/40 h-20 resize-none"
        />
      </div>
      <div className="sm:col-span-2 pt-2 text-right">
        <button
          type="submit"
          className="gradient-blue text-white font-black px-8 py-3 rounded text-xs uppercase tracking-widest hover:scale-[1.02] transition-all cursor-pointer select-none"
        >
          Add Payment Method
        </button>
      </div>
    </form>
  );
};

const GatewayItemCardSection: React.FC<{
  gateway: any;
  onUpdate: (g: any) => void;
  onDelete: (id: string) => void;
}> = ({ gateway, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState(gateway.type);
  const [details, setDetails] = useState(gateway.details);
  const [instructions, setInstructions] = useState(gateway.instructions);

  const handleSave = () => {
    onUpdate({
      ...gateway,
      type,
      details,
      instructions
    });
    setIsEditing(false);
  };

  return (
    <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm flex flex-col justify-between gap-4 text-xs">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold uppercase text-white tracking-wider">{gateway.name}</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
              gateway.active 
                ? "bg-neon-green/10 text-neon-green border-neon-green/20" 
                : "bg-white/5 text-white/30 border-white/10"
            }`}>
              {gateway.active ? "ACTIVE" : "DISABLED"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdate({ ...gateway, active: !gateway.active })}
              className="text-[10px] text-neon-blue hover:underline uppercase font-bold select-none cursor-pointer"
            >
              {gateway.active ? "Deactivate" : "Activate"}
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => onDelete(gateway.id)}
              className="text-[10px] text-red-400 hover:underline uppercase font-bold select-none cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white/40">Label / Type</label>
              <input 
                type="text" 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white/40">Details / Address</label>
              <input 
                type="text" 
                value={details} 
                onChange={e => setDetails(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-white/40">Instructions</label>
              <textarea 
                value={instructions} 
                onChange={e => setInstructions(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-white h-16 resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-white/5 border border-white/10 px-3 py-1 rounded text-[10px] text-white/70 uppercase font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-neon-blue text-black px-3 py-1 rounded text-[10px] font-black uppercase"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-white/60">
            <p><span className="text-white/30 uppercase font-bold text-[10px]">Label:</span> {gateway.type}</p>
            <p className="font-mono text-neon-blue break-all"><span className="text-white/30 uppercase font-bold text-[10px] font-sans">Details:</span> {gateway.details}</p>
            <p className="text-[11px] text-white/40 leading-normal italic mt-1">{gateway.instructions}</p>
            
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 text-[10px] text-white/60 hover:text-white border border-white/10 rounded px-2.5 py-1 flex items-center gap-1 hover:bg-white/5"
            >
              <Edit className="h-3 w-3" />
              <span>Modify Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
