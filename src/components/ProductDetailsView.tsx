import React, { useState } from "react";
import { useAppState } from "../state";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Share2, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";

export const ProductDetailsView: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    addToCart, 
    setView, 
    setView: changeView 
  } = useAppState();

  const [copiedLink, setCopiedLink] = useState(false);

  // Find the selected product
  const product = products.find(p => p.id === selectedProductId);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60">Product not found.</p>
        <button 
          onClick={() => setView("shop")} 
          className="mt-4 bg-neon-blue text-black font-bold px-6 py-2 rounded"
        >
          Back to Market
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href + "#" + product.id);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id, 1);
    setView("cart");
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Navigation Anchor */}
      <button 
        onClick={() => setView("shop")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-neon-blue transition-colors select-none cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform stroke-[2.5px]" />
        <span>Return to Marketplace</span>
      </button>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Dynamic Product Image and Delivery badge explanation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-1.5 cyber-border rounded-xl overflow-hidden relative aspect-square group">
            <div className="absolute -inset-4 bg-neon-purple/10 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <img 
              className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105" 
              src={product.imageUrl} 
              alt={product.name}
            />

            {/* Float badge indicator overlay */}
            <span className={`absolute top-6 left-6 z-20 text-[10px] font-black px-3 py-1 rounded-sm border ${
              product.deliveryType === "Instant" 
                ? "bg-neon-green/10 text-neon-green border-neon-green/30" 
                : "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
            }`}>
              {product.deliveryType === "Instant" ? "⚡ INSTANT DELIVERY" : "⏳ MANUAL DELIVERY"}
            </span>
          </div>

          {/* Delivery Process Map Box */}
          <div className="glass p-5 rounded-xl cyber-border space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#00BFFF]" />
              <span>Matching & Delivery Protocol</span>
            </h4>
            <p className="text-[11px] text-white/40 leading-relaxed font-semibold">
              {product.deliveryType === "Instant" 
                ? "Automatic Extraction: The second your checkout receipt is approved, our automated locker fetches the requested serial/login keys from pre-seeded stock and lists them copy-ready on your orders panel." 
                : "Admin Carrier Handshake: This messaging product is active on physical SIM nodes. Once payment is logged, our admin manually hooks the carrier verification gateway and releases setup keys in 10-30 mins."}
            </p>
          </div>
        </div>

        {/* Right Side: Product Details, description & actions */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header titles */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-neon-blue uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm">
              {product.category}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase text-white leading-none">
              {product.name}
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              {product.subCategory}
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-0.5">Price</span>
                <span className="text-3xl font-black text-[#00BFFF] font-mono">${product.price.toFixed(2)}</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-0.5">Guarantee</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">7-Day Replacement</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-0.5">Availability</span>
                <span className={`text-xs font-bold uppercase tracking-wider block ${isOutOfStock ? "text-red-500" : "text-[#00FFAA]"}`}>
                  {isOutOfStock ? "SOLD OUT" : `Active (${product.stock} left)`}
                </span>
              </div>
            </div>
          </div>

          {/* Description Text Box */}
          <div className="glass p-6 rounded-xl cyber-border space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Core Product Intel</h3>
            <p className="text-xs text-white/70 leading-relaxed font-medium">
              {product.description}
            </p>
            
            <div className="h-[1px] bg-white/5"></div>

            {/* Features check points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80 font-semibold">
                  <CheckCircle className="h-4.5 w-4.5 text-[#00FFAA] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Bento Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Technical Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, val], idx) => (
                <div key={idx} className="glass border border-white/5 p-4 rounded-xl flex justify-between items-center text-xs hover:border-[#8A2BE2] transition-colors">
                  <span className="text-white/40 uppercase font-bold tracking-wider">{key}</span>
                  <span className="text-white font-black">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Triggers Action Block */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 py-4 px-8 rounded-xl font-black uppercase tracking-widest text-center select-none transition-all ${
                isOutOfStock 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : "gradient-blue text-white hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_4px_20px_rgba(0,191,255,0.2)]"
              }`}
            >
              <span>Instant Buy Now</span>
            </button>
            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={isOutOfStock}
              className={`sm:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest select-none border transition-all flex items-center justify-center gap-2 ${
                isOutOfStock 
                  ? "border-white/5 text-white/20 cursor-not-allowed" 
                  : "bg-white/5 border-white/10 hover:border-white/25 text-white hover:bg-white/10 active:scale-95 cursor-pointer"
              }`}
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-white/70 hover:text-white flex items-center justify-center select-none cursor-pointer active:scale-95 transition-all"
              title="Copy Asset Code"
            >
              {copiedLink ? <CheckCircle className="h-4.5 w-4.5 text-[#00FFAA]" /> : <Share2 className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Quick Notice of Support */}
          <div className="flex gap-2.5 items-center p-4 bg-white/[0.01] border border-white/5 rounded-xl">
            <Info className="h-4.5 w-4.5 text-neon-blue shrink-0" />
            <p className="text-[10px] text-white/40 leading-normal font-semibold uppercase tracking-wide">
              7-Day automatic login replacement protection applies to all digital logs. If credentials fail to resolve on initial load, connect with live WhatsApp/Telegram reps for a manual trade-in slot.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
