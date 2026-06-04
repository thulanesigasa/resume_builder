import Link from "next/link";

export default function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy/5 border-t border-brand-navy/10 pt-16 pb-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-brand-deep">
                rbptech
              </span>
            </Link>
            <p className="text-xs text-brand-navy/70 leading-relaxed max-w-xs">
              Empowering job seekers with Next-Gen AI compilation to bypass algorithmic gatekeepers and secure interviews faster.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/thulanesigasa" target="_blank" rel="noreferrer" className="text-brand-navy/50 hover:text-brand-indigo transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/thulanesigasa" target="_blank" rel="noreferrer" className="text-brand-navy/50 hover:text-brand-indigo transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@ptechsolutions_?_r=1&_t=ZS-96vdzKc6rO0" target="_blank" rel="noreferrer" className="text-brand-navy/50 hover:text-brand-indigo transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          {/* Links: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-brand-deep uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-brand-deep uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-brand-deep uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-brand-navy/60 hover:text-brand-indigo transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brand-navy/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-brand-navy/50 tracking-wider uppercase">
            © {currentYear} T.S Industries. All rights reserved.
          </p>
          <div className="text-[10px] text-brand-navy/40">
            Designed for the modern job seeker.
          </div>
        </div>
      </div>
    </footer>
  );
}
