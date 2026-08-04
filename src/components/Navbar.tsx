import React from "react";
import { useAppState } from "../state";
import { EliteLogo } from "./EliteLogo";
import { ProfileDropdown } from "./ProfileDropdown";
import { 
  ShoppingBag, 
  ShoppingCart, 
  User, 
  Coins, 
  LogOut, 
  LogIn,
  ShieldAlert,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    cart, 
    setView, 
    activeView, 
    toggleAdminMode,
    logOut
  } = useAppState();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: "Home", view: "home" },
    { label: "Market", view: "shop" },
  ];

  if (!currentUser.isGuest) {
    if (currentUser.isAdmin) {
      navItems.push({ label: "Admin Dashboard", view: "admin" });
    } else {
      navItems.push({ label: "Dashboard", view: "dashboard" });
    }
  }

  navItems.push({ label: "FAQ & Support", view: "faq" });

  return (
    <header className="sticky top-0 w-full z-50 bg-[#0B0B0F]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { setView("home"); setMobileMenuOpen(false); }} 
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="logo-anchor"
        >
          <EliteLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white font-sans">
                Elite<span className="text-white">Logs</span>
              </span>
              <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                Market
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#D4AF37]/70 block -mt-1 font-semibold">
              Verified Digital Assets
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-200 relative py-1 hover:text-neon-blue ${
                activeView === item.view 
                  ? "text-[#00BFFF] font-black after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#00BFFF]" 
                  : "text-white/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center gap-4">
          
          {/* User Wallet Balance or Sign In */}
          {currentUser.isGuest ? (
            <button
              onClick={() => setView("auth")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue hover:text-black rounded-sm text-xs font-bold uppercase transition-all shadow-[0_0_8px_rgba(0,191,255,0.2)] cursor-pointer select-none"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            !currentUser.isAdmin && (
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
                <Coins className="h-4 w-4 text-neon-green" />
                <span className="text-xs font-mono font-bold text-white">
                  ${currentUser.walletBalance.toFixed(2)}
                </span>
              </div>
            )
          )}

          {/* Admin Panel Button - Only visible when logged in as administrator */}
          {currentUser.isAdmin && (
            <button
              onClick={() => setView("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase transition-all border ${
                activeView === "admin"
                  ? "bg-neon-purple border-neon-purple text-black font-black shadow-[0_0_12px_rgba(255,0,255,0.4)]"
                  : "bg-neon-purple/10 border-neon-purple/30 text-neon-purple hover:bg-neon-purple hover:text-black hover:border-neon-purple shadow-[0_0_8px_rgba(255,0,255,0.15)]"
              }`}
              title="Open Admin Panel"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          {!currentUser.isAdmin && (
            <button 
              onClick={() => setView("cart")}
              className="relative p-2.5 rounded-sm bg-white/5 border border-white/10 text-white hover:text-neon-blue hover:border-neon-blue/40 hover:bg-neon-blue/5 transition-all"
              id="navbar-cart-btn"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-blue text-[10px] font-black text-black animate-pulse shadow-[0_0_10px_rgba(0,191,255,0.8)]">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Dashboard trigger */}
          <button 
            onClick={() => {
              if (currentUser.isGuest) {
                setView("auth");
              } else {
                setProfileDropdownOpen(true);
              }
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-sm bg-white/5 border border-white/10 hover:border-neon-purple hover:bg-neon-purple/5 transition-all text-white hover:text-neon-purple flex items-center gap-2 cursor-pointer select-none"
            title={currentUser.isGuest ? "Login / Register" : "Profile & Account Menu"}
          >
            {currentUser.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt="Profile Avatar" 
                className="w-6 h-6 rounded-full object-cover border border-neon-purple/50 shrink-0" 
              />
            ) : (
              <User className="h-5 w-5 text-neon-purple" />
            )}
            {!currentUser.isGuest && (
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-mono font-bold text-white/90 leading-tight">
                  {currentUser.fullName || currentUser.username}
                </span>
                <span className="text-[8px] font-mono uppercase text-neon-purple tracking-widest font-bold">
                  {currentUser.isAdmin ? "Master Admin" : "User Profile"}
                </span>
              </div>
            )}
          </button>

          {/* Logout button */}
          {!currentUser.isGuest && (
            <button 
              onClick={() => logOut()}
              className="p-2.5 rounded-sm bg-white/5 border border-white/10 hover:border-red-500 hover:bg-red-500/5 hover:text-red-500 transition-all text-white/70"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 md:hidden rounded-sm bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B0B0F]/98 px-6 py-4 space-y-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 font-semibold text-sm uppercase tracking-wider ${
                  activeView === item.view ? "text-neon-blue" : "text-white/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-[1px] bg-white/10 w-full my-2"></div>

          {!currentUser.isAdmin && !currentUser.isGuest && (
            <div className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg">
              <span className="text-xs text-white/50">Wallet Balance</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-neon-green" />
                <span className="font-mono text-sm font-bold">${currentUser.walletBalance.toFixed(2)}</span>
              </div>
            </div>
          )}

          {currentUser.isGuest ? (
            <button
              onClick={() => {
                setView("auth");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-neon-blue/15 border border-neon-blue/30 text-neon-blue font-bold rounded text-xs uppercase"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Register</span>
            </button>
          ) : (
            <button
              onClick={() => {
                logOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded text-xs uppercase"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}

      {/* Profile Menu Dropdown */}
      <ProfileDropdown 
        isOpen={profileDropdownOpen} 
        onClose={() => setProfileDropdownOpen(false)} 
      />
    </header>
  );
};
