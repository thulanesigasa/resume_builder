"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, ArrowRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const CAROUSEL_TEMPLATES = [
  {
    id: "ui_ux_pro_max_resume.html",
    name: "THABO NKOSI",
    style: "Modern Classic",
    color: "bg-indigo-950",
    role: "Senior Software Engineer",
    ats: "100%",
    bullets: [
      "Architected scalable React & TypeScript microservices, reducing cloud latency by 38%.",
      "Conducted demand analysis, identifying performance bottlenecks that saved R500,000 annually.",
      "Liaised with stakeholders to verify business & technology alignment.",
    ],
  },
  {
    id: "ats_resume_template.html",
    name: "NOMALANGA DLAMINI",
    style: "Executive Minimalist",
    color: "bg-indigo-900",
    role: "Business Analyst / Financial Lead",
    ats: "100%",
    bullets: [
      "Analyzed business, user, and technical requirements for proposal system solutions.",
      "Performed data modeling and proposed suggestions for strategic operations.",
      "Developed and delivered user training, earning 95% positive feedback.",
    ],
  },
  {
    id: "david_turner_resume.html",
    name: "SIPHO MTHEMBU",
    style: "Classic Formal",
    color: "bg-slate-800",
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
    <section className="bg-white py-16 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
        
        {/* Header */}
        <header className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight">
            Top professional templates for a perfect CV
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            30+ expert-designed CV templates to choose from. Optimised to impress recruiters and pass ATS. One-click layouts – no formatting necessary.
          </p>
        </header>

        {/* Interactive Template Carousel */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center shadow-sm transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Previous Template"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Slider Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 w-full">
            {CAROUSEL_TEMPLATES.map((tpl, idx) => (
              <article
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group ${
                  currentIndex === idx ? "border-indigo-700 ring-2 ring-indigo-700/20" : "border-slate-200"
                }`}
              >
                {/* Header Stripe */}
                <header className={`p-3.5 ${tpl.color} text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center`}>
                  <span>{tpl.style}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">ATS {tpl.ats}</span>
                </header>

                {/* Blurry Visual Resume Document Layout Mockup (Matching user request) */}
                <div className="p-5 relative min-h-[260px] bg-slate-50 flex flex-col justify-between overflow-hidden">
                  
                  {/* Blurry Document Canvas Wrapper */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-3 blur-[1.5px] group-hover:blur-none transition-all duration-300 select-none">
                    
                    {/* CV Header Silhouette */}
                    <div className="border-b border-slate-200 pb-2 space-y-1">
                      <div className="h-3 bg-indigo-950 rounded w-2/3" />
                      <div className="h-2 bg-slate-400 rounded w-1/3" />
                    </div>

                    {/* Summary paragraph lines */}
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 bg-slate-300 rounded w-full" />
                      <div className="h-1.5 bg-slate-300 rounded w-5/6" />
                      <div className="h-1.5 bg-slate-300 rounded w-4/5" />
                    </div>

                    {/* Section 1: Work History */}
                    <div className="pt-2 space-y-1.5">
                      <div className="h-2 bg-indigo-800 rounded w-2/5" />
                      <div className="h-1.5 bg-slate-400 rounded w-1/2" />
                      <div className="space-y-1 pt-0.5">
                        <div className="h-1.5 bg-slate-300 rounded w-full" />
                        <div className="h-1.5 bg-slate-300 rounded w-11/12" />
                      </div>
                    </div>

                    {/* Section 2: Education & Skills */}
                    <div className="pt-2 space-y-1.5">
                      <div className="h-2 bg-indigo-800 rounded w-1/3" />
                      <div className="flex gap-1">
                        <div className="h-3 bg-slate-200 rounded-xs w-12" />
                        <div className="h-3 bg-slate-200 rounded-xs w-10" />
                        <div className="h-3 bg-slate-200 rounded-xs w-14" />
                      </div>
                    </div>

                  </div>

                  {/* Overlay Name Badge */}
                  <div className="absolute inset-x-0 bottom-3 px-4 flex items-center justify-between pointer-events-none">
                    <span className="text-xs font-black text-indigo-950 bg-white/95 px-2.5 py-1 rounded shadow-xs border border-slate-200">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white/95 px-2 py-1 rounded shadow-xs border border-slate-200">
                      {tpl.role}
                    </span>
                  </div>

                </div>

                {/* Footer Action Bar */}
                <footer className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs font-bold text-indigo-950 flex items-center justify-center gap-1.5 group-hover:bg-indigo-950 group-hover:text-white transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to Preview Layout</span>
                </footer>
              </article>
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center shadow-sm transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Next Template"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2">
          {CAROUSEL_TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? "w-6 bg-indigo-700" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA Pill Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => router.push("/register")}
            className="px-10 py-3.5 border-2 border-indigo-950 text-indigo-950 hover:bg-indigo-950 hover:text-white font-bold text-sm rounded-full transition-all cursor-pointer"
          >
            Build my CV
          </button>
        </div>

      </div>

      {/* Unblurred Full Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white p-6 md:p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-300 space-y-6 relative">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <header className="space-y-2">
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-slate-100 text-indigo-950 rounded">
                {previewTemplate.style}
              </span>
              <h3 className="text-xl font-extrabold text-indigo-950">{previewTemplate.name}</h3>
              <p className="text-xs text-slate-500 font-semibold">{previewTemplate.role}</p>
            </header>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-indigo-950 block border-b border-slate-200 pb-1 mb-2">
                ATS Compatibility Rating: {previewTemplate.ats}
              </span>
              {previewTemplate.bullets.map((b: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <footer className="flex gap-3">
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
                className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </footer>
          </div>
        </div>
      )}

    </section>
  );
}
