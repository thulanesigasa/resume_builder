"use client";

export default function FeaturesPage() {
  const features = [
    {
      num: "01",
      title: "Next-Gen AI Compiler",
      description: "Our proprietary AI engine scans target job descriptions and aligns your background seamlessly to the requirements, rewriting bullet points for maximum semantic impact. No hallucinations, just precision optimization."
    },
    {
      num: "02",
      title: "Interactive Editor",
      description: "Fine-tune layouts instantly. Drag sections, click to edit fields inline, and preview the actual compiled PDF live before exporting. Absolute control over every pixel."
    },
    {
      num: "03",
      title: "ATS-Optimized Architecture",
      description: "No more parsing errors. Our templates are compiled strictly on the server to ensure 100% readability by Greenhouse, Workday, Taleo, and other enterprise systems."
    },
    {
      num: "04",
      title: "Real-time Score Auditing",
      description: "As you edit, the engine continuously calculates your ATS match score based on keyword density, formatting constraints, and mandatory skills extracted directly from the posting."
    },
    {
      num: "05",
      title: "Batch Autopilot",
      description: "Configure your target job parameters and let the system generate up to 50 tailored resumes and cover letters in the background while you sleep. Maximum efficiency."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Engineered for <span className="text-brand-indigo glow-text-brand">Precision</span>
        </h1>
        <p className="text-base text-brand-navy/70 leading-relaxed">
          rbptech provides an editorial, end-to-end toolkit designed specifically to bypass automated screening filters and get your resume into the hands of a human.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Feature 01: Wide Span */}
        <div className="md:col-span-12 glass-panel p-10 md:p-14 rounded-3xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100 fill-mode-both cursor-default">
          <div className="absolute -top-10 -right-10 text-[180px] font-black text-brand-navy/5 select-none leading-none pointer-events-none group-hover:text-brand-indigo/5 transition-colors duration-500">
            {features[0].num}
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="text-brand-indigo font-bold tracking-widest text-xs uppercase mb-4">{features[0].num} / Overview</div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-deep leading-tight transition-transform duration-500 group-hover:-translate-y-2">{features[0].title}</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-base md:text-lg text-brand-navy/70 leading-relaxed max-w-xl pt-4">
                  {features[0].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 02: Half Span */}
        <div className="md:col-span-6 glass-panel p-10 rounded-3xl relative overflow-hidden group border-t-4 border-t-brand-indigo/20 hover:border-t-brand-indigo transition-colors duration-300 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both cursor-default">
          <div className="relative z-10">
            <div className="text-brand-navy/40 font-bold tracking-widest text-xs uppercase mb-4">{features[1].num}</div>
            <h3 className="text-2xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-2">{features[1].title}</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/70 leading-relaxed pt-4">
                  {features[1].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 03: Half Span */}
        <div className="md:col-span-6 glass-panel p-10 rounded-3xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both cursor-default">
          <div className="relative z-10">
            <div className="text-brand-navy/40 font-bold tracking-widest text-xs uppercase mb-4">{features[2].num}</div>
            <h3 className="text-2xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-2">{features[2].title}</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/70 leading-relaxed pt-4">
                  {features[2].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 04: One-third Span */}
        <div className="md:col-span-4 glass-panel p-10 rounded-3xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400 fill-mode-both cursor-default">
          <div className="relative z-10">
            <div className="text-brand-navy/40 font-bold tracking-widest text-xs uppercase mb-4">{features[3].num}</div>
            <h3 className="text-xl font-extrabold text-brand-deep transition-transform duration-500 group-hover:-translate-y-2">{features[3].title}</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-xs text-brand-navy/70 leading-relaxed pt-4">
                  {features[3].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 05: Two-thirds Span */}
        <div className="md:col-span-8 glass-panel bg-brand-deep text-brand-light p-10 rounded-3xl relative overflow-hidden group border-none shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-both cursor-default">
          <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[200px] font-black text-white/5 select-none leading-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
            {features[4].num}
          </div>
          <div className="relative z-10 max-w-md">
            <div className="text-brand-indigo font-bold tracking-widest text-xs uppercase mb-4">{features[4].num} / Automation</div>
            <h3 className="text-2xl font-extrabold text-white transition-transform duration-500 group-hover:-translate-y-2">{features[4].title}</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-light/70 leading-relaxed pt-4">
                  {features[4].description}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
