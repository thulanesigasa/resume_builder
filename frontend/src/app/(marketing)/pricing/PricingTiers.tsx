"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Check, ArrowLeft, Zap } from "lucide-react";

export default function PricingTiers() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [batchType, setBatchType] = useState<"resume" | "combo">("combo");
  const [numJobs, setNumJobs] = useState<number>(5);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const [payfastData, setPayfastData] = useState<{ url: string; fields: Record<string, string> } | null>(null);

  useEffect(() => {
    if (payfastData) {
      const form = document.getElementById("payfast-form") as HTMLFormElement;
      if (form) form.submit();
    }
  }, [payfastData]);

  const handleSelectPlan = async (planName: string, amountStr: string) => {
    if (!user) {
      triggerToast("Please login first to continue to checkout.", "error");
      setTimeout(() => {
        router.push(`/login?redirect=/pricing`);
      }, 1500);
      return;
    }

    triggerToast(`Initializing secure Payfast checkout for ${planName}...`, "info");
    
    try {
      // Extract numeric value from string (e.g. "R18" -> 18, "R 125.50" -> 125.5)
      const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ""));
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payfast/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          plan_name: planName,
          amount: amount
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to initialize checkout");
      }
      
      const data = await response.json();
      setPayfastData({ url: data.payfast_url, fields: data.form_fields });
      triggerToast("Redirecting to PayFast...", "success");
      
    } catch (error) {
      console.error(error);
      triggerToast("Error connecting to Payfast gateway.", "error");
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 flex flex-col justify-between">
      <div className="max-w-6xl w-full mx-auto space-y-12">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 text-xs tracking-wider text-brand-navy/70 bg-brand-navy/5 border border-brand-navy/10 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full glow-border-brand animate-pulse"></span>
            CREDITS & LICENSING
          </div>
        </div>

        {/* Hidden PayFast Form */}
        {payfastData && (
          <form id="payfast-form" action={payfastData.url} method="POST" className="hidden">
            {Object.entries(payfastData.fields).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        )}

        {/* Hidden PayFast Form */}
        {payfastData && (
          <form id="payfast-form" action={payfastData.url} method="POST" className="hidden">
            {Object.entries(payfastData.fields).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        )}

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
            Pay-As-You-Go{" "}
            <span className="text-brand-indigo glow-text-brand">
              Pricing Workspace
            </span>
          </h1>
          <p className="text-sm md:text-base text-brand-navy/70 max-w-xl mx-auto">
            No monthly subscriptions, no lock-in. Pay only for the documents you compile.
          </p>
        </div>

        {/* Pricing tiers grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pt-6">
          {/* Resume Only */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold text-brand-navy/50">Resume Only</div>
              <div className="flex items-baseline text-brand-deep">
                <span className="text-4xl font-extrabold">R18</span>
                <span className="text-xs text-brand-navy/60 ml-1">/ generation</span>
              </div>
              <p className="text-xs text-brand-navy/70">Tailor your base background and details for one specific job.</p>
              <div className="h-[1px] bg-brand-navy/10 pt-2"></div>
              <ul className="space-y-3">
                {[
                  "1 Tailored ATS Resume compile",
                  "Drag & Drop section builder",
                  "ATS score scanning & audit",
                  "Secure PDF download link",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-brand-navy/85">
                    <Check className="w-3.5 h-3.5 text-brand-indigo flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan("Resume Only Plan", "R18")}
              className="w-full py-2.5 btn-secondary text-xs cursor-pointer"
            >
              Get Resume Only
            </button>
          </div>

          {/* Resume & Cover Letter Combo */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden border-brand-indigo/60 shadow-[0_0_25px_rgba(91,88,235,0.06)] group">
            <div className="absolute top-0 right-0 bg-brand-indigo text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Best Value
            </div>
            
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold text-brand-indigo">Resume & Letter Combo</div>
              <div className="flex items-baseline text-brand-deep">
                <span className="text-4xl font-extrabold">R25</span>
                <span className="text-xs text-brand-navy/60 ml-1">/ generation</span>
              </div>
              <p className="text-xs text-brand-navy/70">Draft a matched tailored cover letter along with your ATS resume.</p>
              <div className="h-[1px] bg-brand-navy/10 pt-2"></div>
              <ul className="space-y-3">
                {[
                  "1 Tailored ATS Resume compile",
                  "1 Matched Cover Letter compile",
                  "Drag & Drop section reordering",
                  "Full ATS match scan & keywords",
                  "Instant PDF compilation downloads",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-brand-navy/85">
                    <Check className="w-3.5 h-3.5 text-brand-indigo flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan("Resume & Cover Letter Combo", "R25")}
              className="w-full py-3 btn-primary text-xs cursor-pointer"
            >
              Get Combo Deal
            </button>
          </div>

          {/* Batch Autopilot Discount Calculator */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="text-xs uppercase font-bold text-brand-navy/50">Batch Autopilot Calculator</div>
              <div className="text-xs text-brand-navy/70">
                Trigger multiple jobs on autopilot and receive a **7.8% discount** at checkout!
              </div>

              {/* Calculator Settings */}
              <div className="space-y-3 p-3 bg-brand-navy/5 rounded-xl border border-brand-navy/10">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-brand-navy/70 mb-1">Document Type</label>
                  <div className="flex bg-white rounded-md p-0.5 border border-brand-navy/15">
                    <button
                      type="button"
                      onClick={() => setBatchType("resume")}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        batchType === "resume" ? "bg-brand-indigo text-white shadow-sm" : "text-brand-navy hover:text-brand-indigo"
                      }`}
                    >
                      Resume (R18)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchType("combo")}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        batchType === "combo" ? "bg-brand-indigo text-white shadow-sm" : "text-brand-navy hover:text-brand-indigo"
                      }`}
                    >
                      Combo (R25)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-bold text-brand-navy/70 mb-1">
                    Number of Jobs: <span className="text-brand-indigo font-bold">{numJobs}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={numJobs}
                    onChange={(e) => setNumJobs(parseInt(e.target.value) || 2)}
                    className="w-full accent-brand-indigo cursor-pointer h-1.5 bg-white rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[8px] text-brand-navy/50 font-mono mt-0.5">
                    <span>2 jobs</span>
                    <span>50 jobs</span>
                  </div>
                </div>

                {/* Math breakdown */}
                <div className="pt-2 border-t border-brand-navy/10 space-y-1 text-xs">
                  <div className="flex justify-between text-brand-navy/70 text-[10px]">
                    <span>Original Price:</span>
                    <span>R {(numJobs * (batchType === "resume" ? 18 : 25)).toFixed(2)}</span>
                  </div>
                  {(() => {
                    const getDiscountRate = (jobs: number) => {
                      if (jobs >= 30) return 0.29;
                      if (jobs >= 25) return 0.23;
                      if (jobs >= 20) return 0.19;
                      if (jobs >= 11) return 0.13;
                      if (jobs >= 5) return 0.09;
                      return 0;
                    };
                    const rate = getDiscountRate(numJobs);
                    const basePrice = numJobs * (batchType === "resume" ? 18 : 25);
                    const discountAmount = basePrice * rate;
                    const finalPrice = basePrice - discountAmount;
                    return (
                      <>
                        {rate > 0 && (
                          <div className="flex justify-between text-brand-indigo text-[10px] font-semibold">
                            <span>{(rate * 100).toFixed(0)}% Batch Discount:</span>
                            <span>- R {discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-brand-deep font-bold border-t border-brand-navy/10 pt-1.5 text-sm">
                          <span>Total Cost:</span>
                          <span>R {finalPrice.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                const getDiscountRate = (jobs: number) => {
                  if (jobs >= 30) return 0.29;
                  if (jobs >= 25) return 0.23;
                  if (jobs >= 20) return 0.19;
                  if (jobs >= 11) return 0.13;
                  if (jobs >= 5) return 0.09;
                  return 0;
                };
                const rate = getDiscountRate(numJobs);
                const finalPrice = (numJobs * (batchType === "resume" ? 18 : 25)) * (1 - rate);
                handleSelectPlan(
                  `Batch Autopilot (${numJobs} jobs, ${batchType === "resume" ? "Resume Only" : "Combo"})`,
                  `R ${finalPrice.toFixed(2)}`
                );
              }}
              className="w-full py-2.5 btn-secondary text-xs cursor-pointer"
            >
              Checkout Batch
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-xl border shadow-lg flex items-center gap-2 max-w-sm ${
            toast.type === "success" 
              ? "bg-white border-green-200 text-green-800" 
              : toast.type === "error" 
              ? "bg-white border-red-200 text-red-800" 
              : "bg-white border-brand-indigo/35 text-brand-deep"
          }`}>
            <span className="text-xs font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-xs ml-auto opacity-75 hover:opacity-100 font-bold px-1.5 py-0.5">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
