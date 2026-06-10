"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
            Let's <span className="text-brand-indigo glow-text-brand">Connect</span>
          </h1>
          <p className="text-base text-brand-navy/70 leading-relaxed max-w-sm">
            Have a question about billing, ATS compatibility, or need technical support? Drop us a message.
          </p>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 fill-mode-both">
          <div className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-indigo/20 group-hover:bg-brand-indigo transition-colors rounded-full"></div>
            <div className="text-xs font-bold text-brand-navy/40 uppercase tracking-widest mb-1">Direct Email</div>
            <div className="text-lg font-bold text-brand-deep uppercase tracking-wider">Support</div>
            <a href="mailto:support@rbptech.co.za" className="text-sm text-brand-navy/80 hover:text-brand-indigo transition-colors inline-block mt-1">support@rbptech.co.za</a>
          </div>
          
          <div className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-indigo/20 group-hover:bg-brand-indigo transition-colors rounded-full"></div>
            <div className="text-xs font-bold text-brand-navy/40 uppercase tracking-widest mb-1">Dashboard</div>
            <div className="text-lg font-bold text-brand-deep uppercase tracking-wider">Live Chat</div>
            <div className="text-sm text-brand-navy/80 mt-1">Available Mon-Fri, 9am - 5pm SAST</div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-3xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
        <div className="absolute top-0 right-0 text-[120px] font-black text-brand-navy/5 select-none leading-none pointer-events-none -mt-4 -mr-4">
          @
        </div>
        
        <div className="relative z-10">
          {formStatus === "success" ? (
            <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-500">
              <div className="text-6xl font-black text-brand-indigo mb-6">✓</div>
              <h3 className="text-2xl font-bold text-brand-deep">Message Sent!</h3>
              <p className="text-sm text-brand-navy/70">We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setFormStatus("idle")}
                className="mt-6 px-6 py-2 btn-secondary text-xs"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-navy/70 uppercase tracking-widest">Your Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-white border border-brand-navy/15 rounded-lg text-sm text-brand-deep focus:outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/50 transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-navy/70 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 bg-white border border-brand-navy/15 rounded-lg text-sm text-brand-deep focus:outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/50 transition-all shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-navy/70 uppercase tracking-widest">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-brand-navy/15 rounded-lg text-sm text-brand-deep focus:outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/50 transition-all resize-none shadow-sm"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formStatus === "submitting"}
                className="w-full py-4 btn-primary text-sm mt-2 disabled:opacity-50 tracking-wider uppercase font-bold"
              >
                {formStatus === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
