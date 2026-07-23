"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface CtaBannerProps {
  user: any;
}

export default function CtaBanner({ user }: CtaBannerProps) {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Banner Glass Box */}
        <div className="glass-panel p-8 md:p-16 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-slate-700/60 text-center space-y-8">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-indigo/30 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to Land Your Next Interview?</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Build Your ATS-Proof Resume & Cover Letter in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Under 2 Minutes
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of job seekers who use rbptech to tailor job-winning resumes, audit ATS scores, and get hired faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {user ? (
              <button
                onClick={() => router.push("/home")}
                className="w-full sm:w-auto px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-900/40 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Go to Your Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-900/40 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Start Building for R15</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => router.push("/pricing")}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Transparent Pricing</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pay-As-You-Go
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              No Credit Card Needed to Start
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
