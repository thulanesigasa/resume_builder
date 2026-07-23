"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How does the AI ensure my resume passes Applicant Tracking Systems (ATS)?",
    answer: "Our AI (GPT-4o-mini) compares your work history directly against the target job posting keywords, action verbs, and skill requirements. It formats your document using single-column, standard vector fonts and clear semantic tags that high-volume enterprise systems (Workday, Taleo, Greenhouse) can read with 100% precision.",
  },
  {
    question: "Is rbptech really pay-as-you-go with no recurring monthly subscriptions?",
    answer: "Yes! Unlike traditional resume builders that silently bill your card $29 every month, rbptech operates strictly on a pay-per-document model. You can generate a single tailored resume for R15, or a Resume + Cover Letter combo for R25. You only pay when you actually generate a document.",
  },
  {
    question: "What payment methods are supported in South Africa?",
    answer: "We use PayFast, South Africa's leading payment gateway. You can pay securely using Instant EFT (Capitec Pay, FNB, ABSA, Standard Bank, Nedbank), Credit/Debit Cards, Masterpass, or Zapper.",
  },
  {
    question: "Can I upload my existing CV or certificates to auto-fill my profile?",
    answer: "Absolutely. You can upload your existing PDF resume or official certificates (AWS, Microsoft, University Diplomas). Our system extracts the text, saves verified skills in your profile vault, and automatically includes them whenever you tailor a new application.",
  },
  {
    question: "What is 1-Click Batch Autopilot mode?",
    answer: "If you are applying for multiple jobs, Batch Autopilot lets you upload a text file with job URLs. Our engine automatically scrapes every URL, tailors custom resumes for each role, audits ATS scores, and compiles all PDF files into your archives in one run.",
  },
  {
    question: "Can I edit the generated resume before downloading?",
    answer: "Yes. Once generated, you enter our full interactive Editor workspace where you can re-order experience bullets, edit text inline, try alternative 1-sentence AI summaries, and preview your print PDF before downloading.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50/60 to-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-brand-deep tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-sm md:text-base text-brand-navy/70">
            Have questions about ATS compatibility, pricing, or our AI generator? We've got answers.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="glass-panel rounded-2xl border border-brand-navy/15 bg-white/90 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer font-bold text-sm md:text-base text-brand-deep hover:text-brand-indigo transition-colors"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-brand-indigo text-white" : "text-brand-navy/50"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 text-xs md:text-sm text-brand-navy/80 leading-relaxed border-t border-brand-navy/10 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
