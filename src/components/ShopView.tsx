import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../state";
import { Category, PRESET_CATEGORIES } from "../types";
import { 
  Search, 
  ShoppingCart, 
  Zap, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  SlidersHorizontal,
  Plus,
  Lock,
  Heart,
  Pause,
  Play,
  LayoutGrid,
  Layers
} from "lucide-react";

export const ShopView: React.FC = () => {
  const { 
    products, 
    addToCart, 
    selectProduct, 
    setView 
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("grid");

  // Auto Slider states for Shop Products
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  // Auto Slide categories state
  const [autoCategorySlide, setAutoCategorySlide] = useState(true);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Category list
  const categories: Array<Category | "All"> = [
    "All",
    ...PRESET_CATEGORIES.map(c => c.name)
  ];

  const getCategoryEmoji = (catName: string) => {
    const match = PRESET_CATEGORIES.find(c => c.name === catName);
    return match ? match.emoji : "💼";
  };

  // Hotkey Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products based on search term and active category
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset active slider index if filtered products change
  useEffect(() => {
    setActiveSliderIndex(0);
  }, [selectedCategory, searchTerm]);

  // Auto-slide products in slider mode every 3.5 seconds
  useEffect(() => {
    if (isSliderPaused || filteredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSliderIndex(prev => (prev + 1) % filteredProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isSliderPaused, filteredProducts.length]);

  // Auto-slide category bar every 4 seconds if enabled
  useEffect(() => {
    if (!autoCategorySlide || !categoryScrollRef.current) return;
    const interval = setInterval(() => {
      if (categoryScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          categoryScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          categoryScrollRef.current.scrollBy({ left: 160, behavior: "smooth" });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [autoCategorySlide]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleQuickBuy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(id, 1);
    setView("cart");
  };

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(id, 1);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Search & Welcome Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase">
            CLASSIFIED <span className="text-[#00BFFF] neon-text-blue">ASSETS</span>
          </h2>
          <p className="text-white/40 text-xs font-semibold">
            Filter high-authority, pristine digital accounts and fully verified virtual codes.
          </p>
        </div>

        {/* Dynamic Interactive Search Bar */}
        <div className="w-full lg:w-96">
          <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-neon-blue/40 rounded-sm px-4 py-3 transition-all duration-300 shadow-md">
            <Search className="h-5 w-5 text-white/40 focus-within:text-neon-blue transition-colors" />
            <input 
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search elite logs, VPNs, accounts..."
              className="bg-transparent border-none focus:outline-none w-full text-white text-xs px-3 placeholder:text-white/30 font-semibold"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-bold text-white/40 uppercase bg-white/5 font-mono select-none">
              ⌘ K
            </kbd>
          </div>
        </div>
      </section>

      {/* Category Chips Auto-Sliding Carousel */}
      <section className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-blue flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></span>
            Category Navigation
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (categoryScrollRef.current) {
                  categoryScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
                }
              }}
              className="p-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/70 hover:text-white transition-colors"
              title="Slide Left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAutoCategorySlide(!autoCategorySlide)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border transition-colors ${
                autoCategorySlide 
                  ? "bg-neon-blue/10 text-neon-blue border-neon-blue/30" 
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
              title="Toggle Auto Slide Categories"
            >
              {autoCategorySlide ? "AUTO SLIDE ON" : "AUTO SLIDE OFF"}
            </button>
            <button
              onClick={() => {
                if (categoryScrollRef.current) {
                  categoryScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
                }
              }}
              className="p-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/70 hover:text-white transition-colors"
              title="Slide Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div 
          ref={categoryScrollRef}
          onMouseEnter={() => setAutoCategorySlide(false)}
          className="overflow-x-auto custom-scrollbar py-2 -mx-6 px-6 scroll-smooth"
        >
          <div className="flex gap-3 min-w-max">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat);
                  // Smooth scroll to this button
                  const btn = categoryScrollRef.current?.children[0]?.children[idx] as HTMLElement;
                  if (btn && categoryScrollRef.current) {
                    categoryScrollRef.current.scrollTo({
                      left: btn.offsetLeft - 100,
                      behavior: "smooth"
                    });
                  }
                }}
                className={`px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider select-none cursor-pointer transition-all duration-300 ${
                  selectedCategory === cat 
                    ? "gradient-blue text-white font-black shadow-lg shadow-neon-blue/20 scale-105 ring-1 ring-neon-blue" 
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {cat === "All" ? "🔥 All Items" : `${getCategoryEmoji(cat)} ${cat}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & View Mode Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/40 border-b border-white/5 pb-4 uppercase tracking-wider font-bold">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neon-blue" />
          <span>Showing <strong className="text-white">{filteredProducts.length}</strong> premium assets</span>
          {selectedCategory !== "All" && (
            <span className="text-[10px] font-mono text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20">
              {selectedCategory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/50">Display Mode:</span>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                viewMode === "grid" 
                  ? "bg-neon-blue text-black font-black shadow-sm" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode("slider")}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                viewMode === "slider" 
                  ? "bg-neon-purple text-white font-black shadow-sm" 
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Auto Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Slider View OR Product Grid */}
      {viewMode === "slider" && filteredProducts.length > 0 ? (
        <div 
          className="glass p-6 md:p-8 rounded-xl border border-neon-purple/30 bg-gradient-to-br from-[#0D0D17] via-[#09090F] to-[#120B1F] relative overflow-hidden space-y-6"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
        >
          {/* Header Controls for Auto Slider */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-neon-purple">• Auto Slider Showcase</span>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-neon-purple/20 text-neon-purple rounded-full border border-neon-purple/40 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span>
                AUTO ROTATING ({activeSliderIndex + 1}/{filteredProducts.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSliderIndex(prev => (prev - 1 + filteredProducts.length) % filteredProducts.length)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded text-white transition-colors"
                title="Previous Asset"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsSliderPaused(!isSliderPaused)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 border border-white/10"
              >
                {isSliderPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 text-neon-green" />
                    <span>PLAY</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 text-neon-purple" />
                    <span>PAUSE</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveSliderIndex(prev => (prev + 1) % filteredProducts.length)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded text-white transition-colors"
                title="Next Asset"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Slider Card Showcase */}
          {(() => {
            const p = filteredProducts[activeSliderIndex];
            if (!p) return null;
            const isOutOfStock = p.stock <= 0;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div 
                  className="lg:col-span-5 relative h-72 sm:h-80 rounded-xl overflow-hidden group cursor-pointer border border-white/10"
                  onClick={() => selectProduct(p.id)}
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 animate-fadeIn"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  <span className={`absolute top-4 left-4 z-20 text-[10px] font-black px-2.5 py-1 rounded-sm border ${
                    p.deliveryType === "Instant" 
                      ? "bg-neon-green/20 text-neon-green border-neon-green/40 backdrop-blur-md" 
                      : "bg-neon-purple/20 text-neon-purple border-neon-purple/40 backdrop-blur-md"
                  }`}>
                    {p.deliveryType === "Instant" ? "⚡ INSTANT DELIVERY" : "⏳ MANUAL DELIVERY"}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-white/80">
                      Catalog Stock: <strong className="text-neon-green">{p.stock} units</strong>
                    </span>
                    <span className="text-neon-blue font-bold">
                      ITEM #{p.id}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-neon-blue tracking-widest font-mono">
                        {p.category}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-xs font-semibold text-white/50">
                        {p.subCategory}
                      </span>
                    </div>

                    <h3 
                      onClick={() => selectProduct(p.id)}
                      className="text-2xl sm:text-4xl font-black uppercase text-white hover:text-neon-blue transition-colors cursor-pointer leading-tight"
                    >
                      {p.name}
                    </h3>

                    <p className="text-sm text-white/60 leading-relaxed font-semibold">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-white/40 block">Guaranteed Price</span>
                      <span className="text-3xl font-black text-white font-mono">${p.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleAddToCart(p.id, e)}
                        disabled={isOutOfStock}
                        className="px-5 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickBuy(p.id, e)}
                        disabled={isOutOfStock}
                        className="px-8 py-3.5 gradient-blue text-white font-black text-xs uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all select-none cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Buy Asset Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Auto Sliding Card Thumbnails Horizontal Reel */}
                  <div className="pt-2 flex items-center gap-2 overflow-x-auto custom-scrollbar py-2">
                    {filteredProducts.map((prod, idx) => (
                      <button
                        key={prod.id}
                        onClick={() => setActiveSliderIndex(idx)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          activeSliderIndex === idx 
                            ? "border-neon-purple ring-2 ring-neon-purple/50 scale-105 opacity-100" 
                            : "border-white/10 opacity-40 hover:opacity-80"
                        }`}
                      >
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/20"></span>
                        <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white font-bold bg-black/60 px-1 rounded">
                          ${prod.price}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            );
          })()}
        </div>
      ) : null}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${viewMode === "slider" ? "mt-8" : ""}`}>
          {filteredProducts.map((p) => {
            const isFav = favorites.includes(p.id);
            const isOutOfStock = p.stock <= 0;
            
            return (
              <div 
                key={p.id}
                onClick={() => selectProduct(p.id)}
                className={`group relative flex flex-col justify-between glass p-1.5 cyber-border rounded-xl overflow-hidden hover:border-neon-blue hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(0,191,255,0.1)] transition-all duration-300 ${
                  isOutOfStock ? "opacity-60 grayscale-[0.5]" : ""
                }`}
                style={{ height: "420px" }}
              >
                {/* Image Area */}
                <div className="relative h-44 overflow-hidden bg-white/5 rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F17] to-transparent z-10 opacity-70"></div>
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={p.imageUrl} 
                    alt={p.name}
                  />
                  
                  {/* Category overlay label */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm border ${
                      p.deliveryType === "Instant" 
                        ? "bg-neon-green/10 text-neon-green border-neon-green/30" 
                        : "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                    }`}>
                      {p.deliveryType === "Instant" ? "⚡ INSTANT DELIVERY" : "⏳ MANUAL DELIVERY"}
                    </span>
                    {p.price > 30 && (
                      <span className="bg-neon-purple text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider w-max">
                        ELITE TIER
                      </span>
                    )}
                  </div>

                  {/* Favorite Indicator */}
                  <button 
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 text-white active:scale-90 transition-transform select-none cursor-pointer"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-neon-purple text-neon-purple" : "text-white/60"}`} />
                  </button>

                  {/* Anti-Scraping Copy Protection Mockup Overlay */}
                  <div className="absolute inset-0 z-15 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-1 bg-black/75 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded text-[10px] text-white/80 font-mono">
                      <Lock className="h-3 w-3 text-neon-blue" />
                      <span>DETAILS ENCRYPTED</span>
                    </div>
                  </div>
                </div>

                {/* Info and Actions Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">
                        {p.category}
                      </p>
                      <span className={`text-[10px] font-mono font-bold ${isOutOfStock ? "text-red-500" : "text-neon-green"}`}>
                        {isOutOfStock ? "SOLD OUT" : "IN STOCK"}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-black uppercase text-white group-hover:text-neon-blue transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    
                    <p className="text-[11px] text-white/40 font-semibold line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Price and Stock Stats */}
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="block text-xs text-white/40 font-semibold uppercase leading-none">Price</span>
                        <span className="text-xl font-black text-white font-mono">${p.price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-white/40 font-mono leading-none">Catalog stock</span>
                        <span className="text-xs font-bold text-white/80 font-mono">{p.stock} units</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={(e) => handleAddToCart(p.id, e)}
                        disabled={isOutOfStock}
                        className={`py-2 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 select-none transition-all ${
                          isOutOfStock 
                            ? "bg-white/5 text-white/30 cursor-not-allowed" 
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
                        }`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={(e) => handleQuickBuy(p.id, e)}
                        disabled={isOutOfStock}
                        className={`py-2 rounded-sm text-xs font-black uppercase tracking-widest select-none transition-all ${
                          isOutOfStock 
                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                            : "gradient-blue text-white hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                      >
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-sm">
          <HelpCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white uppercase">No premium assets found</h3>
          <p className="text-xs text-white/40 max-w-md mx-auto mt-1">
            We couldn't match any items to "{searchTerm}". Try exploring other categories or clearing your search filters.
          </p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="mt-6 bg-white/5 border border-white/10 hover:border-white/25 px-6 py-2 rounded text-xs font-bold uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
