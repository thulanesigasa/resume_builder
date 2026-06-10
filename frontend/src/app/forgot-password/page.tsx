"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <MarketingHeader />
      <main className="flex-1 flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Branding header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-brand-deep">
              Reset Password
            </h1>
            <p className="text-sm text-brand-navy/70">
              Enter your email and we will send you a secure link to choose a new password.
            </p>
          </div>

          {/* Glass Card */}
          <div className="glass-panel p-8 rounded-2xl w-full">
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-brand-deep">Check your inbox!</h3>
                <p className="text-sm text-brand-navy/70">
                  We sent a secure password reset link to <strong>{email}</strong>. 
                  Click the link in the email to set your new password.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center justify-center w-full py-2.5 text-sm font-semibold text-brand-indigo hover:text-brand-deep transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-indigo hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-indigo transition-colors disabled:opacity-70 mt-6"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <div className="text-center mt-6">
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-brand-indigo hover:text-brand-deep transition-colors"
                  >
                    Wait, I remember my password
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
