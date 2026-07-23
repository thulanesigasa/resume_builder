"use client";

import { useState } from "react";
import { Eye, Check, Sparkles, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

const TEMPLATES = [
  {
    id: "ui_ux_pro_max_resume.html",
    title: "UI/UX Pro Max",
    category: "Modern Tech",
    badge: "Most Popular",
    atsScore: "99%",
    description: "Vibrant modern layout with side accents, perfect for tech, product, and design roles.",
    features: ["Dual-column layout", "Skill proficiency bars", "Project spotlight section"],
  },
  {
    id: "ats_resume_template.html",
    title: "ATS Clean Blueprint",
    category: "ATS Clean",
    badge: "100% ATS Safe",
    atsScore: "100%",
    description: "Strict single-column text formatting designed specifically for high-volume enterprise ATS systems.",
    features: ["Zero columns or graphics", "Maximum keyword density", "Taleo & Workday verified"],
  },
  {
    id: "david_turner_resume.html",
    title: "David Turner Classic",
    category: "Executive Classic",
    badge: "Executive",
    atsScore: "97%",
    description: "Authoritative serif typography and structured headers for senior leadership and finance executives.",
    features: ["Classic serif headings", "Executive summary box", "Publication & award highlights"],
  },
  {
    id: "amy_stein_resume.html",
    title: "Amy Stein Elegant",
    category: "Creative & UI",
    badge: "Elegant",
    atsScore: "96%",
    description: "Clean aesthetic with subtle indigo borders, ideal for consulting, marketing, and strategy professionals.",
    features: ["Subtle indigo top border", "Compact work history grid", "Clean contact header"],
  },
  {
    id: "noma_resume_template_black.html",
    title: "Noma Clean Modern",
    category: "Modern Tech",
    badge: "Minimalist",
    atsScore: "98%",
    description: "Sleek, high-density modern layout designed for software engineers and data scientists.",
    features: ["High text density", "Compact tech stack list", "Clean bullet alignment"],
  },
  {
    id: "caleb_foster_cover_letter.html",
    title: "Caleb Foster Cover Letter",
    category: "Cover Letters",
    badge: "Matching CL",
    atsScore: "98%",
    description: "Matching bold cover letter template aligned perfectly with all resume styles.",
    features: ["Official recipient header", "Personalized opening & sign-off", "Matching accent color"],
  },
];

const CATEGORIES = ["All Templates", "Modern Tech", "ATS Clean", "Executive Classic", "Creative & UI", "Cover Letters"];

export default function TemplateShowcase() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (activeCategory === "All Templates") return true;
    return tpl.category === activeCategory;
  });

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Battle-Tested Templates
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-deep tracking-tight">
            Designed to Pass Every{" "}
            <span className="bg-gradient-to-r from-brand-indigo via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Recruiter & ATS Check
            </span>
          </h2>
          <p className="text-sm md:text-base text-brand-navy/70">
            Choose from high-converting, professionally formatted templates. Switch templates anytime with a single click.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-brand-indigo text-white border-brand-indigo shadow-md"
                  : "bg-white text-brand-navy/70 border-brand-navy/15 hover:border-brand-indigo/50 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="glass-panel p-6 rounded-2xl border border-brand-navy/15 bg-white/90 shadow-sm hover:shadow-xl hover:border-brand-indigo/30 transition-all duration-300 flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full">
                    {tpl.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> ATS {tpl.atsScore}
                  </span>
                </div>

                {/* Title & description */}
                <div>
                  <h3 className="text-lg font-bold text-brand-deep group-hover:text-brand-indigo transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-brand-navy/70 mt-1 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                {/* Features bullet list */}
                <div className="space-y-1.5 pt-2 border-t border-brand-navy/10">
                  {tpl.features.map((ft) => (
                    <div key={ft} className="text-[11px] text-brand-navy/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full" />
                      <span>{ft}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-navy/10 flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-deep text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="flex-1 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl border border-brand-navy/15 space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 text-brand-navy/40 hover:text-brand-deep rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full">
                {previewTemplate.category}
              </span>
              <h3 className="text-2xl font-black text-brand-deep">
                {previewTemplate.title}
              </h3>
              <p className="text-xs text-brand-navy/70">
                {previewTemplate.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-brand-navy/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[11px] text-brand-navy/60 border-b border-brand-navy/10 pb-2">
                <span>SPECIFICATIONS</span>
                <span className="text-emerald-600 font-bold">ATS MATCH: {previewTemplate.atsScore}</span>
              </div>
              {previewTemplate.features.map((f: string) => (
                <div key={f} className="flex items-center gap-2 text-brand-deep">
                  <Check className="w-3.5 h-3.5 text-brand-indigo" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 py-3 bg-slate-100 text-brand-navy font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  router.push("/register");
                }}
                className="flex-1 py-3 bg-brand-indigo text-white font-bold text-xs rounded-xl hover:bg-brand-indigo/90 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Select & Start Building</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
