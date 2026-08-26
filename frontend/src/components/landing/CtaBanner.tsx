"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

interface CtaBannerProps {
  user: any;
}

export default function CtaBanner({ user }: CtaBannerProps) {
  const router = useRouter();

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Create Your Perfect CV in Minutes
          </h2>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Join thousands of job seekers who use rbptech to pass ATS scanners, impress recruiters, and land interviews faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {user ? (
              <button
                onClick={() => router.push("/home")}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => router.push("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Build My CV Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => router.push("/pricing")}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Plans</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-400" />
              Pay-As-You-Go in ZAR
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-purple-400" />
              Zero Monthly Auto-Billing
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
