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
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
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

          <button
            onClick={() => router.push(user ? "/dashboard" : "/login")}
            className="px-5 py-2 btn-secondary text-xs"
          >
            {user ? "Go to Dashboard" : "Sign In"}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-brand-navy/70 hover:text-brand-deep"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-brand-navy/10 shadow-lg px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
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
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              router.push(user ? "/dashboard" : "/login");
            }}
            className="w-full py-3 btn-primary text-sm"
          >
            {user ? "Go to Dashboard" : "Sign In"}
          </button>
        </div>
      )}
    </header>
  );
}
