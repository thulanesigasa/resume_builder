"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, ArrowRight, Eye, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const THREE_CANDIDATE_TEMPLATES = [
  {
    id: "ui_ux_pro_max_resume.html",
    name: "THABO NKOSI",
    title: "UI/UX Pro Max",
    style: "Modern Tech & Design",
    color: "bg-indigo-950",
    role: "Senior Software Engineer",
    ats: "100%",
    email: "thabo.nkosi@gmail.com",
    phone: "+27 82 456 7890",
    location: "Johannesburg, SA",
    summary: "Results-driven Senior Software Engineer with 6+ years of experience architecting high-throughput microservices, React frontends, and automated CI/CD pipelines across South African fintech systems.",
    bullets: [
      "Architected scalable React & TypeScript microservices, reducing cloud infrastructure latency by 38%.",
      "Conducted demand analysis & database indexing, identifying performance bottlenecks that saved R500,000 annually.",
      "Liaised with cross-functional stakeholders to align technology roadmaps with corporate objectives.",
      "Automated CI/CD deployment pipelines, cutting release turnaround times from 3 days to under 45 minutes.",
    ],
    skills: ["React", "TypeScript", "Node.js", "AWS Cloud", "PostgreSQL", "Microservices", "Docker", "CI/CD"],
    education: "BSc Computer Science & Info Systems — Wits University",
    layoutType: "modern-cyan",
    ctaText: "Build Resume Now",
  },
  {
    id: "ats_resume_template.html",
    name: "NOMALANGA DLAMINI",
    title: "ATS Blueprint Standard",
    style: "Clean Single-Column ATS",
    color: "bg-indigo-900",
    role: "Business Analyst & Financial Lead",
    ats: "100%",
    email: "nomalanga.dlamini@gmail.com",
    phone: "+27 71 234 5678",
    location: "Sandton, Gauteng",
    summary: "Detail-oriented Business Analyst and Financial Lead specializing in enterprise process optimization, financial modeling, and IFRS compliance across banking and advisory sectors.",
    bullets: [
      "Analyzed business, user, and technical requirements for proposal system solutions for R45M portfolios.",
      "Performed financial data modeling and proposed suggestions for strategic operations and risk management.",
      "Developed and delivered user training across 6 regional branches, earning 95% positive feedback.",
      "Spearheaded quarterly financial audits, identifying cost optimization opportunities of R320,000.",
    ],
    skills: ["Business Analysis", "Financial Modeling", "IFRS Compliance", "Process Optimization", "Excel VBA", "SQL"],
    education: "BCom Financial Management — University of Cape Town (UCT)",
    layoutType: "ats-clean",
    ctaText: "Build Resume Now",
  },
  {
    id: "david_turner_resume.html",
    name: "SIPHO MTHEMBU",
    title: "David Turner Executive",
    style: "Classic Serif Executive",
    color: "bg-slate-800",
    role: "Senior Technical Consultant",
    ats: "98%",
    email: "sipho.mthembu@gmail.com",
    phone: "+27 83 987 6543",
    location: "Durban, KZN",
    summary: "Senior Technical Consultant with extensive experience directing large-scale Capex engineering projects, vendor procurement, and ISO compliance standards.",
    bullets: [
      "Spearheaded enterprise IT and engineering transformations across financial and industrial sectors.",
      "Managed Capex project budgets exceeding R12M with zero timeline or compliance overruns.",
      "Direct oversight of cross-functional teams comprising 18 engineers and external vendors.",
      "Implemented ISO 45001 safety & quality frameworks across 4 regional project sites.",
    ],
    skills: ["Capex Management", "ISO Compliance", "Vendor Procurement", "Project Engineering", "Scrum", "Risk Assessment"],
    education: "BSc Electrical Engineering — University of KwaZulu-Natal (UKZN)",
    layoutType: "executive-serif",
    ctaText: "Build Resume Now",
  },
];

export default function TemplateShowcase() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % THREE_CANDIDATE_TEMPLATES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + THREE_CANDIDATE_TEMPLATES.length) % THREE_CANDIDATE_TEMPLATES.length);
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

        {/* Carousel Container for 3 Candidates */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center">
          
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white flex items-center justify-center shadow-sm transition-all shrink-0 z-10 cursor-pointer"
            aria-label="Previous Template"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Slider Grid: 3 Candidates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6 w-full">
            {THREE_CANDIDATE_TEMPLATES.map((tpl, idx) => (
              <article
                key={tpl.id}
                className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group ${
                  currentIndex === idx ? "border-indigo-700 ring-2 ring-indigo-700/20" : "border-slate-200"
                }`}
              >
                {/* Card Header Stripe */}
                <header className={`p-3.5 ${tpl.color} text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center`}>
                  <span>{tpl.style}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">ATS {tpl.ats}</span>
                </header>

                {/* Blurry Visual Resume Document Layout Mockup */}
                <div
                  onClick={() => setPreviewTemplate(tpl)}
                  className="p-4 relative min-h-[260px] bg-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  
                  {/* Blurry Real Template Layout Silhouette */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-3 blur-[2px] group-hover:blur-[1px] transition-all duration-300 select-none pointer-events-none">
                    
                    {/* Header */}
                    <div className="text-center border-b border-indigo-900/20 pb-2 space-y-1">
                      <div className="h-3.5 bg-indigo-950 rounded w-2/3 mx-auto" />
                      <div className="h-2 bg-indigo-700 rounded w-1/3 mx-auto" />
                      <div className="flex justify-center gap-1 pt-1">
                        <div className="h-1.5 bg-slate-300 rounded w-10" />
                        <div className="h-1.5 bg-slate-300 rounded w-12" />
                        <div className="h-1.5 bg-slate-300 rounded w-14" />
                      </div>
                    </div>

                    {/* Section: Summary */}
                    <div className="space-y-1">
                      <div className="h-2 bg-indigo-900 rounded w-1/3" />
                      <div className="h-1.5 bg-slate-300 rounded w-full" />
                      <div className="h-1.5 bg-slate-300 rounded w-11/12" />
                    </div>

                    {/* Section: Work Experience */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 bg-indigo-900 rounded w-2/5" />
                      <div className="flex justify-between">
                        <div className="h-2 bg-slate-800 rounded w-1/2" />
                        <div className="h-2 bg-slate-300 rounded w-12" />
                      </div>
                      <div className="space-y-1 pl-2">
                        <div className="h-1.5 bg-slate-300 rounded w-full" />
                        <div className="h-1.5 bg-slate-300 rounded w-4/5" />
                      </div>
                    </div>

                    {/* Section: Skills */}
                    <div className="space-y-1 pt-1">
                      <div className="h-2 bg-indigo-900 rounded w-1/4" />
                      <div className="flex flex-wrap gap-1">
                        <div className="h-2.5 bg-indigo-100 rounded w-8" />
                        <div className="h-2.5 bg-indigo-100 rounded w-10" />
                        <div className="h-2.5 bg-indigo-100 rounded w-7" />
                        <div className="h-2.5 bg-indigo-100 rounded w-12" />
                      </div>
                    </div>

                  </div>

                  {/* Template Title & Candidate Name Overlay */}
                  <div className="absolute inset-x-0 bottom-3 px-3 flex items-center justify-between pointer-events-none">
                    <span className="text-xs font-black text-indigo-950 bg-white/95 px-2.5 py-1 rounded shadow-xs border border-slate-200">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-white/95 px-2 py-1 rounded shadow-xs border border-slate-200">
                      {tpl.title}
                    </span>
                  </div>

                </div>

                {/* Footer Action Bar Prompting Direct Sign Up */}
                <footer className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    onClick={() => router.push("/register")}
                    className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{tpl.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>Preview Layout</span>
                  </button>
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

        {/* Carousel Pagination Dots for 3 Candidates */}
        <div className="flex items-center justify-center gap-2">
          {THREE_CANDIDATE_TEMPLATES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? "w-6 bg-indigo-700" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA Pill Button Prompting Sign Up */}
        <div className="text-center pt-2">
          <button
            onClick={() => router.push("/register")}
            className="px-10 py-3.5 border-2 border-indigo-950 text-indigo-950 hover:bg-indigo-950 hover:text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-xs"
          >
            Build Resume Now
          </button>
        </div>

      </div>

      {/* Unblurred Full Resume Template Document Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white p-6 md:p-8 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 space-y-6 relative max-h-[90vh] flex flex-col justify-between animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-100 text-indigo-950 rounded">
                  {previewTemplate.title} ({previewTemplate.id})
                </span>
                <h3 className="text-lg font-black text-indigo-950 mt-1">
                  {previewTemplate.style} Template Preview
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                ATS Score: {previewTemplate.ats}
              </span>
            </div>

            {/* Un-blurred Crisp A4 Resume Paper Sheet Container */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-inner space-y-5 overflow-y-auto max-h-[55vh] text-left font-sans text-xs text-slate-800">
              
              {/* Document Title Header */}
              <div className="border-b-2 border-indigo-950 pb-3 space-y-1 text-center">
                <h2 className="text-2xl font-black text-indigo-950 tracking-tight">{previewTemplate.name}</h2>
                <p className="text-xs font-bold text-indigo-700">{previewTemplate.role}</p>
                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  {previewTemplate.email} • {previewTemplate.phone} • {previewTemplate.location}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  PROFESSIONAL SUMMARY
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {previewTemplate.summary}
                </p>
              </div>

              {/* Work Experience */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  WORK EXPERIENCE
                </h4>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{previewTemplate.role}</span>
                    <span className="text-[11px] text-slate-500 font-mono">2021 – Present</span>
                  </div>
                  
                  <div className="space-y-1 pl-2">
                    {previewTemplate.bullets.map((bullet: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-relaxed font-normal">
                        <span className="text-indigo-700 font-bold">•</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Skills */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  CORE COMPETENCIES & TECHNICAL SKILLS
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {previewTemplate.skills.map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-white border border-slate-300 rounded font-semibold text-[11px] text-indigo-950 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  EDUCATION & ACCREDITATIONS
                </h4>
                <p className="text-xs text-slate-700 font-semibold pt-0.5">
                  {previewTemplate.education}
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <footer className="flex gap-3 pt-2">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  router.push("/register");
                }}
                className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Build Resume Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </footer>

          </div>
        </div>
      )}

    </section>
  );
}
