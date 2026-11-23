import React, { useEffect, useState, useRef } from 'react';

export default function DonationCelebrationBanner({
  donation,
  onDismiss
}) {
  const [particles, setParticles] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!donation) return;

    setIsFadingOut(false);

    // Spawn subtle floating celebratory particles (hearts, paw prints, sparkles)
    const newParticles = [];
    const emojis = ['❤️', '🐾', '🌿', '🎉', '💖', '🦚'];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: 'cp_' + Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: 20 + Math.random() * 60, // 20% to 80% horizontal spread
        duration: 1.4 + Math.random() * 0.4,
        driftX: (Math.random() - 0.5) * 80,
        rotation: (Math.random() - 0.5) * 45,
        scale: 0.8 + Math.random() * 0.6
      });
    }
    setParticles(newParticles);

    // Fade out gracefully before disappearance at 2s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1700);

    // Auto dismiss after exactly 2 seconds as requested (stable across parent re-renders)
    const timer = setTimeout(() => {
      if (onDismissRef.current) onDismissRef.current();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(timer);
    };
  }, [donation]);

  if (!donation) return null;

  const donorName = donation.display_donor_name || (donation.is_anonymous ? 'Anonymous Wildlife Friend' : donation.donor_name);

  return (
    <>
      {/* Floating Celebratory Particles Layer */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-35 select-none transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.left}%`,
              bottom: '80px',
              fontSize: `${Math.round(26 * p.scale)}px`,
              animation: `floatUpWobble ${p.duration}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
              '--drift-x': `${p.driftX}px`,
              '--rotation': `${p.rotation}deg`,
              '--distance-y': '-260px'
            }}
            className="absolute pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] will-change-transform animate-floatUpWobble"
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Temporary Donor Appreciation Banner (Positioned gracefully near top of player) */}
      <div className={`absolute top-14 inset-x-3 sm:inset-x-8 z-40 flex justify-center pointer-events-none select-none transition-all duration-300 ${isFadingOut ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-md w-full bg-gradient-to-r from-[#071D12]/95 via-[#0B2A1A]/95 to-[#071D12]/95 border-2 border-[#C8A96B] rounded-2xl p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl pointer-events-auto animate-toastSlideIn flex items-center gap-3 text-[#F5F4EA]">
          
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-[#14532D] border border-emerald-400/60 flex items-center justify-center text-white shadow-md shrink-0 text-lg">
              {donation.animal_emoji || '🐾'}
            </div>

            <div className="min-w-0 truncate flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold font-serif text-[#C8A96B] truncate">
                  Thank You, {donorName}!
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-300 font-mono font-bold text-[10px]">
                  +₹{donation.amount}
                </span>
              </div>

              <p className="text-[11px] text-white/90 truncate leading-tight">
                Contributed to approved nutrition for <strong>{donation.animal_name}</strong>
              </p>

              {donation.personal_message && (
                <p className="text-[10px] text-[#A7D7A9] italic truncate mt-0.5">
                  "{donation.personal_message}"
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
