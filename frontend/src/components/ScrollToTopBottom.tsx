"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ScrollToTopBottom() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 120 || document.documentElement.scrollTop > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(true); // Keep visible so user can scroll down easily too
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Also scroll active scrollable overflow containers if any
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight || document.body.scrollHeight,
      behavior: "smooth",
    });

    // Also scroll active scrollable overflow containers if any
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-xl transition-all duration-300"
      aria-label="Scroll Navigation"
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-xs group cursor-pointer"
        title="Scroll to Top"
        aria-label="Scroll to top of page"
      >
        <ChevronUp className="w-5 h-5 transition-transform group-active:-translate-y-0.5" />
      </button>

      <div className="w-full h-[1px] bg-slate-200/80 my-0.5" />

      <button
        type="button"
        onClick={scrollToBottom}
        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white flex items-center justify-center transition-colors shadow-xs group cursor-pointer"
        title="Scroll to Bottom"
        aria-label="Scroll to bottom of page"
      >
        <ChevronDown className="w-5 h-5 transition-transform group-active:translate-y-0.5" />
      </button>
    </div>
  );
}
