import fs from 'fs';
import path from 'path';

// 1. Update LiveCameraPlayer.jsx
const p1 = 'c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife/frontend/src/components/LiveCameraPlayer.jsx';
let content = fs.readFileSync(p1, 'utf8');

// A. Remove countdown timer effect and duplicate handlers (lines 446-513)
const effectIdx = content.indexOf('  useEffect(() => {\n    if (isSubscribed) return;');
const syncIdx = content.indexOf('  // Clock & Sync Timer');
if (effectIdx !== -1 && syncIdx !== -1) {
  content = content.slice(0, effectIdx) + content.slice(syncIdx);
  console.log('[PASS] Removed countdown timer effect from LiveCameraPlayer');
}

// B. Remove togglePlay restriction
const oldToggle = `    // If user is not subscribed and preview has expired, block playback & show subscription modal
    if (!isSubscribed && remainingSeconds <= 0) {
      setShowSubscriptionModal(true);
      return;
    }
`;
if (content.includes(oldToggle)) {
  content = content.replace(oldToggle, '');
  console.log('[PASS] Removed togglePlay restriction');
}

// C. Replace top badge (countdown badge)
const badgeStart = content.indexOf('{/* 10-Second Free Preview Countdown Timer / VIP Unlimited Badge */}');
if (badgeStart !== -1) {
  const badgeEnd = content.indexOf('</div>\n            </div>\n\n            {/* Top-Right Technical Resolution');
  if (badgeEnd !== -1) {
    const replacementBadge = `{/* Continuous Live Stream Badge */}
              <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono text-emerald-300 font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Continuous Live Stream</span>
              </div>`;
    content = content.slice(0, badgeStart) + replacementBadge + '\n            ' + content.slice(badgeEnd);
    console.log('[PASS] Replaced top countdown badge with live stream badge');
  }
}

// D. Remove locked screen overlay
const lockStart = content.indexOf('{/* Locked Screen Overlay after 10-Second Free Preview finishes */}');
if (lockStart !== -1) {
  const lockEnd = content.indexOf('{/* Floating Multi-Particle Reactions Layer */}');
  if (lockEnd !== -1) {
    content = content.slice(0, lockStart) + content.slice(lockEnd);
    console.log('[PASS] Removed locked screen overlay');
  }
}

// E. Remove SubscriptionModal rendering
const modalStart = content.indexOf('{/* SUBSCRIPTION MODAL POPUP (10-Second Free Preview Limit / ₹100 Subscription) */}');
if (modalStart !== -1) {
  const modalEnd = content.indexOf('{/* WILDLIFE WALLET & ANIMAL CONTRIBUTION MODALS */}');
  if (modalEnd !== -1) {
    content = content.slice(0, modalStart) + content.slice(modalEnd);
    console.log('[PASS] Removed SubscriptionModal rendering');
  }
}

fs.writeFileSync(p1, content, 'utf8');

// 2. Update LiveStreaming.jsx
const p2 = 'c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife/frontend/src/components/LiveStreaming.jsx';
let content2 = fs.readFileSync(p2, 'utf8');

// Header pill replacement
const subHeaderStart = content2.indexOf('{isSubscribed ? (');
const subHeaderEnd = content2.indexOf('{/* Demo Mode Notice Banner */}');
if (subHeaderStart !== -1 && subHeaderEnd !== -1) {
  const newHeaderPill = `<div className="bg-[#14532D]/80 border border-[#C8A96B]/50 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-[#C8A96B] font-bold font-mono backdrop-blur-md shadow-lg shadow-[#C8A96B]/20">
              <Sparkles className="w-4 h-4 text-[#C8A96B]" />
              <span>Free Unrestricted Live Streaming Active</span>
            </div>
          </div>
        </div>

        `;
  const beforeHeader = content2.slice(0, subHeaderStart);
  content2 = beforeHeader + newHeaderPill + content2.slice(subHeaderEnd);
  console.log('[PASS] Updated LiveStreaming header pill');
}

// Card pill replacement
const cardPillStart = content2.indexOf('{isSubscribed ? (');
if (cardPillStart !== -1) {
  const cardPillEnd = content2.indexOf('</div>\n                  </div>\n\n                  {/* Card Content & Sanctuary Metadata */}', cardPillStart);
  if (cardPillEnd !== -1) {
    const newCardPill = `<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/40 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>LIVE STREAM</span>
                    </span>`;
    content2 = content2.slice(0, cardPillStart) + newCardPill + '\n                  ' + content2.slice(cardPillEnd);
    console.log('[PASS] Updated LiveStreaming card pill');
  }
}

fs.writeFileSync(p2, content2, 'utf8');
console.log('SUCCESS: All subscription limits and popups deleted cleanly!');
