import React, { useState } from "react";
import { useAppState } from "../state";
import { PaymentMethod } from "../types";
import { fileToDataUrl } from "../lib/imageUtils";
import { 
  ArrowLeft, 
  Lock, 
  UploadCloud, 
  Copy, 
  CheckCircle, 
  CreditCard, 
  Coins, 
  Sparkles,
  Info,
  Check
} from "lucide-react";

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    products, 
    activeCouponCode, 
    placeOrder, 
    trackOrder, 
    setView,
    paymentGateways,
    currentUser
  } = useAppState();

  const activeGateways = paymentGateways.filter(g => g.active);

  const [fullName, setFullName] = useState(() => currentUser.isGuest ? "" : currentUser.username);
  const [email, setEmail] = useState(() => currentUser.isGuest ? "" : currentUser.email);
  const [contactInfo, setContactInfo] = useState("");
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>(() => {
    if (!currentUser.isGuest && currentUser.walletBalance > 0) {
      return "wallet";
    }
    return activeGateways[0]?.id || "";
  });
  const [screenshotSelected, setScreenshotSelected] = useState(false);
  const [screenshotName, setScreenshotName] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorText, setErrorText] = useState("");

  const selectedGateway = activeGateways.find(g => g.id === selectedGatewayId) || activeGateways[0];

  // Match items with catalog details
  const cartItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      product: prod,
      quantity: item.quantity
    };
  }).filter(item => item.product !== undefined);

  // Totals
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  let discountPercent = 0;
  if (activeCouponCode) {
    if (activeCouponCode === "ELITE20") discountPercent = 20;
    else if (activeCouponCode === "NIGERIA10") discountPercent = 10;
    else if (activeCouponCode === "CYBER50") discountPercent = 50;
  }

  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleCopyText = (text: string, isAddress: boolean) => {
    if (isAddress) {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    }
    navigator.clipboard.writeText(text);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorText("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    setIsUploading(true);
    setErrorText("");
    try {
      const dataUrl = await fileToDataUrl(file);
      setScreenshotDataUrl(dataUrl);
      setScreenshotName(file.name);
      setScreenshotSelected(true);
    } catch (err) {
      setErrorText("Failed to process image file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!fullName.trim() || !email.trim() || !contactInfo.trim()) {
      setErrorText("Please fill out all contact details.");
      return;
    }

    let pMethod = selectedGateway?.name || "Payment System";
    let sUrl = screenshotDataUrl || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop";

    if (selectedGatewayId === "wallet") {
      if (currentUser.isGuest) {
        setErrorText("You must be logged in to pay with wallet balance.");
        return;
      }
      if (currentUser.walletBalance < total) {
        setErrorText(`Insufficient wallet balance. You need $${total.toFixed(2)} but only have $${currentUser.walletBalance.toFixed(2)}.`);
        return;
      }
      pMethod = "Wallet Balance";
      sUrl = "Paid with Wallet Balance";
    } else {
      if (!screenshotSelected) {
        setErrorText("Please upload a payment screenshot receipt.");
        return;
      }
    }

    // Place the order
    const order = placeOrder({
      name: fullName,
      email,
      social: contactInfo,
      paymentMethod: pMethod,
      screenshotUrl: sUrl
    });

    // Track the newly created order
    trackOrder(order.id);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Return to Cart Trigger */}
      <button 
        onClick={() => setView("cart")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-neon-blue transition-colors select-none cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform stroke-[2.5px]" />
        <span>Return to Cart</span>
      </button>

      {/* Checkout layout splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Form Fields & Payments */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="glass-card p-8 rounded-sm border border-white/5 space-y-8">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/5 pb-4 flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-neon-blue" />
              <span>Billing & Contact Credentials</span>
            </h2>

            <form onSubmit={handleSubmitEscrow} className="space-y-6">
              
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none p-3 text-xs text-white placeholder:text-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none p-3 text-xs text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Contact numbers */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest flex items-center justify-between">
                  <span>WhatsApp / Telegram Number</span>
                  <span className="text-[10px] text-neon-purple font-semibold">REPLY MATCHING POOL</span>
                </label>
                <input 
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="+234 810 555 1234"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none p-3 text-xs text-white placeholder:text-white/30"
                />
                <span className="text-[10px] text-white/30 block">
                  Critical: Our manual delivery bots and administrators will match verification codes and transfer files to this active handle.
                </span>
              </div>

              {/* Select Payment Method Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Select Escrow Payment System</label>
                {activeGateways.length === 0 && currentUser.isGuest ? (
                  <p className="text-xs text-red-400 font-bold">No active payment methods are configured by Admin.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Wallet Balance Payment option */}
                    {!currentUser.isGuest && (
                      <button
                        type="button"
                        onClick={() => setSelectedGatewayId("wallet")}
                        className={`p-4 rounded-sm border select-none cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                          selectedGatewayId === "wallet"
                            ? "bg-neon-green/5 border-neon-green text-white"
                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                        }`}
                      >
                        <Coins className={`h-5 w-5 ${selectedGatewayId === "wallet" ? "text-neon-green" : "text-white/40"}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Wallet Balance</span>
                        <span className="text-[8px] font-mono opacity-65">${currentUser.walletBalance.toFixed(2)}</span>
                      </button>
                    )}

                    {activeGateways.map((g) => {
                      const isSelected = g.id === selectedGatewayId;
                      const isCrypto = g.name.toLowerCase().includes("usdt") || g.name.toLowerCase().includes("crypto") || g.name.toLowerCase().includes("btc");
                      const isNagad = g.name.toLowerCase().includes("nagad");
                      const themeColorClass = isCrypto 
                        ? (isSelected ? "bg-neon-blue/5 border-neon-blue text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20")
                        : isNagad 
                          ? (isSelected ? "bg-neon-green/5 border-neon-green text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20")
                          : (isSelected ? "bg-neon-purple/5 border-neon-purple text-white" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20");

                      const iconColorClass = isCrypto ? "text-neon-blue" : isNagad ? "text-neon-green" : "text-neon-purple";

                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGatewayId(g.id)}
                          className={`p-4 rounded-sm border select-none cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${themeColorClass}`}
                        >
                          <CreditCard className={`h-5 w-5 ${iconColorClass}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{g.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* If guest, remind about wallet benefit */}
                {currentUser.isGuest && (
                  <p className="text-[10px] text-white/40 leading-normal bg-white/5 p-2.5 rounded-sm border border-white/5">
                    💡 <strong>Tip:</strong> Create an account or sign in to pay instantly using preloaded <strong>Wallet Balance</strong> without uploading payment confirmation screenshots!
                  </p>
                )}
              </div>

              {/* Dynamic Instructions Panel */}
              {selectedGatewayId === "wallet" ? (
                <div className="p-5 bg-neon-green/5 border border-neon-green/20 rounded-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-neon-green uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="h-4 w-4" />
                        <span>Instant Wallet Checkout</span>
                      </h4>
                      <p className="text-[11px] text-white/75 mt-1 leading-normal">
                        Deducts directly from your pre-loaded balance. Order is authorized and processed automatically!
                      </p>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5"></div>

                  <div className="grid grid-cols-2 text-[11px] font-mono text-white/60 gap-y-1">
                    <div>Current Balance:</div>
                    <div className="text-right font-bold text-white">${currentUser.walletBalance.toFixed(2)}</div>
                    <div>Deduction:</div>
                    <div className="text-right font-bold text-red-400">-${total.toFixed(2)}</div>
                    <div className="pt-2 border-t border-white/5 mt-1 font-sans">Remaining Balance:</div>
                    <div className="pt-2 border-t border-white/5 mt-1 text-right font-bold text-neon-green">
                      ${(currentUser.walletBalance - total).toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                selectedGateway && (
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          {selectedGateway.type}
                        </h4>
                        <p className="font-mono text-neon-blue text-sm font-bold mt-1 tracking-wide break-all">
                          {selectedGateway.details}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyText(selectedGateway.details, selectedGateway.type.toLowerCase().includes("address"))}
                        className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white select-none cursor-pointer shrink-0 ml-2"
                        title="Copy details"
                      >
                        {copiedAddress || copiedNumber ? <Check className="h-4 w-4 text-neon-green" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>

                    <div className="h-[1px] bg-white/5"></div>

                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-neon-blue shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        {selectedGateway.instructions}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Payment Screenshot receipt uploader (hide when wallet is selected) */}
              {selectedGatewayId !== "wallet" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">
                    Upload Payment Confirmation Screenshot (From Device)
                  </label>
                  <div className="relative group border border-dashed border-white/10 hover:border-neon-blue/30 rounded-sm p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-white/[0.01]">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      title="Select image from device"
                    />
                    
                    {isUploading ? (
                      <p className="text-xs font-mono text-neon-blue animate-pulse py-4">
                        Processing image from device...
                      </p>
                    ) : screenshotSelected && screenshotDataUrl ? (
                      <div className="space-y-2 flex flex-col items-center py-2">
                        <img 
                          src={screenshotDataUrl} 
                          alt="Screenshot preview" 
                          className="h-24 max-w-full object-contain rounded border border-white/20 shadow-md"
                        />
                        <div className="space-y-0.5">
                          <p className="text-neon-green font-bold text-xs flex items-center justify-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Screenshot Attached Successfully</span>
                          </p>
                          <p className="text-[10px] font-mono text-white/50">{screenshotName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center py-2">
                        <UploadCloud className="h-8 w-8 text-white/30 group-hover:text-neon-blue transition-colors group-hover:scale-105" />
                        <div className="space-y-1">
                          <p className="text-white text-xs font-semibold">Click to Browse device files or Drag image</p>
                          <p className="text-[10px] text-white/40">PNG, JPG, or WEBP up to 5MB from Mobile/PC</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errorText && <p className="text-xs text-red-500 font-bold">{errorText}</p>}

              {/* Submission Escrow Trigger */}
              <button
                type="submit"
                className={`w-full font-black py-4 rounded-sm uppercase tracking-widest text-xs flex items-center justify-center gap-2 select-none cursor-pointer transition-all hover:scale-[1.01] active:scale-95 ${
                  selectedGatewayId === "wallet"
                    ? "bg-neon-green hover:bg-neon-green/95 text-black"
                    : "bg-neon-blue hover:bg-neon-blue/95 text-black"
                }`}
              >
                <span>{selectedGatewayId === "wallet" ? "Complete Instant Purchase" : "Submit Escrow Transaction"}</span>
                <Sparkles className="h-4 w-4" />
              </button>

            </form>
          </div>

        </div>

        {/* Right Side: Ledger breakdown sticky card */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 rounded-sm border border-white/5 space-y-6 sticky top-28">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-3">
              Checkout Summary
            </h3>

            {/* Shopping Line Items */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {cartItems.map((item, idx) => {
                const p = item.product!;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/[0.01] border border-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <img className="h-10 w-10 object-cover rounded bg-white/5" src={p.imageUrl} alt={p.name} />
                      <div>
                        <h4 className="font-bold text-white leading-tight line-clamp-1">{p.name}</h4>
                        <span className="text-[9px] text-white/40 block mt-0.5">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">${(p.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-[1px] bg-white/5"></div>

            {/* Pricing ledger */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-neon-green">
                  <span>Discount Applied</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-white/70">
                <span>Escrow Processing Gateway</span>
                <span className="font-mono text-neon-green">FREE</span>
              </div>

              <div className="h-[1px] bg-white/5 my-2"></div>

              <div className="flex justify-between items-end">
                <span className="text-xs font-extrabold text-white uppercase tracking-widest">Escrow Total Paid</span>
                <span className="text-xl font-black text-neon-blue font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shield and Privacy Notice */}
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-sm flex items-start gap-2.5">
              <Lock className="h-4.5 w-4.5 text-neon-purple shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase text-white tracking-wider">Escrow Encryption Shield</h5>
                <p className="text-[9px] text-white/40 leading-normal">
                  Your billing screenshot and WhatsApp/Telegram credentials are encrypted directly on our sandbox. Absolutely no public exposures or third-party breaches.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
