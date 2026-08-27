"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.error("[PWA] SW registration failed:", err));
    }

    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user already dismissed this session
    const wasDismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Listen for the browser's install-ready event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the banner after a short delay so it doesn't feel intrusive
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Track successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setShowBanner(false);
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (isInstalled || dismissed || !showBanner) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm
        bg-white border border-purple-100 rounded-2xl shadow-2xl shadow-purple-200/40
        transition-all duration-500 ease-out
        ${showBanner ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}
      `}
      role="dialog"
      aria-label="Install rbptech app"
    >
      {/* Purple accent line at top */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-t-2xl" />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* App icon */}
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-300/40">
            <span className="text-white font-extrabold text-xs tracking-tight">.rbpt</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-slate-900 text-sm leading-tight">Add rbptech to Home Screen</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-snug">
              One-tap access — works offline, no app store needed
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
            aria-label="Dismiss install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device indicators */}
        <div className="flex gap-3 mb-4 pl-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span>Mobile</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>Desktop</span>
          </div>
        </div>

        {/* Install button */}
        <button
          id="pwa-install-btn"
          onClick={handleInstall}
          disabled={installing}
          className="
            w-full py-2.5 px-4 rounded-xl font-extrabold text-sm
            bg-purple-600 hover:bg-purple-700 active:scale-[0.98]
            text-white transition-all duration-150
            flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed
            shadow-md shadow-purple-300/30
          "
        >
          {installing ? (
            <span className="animate-pulse">Installing...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
