import { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | rbptech",
  description: "Have questions about ATS scoring, data privacy, PDF formats, or pricing? Find detailed answers in our Frequently Asked Questions.",
};

export default function FAQPage() {
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-3xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
            className="glass-panel rounded-2xl overflow-hidden border border-brand-navy/10 hover:border-brand-indigo/30 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both group cursor-default"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-brand-deep">
              {faq.question}
              <ChevronDown className="w-5 h-5 text-brand-indigo transition-transform duration-500 group-hover:rotate-180" />
            </div>
            
            <div className="px-6 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm text-brand-navy/70 leading-relaxed pb-5">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

