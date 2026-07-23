"use client";

import { Star } from "lucide-react";

const COMPANY_LOGOS = [
  { name: "TAQA", logoText: "TAQA" },
  { name: "Mashreq", logoText: "MASHREQ" },
  { name: "Al Ghurair", logoText: "AL GHURAIR" },
  { name: "EMAAR", logoText: "EMAAR" },
  { name: "FAB", logoText: "FAB" },
  { name: "Discovery", logoText: "DISCOVERY" },
  { name: "Standard Bank", logoText: "STANDARD BANK" },
];

export default function TrustStatsBar() {
  return (
    <section className="bg-slate-50 py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Customer Hiring Logo Banner */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Our customers have been hired at top employers:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-75">
            {COMPANY_LOGOS.map((company) => (
              <span
                key={company.name}
                className="text-sm md:text-base font-extrabold text-slate-800 tracking-wider font-mono select-none"
              >
                {company.logoText}
              </span>
            ))}
          </div>
        </div>

        {/* Rating Summary Bar (Purple Stars, No Yellow) */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-indigo-700 text-indigo-700" />
            ))}
          </div>
          <div>
            <span className="font-bold text-indigo-950">4.8 / 5.0 Rating</span> based on over <span className="font-bold text-indigo-950">4,138 reviews</span> on Trustpilot & Customer Surveys
          </div>
        </div>

      </div>
    </section>
  );
}
