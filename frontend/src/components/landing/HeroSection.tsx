"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Plus, Search, Sparkles } from "lucide-react";

interface HeroSectionProps {
  user: any;
}

const SAMPLE_PHRASES = [
  {
    id: 1,
    title: "Ex: Graphic Art and Design",
    text: "Developed design deliverables that elevated and differentiated the brand.",
    added: true,
  },
  {
    id: 2,
    title: "Ex: Brand Strategy",
    text: "Maintained consistent use of graphic imagery in materials and other marketing outreach.",
    added: false,
  },
  {
    id: 3,
    title: "Ex: Visual Communications",
    text: "Designed new on-brand visual elements to effectively convey concepts and messaging.",
    added: true,
  },
];

export default function HeroSection({ user }: HeroSectionProps) {
  const router = useRouter();
  const [phrases, setPhrases] = useState(SAMPLE_PHRASES);
  const [searchQuery, setSearchQuery] = useState("Graphic Art and Design");

  const togglePhrase = (id: number) => {
    setPhrases((prev) =>
      prev.map((item) => (item.id === id ? { ...item, added: !item.added } : item))
    );
  };

  return (
    <section className="bg-white pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Copy & Primary Actions */}
        <header className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-indigo-950 tracking-tight leading-[1.15]">
            Create a <span className="text-indigo-700 underline decoration-slate-300">Professional CV</span> in Minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Pre-written expert phrases, ATS-optimized layouts, and instant PDF compilation. No writing required — just point, click, and customize.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            {user ? (
              <button
                onClick={() => router.push("/home")}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
              >
                <span>Build My CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => router.push("/pricing")}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Templates</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-indigo-700" />
              Passes 98.4% of ATS Scanners
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-indigo-700" />
              Pay-As-You-Go (R15 per CV)
            </span>
          </div>

        </header>

        {/* Right Column: Clean Interactive Mockup Card (Flat DOM) */}
        <article className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-md space-y-5">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pre-Written Phrase Selector
            </span>
            <span className="text-xs font-semibold text-indigo-950 bg-slate-200 px-2.5 py-0.5 rounded">
              Point & Click
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-indigo-950 focus:outline-none focus:border-indigo-700"
              placeholder="Search job title or skill..."
            />
            <Search className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="space-y-3">
            {phrases.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePhrase(item.id)}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                  item.added ? "bg-white border-indigo-700 shadow-xs" : "bg-white/60 border-slate-200"
                }`}
              >
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shrink-0 transition-colors ${
                    item.added
                      ? "bg-indigo-950 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-indigo-700 hover:text-white"
                  }`}
                >
                  {item.added ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>

                <p className={`text-xs sm:text-sm leading-relaxed ${item.added ? "text-indigo-950 font-semibold" : "text-slate-600"}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </article>

      </div>
    </section>
  );
}
