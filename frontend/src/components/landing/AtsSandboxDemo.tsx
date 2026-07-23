"use client";

import { useState } from "react";
import { Plus, Check, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "design", label: "Graphic Art & Design" },
  { id: "finance", label: "Financial Analysis" },
  { id: "management", label: "Project Management" },
];

const PREWRITTEN_BULLETS: Record<string, string[]> = {
  design: [
    "Developed design deliverables that elevated and differentiated the brand across multi-channel campaigns.",
    "Maintained consistent use of graphic imagery in materials and official corporate communications.",
    "Designed new on-brand visual elements to effectively convey complex technical concepts and messaging.",
  ],
  finance: [
    "Formulated financial valuation models for R45M portfolios, ensuring strict compliance with IFRS standards.",
    "Streamlined monthly financial reporting using Excel VBA scripts, reducing processing time by 40%.",
    "Performed variance audits across operational budgets, identifying cost savings of R280,000 annually.",
  ],
  management: [
    "Managed cross-functional teams of 14 personnel to deliver Capex engineering milestones on schedule.",
    "Implemented Agile Scrum methodologies, increasing project delivery velocity by 28%.",
    "Spearheaded vendor procurement negotiations, cutting software licensing expenses by R150,000.",
  ],
};

export default function AtsSandboxDemo() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("design");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({ "design-0": true, "design-2": true });

  const toggleItem = (key: string) => {
    setAddedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (Matching Screenshot 1) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>PRE-WRITTEN CV CONTENT VAULT</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-indigo-950 tracking-tight leading-tight">
              Insert our pre-written CV content
            </h2>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              No writing required – just point and click. Our library provides thousands of recruiter-approved phrases tailored for your target role.
            </p>

            <div className="pt-2">
              <button
                onClick={() => router.push("/register")}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Try Pre-Written Bullets
              </button>
            </div>
          </div>

          {/* Right Column: UI Mockup Card (Matching Screenshot 1 Layout) */}
          <div className="lg:col-span-6">
            <div className="bg-amber-50/60 p-6 md:p-8 rounded-3xl border border-amber-200/80 shadow-lg space-y-5">
              
              {/* Category Search Input */}
              <div className="bg-white rounded-xl border border-slate-300 p-2 flex items-center justify-between shadow-2xs">
                <span className="text-xs font-bold text-indigo-950 px-2">
                  Ex: {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4" />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-indigo-900 text-white border-indigo-900"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {cat.label.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Pre-written Bullet List */}
              <div className="space-y-3">
                {PREWRITTEN_BULLETS[activeCategory].map((bulletText, idx) => {
                  const key = `${activeCategory}-${idx}`;
                  const isAdded = !!addedItems[key];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleItem(key)}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-md text-xs font-bold shrink-0 transition-colors ${
                          isAdded
                            ? "bg-teal-700 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-teal-600 hover:text-white"
                        }`}
                      >
                        {isAdded ? "Added" : "Add"}
                      </button>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {bulletText}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
