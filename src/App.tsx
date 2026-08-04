import React from "react";
import { useAppState } from "./state";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./components/HomeView";
import { ShopView } from "./components/ShopView";
import { ProductDetailsView } from "./components/ProductDetailsView";
import { CartView } from "./components/CartView";
import { CheckoutView } from "./components/CheckoutView";
import { DashboardView } from "./components/DashboardView";
import { TrackingView } from "./components/TrackingView";
import { FAQView } from "./components/FAQView";
import { AdminPanel } from "./components/AdminPanel";
import { AuthView } from "./components/AuthView";
import { SupportChat } from "./components/SupportChat";

export default function App() {
  const { activeView, currentUser, setView } = useAppState();

  React.useEffect(() => {
    if (activeView === "admin") {
      window.location.href = "/admin.html";
    }
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case "home":
        return <HomeView />;
      case "shop":
        return <ShopView />;
      case "product":
        return <ProductDetailsView />;
      case "cart":
        return <CartView />;
      case "checkout":
        return <CheckoutView />;
      case "dashboard":
        return <DashboardView />;
      case "tracking":
        return <TrackingView />;
      case "faq":
        return <FAQView />;
      case "auth":
        return <AuthView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white font-sans flex flex-col selection:bg-neon-purple selection:text-black">
      {/* Decorative top energy line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"></div>

      {/* Primary Sticky Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {renderActiveView()}
      </main>

      {/* Floating real-time support chat */}
      <SupportChat />
    </div>
  );
}

