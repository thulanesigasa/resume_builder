"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LogIn, Key, Mail, Briefcase } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setError(err);
      // Clean query parameter from URL bar
      router.replace("/login");
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs tracking-wider text-brand-navy/70 bg-brand-navy/5 border border-brand-navy/10 px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full glow-border-brand"></span>
            A PRODUCT BY T.S INDUSTRIES
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-brand-deep">
            <span className="text-brand-indigo glow-text-brand">Resume Builder</span>
          </h1>
          <p className="text-sm text-brand-navy/70">
            Deploy resumes & cover letters matching industry profiles instantly.
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-panel p-8 rounded-2xl w-full">
          <h2 className="text-xl font-bold mb-6 text-brand-deep flex items-center gap-2">
            <LogIn className="w-5 h-5 text-brand-indigo" />
            Sign In to Your Workspace
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-brand-navy/70 uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-brand-indigo hover:text-brand-deep transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 btn-primary text-sm font-semibold flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Workspace
                  <Briefcase className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-brand-navy/60">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-brand-indigo font-semibold hover:underline"
            >
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-brand-navy/60">Loading login workspace...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
