"use client";

import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

const REVIEWS = [
  {
    author: "Thabo Nkosi",
    time: "Verified Candidate • South Africa",
    headline: "Great CV builder",
    body: "Easy to use site with nice features. Got my CV tailored for an engineering role in under 2 minutes.",
    stars: 5,
  },
  {
    author: "Nomalanga Dlamini",
    time: "Verified Candidate • South Africa",
    headline: "Best services ever.",
    body: "Best services ever. Resume made easy and perfect. 100% ATS friendly and passed recruiter screening.",
    stars: 5,
  },
  {
    author: "Sipho Mthembu",
    time: "Verified Candidate • South Africa",
    headline: "Extremely helpful",
    body: "I can't even explain how helpful this tool is. Had my CV and cover letter ready for PayFast checkout instantly.",
    stars: 5,
  },
  {
    author: "Keagan van der Merwe",
    time: "Verified Candidate • South Africa",
    headline: "Excellent value for money",
    body: "The best and most economical CV writing service that is guaranteed to get interview responses without monthly traps.",
    stars: 5,
  },
];

const FAQS = [
  {
    question: "How does the AI ensure my resume passes Applicant Tracking Systems (ATS)?",
    answer: "Our AI compares your work history directly against target job posting keywords, action verbs, and skill requirements. It formats your document using single-column, standard vector fonts and clear semantic tags that high-volume enterprise systems (Workday, Taleo, Greenhouse) can read with 100% precision.",
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
        
        {/* User Satisfaction Banner Card (Updated to 4.76/5.0 with smooth hover animation) */}
        <header className="bg-indigo-950 text-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Designed for Job Seekers Across South Africa & Global Roles
            </h3>
            <p className="text-xs text-indigo-200">
              Pass recruiter screenings with ATS-tailored bullet points and instant PDF export.
            </p>
          </div>
          <div className="px-6 py-4 rounded-xl bg-indigo-900 border border-indigo-700 text-center shrink-0 shadow-inner group hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-black text-white block">4.76 / 5.0</span>
            <span className="block text-[11px] text-indigo-200 uppercase font-semibold">Candidate Feedback</span>
          </div>
        </header>

        {/* Candidate Feedback Section */}
        <div className="space-y-8">
          <header className="text-center space-y-3">
            <h3 className="text-3xl font-black text-indigo-950 tracking-tight">
              Candidate Feedback
            </h3>
            
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
              <div className="flex text-indigo-700">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-indigo-700 text-indigo-700 hover:scale-125 transition-transform duration-200" />
                ))}
              </div>
              <span>Rated 4.76 / 5.0 by candidates across top industries</span>
            </div>
          </header>

          {/* Reviews Cards Grid (Hover lift micro-animations) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((rev, idx) => (
              <article
                key={idx}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex text-indigo-700">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-indigo-700 text-indigo-700" />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-indigo-950">{rev.author}</h4>
                    <span className="text-[10px] text-slate-400 block">{rev.time}</span>
                  </div>

                  <h5 className="font-bold text-xs text-slate-800 pt-1">{rev.headline}</h5>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    "{rev.body}"
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="pt-8 border-t border-slate-200 space-y-6 max-w-4xl mx-auto">
          <header className="text-center space-y-2">
            <h3 className="text-2xl font-black text-indigo-950">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about our CV builder & pricing</p>
          </header>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-indigo-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-indigo-950 hover:text-indigo-700 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-700" : ""}`} />
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
