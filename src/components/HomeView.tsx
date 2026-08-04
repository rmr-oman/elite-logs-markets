import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../state";
import { EliteLogo } from "./EliteLogo";
import { 
  Terminal, 
  Cpu, 
  MessageSquare, 
  UserCheck, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Check,
  Star,
  MessageCircle,
  Clock,
  ExternalLink,
  Globe,
  ChevronRight,
  ChevronLeft,
  SendHorizontal,
  ShoppingBag,
  Pause,
  Play
} from "lucide-react";

export const HomeView: React.FC = () => {
  const { products, setView, selectProduct, supportSettings, currentUser } = useAppState();

  // Pick top 6 products for trending carousel
  const featuredProducts = products.slice(0, 6);

  const categories = [
    { name: "Virtual Numbers", icon: Cpu, desc: "Google Voice, TextNow, Talkatone & more", color: "neon-blue" },
    { name: "Messaging Accounts", icon: MessageSquare, desc: "UK/USA WhatsApp & Telegram Warmed SIMs", color: "neon-purple" },
    { name: "Accounts", icon: UserCheck, desc: "Fresh Phone-Verified PVA Gmails, USA Apple IDs", color: "neon-green" },
    { name: "OTP & Verification Services", icon: ShieldCheck, desc: "Real-time bypass injection & customized codes", color: "neon-blue" },
    { name: "VPN Services", icon: Key, desc: "Fully active multi-device NordVPN & ExpressVPN", color: "neon-purple" },
  ];

  // Auto-Slider state for Featured Products
  const [activeProdIndex, setActiveProdIndex] = useState(0);
  const [isProdSliderPaused, setIsProdSliderPaused] = useState(false);

  // Auto-Slider state for Categories
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [isCatSliderPaused, setIsCatSliderPaused] = useState(false);

  // Auto-slide products every 3.5 seconds
  useEffect(() => {
    if (isProdSliderPaused || featuredProducts.length === 0) return;
    const interval = setInterval(() => {
      setActiveProdIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isProdSliderPaused, featuredProducts.length]);

  // Auto-slide categories every 3 seconds
  useEffect(() => {
    if (isCatSliderPaused || categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveCatIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isCatSliderPaused, categories.length]);

  const testimonials = [
    { name: "Chidi K.", role: "Digital Marketer", text: "Elite Logs is a game changer for bulk WhatsApp outreach in Nigeria. The aged WhatsApp accounts worked perfectly on my bulk sender without getting instantly flagged. Highly recommend!", rating: 5, date: "July 2026", loc: "Lagos, NG" },
    { name: "Romanus I.", role: "System Admin", text: "Incredible speed! Bought 10 fresh Gmails and received the credentials in exactly 3 seconds on the order page. 100% PVA, absolutely no annoying verification blocks.", rating: 5, date: "June 2026", loc: "Abuja, NG" },
    { name: "Alona S.", role: "Affiliate Specialist", text: "Got an SMS OTP bypass slot for my business registrations. The support team assisted me instantly over WhatsApp to verify my account. Fast, trustworthy, and safe.", rating: 5, date: "June 2026", loc: "Kiev, UA" },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Ambient Cyber Glows */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-neon-blue/10 blur-[130px] rounded-full -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-neon-purple/10 blur-[130px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl space-y-8 relative">
          
          {/* Cyber Header Badge */}
          <div className="inline-block px-3 py-1 bg-neon-green/10 border border-neon-green/30 text-neon-green text-[10px] font-bold tracking-widest uppercase mb-6 w-fit rounded-full">
            • Premium Digital Assets
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[90px] font-black leading-[0.95] tracking-tighter mb-6 uppercase text-white">
            HIGH <span className="text-neon-blue neon-text-blue">QUALITY</span> <br />
            <span className="text-neon-purple neon-text-purple">DIGITAL</span> LOGS
          </h1>

          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-semibold">
            The global leader in premium digital accounts and verification services. Secure payments, instant delivery, 24/7 technical support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setView("shop")}
              className="px-10 py-5 w-full sm:w-auto gradient-blue text-white font-black uppercase tracking-widest rounded-sm hover:scale-[1.03] transition-all select-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Browse Shop</span>
              <ArrowRight className="h-4.5 w-4.5 stroke-[3px]" />
            </button>
            <button 
              onClick={() => setView("faq")}
              className="px-10 py-5 w-full sm:w-auto bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all select-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Our Methods</span>
              <Clock className="h-4.5 w-4.5 text-white/55" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5 max-w-xl mx-auto text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-white">14K+</p>
              <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mt-1">Delivered Logs</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-[#00BFFF] neon-text-blue">99.2%</p>
              <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mt-1">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-[#8A2BE2] neon-text-purple">&lt; 15M</p>
              <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mt-1">Avg. Delivery</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Elite Categories Section */}
      <section 
        className="max-w-7xl mx-auto px-6"
        onMouseEnter={() => setIsCatSliderPaused(true)}
        onMouseLeave={() => setIsCatSliderPaused(false)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neon-purple uppercase tracking-widest font-bold">• Classified Hubs</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span>
                AUTO SLIDE ACTIVE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mt-1">Elite Categories</h2>
            <p className="text-white/40 mt-1 font-semibold">Explore our highly-specialized digital service vaults</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Slide Controls */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-sm">
              <button 
                onClick={() => setActiveCatIndex((prev) => (prev - 1 + categories.length) % categories.length)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Previous Category"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsCatSliderPaused(!isCatSliderPaused)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title={isCatSliderPaused ? "Resume Auto Slide" : "Pause Auto Slide"}
              >
                {isCatSliderPaused ? <Play className="h-3.5 w-3.5 text-neon-green" /> : <Pause className="h-3.5 w-3.5 text-neon-purple" />}
              </button>
              <button 
                onClick={() => setActiveCatIndex((prev) => (prev + 1) % categories.length)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Next Category"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button 
              onClick={() => setView("shop")}
              className="text-neon-blue hover:text-neon-blue/80 font-black flex items-center gap-1.5 text-xs uppercase tracking-widest select-none cursor-pointer border border-[#00BFFF]/20 px-4 py-2.5 rounded-sm"
            >
              <span>View All Vaults</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Auto-sliding Category Cards Grid & Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isActive = activeCatIndex === idx;
            const borderClass = isActive 
              ? "border-neon-blue shadow-[0_0_25px_rgba(0,191,255,0.25)] scale-[1.03] bg-white/[0.08]" 
              : "border-white/5 hover:border-white/20 bg-white/[0.02]";
            const textGlow = cat.color === "neon-blue" ? "text-neon-blue" : cat.color === "neon-green" ? "text-neon-green" : "text-neon-purple";
            
            return (
              <div 
                key={idx}
                onClick={() => {
                  setActiveCatIndex(idx);
                  setView("shop");
                }}
                className={`glass p-6 cyber-border rounded-xl transition-all duration-500 cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden ${borderClass}`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green animate-pulse"></div>
                )}
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg transition-transform ${isActive ? "bg-neon-blue/20 scale-110" : "bg-white/5"} ${textGlow}`}>
                    <IconComponent className="h-6 w-6 stroke-[2px]" />
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-all ${isActive ? "text-neon-blue translate-x-1" : "text-white/20 group-hover:text-white/80"}`} />
                </div>
                <div>
                  <h3 className={`font-black uppercase tracking-wide text-sm transition-colors ${isActive ? "text-neon-blue" : "text-white"}`}>
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-white/50 mt-1 line-clamp-2 leading-snug font-semibold">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Carousel Progress Indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCatIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCatIndex === idx ? "w-8 bg-neon-blue shadow-[0_0_8px_rgba(0,191,255,0.5)]" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. Trending Assets Auto-Slider */}
      <section 
        className="max-w-7xl mx-auto px-6"
        onMouseEnter={() => setIsProdSliderPaused(true)}
        onMouseLeave={() => setIsProdSliderPaused(false)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neon-green uppercase tracking-widest font-bold">• Fast-Selling Logs</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
                AUTO SLIDING
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mt-1">Trending Assets</h2>
            <p className="text-white/40 mt-1 font-semibold">Acquire top digital logs with active guarantee warranties</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Slider Controls */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-sm">
              <button 
                onClick={() => setActiveProdIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Previous Asset"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button 
                onClick={() => setIsProdSliderPaused(!isProdSliderPaused)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center gap-1 text-[10px] font-mono font-bold"
                title={isProdSliderPaused ? "Resume Auto Slide" : "Pause Auto Slide"}
              >
                {isProdSliderPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 text-neon-green" />
                    <span>PLAY</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 text-neon-blue" />
                    <span>PAUSE</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setActiveProdIndex((prev) => (prev + 1) % featuredProducts.length)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Next Asset"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Product Auto-Sliding Showcase Cards */}
        {featuredProducts.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 glass p-6 md:p-8 bg-gradient-to-br from-[#0F0F1A] via-[#0B0B0F] to-[#120F1D]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Product Preview Image */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-xl overflow-hidden group cursor-pointer border border-white/10" onClick={() => selectProduct(featuredProducts[activeProdIndex].id)}>
                <img 
                  key={featuredProducts[activeProdIndex].id}
                  src={featuredProducts[activeProdIndex].imageUrl} 
                  alt={featuredProducts[activeProdIndex].name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <span className={`absolute top-4 left-4 z-20 text-[10px] font-black px-2.5 py-1 rounded-sm border ${
                  featuredProducts[activeProdIndex].deliveryType === "Instant" 
                    ? "bg-neon-green/20 text-neon-green border-neon-green/40 backdrop-blur-md" 
                    : "bg-neon-purple/20 text-neon-purple border-neon-purple/40 backdrop-blur-md"
                }`}>
                  {featuredProducts[activeProdIndex].deliveryType === "Instant" ? "⚡ INSTANT AUTO DELIVERY" : "⏳ MANUAL VERIFIED DELIVERY"}
                </span>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono text-white/80">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                    Stock: <strong className="text-neon-blue">{featuredProducts[activeProdIndex].stock} UNITS</strong>
                  </span>
                  <span className="text-neon-purple font-bold">
                    SLIDE {activeProdIndex + 1} OF {featuredProducts.length}
                  </span>
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-neon-blue tracking-widest font-mono">
                      {featuredProducts[activeProdIndex].category}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-semibold text-white/50">
                      {featuredProducts[activeProdIndex].subCategory}
                    </span>
                  </div>

                  <h3 
                    onClick={() => selectProduct(featuredProducts[activeProdIndex].id)}
                    className="text-2xl sm:text-4xl font-black uppercase text-white hover:text-neon-blue transition-colors cursor-pointer leading-tight"
                  >
                    {featuredProducts[activeProdIndex].name}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed font-semibold max-w-xl">
                    {featuredProducts[activeProdIndex].description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-white/40 block">Guaranteed Price</span>
                    <span className="text-3xl font-black text-white font-mono">${featuredProducts[activeProdIndex].price.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => selectProduct(featuredProducts[activeProdIndex].id)}
                      className="px-8 py-4 gradient-blue text-white font-black text-xs uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all select-none cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Buy Item Now</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails to Click & Auto Slide */}
                <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {featuredProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProdIndex(idx)}
                      className={`relative w-16 h-12 rounded-sm overflow-hidden shrink-0 border transition-all cursor-pointer ${
                        activeProdIndex === idx 
                          ? "border-neon-blue ring-2 ring-neon-blue/50 scale-105" 
                          : "border-white/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="bg-white/[0.01] border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-mono text-neon-blue uppercase tracking-widest font-bold">• Uncompromising Quality</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mt-1">The Elite Standards</h2>
            <p className="text-white/40 font-semibold">Securing your digital environment is our utmost mandate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4 border-l-2 border-neon-blue pl-6 py-2">
              <Zap className="h-8 w-8 text-neon-blue" />
              <h4 className="font-extrabold uppercase tracking-widest text-sm text-white">Instant Delivery</h4>
              <p className="text-white/40 text-xs leading-relaxed font-semibold">Most instant products are delivered straight to your tracker panel within seconds of transaction matching.</p>
            </div>
            <div className="space-y-4 border-l-2 border-neon-purple pl-6 py-2">
              <ShieldCheck className="h-8 w-8 text-neon-purple" />
              <h4 className="font-extrabold uppercase tracking-widest text-sm text-white">Secure Payments</h4>
              <p className="text-white/40 text-xs leading-relaxed font-semibold">Multiple crypto (USDT) and regional instant mobile banks (bKash/Nagad) with end-to-end receipt encryption.</p>
            </div>
            <div className="space-y-4 border-l-2 border-neon-green pl-6 py-2">
              <Globe className="h-8 w-8 text-neon-green" />
              <h4 className="font-extrabold uppercase tracking-widest text-sm text-white">Global Access</h4>
              <p className="text-white/40 text-xs leading-relaxed font-semibold">Unlock regional restriction barriers and create elite profiles across USA, UK, and Europe safely.</p>
            </div>
            <div className="space-y-4 border-l-2 border-neon-blue pl-6 py-2">
              <MessageCircle className="h-8 w-8 text-neon-blue" />
              <h4 className="font-extrabold uppercase tracking-widest text-sm text-white">24/7 Support</h4>
              <p className="text-white/40 text-xs leading-relaxed font-semibold">Dedicated expert carrier admins are active around the clock on Telegram and WhatsApp Live Chat pools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-mono text-neon-purple uppercase tracking-widest font-bold">• Verified Feedbacks</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase mt-1">Trusted By Thousands</h2>
          <p className="text-white/40 font-semibold">Read authentic logs feedback from global marketers and team admins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div key={index} className="glass p-8 rounded-xl cyber-border space-y-6 flex flex-col justify-between hover:border-neon-purple hover:scale-[1.01] transition-all duration-300">
              <div className="space-y-4">
                <div className="flex gap-1 text-[#00FFAA]">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#00FFAA] stroke-none" />
                  ))}
                </div>
                <p className="text-white/70 text-xs leading-relaxed italic font-medium">
                  "{test.text}"
                </p>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-white/5">
                <div>
                  <h5 className="font-bold text-white text-xs uppercase">{test.name}</h5>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold mt-0.5">{test.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#00BFFF] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                    {test.loc}
                  </span>
                  <p className="text-[9px] text-white/30 font-mono mt-1">{test.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Live Support Channels */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#8A2BE2]/30 via-transparent to-transparent p-[1px] rounded-xl">
          <div className="bg-[#16161D] p-8 sm:p-12 rounded-xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A2BE2]/10 blur-[80px] rounded-full"></div>
            
            <div className="space-y-4 text-center md:text-left z-10 max-w-xl">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase text-white">
                Need Help? Connect with our Live Support!
              </h3>
              <p className="text-white/50 text-xs leading-relaxed font-semibold">
                Have specific account requirements? Need custom verification setups or bulk discounts? Chat directly with our verified carrier representatives instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10 shrink-0">
              <a 
                href={supportSettings.telegramLink || "https://t.me/"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white px-6 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all select-none cursor-pointer text-center"
              >
                <SendHorizontal className="h-4 w-4" />
                <span>Telegram Channel</span>
              </a>
              <a 
                href={supportSettings.whatsappLink || "https://wa.me/"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#25d366]/90 text-white px-6 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all select-none cursor-pointer text-center"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Elite Footer */}
      <footer className="border-t border-white/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 select-none">
              <EliteLogo className="w-11 h-11" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-tight uppercase text-white font-sans">
                    Elite<span className="text-white">Logs</span>
                  </span>
                  <span className="text-xl font-black tracking-tight uppercase text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                    Market
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37]/70 block -mt-1 font-semibold">
                  Verified Digital Assets
                </span>
              </div>
            </div>
            <p className="text-white/40 text-xs leading-relaxed font-semibold">
              The industry's premier digital product marketplace for verified, high-authority digital assets, logs, and carrier accounts. Quality verified, guaranteed every time.
            </p>
          </div>

          <div>
            <h5 className="text-white font-black uppercase tracking-widest text-xs mb-6">Quick Actions</h5>
            <ul className="space-y-3 text-xs text-white/50 font-bold uppercase tracking-wide">
              <li><button onClick={() => setView("shop")} className="hover:text-neon-blue transition-colors">Browse Marketplace</button></li>
              <li>
                {currentUser.isAdmin ? (
                  <a href="/admin.html" className="hover:text-neon-purple transition-colors">Admin Console</a>
                ) : (
                  <button onClick={() => setView(currentUser.isGuest ? "auth" : "dashboard")} className="hover:text-neon-blue transition-colors">My Order History</button>
                )}
              </li>
              <li><a href="/admin.html" className="text-white/20 hover:text-neon-purple transition-colors text-[10px] lowercase font-mono">admin login</a></li>
              <li><button onClick={() => setView("faq")} className="hover:text-neon-blue transition-colors">General FAQs</button></li>
              <li><button onClick={() => setView("faq")} className="hover:text-neon-blue transition-colors">Technical Warranties</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-black uppercase tracking-widest text-xs mb-6">Classified Categories</h5>
            <ul className="space-y-3 text-xs text-white/50 font-bold uppercase tracking-wide">
              <li><button onClick={() => setView("shop")} className="hover:text-neon-purple transition-colors">Virtual Phone Numbers</button></li>
              <li><button onClick={() => setView("shop")} className="hover:text-neon-purple transition-colors">Aged WhatsApp & Telegram</button></li>
              <li><button onClick={() => setView("shop")} className="hover:text-neon-purple transition-colors">PVA Verified Email Logs</button></li>
              <li><button onClick={() => setView("shop")} className="hover:text-neon-purple transition-colors">Unrestricted Private VPNs</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-black uppercase tracking-widest text-xs mb-6">Global Compliance</h5>
            <p className="text-white/40 text-xs leading-relaxed mb-4 font-semibold">
              Our support line matches verification codes and OTP releases with extreme speed and military precision.
            </p>
            <div className="flex gap-4 grayscale opacity-30">
              <span className="text-xs font-mono font-bold tracking-widest text-white border border-white/20 px-2 py-0.5 rounded">BTC</span>
              <span className="text-xs font-mono font-bold tracking-widest text-white border border-white/20 px-2 py-0.5 rounded">USDT</span>
              <span className="text-xs font-mono font-bold tracking-widest text-white border border-white/20 px-2 py-0.5 rounded">P2P</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.25em] font-black font-mono">
            © 2026 ELITE LOGS MARKET • ALL RIGHTS RESERVED • END-TO-END ENCRYPTED ACQUISITION
          </p>
          <div className="flex gap-6 text-xs text-white/35 font-semibold uppercase tracking-wider">
            <button onClick={() => setView("faq")} className="hover:text-neon-blue">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setView("faq")} className="hover:text-neon-blue">Terms of Service</button>
            <span>•</span>
            <button onClick={() => setView("faq")} className="hover:text-neon-blue">Refund Policy</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
