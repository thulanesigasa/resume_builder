"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function SecurityWrapper({ children }: { children: React.ReactNode }) {
  const [isBlackout, setIsBlackout] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleBlur = () => {
      // Window lost focus (could be Snipping Tool overlay, or just switching apps)
      setIsBlackout(true);
    };

    const handleFocus = () => {
      // Window regained focus
      setIsBlackout(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Common screenshot/print shortcuts
      // PrintScreen: e.key === 'PrintScreen'
      // Windows Snipping Tool: Meta + Shift + S
      // Mac Screenshot: Meta + Shift + 3 / Meta + Shift + 4
      // Print: Ctrl/Cmd + P
      
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');
      const isWinSnippingTool = e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S');
      const isPrintScreen = e.key === 'PrintScreen';
      const isPrint = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');

      if (isMacScreenshot || isWinSnippingTool || isPrintScreen || isPrint) {
        setIsBlackout(true);
        // Fallback: clear blackout after 3 seconds if blur doesn't happen
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setIsBlackout(false), 3000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setTimeout(() => setIsBlackout(false), 500);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsBlackout(true);
      } else {
        setIsBlackout(false);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Disable right click (context menu) to prevent "Save Image As" or inspect element trivially
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('contextmenu', handleContextMenu);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="select-none">
        {children}
      </div>

      {isBlackout && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white">
          <ShieldAlert className="w-16 h-16 text-brand-indigo mb-4" />
          <h2 className="text-2xl font-bold mb-2">Security Protection Active</h2>
          <p className="text-gray-400">Screenshots and printing are disabled to protect document integrity.</p>
        </div>
      )}
    </>
  );
}
