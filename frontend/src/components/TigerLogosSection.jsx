import React from 'react';

export default function TigerLogosSection() {
  const logos = [
    { name: 'CROWDSTRIKE', mark: 'CS' },
    { name: 'PALO ALTO', mark: 'PA' },
    { name: 'SENTINELONE', mark: 'S1' },
    { name: 'DATADOG', mark: 'DD' },
    { name: 'SNOWFLAKE', mark: 'SF' },
    { name: 'CLOUDFLARE', mark: 'CF' },
  ];

  return (
    <section className="py-14 border-y border-black/8 bg-white/40 backdrop-blur-sm relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-[#888888] font-semibold mb-8">
          Trusted by cybersecurity & infrastructure teams at global scale
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-20 opacity-70 hover:opacity-100 transition-opacity">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-2 group cursor-default">
              <span className="w-2 h-2 rounded-sm bg-[#111111] group-hover:bg-[#F28C1B] transition-colors" />
              <span className="font-mono font-bold tracking-[0.2em] text-sm text-[#333333] group-hover:text-[#111111] transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

