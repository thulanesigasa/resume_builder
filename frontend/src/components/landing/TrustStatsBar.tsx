"use client";

const ATS_SYSTEMS = [
  "WORKDAY",
  "TALEO",
  "GREENHOUSE",
  "SUCCESSFACTORS",
  "LEVER",
  "BAMBOOHR",
  "ICIMS",
];

export default function TrustStatsBar() {
  return (
    <section className="bg-slate-50 py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-4 text-center">
        
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Optimized for Enterprise ATS Parsers & HR Systems:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-75">
          {ATS_SYSTEMS.map((system) => (
            <span
              key={system}
              className="text-xs md:text-sm font-extrabold text-indigo-950 tracking-wider font-mono select-none"
            >
              {system}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
          <span>✓ 100% ATS Single-Column Layouts</span>
          <span>✓ Local SA PayFast Integration</span>
          <span>✓ Pay-As-You-Go (R15 per CV)</span>
        </div>

      </div>
    </section>
  );
}
