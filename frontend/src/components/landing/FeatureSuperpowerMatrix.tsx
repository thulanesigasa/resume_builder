"use client";

import { Link2, ShieldCheck, Target, Layers, CreditCard, Edit3 } from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "1-Click Job Link Auto-Scraper",
    desc: "Paste any LinkedIn, Indeed, or company portal job URL. Our scraper instantly extracts job titles, required skills, and duties automatically.",
    highlight: "Scrapes LinkedIn & Indeed URLs",
  },
  {
    icon: ShieldCheck,
    title: "Verified Credential Vault",
    desc: "Upload accredited diplomas, AWS/Microsoft certifications, or transcripts. Extracted skills are attached and verified directly on your CV.",
    highlight: "Zero false claim flags by recruiters",
  },
  {
    icon: Target,
    title: "Real-Time ATS Keyword Auditor",
    desc: "Scan your CV against the job description to calculate a 0-100 ATS score match before applying. Fix missing keywords on the fly.",
    highlight: "Identifies missing hard & soft skills",
  },
  {
    icon: Layers,
    title: "1-Click Batch Autopilot",
    desc: "Applying to 10 jobs at once? Upload a text file with multiple job URLs. Our engine scrapes, tailors, and compiles all 10 PDFs in one run.",
    highlight: "Massive time saver for job hunters",
  },
  {
    icon: CreditCard,
    title: "Pay-As-You-Go Transparency",
    desc: "No sneaky $29/mo recurring subscriptions that charge your card secretly. Pay R15 per tailored resume or R25 per combo via PayFast.",
    highlight: "Local ZAR pricing with zero traps",
  },
  {
    icon: Edit3,
    title: "Full Line-by-Line Interactive Editor",
    desc: "Fine-tune every section with live drag-and-drop ordering, click-to-edit fields, 1-sentence AI summaries, and real-time print preview.",
    highlight: "100% full creative control",
  },
];

export default function FeatureSuperpowerMatrix() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-md">
            Built For Results
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
            Features designed to get you hired
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal">
            Everything you need to outsmart automated ATS filters and stand out to hiring managers.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    {feat.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs font-bold text-teal-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                  <span>{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
