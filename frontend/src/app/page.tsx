"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sparkles, FileText, ArrowRight, Layers, Cpu } from "lucide-react";

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
    <div className="flex-1 flex flex-col justify-between min-h-screen px-6 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-12 md:space-y-16 relative z-10">
        {/* Header navigation bar */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5.5 h-5.5 text-brand-indigo animate-pulse" />
            <span className="font-extrabold text-lg tracking-tight text-brand-deep">
              ATS SaaS Suite
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/pricing")}
              className="text-xs font-semibold text-brand-navy/70 hover:text-brand-deep transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => router.push(user ? "/dashboard" : "/login")}
              className="px-4 py-2 btn-secondary text-xs"
            >
              {user ? "Go to Dashboard" : "Sign In"}
            </button>
          </div>
        </header>

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
            <button
              onClick={() => router.push(user ? "/dashboard" : "/login")}
              className="px-8 py-3.5 btn-primary text-sm flex items-center justify-center gap-2"
            >
              Configure Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="px-8 py-3.5 btn-secondary text-sm"
            >
              Explore Plans
            </button>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="glass-panel p-6 rounded-xl space-y-3">
            <Cpu className="w-6 h-6 text-brand-indigo" />
            <h3 className="text-sm font-bold text-brand-deep">AI Tailoring Pipeline</h3>
            <p className="text-xs text-brand-navy/70 leading-normal">
              Structured JSON generations using GPT-4o-mini aligned to scraped job description criteria.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-3">
            <Layers className="w-6 h-6 text-brand-indigo" />
            <h3 className="text-sm font-bold text-brand-deep">Interactive Editor</h3>
            <p className="text-xs text-brand-navy/70 leading-normal">
              Drag-and-drop to reorder achievements, click-to-edit elements, and review ATS keyword scores.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-3">
            <FileText className="w-6 h-6 text-brand-indigo" />
            <h3 className="text-sm font-bold text-brand-deep">Instant Compilers</h3>
            <p className="text-xs text-brand-navy/70 leading-normal">
              High fidelity PDF conversion using Jinja2 templates and wkhtmltopdf pipelines.
            </p>
          </div>
        </section>
      </div>

      <footer className="text-center text-[10px] text-brand-navy/55 tracking-wider uppercase pt-16">
        © 2026 T.S Industries. All rights reserved.
      </footer>
    </div>
  );
}
