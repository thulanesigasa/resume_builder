"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Key, Phone, User, Briefcase } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (authError) throw authError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
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
            Join us and start generating ATS-optimized templates today.
          </p>
        </div>

        {/* Register Glass Card */}
        <div className="glass-panel p-8 rounded-2xl w-full">
          <h2 className="text-xl font-bold mb-6 text-brand-deep flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-indigo" />
            Create Your Account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
                Registration successful! An activation link has been sent to your email address. Please verify your email before logging in.
              </div>
              <Link
                href="/login"
                className="w-full py-3 btn-primary text-sm flex items-center justify-center gap-2"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy/80 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-brand-navy/60" />
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy/80 uppercase tracking-wider mb-2">
                    Surname
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-brand-navy/60" />
                    <input
                      type="text"
                      required
                      placeholder="Smith"
                      className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy/80 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-brand-navy/60" />
                  <input
                    type="tel"
                    required
                    placeholder="+27821234567"
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy/80 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-brand-navy/60" />
                  <input
                    type="email"
                    required
                    placeholder="janesmith@example.com"
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy/80 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 w-4 h-4 text-brand-navy/60" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    Register Account
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-brand-navy/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-indigo hover:text-brand-deep hover:underline transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
