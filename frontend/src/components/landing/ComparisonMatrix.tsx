"use client";

import { Check, X, ShieldAlert, Zap } from "lucide-react";

const COMPARISONS = [
  {
    feature: "Pricing Model",
    rbptech: "Pay-As-You-Go (R15/CV, R25 Combo)",
    competitors: "Hidden $29/mo ($500+ ZAR) Auto-Renewal",
    highlight: true,
  },
  {
    feature: "Job Link Auto-Scraper",
    rbptech: "Paste any LinkedIn/Indeed URL to scrape",
    competitors: "Manual typing or copy-pasting only",
    highlight: true,
  },
  {
    feature: "Certified Credential Vault",
    rbptech: "Upload & sync accredited degrees/certs",
    competitors: "Not supported",
    highlight: true,
  },
  {
    feature: "Real-Time ATS Score Audit",
    rbptech: "Instant 0-100 keyword density match score",
    competitors: "Basic spell check only",
    highlight: false,
  },
  {
    feature: "1-Click Batch Autopilot",
    rbptech: "Process 10+ job URLs in one run",
    competitors: "Must generate each CV one-by-one",
    highlight: true,
  },
  {
    feature: "South African PayFast Support",
    rbptech: "Instant EFT, Cards, Zapper (ZAR)",
    competitors: "US Dollar Credit Cards Only",
    highlight: false,
  },
];

export default function ComparisonMatrix() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Why Job Seekers Switch
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-deep tracking-tight">
            rbptech vs{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              Traditional Resume Builders
            </span>
          </h2>
          <p className="text-sm md:text-base text-brand-navy/70">
            Stop paying monthly subscriptions for tools you only use once. Get better results for a fraction of the cost.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="glass-panel rounded-3xl border border-brand-navy/15 bg-white/95 shadow-xl overflow-hidden max-w-4xl mx-auto">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-slate-900 text-white p-4 md:p-6 text-xs md:text-sm font-bold items-center">
            <div className="col-span-5">Feature & Capabilities</div>
            <div className="col-span-4 text-center text-brand-indigo flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-white font-extrabold">rbptech</span>
            </div>
            <div className="col-span-3 text-center text-slate-400">
              Other Builders ($29/mo)
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-brand-navy/10 text-xs md:text-sm">
            {COMPARISONS.map((row, idx) => (
              <div
                key={row.feature}
                className={`grid grid-cols-12 p-4 md:p-5 items-center transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                }`}
              >
                <div className="col-span-5 font-bold text-brand-deep">
                  {row.feature}
                </div>

                <div className="col-span-4 text-center px-2 font-semibold text-emerald-700 bg-emerald-50/80 py-2 rounded-xl border border-emerald-200/80 flex items-center justify-center gap-1.5 shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] md:text-xs">{row.rbptech}</span>
                </div>

                <div className="col-span-3 text-center px-2 text-red-600/80 font-medium flex items-center justify-center gap-1">
                  <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-[10.5px] md:text-xs">{row.competitors}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
