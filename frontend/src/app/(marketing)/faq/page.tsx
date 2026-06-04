"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the ATS scoring work?",
      answer: "Our system analyzes the semantic similarity and keyword density between your generated resume and the target job description. We compare exact matches, variations, and missing mandatory skills to calculate a percentage score representing your likelihood of passing automated filters."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We do not sell your personal data. All compilations happen securely on the server without executing arbitrary code, and documents are stored securely in Supabase storage."
    },
    {
      question: "What format are the resumes exported in?",
      answer: "All documents are exported as clean, standard PDF files. We use a server-side WebKit engine to compile the HTML templates into PDFs, ensuring the text remains perfectly selectable and parsable by ATS systems."
    },
    {
      question: "Do subscriptions auto-renew?",
      answer: "We don't do subscriptions! rbptech is completely Pay-As-You-Go. You buy credits or pay per compilation, so you are never locked into a monthly fee when you stop applying for jobs."
    },
    {
      question: "Does the Batch Autopilot really run automatically?",
      answer: "Yes. Once you configure a batch job, our backend orchestrator will iteratively scrape the target links, generate tailored content, and compile the PDFs in the background. You can safely close the tab and return later to find your archive populated."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Frequently Asked <span className="text-brand-indigo glow-text-brand">Questions</span>
        </h1>
        <p className="text-base text-brand-navy/70 leading-relaxed">
          Everything you need to know about the platform and billing.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${openIndex === idx ? 'border-brand-indigo/30 shadow-md' : 'border-brand-navy/10 hover:border-brand-navy/20'}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-brand-deep cursor-pointer"
            >
              {faq.question}
              <ChevronDown className={`w-5 h-5 text-brand-indigo transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-sm text-brand-navy/70 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
