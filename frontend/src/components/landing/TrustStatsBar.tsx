"use client";

import { Award, Zap, TrendingUp, Users } from "lucide-react";

const STATS = [
  {
    icon: FileTextIcon,
    value: "10,000+",
    label: "Resumes & Letters Generated",
    subtext: "Across South Africa & Global Roles",
  },
  {
    icon: Award,
    value: "98.4%",
    label: "ATS Parser Compatibility",
    subtext: "Workday, Taleo, Greenhouse Ready",
  },
  {
    icon: Zap,
    value: "< 2 Mins",
    label: "Average Creation Time",
    subtext: "URL Job Scraper to Print PDF",
  },
  {
    icon: TrendingUp,
    value: "3.8x",
    label: "Higher Interview Rate",
    subtext: "Quantified Accomplishment Bullets",
  },
];

function FileTextIcon(props: any) {
  return <Users {...props} />;
}

export default function TrustStatsBar() {
  return (
    <section className="py-12 bg-gradient-to-b from-brand-navy/[0.02] to-brand-navy/[0.05] border-y border-brand-navy/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-brand-navy/10 bg-white/70 backdrop-blur-sm text-center space-y-2 hover:border-brand-indigo/30 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-brand-deep tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[11px] text-brand-navy/60">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Industry Tags */}
        <div className="mt-8 pt-6 border-t border-brand-navy/10 flex flex-wrap items-center justify-center gap-3 text-xs text-brand-navy/70">
          <span className="font-bold text-brand-deep uppercase tracking-wider text-[11px]">
            Tailored For Top Sector CVs:
          </span>
          {["Software & IT", "Financial Services", "Engineering & Mining", "Healthcare", "Legal & Admin", "Marketing & Retail"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white border border-brand-navy/15 rounded-full text-brand-navy font-semibold text-[11px] shadow-2xs"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
