"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { UserPlus, Mail, Key, Phone, User, Briefcase, MapPin, Globe, ChevronDown, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const experienceOptions = [
    { label: "Entry Level (0-2 yrs)", value: "Entry Level" },
    { label: "Mid Level (3-5 yrs)", value: "Mid Level" },
    { label: "Senior (5-10 yrs)", value: "Senior" },
    { label: "Executive (10+ yrs)", value: "Executive" }
  ];
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special symbol.");
      setLoading(false);
      return;
    }

    try {
      let formattedPhone = phone.trim().replace(/\s+/g, '');
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+27" + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith("27") && formattedPhone.length === 11) {
        formattedPhone = "+" + formattedPhone;
      } else if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+27" + formattedPhone;
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: formattedPhone,
            target_job_title: targetJobTitle.trim(),
            experience_level: experienceLevel,
            linkedin_url: linkedinUrl.trim(),
          },
        },
      });

      if (authError) throw authError;

      // Check if user already exists (Supabase security feature returns user but no identities if email taken)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error("This email is already registered. Please log in instead.");
      }

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
            <div className="bg-brand-indigo/10 border border-brand-indigo/20 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-indigo rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-deep">Verify Your Email</h3>
              <p className="text-sm text-brand-navy/70 leading-relaxed">
                We've sent a verification link to <span className="font-semibold text-brand-navy">{email}</span>. Please check your inbox and click the link to activate your workspace.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 px-6 py-2 btn-secondary text-sm"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                      placeholder="+27 82 000 0000"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-navy/10 mt-2 mb-2">
                  <h3 className="text-sm font-bold text-brand-deep mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-indigo" />
                    Professional Details
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                        Target Job Title
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={targetJobTitle}
                          onChange={(e) => setTargetJobTitle(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                        Experience Level
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                          className="w-full pl-3 pr-8 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep flex justify-between items-center"
                        >
                          <span>{experienceOptions.find(o => o.value === experienceLevel)?.label || "Select Level"}</span>
                          <ChevronDown className={`h-4 w-4 text-brand-navy/40 transition-transform ${showExperienceDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showExperienceDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setShowExperienceDropdown(false)}
                            ></div>
                            <div className="absolute z-20 w-full mt-1 bg-white border border-brand-navy/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                              {experienceOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setExperienceLevel(opt.value);
                                    setShowExperienceDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-brand-navy/5 transition-colors ${experienceLevel === opt.value ? 'bg-brand-indigo/5 text-brand-indigo font-medium' : 'text-brand-deep'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2">
                        LinkedIn URL <span className="text-brand-navy/40 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                          <Globe className="h-4 w-4" />
                        </div>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-navy/10 mt-2 mb-2">
                  <h3 className="text-sm font-bold text-brand-deep mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand-indigo" />
                    Account Security
                  </h3>
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
                  <label className="block text-xs font-bold text-brand-navy/70 uppercase mb-2 flex justify-between">
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-navy/40">
                      <Key className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-brand-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo transition-shadow text-brand-deep placeholder-brand-navy/30"
                      placeholder="Min. 8 chars, 1 uppercase, 1 symbol"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-navy/40 hover:text-brand-indigo transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-2 flex gap-1 items-center">
                      <div className={`h-1.5 flex-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-brand-navy/10'}`}></div>
                      <div className={`h-1.5 flex-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-brand-navy/10'}`}></div>
                      <div className={`h-1.5 flex-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-brand-navy/10'}`}></div>
                    </div>
                  )}
                  {password && (
                    <div className="mt-1 flex justify-between text-[10px] text-brand-navy/60">
                      <span className={password.length >= 8 ? 'text-green-600 font-medium' : ''}>8+ Chars</span>
                      <span className={/[A-Z]/.test(password) ? 'text-green-600 font-medium' : ''}>Uppercase</span>
                      <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 font-medium' : ''}>Symbol</span>
                    </div>
                  )}
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Workspace
                      <Briefcase className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-brand-navy/60">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-brand-indigo font-semibold hover:underline"
                >
                  Log in here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
