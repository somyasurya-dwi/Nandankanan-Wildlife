import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function TigerCtaAndFooter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer id="cta" className="relative z-20 bg-[#EFEFEC] pt-24 pb-12 overflow-hidden border-t border-black/8">
      
      {/* Final CTA Container (Tiger sits in close-up gaze right here!) */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center mb-28">
        
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-5 h-[1.5px] bg-[#F28C1B]" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#666666]">
            DEPLOY INSTINCT
          </span>
        </div>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#111111] leading-tight mb-6">
          Ready to instinct <br />
          <span className="font-editorial italic font-normal text-[#111111]">your defence?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#555555] font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Connect your cloud and identity perimeter in under 5 minutes. Experience the unblinking watch of autonomous threat intelligence.
        </p>

        {/* Action Form */}
        <div className="max-w-md mx-auto mb-8">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-[#111111] text-white flex items-center justify-center gap-2 text-sm font-semibold shadow-lg">
              <Check className="w-4 h-4 text-[#F28C1B]" />
              <span>Invitation dispatched! Welcome to the apex hunt.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="flex-1 px-5 py-3.5 rounded-full bg-white border border-black/10 text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#F28C1B] shadow-sm"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-[#F28C1B] hover:bg-[#d9750d] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#F28C1B]/30 hover:shadow-[#F28C1B]/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Start free trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Micro Guarantee */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#777777]">
          <span>14-day full access trial</span>
          <span>•</span>
          <span>Zero agents required</span>
          <span>•</span>
          <span>Deploy in 5 minutes</span>
        </div>

      </div>

      {/* Sitemaps & Footer Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 border-t border-black/8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif font-black text-2xl tracking-[0.18em] text-[#111111] uppercase">
                TIGER
              </span>
              <span className="w-2 h-2 rounded-full bg-[#F28C1B]" />
            </div>
            <p className="text-xs text-[#666666] font-light max-w-sm leading-relaxed mb-6">
              Adaptive threat intelligence powered by autonomous predatory heuristics. Protecting hybrid infrastructure, identities, and sovereign cloud environments worldwide.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] px-2.5 py-1 rounded bg-black/5">
                SOC2 Type II
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] px-2.5 py-1 rounded bg-black/5">
                ISO 27001
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] px-2.5 py-1 rounded bg-black/5">
                GDPR
              </span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#111111] mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><a href="#features" className="hover:text-[#111111]">Surface Sensor</a></li>
              <li><a href="#features" className="hover:text-[#111111]">Predatory Heuristics</a></li>
              <li><a href="#features" className="hover:text-[#111111]">Automated Containment</a></li>
              <li><a href="#stats" className="hover:text-[#111111]">Zero-Latency Telemetry</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#111111] mb-4">
              Research
            </h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><a href="#features" className="hover:text-[#111111]">Threat Advisories</a></li>
              <li><a href="#features" className="hover:text-[#111111]">Zero-Day Disclosures</a></li>
              <li><a href="#features" className="hover:text-[#111111]">APEX Heuristic Whitepaper</a></li>
              <li><a href="#features" className="hover:text-[#111111]">Vulnerability Index</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#111111] mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#666666]">
              <li><a href="#testimonial" className="hover:text-[#111111]">About TIGER</a></li>
              <li><a href="#testimonial" className="hover:text-[#111111]">Security Leadership</a></li>
              <li><a href="#cta" className="hover:text-[#111111]">Careers</a></li>
              <li><a href="#cta" className="hover:text-[#111111]">Contact Intelligence</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-black/6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] gap-4">
          <div>
            © 2026 TIGER Intelligence Inc. Defence shaped by instinct.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#111111]">Privacy Policy</a>
            <a href="#" className="hover:text-[#111111]">Terms of Service</a>
            <a href="#" className="hover:text-[#111111]">Security Disclosures</a>
          </div>
        </div>

      </div>

    </footer>
  );
}

