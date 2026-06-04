"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Empowering the <span className="text-brand-indigo glow-text-brand">Modern Candidate</span>
        </h1>
        <p className="text-base text-brand-navy/70 leading-relaxed">
          The job market has fundamentally changed. We're here to give the power back to you.
        </p>
      </div>

      <div className="glass-panel p-10 md:p-14 rounded-3xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-indigo/10 transition-colors duration-700"></div>
        <div className="absolute -bottom-6 -left-6 text-[150px] font-black text-brand-navy/5 select-none leading-none pointer-events-none">
          MISSION
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="text-brand-indigo font-bold tracking-widest text-xs uppercase">Why We Exist</div>
          <h2 className="text-2xl font-bold text-brand-deep">Our Core Philosophy</h2>
          <p className="text-sm text-brand-navy/80 leading-relaxed max-w-2xl">
            We founded rbptech because we were tired of seeing highly qualified candidates get automatically rejected by broken ATS (Applicant Tracking System) bots. These systems often filter out brilliant people simply because their resumes lack the exact phrasing or formatting expected by the algorithm.
          </p>
          <p className="text-sm text-brand-navy/80 leading-relaxed max-w-2xl">
            Our mission is to level the playing field. By reverse-engineering how ATS systems parse and rank documents, and combining it with Next-Gen AI capabilities, we provide candidates with a toolkit to perfectly tailor their applications for every single job they apply to—at scale.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-10 rounded-2xl relative overflow-hidden group border-t-4 border-t-brand-indigo/20 hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100 fill-mode-both cursor-default">
          <div className="absolute top-4 right-4 text-4xl font-black text-brand-navy/5 select-none group-hover:text-brand-indigo/10 transition-colors">01</div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Precision Tuning</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/60 leading-relaxed pt-3">We focus on semantic keyword density to ensure your resume speaks the exact language of the job description.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-10 rounded-2xl relative overflow-hidden group border-t-4 border-t-brand-indigo/20 hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both cursor-default">
          <div className="absolute top-4 right-4 text-4xl font-black text-brand-navy/5 select-none group-hover:text-brand-indigo/10 transition-colors">02</div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Parser Safe</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/60 leading-relaxed pt-3">Our templates are strictly designed to compile into raw, selectable PDF text that never confuses an ATS algorithm.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-10 rounded-2xl relative overflow-hidden group border-t-4 border-t-brand-indigo/20 hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both cursor-default">
          <div className="absolute top-4 right-4 text-4xl font-black text-brand-navy/5 select-none group-hover:text-brand-indigo/10 transition-colors">03</div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-brand-deep transition-transform duration-500 group-hover:-translate-y-1">Candidate First</h3>
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/60 leading-relaxed pt-3">No sneaky monthly subscriptions. You only pay for what you generate. We strictly respect your wallet and your data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
