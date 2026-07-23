"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Eye, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CAROUSEL_TEMPLATES = [
  {
    id: "ui_ux_pro_max_resume.html",
    name: "AHMED GULAL (Professional Summary)",
    style: "Modern Classic",
    color: "bg-slate-700",
    role: "Senior Business Analyst",
    ats: "100%",
    bullets: [
      "Designed analytical solutions for business optimization projects, producing 15% market share increase.",
      "Conducted demand analysis, identifying risk mitigation opportunities that led to R500,000 cost savings.",
      "Liaised with stakeholders to verify business & technology alignment.",
    ],
  },
  {
    id: "ats_resume_template.html",
    name: "AHMED GULAL (Clean ATS Blueprint)",
    style: "Executive Minimalist",
    color: "bg-amber-700",
    role: "Business Analyst / McKinsey & Co",
    ats: "100%",
    bullets: [
      "Analyzed business, user, and technical requirements for proposal system solutions.",
      "Performed data modeling and proposed suggestions for strategic operations.",
      "Developed and delivered user training, earning 95% positive feedback.",
    ],
  },
  {
    id: "david_turner_resume.html",
    name: "AHMED GULAL (Serif Executive)",
    style: "Classic Formal",
    color: "bg-indigo-900",
    role: "Senior Technical Consultant",
    ats: "98%",
    bullets: [
      "Spearheaded enterprise IT transformations across financial services sectors.",
      "Managed Capex budgets exceeding R12M with zero timeline overruns.",
      "Direct oversight of cross-functional team across 4 regional branches.",
    ],
  },
];

export default function TemplateShowcase() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_TEMPLATES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_TEMPLATES.length) % CAROUSEL_TEMPLATES.length);
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Section Header (Matching Screenshot 2) */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
            Top professional templates for a perfect CV
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            30+ expert-designed CV templates to choose from. Optimised to impress recruiters and pass ATS. One-click layouts – no formatting necessary.
          </p>
        </div>

        {/* Interactive Template Carousel (Matching Screenshot 2 Layout) */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Previous Template"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards Slider Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 w-full">
            {CAROUSEL_TEMPLATES.map((tpl, idx) => (
              <div
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className={`bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between ${
                  currentIndex === idx ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200"
                }`}
              >
                {/* CV Mockup Header Color Stripe */}
                <div className={`p-4 ${tpl.color} text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center`}>
                  <span>{tpl.style}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">ATS {tpl.ats}</span>
                </div>

                {/* CV Content Mockup */}
                <div className="p-5 space-y-3 text-left">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{tpl.name}</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{tpl.role}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      WORK HISTORY HIGHLIGHTS
                    </span>
                    {tpl.bullets.map((bullet, i) => (
                      <p key={i} className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        • {bullet}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer preview button */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs font-bold text-indigo-900 group-hover:underline">
                  Click to Preview Layout
                </div>
              </div>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Next Template"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {CAROUSEL_TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? "w-6 bg-indigo-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA Button (Matching Screenshot 2 "Build my CV" Pill Button) */}
        <div className="text-center pt-4">
          <button
            onClick={() => router.push("/register")}
            className="px-10 py-3.5 border-2 border-indigo-900 text-indigo-950 hover:bg-indigo-950 hover:text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-sm"
          >
            Build my CV
          </button>
        </div>

      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white p-6 md:p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-300 space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded-md">
                {previewTemplate.style}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">{previewTemplate.name}</h3>
              <p className="text-xs text-slate-500 font-semibold">{previewTemplate.role}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1 mb-2">
                ATS Compatibility Rating: {previewTemplate.ats}
              </span>
              {previewTemplate.bullets.map((b: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  router.push("/register");
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
