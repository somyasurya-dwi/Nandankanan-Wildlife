import React from 'react';
import { Quote, ShieldCheck } from 'lucide-react';

export default function TigerTestimonialSection() {
  return (
    <section id="testimonial" className="py-28 relative z-20 overflow-hidden bg-[#EFEFEC]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Quote Mark */}
        <div className="w-12 h-12 rounded-full bg-[#111111] text-white mx-auto mb-8 flex items-center justify-center shadow-md">
          <Quote className="w-5 h-5 text-[#F28C1B]" />
        </div>

        {/* Editorial Pull Quote */}
        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#111111] leading-snug tracking-tight mb-10 max-w-4xl mx-auto">
          "TIGER doesn't just alert us to anomalies — it stalks threats across our entire multi-cloud architecture and neutralizes them before our SOC analysts even get a page. It's the first security platform that truly feels like <span className="font-editorial italic font-normal text-[#111111]">an apex instinct</span>."
        </blockquote>

        {/* Author Credential */}
        <div className="flex flex-col items-center justify-center">
          <div className="font-serif font-bold text-lg text-[#111111]">
            Marcus Vance
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#666666] font-medium mt-1">
            Chief Information Security Officer • Apex Global Financial
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[11px] text-[#444444] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F28C1B]" />
            <span>Guarding $140B in active digital assets</span>
          </div>
        </div>

      </div>
    </section>
  );
}

