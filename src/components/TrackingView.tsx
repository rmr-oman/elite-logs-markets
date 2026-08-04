import React, { useState, useEffect } from "react";
import { useAppState } from "../state";
import { 
  Lock, 
  Unlock, 
  Copy, 
  Send, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  ExternalLink,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const TrackingView: React.FC = () => {
  const { 
    orders, 
    activeTrackingOrderId, 
    setView, 
    updateOrderStatus 
  } = useAppState();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Find the active tracking order
  const order = orders.find(o => o.id === activeTrackingOrderId);

  // Fallback if no tracking order is active, pick the latest order
  const trackingOrder = order || orders[0];

  if (!trackingOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <AlertCircle className="h-12 w-12 text-white/30 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-lg font-bold uppercase text-white">No active transactions</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            You don't have any ongoing or historic escrow transactions logged under this device's cache.
          </p>
        </div>
        <button 
          onClick={() => setView("shop")}
          className="bg-neon-blue text-black font-extrabold px-6 py-2.5 rounded-sm uppercase tracking-wider text-xs"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const handleCopyCredential = (text: string, index: number) => {
    setCopiedIndex(index);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isCompleted = trackingOrder.status === "Completed";
  const isProcessing = trackingOrder.status === "Processing";
  const isPending = trackingOrder.status === "Pending";

  // Mock progress tracker status description strings
  let statusBadge = "VERIFYING ESCROW";
  let etaMinutes = "~ 5 Mins";
  if (isProcessing) {
    statusBadge = "CARRIER HANDSHAKE";
    etaMinutes = "~ 3 Mins";
  } else if (isCompleted) {
    statusBadge = "LOGS DELIVERED";
    etaMinutes = "Completed";
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-wide">
            Real-Time Escrow Tracker
          </h2>
          <p className="text-xs text-white/50">
            Escrow transaction reference ID: <span className="text-neon-blue font-mono font-bold tracking-wider">{trackingOrder.id}</span>
          </p>
        </div>
        
        {/* Support Buttons */}
        <div className="flex gap-2 shrink-0">
          <a 
            href="https://t.me/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase transition-all"
          >
            <Send className="h-3.5 w-3.5 text-[#0088cc]" />
            <span>Join Telegram</span>
          </a>
          <a 
            href="https://wa.me/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25d366]" />
            <span>Support Chat</span>
          </a>
        </div>
      </div>

      {/* Cyber Progress Indicator Bar */}
      <div className="glass-card p-8 rounded-sm border border-neon-purple/10 shadow-[0_0_20px_rgba(138,43,226,0.15)] relative">
        <div className="relative flex justify-between items-center max-w-2xl mx-auto">
          
          {/* Progress Bar Line Base */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0"></div>
          
          {/* Active progress bar line fill */}
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple -translate-y-1/2 z-0 shadow-[0_0_10px_#00BFFF]"
            style={{ 
              width: isPending ? "15%" : isProcessing ? "50%" : "100%",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          ></div>

          {/* Step 1: Pending */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              isPending 
                ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,191,255,0.4)] animate-pulse" 
                : "bg-black border-neon-blue text-neon-blue"
            }`}>
              {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-5 w-5 text-neon-blue" />}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${isPending ? "text-neon-blue" : "text-white/40"}`}>
              Pending
            </span>
          </div>

          {/* Step 2: Processing */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              isProcessing 
                ? "bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(138,43,226,0.4)] animate-pulse" 
                : isCompleted 
                  ? "bg-black border-neon-purple text-neon-purple" 
                  : "bg-black border-white/10 text-white/20"
            }`}>
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-5 w-5" />}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${isProcessing ? "text-neon-purple" : "text-white/40"}`}>
              Processing
            </span>
          </div>

          {/* Step 3: Completed */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              isCompleted 
                ? "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_10px_rgba(0,255,170,0.4)] animate-pulse" 
                : "bg-black border-white/10 text-white/20"
            }`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${isCompleted ? "text-neon-green" : "text-white/40"}`}>
              Completed
            </span>
          </div>

        </div>
      </div>

      {/* Real-time automated delivery indicator */}
      {isPending && (
        <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded text-center text-xs text-neon-blue leading-normal max-w-xl mx-auto">
          ⚡ <strong>Automated Order Dispatching Active</strong>: Your digital logs order is being verified and processed by our secure automated stock manager system.
        </div>
      )}

      {/* Bento Grid Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-center items-center text-center">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Escrow State</span>
          <span className="text-neon-blue text-lg font-black italic uppercase tracking-wider">{statusBadge}</span>
        </div>

        {/* ETA Timer */}
        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-center items-center text-center">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Est. Completion</span>
          <span className="text-white text-lg font-black italic uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-neon-purple" />
            <span>{etaMinutes}</span>
          </span>
        </div>

        {/* Total Cost Paid */}
        <div className="glass-card p-6 rounded-sm border border-white/5 flex flex-col justify-center items-center text-center">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5">Total Paid Escrow</span>
          <span className="text-neon-green text-lg font-black italic uppercase tracking-wider font-mono">
            ${trackingOrder.totalPrice.toFixed(2)} USD
          </span>
        </div>

      </div>

      {/* Locked or Unlocked Credentials Block (Base anti-scraping details lock) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Acquired Digital Credentials</h3>
        
        {!isCompleted ? (
          /* Blurred and padlocked placeholder block */
          <div className="glass-card p-10 rounded-sm border-2 border-dashed border-white/10 overflow-hidden relative flex flex-col items-center justify-center text-center">
            
            {/* Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B0B0F]/70 backdrop-blur-md">
              <Lock className="h-8 w-8 text-neon-blue animate-bounce" />
              <p className="mt-3 text-white font-black uppercase tracking-widest text-xs italic">
                Credentials Encryption Lock
              </p>
              <p className="text-[10px] text-white/40 mt-1 max-w-sm">
                Waiting for administrative validation and escrow release. The credentials will automatically render here.
              </p>
            </div>

            {/* Blurred Mockup Content */}
            <div className="w-full space-y-4 blur-sm select-none pointer-events-none">
              <div className="bg-white/5 p-4 rounded flex justify-between items-center">
                <span className="text-xs font-bold uppercase">Mock Username</span>
                <code className="text-neon-blue text-xs font-mono">******************</code>
              </div>
              <div className="bg-white/5 p-4 rounded flex justify-between items-center">
                <span className="text-xs font-bold uppercase">Mock Code/Secret</span>
                <code className="text-neon-blue text-xs font-mono">************************************</code>
              </div>
            </div>

          </div>
        ) : (
          /* Unlocked Credentials List and copy manager */
          <div className="glass-card p-6 rounded-sm border border-neon-green/20 neon-glow-green space-y-4">
            <div className="flex items-center gap-2 text-neon-green border-b border-white/5 pb-4 mb-2">
              <Unlock className="h-5 w-5" />
              <h4 className="text-xs font-extrabold uppercase tracking-widest">Digital Keys Released</h4>
            </div>

            <div className="space-y-3">
              {trackingOrder.deliveredCredentials && trackingOrder.deliveredCredentials.length > 0 ? (
                trackingOrder.deliveredCredentials.map((cred, index) => (
                  <div 
                    key={index} 
                    className="bg-white/5 p-4 rounded-sm border border-white/15 hover:border-white/25 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] font-mono text-neon-blue font-bold uppercase tracking-widest block">Credential Item {index + 1}</span>
                      <code className="text-xs font-mono text-white break-all">{cred}</code>
                    </div>
                    <button
                      onClick={() => handleCopyCredential(cred, index)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded text-xs font-bold uppercase text-white select-none cursor-pointer transition-all"
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle className="h-4.5 w-4.5 text-neon-green" />
                          <span className="text-neon-green">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4.5 w-4.5 text-white/50" />
                          <span>Copy Item</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white/5 rounded text-xs text-white/60 leading-normal">
                  Credentials matched on database. Click the "Support Chat" anchor to query our carrier reps for instant WhatsApp OTP handshakes.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Summary Card */}
      <div className="glass-card p-8 rounded-sm border border-white/5 space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Escrow Transaction Details</h3>
        
        <div className="space-y-3 text-xs leading-relaxed divide-y divide-white/5">
          <div className="flex justify-between py-3">
            <span className="text-white/40 font-semibold uppercase">Client Contact Handle</span>
            <span className="text-white font-bold">{trackingOrder.customerSocial}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-white/40 font-semibold uppercase">Registered Email</span>
            <span className="text-white font-bold">{trackingOrder.customerEmail}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-white/40 font-semibold uppercase">Payment Gateway</span>
            <span className="text-white font-bold">{trackingOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-white/40 font-semibold uppercase">Acquisition Items</span>
            <span className="text-white font-bold">
              {trackingOrder.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
