"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Briefcase, Menu, X } from "lucide-react";
import Link from "next/link";

export default function MarketingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-brand-navy/10 py-3 shadow-sm" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <div></div> {/* Empty div to keep flex-between layout working properly for the nav */}
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`text-xs font-semibold transition-colors ${
                    pathname === link.href 
                      ? "text-brand-indigo" 
                      : "text-brand-navy/70 hover:text-brand-deep"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="h-4 w-px bg-brand-navy/20"></div>

          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2 btn-secondary text-xs"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 text-xs font-semibold text-brand-navy/80 hover:text-brand-deep transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2 btn-primary text-xs"
              >
                Sign up
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <label htmlFor="mobile-menu-toggle" className="hamburger md:hidden p-2 text-brand-navy/70 hover:text-brand-deep">
          <input 
            id="mobile-menu-toggle"
            type="checkbox"
            checked={mobileMenuOpen}
            onChange={(e) => setMobileMenuOpen(e.target.checked)}
          />
          <svg viewBox="0 0 32 32">
            <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
            <path className="line" d="M7 16 27 16"></path>
          </svg>
        </label>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? "max-h-[500px] border-b border-brand-navy/10 opacity-100" 
            : "max-h-0 border-b-0 border-transparent opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-semibold py-2 transition-colors ${
                pathname === link.href 
                  ? "text-brand-indigo" 
                  : "text-brand-navy/80 hover:text-brand-deep"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px w-full bg-brand-navy/10 my-2"></div>
          
          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push("/dashboard");
              }}
              className="w-full py-3 btn-primary text-sm"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full py-3 border border-brand-navy/10 rounded-full text-xs font-bold text-brand-navy hover:bg-brand-navy/5"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/register");
                }}
                className="w-full py-3 btn-primary text-xs"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
