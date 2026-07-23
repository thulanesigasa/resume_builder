"use client";

import { Link2, ShieldCheck, Target, Layers, CreditCard, Edit3 } from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    badge: "Superpower 01",
    title: "1-Click Job Link Auto-Scraper",
    desc: "Paste any LinkedIn, Indeed, or company portal job URL. Our scraper instantly extracts job titles, required skills, and duties automatically.",
    highlight: "Works with 99% of global job portals",
  },
  {
    icon: ShieldCheck,
    badge: "Superpower 02",
    title: "Verified Credential Vault",
    desc: "Upload accredited diplomas, AWS/Microsoft certifications, or transcripts. Extracted skills are attached and verified directly on your CV.",
    highlight: "Zero false claim flags by recruiters",
  },
  {
    icon: Target,
    badge: "Superpower 03",
    title: "Real-Time ATS Keyword Auditor",
    desc: "Scan your CV against the job description to calculate a 0-100 ATS score match before applying. Fix missing keywords on the fly.",
    highlight: "Identifies missing hard & soft skills",
  },
  {
    icon: Layers,
    badge: "Superpower 04",
    title: "1-Click Batch Autopilot",
    desc: "Applying to 10 jobs at once? Upload a text file with multiple job URLs. Our engine scrapes, tailors, and compiles all 10 PDFs in one run.",
    highlight: "Massive time saver for job hunters",
  },
  {
    icon: CreditCard,
    badge: "Superpower 05",
    title: "Pay-As-You-Go Transparency",
    desc: "No sneaky $29/mo recurring subscriptions that charge your card secretly. Pay R15 per tailored resume or R25 per combo via PayFast.",
    highlight: "Local ZAR pricing with zero traps",
  },
  {
    icon: Edit3,
    badge: "Superpower 06",
    title: "Full Line-by-Line Interactive Editor",
    desc: "Fine-tune every section with live drag-and-drop ordering, click-to-edit fields, 1-sentence AI summaries, and real-time print preview.",
    highlight: "100% full creative control",
  },
];

export default function FeatureSuperpowerMatrix() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Engineered For Impact
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-deep tracking-tight">
            6 Superpowers to Accelerate Your{" "}
            <span className="bg-gradient-to-r from-brand-indigo to-purple-600 bg-clip-text text-transparent">
              Job Search
            </span>
          </h2>
          <p className="text-sm md:text-base text-brand-navy/70">
            Everything you need to outsmart automated ATS filters and stand out to hiring managers.
          </p>
        </div>

        {/* Feature Cards Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="glass-panel p-8 rounded-3xl border border-brand-navy/15 bg-white/90 shadow-sm hover:shadow-xl hover:border-brand-indigo/30 transition-all duration-300 space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center group-hover:bg-brand-indigo group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 bg-slate-100 text-brand-navy/60 rounded-md">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-brand-deep group-hover:text-brand-indigo transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs md:text-sm text-brand-navy/70 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-navy/10 text-[11px] font-bold text-brand-indigo flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
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
