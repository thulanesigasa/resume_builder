"use client";

import { Check, X, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const FREE_FEATURES = [
  { text: "Create unlimited CVs and cover letter drafts.", enabled: true },
  { text: "CV and cover letter generator with step-by-step guidance.", enabled: true },
  { text: "Expert-written content for your CV tailored to your job and industry.", enabled: true },
  { text: "Unlimited downloads in TXT format.", enabled: true },
  { text: "High-resolution print PDF download.", enabled: false },
  { text: "ATS Check™ score audit to scan your CV for issues & suggestions.", enabled: false },
  { text: "Certified Credential Vault sync.", enabled: false },
];

const PREMIUM_FEATURES = [
  { text: "Create unlimited CVs and cover letters.", enabled: true },
  { text: "CV and cover letter generator with step-by-step guidance.", enabled: true },
  { text: "Expert-written content for your CV tailored to your job and industry.", enabled: true },
  { text: "Unlimited downloads in TXT format.", enabled: true },
  { text: "High-resolution print PDF download.", enabled: true },
  { text: "ATS Check™ score audit to scan your CV for issues & suggestions.", enabled: true },
  { text: "Certified Credential Vault sync.", enabled: true },
];

export default function ComparisonMatrix() {
  const router = useRouter();

  return (
    <section className="bg-indigo-950 text-white py-16 md:py-24 border-b border-indigo-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Header (Matching Screenshot 4) */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Create your perfect CV for free or take advantage of the full{" "}
            <span className="text-coral-400 text-amber-400">premium feature set</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-indigo-200 pt-2">
            <span className="flex items-center gap-1 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              30% more likely to land a job*
            </span>
            <span className="flex items-center gap-1 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              42% boost in recruiter response rate*
            </span>
          </div>
        </div>

        {/* Plan Cards Grid (Matching Screenshot 4 Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: Basic Access (Free) */}
          <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between border border-slate-200">
            <div>
              {/* Header stripe */}
              <div className="bg-rose-400 text-white text-center py-2.5 text-xs font-extrabold uppercase tracking-widest">
                BASIC ACCESS
              </div>

              {/* Price block */}
              <div className="p-6 md:p-8 text-center space-y-2 border-b border-slate-100">
                <h3 className="text-4xl font-black text-slate-900">Free</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Create your CV and cover letter for free. Access free tools to start building today.
                </p>
              </div>

              {/* Checklist */}
              <div className="p-6 md:p-8 space-y-3.5 text-xs text-slate-700">
                {FREE_FEATURES.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {item.enabled ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3" />
                      </div>
                    )}
                    <span className={item.enabled ? "font-semibold text-slate-900" : "text-slate-400"}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button
                onClick={() => router.push("/register")}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Start Free Draft
              </button>
            </div>
          </div>

          {/* Card 2: Premium Plan (R15 per CV / R25 Combo) */}
          <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-2 border-amber-400 relative">
            
            <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Best Value
            </div>

            <div>
              {/* Header stripe */}
              <div className="bg-amber-400 text-amber-950 text-center py-2.5 text-xs font-black uppercase tracking-widest">
                PREMIUM PLAN
              </div>

              {/* Price block */}
              <div className="p-6 md:p-8 text-center space-y-2 border-b border-slate-100">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-slate-900">R15</span>
                  <span className="text-xs text-slate-500 font-bold">/ per CV</span>
                </div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  R25 for Resume + Cover Letter combo. Pay via PayFast (EFT/Cards). Zero monthly subscription fees.
                </p>
              </div>

              {/* Checklist */}
              <div className="p-6 md:p-8 space-y-3.5 text-xs text-slate-700">
                {PREMIUM_FEATURES.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-900">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button
                onClick={() => router.push("/register")}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Get Premium CV
              </button>
            </div>
          </div>

        </div>

        <div className="text-center text-[11px] text-indigo-300 italic pt-4">
          *Based on survey responses shared by 1,133 job seekers using ATS-optimized resumes.
        </div>

      </div>
    </section>
  );
}
