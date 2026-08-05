import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useAppState } from "./state";
import { AdminPanel } from "./components/AdminPanel";
import { EliteLogo } from "./components/EliteLogo";
import { ShieldAlert, ArrowLeft, Lock, LogIn } from "lucide-react";

export default function AdminApp() {
  const { currentUser } = useAppState();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isSubscribed) return;

      if (!firebaseUser) {
        // Fallback: Check local state currentUser if logged in without Firebase session, provided active session exists
        const isSessionActive = sessionStorage.getItem("elite_active_browser_session") === "true";
        const localUserStr = isSessionActive ? (sessionStorage.getItem("elite_logs_user") || localStorage.getItem("elite_logs_user")) : null;
        let isLocalAdmin = false;
        if (localUserStr) {
          try {
            const parsed = JSON.parse(localUserStr);
            if (parsed && !parsed.isGuest && (parsed.isAdmin || parsed.email === "admin@elitelogs.net" || parsed.email === "rahatislamroman@gmail.com")) {
              isLocalAdmin = true;
            }
          } catch (e) {
            console.error(e);
          }
        }

        if (isLocalAdmin) {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }

        // Unauthorized access
        setIsAuthorized(false);
        setIsChecking(false);
        setAuthError("Unauthorized access! Redirecting to user homepage.");
        
        alert("Unauthorized access! Redirecting to user homepage.");
        window.location.href = "/index.html";
        return;
      }

      // User logged in via Firebase Auth
      const userEmail = firebaseUser.email?.toLowerCase().trim() || "";
      const isAdminByEmail = userEmail === "admin@elitelogs.net" || userEmail === "rahatislamroman@gmail.com";

      try {
        const userDocRef = doc(db, "registered_users", userEmail);
        const docSnap = await getDoc(userDocRef);
        const isDbAdmin = docSnap.exists() && docSnap.data().isAdmin === true;

        if (isAdminByEmail || isDbAdmin) {
          if (isSubscribed) {
            setIsAuthorized(true);
            setIsChecking(false);
          }
        } else {
          if (isSubscribed) {
            setIsAuthorized(false);
            setIsChecking(false);
            setAuthError("Unauthorized access! Redirecting to user homepage.");
            alert("Unauthorized access! Redirecting to user homepage.");
            window.location.href = "/index.html";
          }
        }
      } catch (err) {
        if (isAdminByEmail) {
          if (isSubscribed) {
            setIsAuthorized(true);
            setIsChecking(false);
          }
        } else {
          if (isSubscribed) {
            setIsAuthorized(false);
            setIsChecking(false);
            setAuthError("Unauthorized access! Redirecting to user homepage.");
            alert("Unauthorized access! Redirecting to user homepage.");
            window.location.href = "/index.html";
          }
        }
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative">
          <EliteLogo className="w-16 h-16 animate-pulse" />
          <div className="absolute -inset-2 rounded-full border border-neon-purple/40 animate-ping opacity-25"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black font-mono uppercase tracking-widest text-neon-purple flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 animate-spin" />
            <span>Verifying Admin Authorization...</span>
          </h2>
          <p className="text-xs text-white/50 font-mono">
            Checking credentials and Firebase Auth security tokens
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/30 text-red-500">
          <ShieldAlert className="h-12 w-12 animate-pulse" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-xl font-black uppercase tracking-wider text-red-400">
            Access Denied
          </h1>
          <p className="text-xs text-white/60 font-mono">
            {authError || "Unauthorized access! Redirecting to user homepage."}
          </p>
        </div>
        <a
          href="/index.html"
          className="px-6 py-2.5 bg-neon-purple hover:bg-neon-purple/90 text-black font-black uppercase text-xs tracking-widest rounded-sm cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to User Homepage</span>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white font-sans flex flex-col selection:bg-neon-purple selection:text-black">
      {/* Decorative top admin line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-neon-purple to-neon-blue"></div>

      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 bg-[#0B0B0F]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EliteLogo className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black uppercase tracking-tight text-white">
                  Elite Logs <span className="text-neon-purple">Admin Control Desk</span>
                </span>
                <span className="px-2 py-0.5 bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[10px] font-mono font-bold uppercase rounded">
                  SECURE MODE
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/40">
                Authorized Master Session • {auth.currentUser?.email || currentUser.email}
              </p>
            </div>
          </div>

          <a
            href="/index.html"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono font-bold text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-neon-blue" />
            <span>Back to Public Store</span>
          </a>
        </div>
      </header>

      {/* Admin Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <AdminPanel />
      </main>
    </div>
  );
}
