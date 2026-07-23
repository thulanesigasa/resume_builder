"use client";

import { useState } from "react";
import { Link2, Cpu, FileCheck2, ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Link2,
    title: "Paste Job URL or Text Listing",
    shortDesc: "Automatic scraping from LinkedIn, Indeed, or company portals.",
    details: "Enter a target job listing URL or paste the job description text directly. Our scraper automatically extracts key skills, required experience levels, and essential job duties.",
    highlights: ["Automatic URL Scraping", "Scrapes LinkedIn & Indeed", "Extracts Hard & Soft Skills"],
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Auto-Tailoring & Credential Sync",
    shortDesc: "GPT-4o-mini aligns experience bullets and syncs verified certs.",
    details: "Our semantic engine rewrites your work history bullet points to match the target keywords, while attaching your authenticated qualifications & certificates from your secure vault.",
    highlights: ["Action-Verbs & Quantified Metrics", "Attach Verified Diplomas/Certs", "Zero Hallucinations Guarantee"],
  },
  {
    num: "03",
    icon: FileCheck2,
    title: "Instant ATS Audit & PDF Export",
    shortDesc: "Real-time 0-100 ATS score check & print-ready PDF download.",
    details: "Get an immediate score audit detailing keyword match density, readability, and structural formatting before downloading your high-resolution print PDF.",
    highlights: ["Real-Time ATS Score (0-100)", "Print-Ready Vector PDF", "1-Click Saved Archive Access"],
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20">
            3 Simple Steps
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            How <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">rbptech</span> Works
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            From job posting to an ATS-optimized, tailored PDF resume in under two minutes.
          </p>
        </div>

        {/* Step Selector & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Step Navigation List */}
          <div className="lg:col-span-5 space-y-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-950/80 border-indigo-500/50 shadow-xl shadow-indigo-900/20 ring-1 ring-indigo-500/30"
                      : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
                        isActive ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-base font-bold transition-colors ${isActive ? "text-white" : "text-slate-300"}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Step Details Preview Card */}
          <div className="lg:col-span-7">
            <div className="h-full p-8 rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/60 shadow-2xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                {/* Active Step Badge */}
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-indigo-400 font-mono">
                      Step {STEPS[activeStep].num}
                    </span>
                    <span className="text-sm font-bold text-slate-200">
                      {STEPS[activeStep].title}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {(() => {
                      const Icon = STEPS[activeStep].icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                </div>

                {/* Detailed Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {STEPS[activeStep].details}
                </p>

                {/* Highlights List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Features Included:
                  </span>
                  {STEPS[activeStep].highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator Dots */}
              <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between">
                <div className="flex gap-2">
                  {STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeStep === idx ? "w-8 bg-indigo-500" : "w-2 bg-slate-700 hover:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % STEPS.length)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
