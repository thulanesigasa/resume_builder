"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does the AI ensure my resume passes Applicant Tracking Systems (ATS)?",
    answer: "Our AI compares your work history directly against target job posting keywords, action verbs, and skill requirements. It formats your document using single-column, standard vector fonts and clear semantic tags that high-volume enterprise systems (Workday, Taleo, Greenhouse) can read with 100% precision.",
  },
  {
    question: "Is rbptech really pay-as-you-go with no recurring monthly subscriptions?",
    answer: "Yes! Unlike traditional resume builders that silently bill your card R350 every month, rbptech operates strictly on a pay-per-document model. You can generate a single tailored resume for R15, or a Resume + Cover Letter combo for R25. You only pay when you actually generate a document.",
  },
  {
    question: "What payment methods are supported in South Africa?",
    answer: "We use PayFast, South Africa's leading payment gateway. You can pay securely using Instant EFT (Capitec Pay, FNB, ABSA, Standard Bank, Nedbank), Credit/Debit Cards, Masterpass, or Zapper.",
  },
  {
    question: "Can I upload my existing CV or certificates to auto-fill my profile?",
    answer: "Absolutely. You can upload your existing PDF resume or official certificates (AWS, Microsoft, University Diplomas). Our system extracts text, saves verified skills in your profile vault, and automatically includes them whenever you tailor a new application.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200 space-y-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* User Satisfaction Banner Card */}
        <header className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Designed for Job Seekers Across South Africa & Global Roles
            </h3>
            <p className="text-xs text-slate-300">
              Pass recruiter screenings with ATS-tailored bullet points and instant PDF export.
            </p>
          </div>
          <div className="px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-center shrink-0 shadow-inner group hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-black text-white block">4.76 / 5.0</span>
            <span className="block text-[11px] text-purple-300 uppercase font-semibold">Candidate Feedback</span>
          </div>
        </header>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <header className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about our CV builder & pricing</p>
          </header>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-purple-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-purple-600 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-purple-600" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3 font-normal animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
