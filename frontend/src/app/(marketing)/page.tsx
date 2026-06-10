"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Briefcase, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen px-4 md:px-6 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 text-xs tracking-wider text-brand-navy/70 bg-brand-navy/5 border border-brand-navy/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full glow-border-brand"></span>
            NEXT-GEN AI RESUME COMPILER
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto text-brand-deep">
            Design Resumes that Pass the{" "}
            <span className="text-brand-indigo glow-text-brand">
              ATS Guardrails
            </span>
          </h1>

          <p className="text-sm md:text-base text-brand-navy/70 max-w-xl mx-auto leading-relaxed">
            Scan target job requirements, tailor CV experience bullet points on the fly, edit details inline, and compiles print-ready PDFs instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3.5 btn-primary text-sm flex items-center justify-center gap-2"
              >
                Configure Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-3.5 btn-primary text-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                Configure Your Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <button
              onClick={() => router.push("/pricing")}
              className="px-8 py-3.5 btn-secondary text-sm"
            >
              Explore Plans
            </button>
          </div>
        </section>

        {/* Editorial Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pt-12">
          {/* Feature 01: Full Width */}
          <div className="md:col-span-12 glass-panel p-10 rounded-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100 fill-mode-both cursor-default">
            <div className="absolute -top-12 -right-6 text-[150px] font-black text-brand-navy/5 select-none leading-none pointer-events-none group-hover:text-brand-indigo/5 transition-colors duration-500">
              01
            </div>
            <div className="relative z-10 max-w-xl">
              <div className="text-brand-indigo font-bold tracking-widest text-[10px] uppercase mb-3">01 / AI Tailoring</div>
              <h3 className="text-2xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Semantic Alignment Pipeline</h3>
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                <div className="overflow-hidden">
                  <p className="text-sm text-brand-navy/70 leading-relaxed pt-3">
                    Optimized CV customization aligned directly with targeted job specifications. Our engine rewrites your history to maximize keyword density without hallucinations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 02: Half */}
          <div className="md:col-span-6 glass-panel p-10 rounded-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both cursor-default">
            <div className="relative z-10">
              <div className="text-brand-navy/40 font-bold tracking-widest text-[10px] uppercase mb-3">02 / UX</div>
              <h3 className="text-xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Interactive Layout Editor</h3>
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                <div className="overflow-hidden">
                  <p className="text-sm text-brand-navy/70 leading-relaxed pt-3">
                    Fine-tune layouts instantly with drag-and-drop sections, click-to-edit fields, and live previews. Complete control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 03: Half */}
          <div className="md:col-span-6 glass-panel p-10 rounded-2xl relative overflow-hidden group border-t-4 border-t-brand-indigo/20 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both cursor-default">
            <div className="relative z-10">
              <div className="text-brand-navy/40 font-bold tracking-widest text-[10px] uppercase mb-3">03 / Parsing</div>
              <h3 className="text-xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Server-Side PDF Compilers</h3>
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                <div className="overflow-hidden">
                  <p className="text-sm text-brand-navy/70 leading-relaxed pt-3">
                    Generate clean, strictly-formatted PDFs compiled natively to ensure 100% readability by enterprise ATS systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
