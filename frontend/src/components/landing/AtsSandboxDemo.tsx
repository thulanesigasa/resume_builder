"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Check, Zap, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

const SAMPLE_INPUTS = [
  {
    label: "Software Developer",
    raw: "Responsible for writing Python code and fixing database errors.",
    optimized: "Engineered scalable Python microservices & PostgreSQL indexing pipelines, improving API throughput by 42% and eliminating query bottlenecks.",
    addedKeywords: ["Microservices", "PostgreSQL", "API Throughput", "Performance Tuning"],
    score: 95,
  },
  {
    label: "Operations Lead",
    raw: "Handled team schedules and ordered supplies for office projects.",
    optimized: "Orchestrated cross-functional scheduling for 45+ staff members and managed R1.2M annual procurement budgets with zero compliance errors.",
    addedKeywords: ["Cross-Functional Leadership", "Procurement Budgeting", "Compliance", "Resource Allocation"],
    score: 93,
  },
  {
    label: "Sales Executive",
    raw: "Sold software products to clients and exceeded quota.",
    optimized: "Spearheaded B2B SaaS business development, outperforming annual sales targets by 145% and generating R3.8M in new recurring pipeline.",
    addedKeywords: ["B2B SaaS Sales", "Business Development", "ARR Growth", "Pipeline Generation"],
    score: 97,
  },
];

export default function AtsSandboxDemo() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeOutput, setActiveOutput] = useState(SAMPLE_INPUTS[0]);

  const handleSelectSample = (idx: number) => {
    setSelectedIndex(idx);
    setCustomText("");
    setIsProcessing(true);
    setTimeout(() => {
      setActiveOutput(SAMPLE_INPUTS[idx]);
      setIsProcessing(false);
    }, 350);
  };

  const handleRunCustom = () => {
    if (!customText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setActiveOutput({
        label: "Custom Entry",
        raw: customText,
        optimized: `Spearheaded ${customText.toLowerCase().replace(/^(responsible for|handled|did|wrote)\s*/i, "")}, driving a 35% operational efficiency boost using industry-standard ATS metrics.`,
        addedKeywords: ["Strategic Execution", "Operational Efficiency", "ATS Optimization"],
        score: 94,
      });
      setIsProcessing(false);
    }, 450);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Interactive AI Sandbox Demo
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-deep tracking-tight">
            See How AI Rewrites Your CV for{" "}
            <span className="bg-gradient-to-r from-brand-indigo to-purple-600 bg-clip-text text-transparent">
              Maximum Impact
            </span>
          </h2>
          <p className="text-sm md:text-base text-brand-navy/70">
            Select a sample bullet point or test your own text below to see how our engine injects metrics, action verbs, and ATS keywords instantly.
          </p>
        </div>

        {/* Sandbox Panel */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-brand-navy/15 bg-white/95 shadow-xl max-w-4xl mx-auto">
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-brand-navy/10">
            <span className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">
              Try Preset Roles:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_INPUTS.map((sample, idx) => (
                <button
                  key={sample.label}
                  onClick={() => handleSelectSample(idx)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedIndex === idx && !customText
                      ? "bg-brand-indigo text-white border-brand-indigo shadow-md"
                      : "bg-slate-50 text-brand-navy/70 border-brand-navy/15 hover:border-brand-indigo/50"
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Live Transformation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 items-start">
            
            {/* Input Box */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider">
                Original Bullet Point (Input):
              </label>
              <textarea
                value={customText || activeOutput.raw}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste a CV bullet point here to test..."
                className="w-full h-36 p-3.5 bg-slate-50 border border-brand-navy/15 rounded-xl text-xs text-brand-deep focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo resize-none font-mono"
              />
              <button
                onClick={handleRunCustom}
                disabled={isProcessing}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Rewriting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test AI Optimization Live</span>
                  </>
                )}
              </button>
            </div>

            {/* Output Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  ATS-Optimized Output:
                </label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  ATS Score: {activeOutput.score}%
                </span>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl min-h-[144px] flex flex-col justify-between space-y-3">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-8 text-xs text-brand-navy/60 space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-brand-indigo" />
                    <span>Cooking high-impact bullet point...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed font-sans">
                      "{activeOutput.optimized}"
                    </p>

                    <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap gap-1.5">
                      {activeOutput.addedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="text-right">
                <button
                  onClick={() => router.push("/register")}
                  className="text-xs text-brand-indigo font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Build Full CV with this Quality</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
