"use client";

import Image from "next/image";

const FEATURES = [
  {
    iconSrc: "/click-svgrepo-com.svg",
    title: "1-Click Job Link Auto-Scraper",
    desc: "Paste any LinkedIn, Indeed, or company portal job URL. Our scraper instantly extracts job titles, required skills, and duties automatically.",
    highlight: "Scrapes LinkedIn & Indeed URLs",
  },
  {
    iconSrc: "/verified-user-svgrepo-com.svg",
    title: "Verified Credential Vault",
    desc: "Upload accredited diplomas, AWS/Microsoft certifications, or transcripts. Extracted skills are attached and verified directly on your CV.",
    highlight: "Zero false claim flags by recruiters",
  },
  {
    iconSrc: "/time-success-svgrepo-com.svg",
    title: "Real-Time ATS Keyword Auditor",
    desc: "Scan your CV against the job description to calculate a 0-100 ATS score match before applying. Fix missing keywords on the fly.",
    highlight: "Identifies missing hard & soft skills",
  },
  {
    iconSrc: "/batch-svgrepo-com.svg",
    title: "1-Click Batch Autopilot",
    desc: "Applying to 10 jobs at once? Upload a text file with multiple job URLs. Our engine scrapes, tailors, and compiles all 10 PDFs in one run.",
    highlight: "Massive time saver for job hunters",
  },
  {
    iconSrc: "/pay-svgrepo-com.svg",
    title: "Pay-As-You-Go Transparency",
    desc: "No sneaky $29/mo recurring subscriptions that charge your card secretly. Pay R15 per tailored resume or R25 per combo via PayFast.",
    highlight: "Local ZAR pricing with zero traps",
  },
  {
    iconSrc: "/line-columns-svgrepo-com.svg",
    title: "Full Line-by-Line Interactive Editor",
    desc: "Fine-tune every section with live drag-and-drop ordering, click-to-edit fields, 1-sentence AI summaries, and real-time print preview.",
    highlight: "100% full creative control",
  },
];

export default function FeatureSuperpowerMatrix() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-950 bg-slate-100 px-3 py-1 rounded">
            Built For Results
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
            Features designed to get you hired
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal">
            Everything you need to outsmart automated ATS filters and stand out to hiring managers.
          </p>
        </header>

        {/* Feature Cards Grid (No icon background boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <article
              key={feat.title}
              className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 hover:border-indigo-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* SVG Icon rendered cleanly WITHOUT background box */}
                <Image
                  src={feat.iconSrc}
                  alt={feat.title}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />

                <h3 className="text-lg font-extrabold text-indigo-950">
                  {feat.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-700 rounded-full" />
                <span>{feat.highlight}</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
