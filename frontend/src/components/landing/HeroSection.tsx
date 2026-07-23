"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, FileText, Check, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  user: any;
}

const PRESET_ROLES = [
  {
    id: "tech",
    title: "Software Engineer",
    company: "Standard Bank Tech",
    score: 96,
    keywords: ["React", "TypeScript", "Microservices", "CI/CD", "AWS Cloud"],
    bulletBefore: "Built web apps and fixed bugs for company projects.",
    bulletAfter: "Architected 12+ scalable React & TypeScript microservices, reducing AWS cloud latency by 38% and automating CI/CD pipelines.",
  },
  {
    id: "finance",
    title: "Financial Analyst",
    company: "FirstRand Capital",
    score: 94,
    keywords: ["Financial Modeling", "Valuation", "Excel VBA", "IFRS", "Risk Analysis"],
    bulletBefore: "Prepared financial reports and handled data analysis.",
    bulletAfter: "Led quarterly financial modeling and IFRS valuation for R45M portfolios, developing Excel VBA scripts that cut reporting time by 50%.",
  },
  {
    id: "mining",
    title: "Project Engineer",
    company: "Anglo American",
    score: 98,
    keywords: ["Safety ISO 45001", "Capex Management", "AutoCAD", "Scrum", "Vendor Procurement"],
    bulletBefore: "Managed engineering tasks and site workers.",
    bulletAfter: "Directed R18M Capex engineering projects under ISO 45001 safety compliance, reducing vendor procurement turnaround by 24 days.",
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
  const router = useRouter();
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const activeRole = PRESET_ROLES[activeRoleIndex];
  const [simulatedScore, setSimulatedScore] = useState(48);

  useEffect(() => {
    setSimulatedScore(48);
    const timer = setTimeout(() => {
      setSimulatedScore(activeRole.score);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeRoleIndex]);

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-indigo/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />
              <span>Next-Gen AI Resume & Cover Letter Compiler</span>
              <span className="bg-brand-indigo text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">v2.4</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-deep tracking-tight leading-[1.1]">
              Build Job-Winning,{" "}
              <span className="bg-gradient-to-r from-brand-indigo via-purple-600 to-indigo-600 bg-clip-text text-transparent glow-text-brand">
                ATS-Proof Resumes
              </span>{" "}
              in Minutes with AI.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-brand-navy/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Scan target job descriptions, auto-match keywords, verify accredited certificates, and audit ATS scores in real time. Pay-as-you-go with zero monthly subscriptions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {user ? (
                <button
                  onClick={() => router.push("/home")}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/95 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-indigo/25 hover:shadow-xl hover:shadow-brand-indigo/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => router.push("/register")}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/95 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-indigo/25 hover:shadow-xl hover:shadow-brand-indigo/35 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>Build Your CV Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              
              <button
                onClick={() => router.push("/pricing")}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-brand-navy/20 text-brand-deep font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View R15 Pay-Per-CV Pricing</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-brand-navy/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs text-brand-navy/70 font-medium">98.4% ATS Compatibility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo shrink-0" />
                <span className="text-xs text-brand-navy/70 font-medium">Zero Subscription Traps</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-brand-navy/70 font-medium">ZAR PayFast Verified</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live ATS Simulator Mockup */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-2xl border border-brand-navy/15 shadow-2xl relative bg-white/90 backdrop-blur-md space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-brand-navy/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-brand-navy/60 ml-2">Live ATS Optimization Engine</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Realtime Scan
                </span>
              </div>

              {/* Preset Selector Buttons */}
              <div>
                <label className="block text-[10px] font-bold text-brand-navy/60 uppercase tracking-wider mb-2">
                  Select Industry Demo Profile:
                </label>
                <div className="flex gap-2">
                  {PRESET_ROLES.map((role, idx) => (
                    <button
                      key={role.id}
                      onClick={() => setActiveRoleIndex(idx)}
                      className={`flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        activeRoleIndex === idx
                          ? "bg-brand-indigo text-white border-brand-indigo shadow-sm"
                          : "bg-slate-50 text-brand-navy/70 border-brand-navy/15 hover:border-brand-indigo/50"
                      }`}
                    >
                      {role.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* ATS Score Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Target Role: {activeRole.title} ({activeRole.company})</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{simulatedScore}% Match</span>
                </div>
                
                {/* Progress bar line */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${simulatedScore}%` }}
                  />
                </div>

                {/* Keyword Match Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeRole.keywords.map((kw) => (
                    <span key={kw} className="text-[10px] bg-slate-800 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Before vs After AI Bullet Showcase */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50/70 border border-red-200/60 text-xs">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                    ❌ Generic Original Bullet Point
                  </span>
                  <p className="text-red-900/80 italic font-mono text-[11px]">"{activeRole.bulletBefore}"</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    ✨ rbptech AI Tailored (Quantified & ATS Aligned)
                  </span>
                  <p className="text-emerald-950 font-medium text-[11.5px] leading-relaxed">
                    "{activeRole.bulletAfter}"
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-brand-navy/60">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-indigo" />
                  Ready to compile as print PDF
                </span>
                <button
                  onClick={() => router.push(user ? "/home" : "/register")}
                  className="text-brand-indigo font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-xs"
                >
                  <span>Try It Free</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
