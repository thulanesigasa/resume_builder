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
    details: "Our semantic engine rewrites your work history bullet points to match target keywords, while attaching your authenticated qualifications & certificates from your secure vault.",
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
    <section className="bg-white py-16 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            How rbptech Works
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal">
            From job posting to an ATS-optimized, tailored PDF resume in under two minutes.
          </p>
        </header>

        {/* Step Selector & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Step Navigation List */}
          <div className="lg:col-span-5 space-y-3">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <article
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {step.num}
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-900"}`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${isActive ? "text-purple-100" : "text-slate-600"}`}>
                        {step.shortDesc}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Column: Active Step Details Card */}
          <div className="lg:col-span-7">
            <article className="h-full p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              
              <div key={activeStep} className="space-y-6 transition-opacity duration-300 ease-in-out animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-purple-600 font-mono">
                      Step {STEPS[activeStep].num}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {STEPS[activeStep].title}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {STEPS[activeStep].details}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Included Features:
                  </span>
                  {STEPS[activeStep].highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  {STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeStep === idx ? "w-6 bg-purple-600" : "w-2 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % STEPS.length)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </footer>

            </article>
          </div>

        </div>

      </div>
    </section>
  );
}
