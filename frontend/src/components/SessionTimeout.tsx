"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function SessionTimeout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logoutUser = async () => {
    // Clear localStorage to prevent cache leaks of tailored JSON
    localStorage.removeItem("edit_resume_json");
    localStorage.removeItem("edit_cl_json");
    localStorage.removeItem("edit_company");
    localStorage.removeItem("edit_job_title");
    localStorage.removeItem("edit_ats_score");

    await supabase.auth.signOut();
    router.push("/login?error=Session expired due to 15 minutes of inactivity.");
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(logoutUser, TIMEOUT_DURATION);
  };

  useEffect(() => {
    let activeCleanup: (() => void) | null = null;

    const initTracker = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Start the timer immediately
        resetTimer();

        // Listen for activity events
        const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
        const handleActivity = () => resetTimer();

        events.forEach((event) => {
          window.addEventListener(event, handleActivity);
        });

        activeCleanup = () => {
          events.forEach((event) => {
            window.removeEventListener(event, handleActivity);
          });
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      }
    };

    // Subscribe to auth state changes to toggle tracker on login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        initTracker();
      } else {
        if (activeCleanup) {
          activeCleanup();
          activeCleanup = null;
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    });

    initTracker();

    return () => {
      if (subscription) subscription.unsubscribe();
      if (activeCleanup) activeCleanup();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router]);

  return null; // Invisible component
}
