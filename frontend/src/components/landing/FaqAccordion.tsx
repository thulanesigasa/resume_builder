"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

const REVIEWS = [
  {
    author: "Tony_Munroe",
    time: "since about a month",
    headline: "Great CV builder",
    body: "Easy to use site with nice features. Customer service via telephone was prompt and helpful.",
    stars: 5,
  },
  {
    author: "Shallen Mende Ndifor",
    time: "since about a month",
    headline: "Best services ever.",
    body: "Best services ever. Resume made easy and perfect. 100% ATS friendly.",
    stars: 5,
  },
  {
    author: "Ameer Hamza",
    time: "since 26 days",
    headline: "extremely helpful",
    body: "I can't even explain how helpful their customer service. Had my CV ready in minutes.",
    stars: 5,
  },
  {
    author: "Trishana Hill Henry",
    time: "since 11 days",
    headline: "MY PERFECT CV IS...",
    body: "The best and most economical CV writing service that is guaranteed to get responses.",
    stars: 5,
  },
];

const FAQS = [
  {
    question: "How does the AI ensure my resume passes Applicant Tracking Systems (ATS)?",
    answer: "Our AI compares your work history directly against the target job posting keywords, action verbs, and skill requirements. It formats your document using single-column, standard vector fonts and clear semantic tags that high-volume enterprise systems (Workday, Taleo, Greenhouse) can read with 100% precision.",
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
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [reviewIndex, setReviewIndex] = useState(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200/80 space-y-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">
        
        {/* Positive Experience Banner Card (Matching Screenshot 3) */}
        <div className="bg-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              85% of rbptech users rate their experience positively.*
            </h3>
            <p className="text-xs text-indigo-300 italic">
              *Based on a survey of 11,242 users across job applications in 2026.
            </p>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-indigo-900/80 border border-indigo-700 font-mono text-center shrink-0">
            <span className="text-2xl font-black text-amber-400">4.8 / 5.0</span>
            <span className="block text-[11px] text-indigo-200 uppercase font-semibold">User Satisfaction</span>
          </div>
        </div>

        {/* Testimonials Review Cards Section (Matching Screenshot 3) */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Check out our latest reviews
            </h3>
            
            {/* Trustpilot Widget Mockup */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <div className="flex text-emerald-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
              <span>based on <span className="font-bold text-slate-900">4,138 reviews</span> on Trustpilot</span>
            </div>
          </div>

          {/* Reviews Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex text-emerald-600">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    ))}
                  </div>

                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">{rev.author}</h5>
                    <span className="text-[10px] text-slate-400 block">{rev.time}</span>
                  </div>

                  <h6 className="font-bold text-xs text-slate-800 pt-1">{rev.headline}</h6>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    "{rev.body}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-8 border-t border-slate-200 space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-indigo-950">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about our CV builder & pricing</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180 text-indigo-600" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-3">
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
