import React, { useState } from "react";
import { useAppState } from "../state";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Ticket,
  X,
  Lock
} from "lucide-react";

export const CartView: React.FC = () => {
  const { 
    cart, 
    products, 
    updateCartQuantity, 
    removeFromCart, 
    activeCouponCode, 
    applyCoupon, 
    removeCoupon, 
    setView 
  } = useAppState();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Match items with catalog product details
  const cartItems = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      product: prod,
      quantity: item.quantity
    };
  }).filter(item => item.product !== undefined);

  // Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  // Active coupon discount calculation
  let discountPercent = 0;
  if (activeCouponCode) {
    if (activeCouponCode === "ELITE20") discountPercent = 20;
    else if (activeCouponCode === "NIGERIA10") discountPercent = 10;
    else if (activeCouponCode === "CYBER50") discountPercent = 50;
  }

  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = 0.00; // Digital Delivery is 100% Free
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res) {
      setCouponSuccess(true);
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try ELITE20, NIGERIA10, or CYBER50.");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess(false);
    setCouponError("");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
          <ShoppingBag className="h-8 w-8 text-white/30 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold uppercase tracking-wider text-white">Your Cart is Empty</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            You haven't added any premium logs, verified accounts, or virtual numbers to your active catalog.
          </p>
        </div>
        <button 
          onClick={() => setView("shop")}
          className="bg-neon-blue text-black font-extrabold px-8 py-3 rounded-sm uppercase tracking-wider text-xs hover:scale-105 active:scale-95 transition-all select-none cursor-pointer"
        >
          Explore Assets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black italic uppercase text-white tracking-wide">Shopping Cart</h2>
        <p className="text-xs text-white/50">Verify and adjust your selected digital items before completing escrow routing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Product Line Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-sm border border-white/5 divide-y divide-white/5">
            {cartItems.map((item, idx) => {
              const p = item.product!;
              const itemTotal = p.price * item.quantity;

              return (
                <div key={p.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  
                  {/* Image & Product Info */}
                  <div className="flex items-center gap-4">
                    <img 
                      className="h-16 w-16 object-cover rounded-sm bg-white/5" 
                      src={p.imageUrl} 
                      alt={p.name}
                    />
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neon-blue uppercase tracking-widest block mb-0.5">
                        {p.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-xs text-white/40 mt-1">Single Unit Price: <span className="font-mono text-white/80">${p.price.toFixed(2)}</span></p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto">
                    
                    {/* Interactive Quantity Box */}
                    <div className="flex items-center border border-white/10 rounded overflow-hidden bg-white/[0.02]">
                      <button 
                        onClick={() => updateCartQuantity(p.id, item.quantity - 1)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/5 select-none cursor-pointer active:scale-90"
                      >
                        <Minus className="h-3 w-3 stroke-[2.5px]" />
                      </button>
                      <span className="px-4 text-xs font-bold font-mono text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(p.id, item.quantity + 1)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/5 select-none cursor-pointer active:scale-90"
                      >
                        <Plus className="h-3 w-3 stroke-[2.5px]" />
                      </button>
                    </div>

                    {/* Pricing Sum and Trash */}
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-bold font-mono text-white w-16 text-right">
                        ${itemTotal.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(p.id)}
                        className="p-2 text-white/40 hover:text-red-500 rounded hover:bg-red-500/5 select-none cursor-pointer transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setView("shop")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-blue hover:underline select-none cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Right Side: Order Summary Calculation & Coupon apply */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Code Panel */}
          <div className="glass-card p-6 rounded-sm border border-white/5 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">Promo Discounts</h3>
            
            {activeCouponCode ? (
              <div className="flex items-center justify-between p-3 bg-neon-green/5 border border-neon-green/20 rounded text-xs text-neon-green">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Coupon Applied: <strong>{activeCouponCode} ({discountPercent}% OFF)</strong></span>
                </div>
                <button 
                  onClick={handleRemoveCoupon}
                  className="p-1 hover:bg-neon-green/10 rounded select-none cursor-pointer text-neon-green"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo Code"
                  className="bg-white/5 border border-white/10 rounded-sm focus:border-neon-blue/40 focus:outline-none p-2.5 text-xs text-white placeholder:text-white/30 uppercase flex-1"
                />
                <button 
                  type="submit"
                  className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 px-4 rounded-sm text-xs font-bold uppercase tracking-wider"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-neon-green font-semibold">Discount coupon applied successfully!</p>}
          </div>

          {/* Pricing Ledger Card */}
          <div className="glass-card p-6 rounded-sm border border-white/5 space-y-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-b border-white/5 pb-3">
              Billing Ledger
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-neon-green">
                  <span>Discounts ({activeCouponCode})</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-white/50">Escrow Gateway Fee</span>
                <span className="font-mono text-neon-green">FREE</span>
              </div>

              <div className="h-[1px] bg-white/5 my-2"></div>

              <div className="flex justify-between items-end">
                <span className="text-xs font-extrabold uppercase text-white tracking-widest">Escrow Total</span>
                <span className="text-2xl font-black text-neon-blue font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-3">
              <button
                onClick={() => setView("checkout")}
                className="w-full bg-neon-blue hover:bg-neon-blue/95 text-black font-black py-4 rounded-sm uppercase tracking-widest text-xs flex items-center justify-center gap-2 select-none cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Proceed to Escrow Checkout</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
              </button>
              
              <div className="flex justify-center items-center gap-1.5 text-[9px] text-white/30 font-mono">
                <Lock className="h-3 w-3" />
                <span>SECURED AES-256 CONNECTION ENCRYPTED</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
