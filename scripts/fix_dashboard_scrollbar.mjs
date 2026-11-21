import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

// 1. Update index.css
const indexCssPath = path.join(projectRoot, 'frontend/src/index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

const targetCss = `/* Smooth natural scrolling & layout flexibility */
html {
  scroll-behavior: smooth;
}

#live-wildlife-dashboard {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}`;

const replacementCss = `/* Smooth natural scrolling & layout flexibility */
html {
  scroll-behavior: smooth;
}

#live-wildlife-dashboard {
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: #26734D #06180E;
}

#live-wildlife-dashboard::-webkit-scrollbar {
  width: 10px;
}
#live-wildlife-dashboard::-webkit-scrollbar-track {
  background: #06180E;
}
#live-wildlife-dashboard::-webkit-scrollbar-thumb {
  background: #26734D;
  border-radius: 6px;
  border: 2px solid #06180E;
}
#live-wildlife-dashboard::-webkit-scrollbar-thumb:hover {
  background: #C8A96B;
}`;

if (indexCss.includes(targetCss)) {
  indexCss = indexCss.replace(targetCss, replacementCss);
  fs.writeFileSync(indexCssPath, indexCss, 'utf8');
  console.log('Updated index.css with high-contrast custom scrollbar and overscroll-contain.');
} else {
  console.log('targetCss not found in index.css, checking fallback...');
}

// 2. Update App.jsx
const appPath = path.join(projectRoot, 'frontend/src/App.jsx');
let appSrc = fs.readFileSync(appPath, 'utf8');

// Add useRef if missing
if (!appSrc.includes('useRef')) {
  appSrc = appSrc.replace(
    "import React, { useEffect, useState } from 'react';",
    "import React, { useEffect, useState, useRef } from 'react';"
  );
}

// Store lenis in ref and pause on modal
const lenisTarget = `  // Initialize Lenis Smooth Scroll & Synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenis.on('scroll', ScrollTrigger.update);`;

const lenisReplacement = `  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scroll & Synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);`;

if (appSrc.includes(lenisTarget)) {
  appSrc = appSrc.replace(lenisTarget, lenisReplacement);
  console.log('Updated lenisRef in App.jsx');
}

const pauseLenisBlock = `    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);`;

const pauseLenisReplacement = `    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Pause Lenis and prevent body scroll when LiveCameraPlayer modal is active
  useEffect(() => {
    if (activeModalCamera) {
      lenisRef.current?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalCamera]);`;

if (appSrc.includes(pauseLenisBlock)) {
  appSrc = appSrc.replace(pauseLenisBlock, pauseLenisReplacement);
  console.log('Added Lenis pause effect on activeModalCamera in App.jsx');
}

fs.writeFileSync(appPath, appSrc, 'utf8');

// 3. Update LiveCameraPlayer.jsx
const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
let playerSrc = fs.readFileSync(playerPath, 'utf8');

// Add createPortal import
if (!playerSrc.includes('createPortal')) {
  playerSrc = playerSrc.replace(
    "import React, { useState, useRef, useEffect, useMemo } from 'react';",
    "import React, { useState, useRef, useEffect, useMemo } from 'react';\nimport { createPortal } from 'react-dom';"
  );
  console.log('Added createPortal import to LiveCameraPlayer.jsx');
}

// Add dashboardRef and body overflow safety
const safetyTarget = `  const donationInfo = {
    animal_name: animal?.animal_name || "Royal Bengal Tiger",
    amounts: [100, 200, 500, 1000],
    amount_descriptions: {
      100: "Provides daily essential vitamins and dietary micronutrient supplements.",
      200: "Supplies natural sensory enrichment items and habitat materials.",
      500: "Supports preventative clinical wellness checkups and water analysis.",
      1000: "Sponsors comprehensive fresh nutrition and enclosure upkeep."
    }
  };

  return (
    <div 
      id="live-wildlife-dashboard"
      className="fixed inset-0 z-[100] bg-[#071D12] overflow-y-auto overflow-x-hidden scroll-smooth selection:bg-[#C8A96B] selection:text-[#071D12]"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >`;

const safetyReplacement = `  const donationInfo = {
    animal_name: animal?.animal_name || "Royal Bengal Tiger",
    amounts: [100, 200, 500, 1000],
    amount_descriptions: {
      100: "Provides daily essential vitamins and dietary micronutrient supplements.",
      200: "Supplies natural sensory enrichment items and habitat materials.",
      500: "Supports preventative clinical wellness checkups and water analysis.",
      1000: "Sponsors comprehensive fresh nutrition and enclosure upkeep."
    }
  };

  const dashboardRef = useRef(null);

  // Lock background scroll when live camera dashboard is mounted
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div 
      id="live-wildlife-dashboard"
      ref={dashboardRef}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      tabIndex={0}
      onWheel={(e) => {
        e.stopPropagation();
      }}
      className="fixed inset-0 z-[100] bg-[#071D12] overflow-y-auto overflow-x-hidden outline-none selection:bg-[#C8A96B] selection:text-[#071D12]"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >`;

if (playerSrc.includes(safetyTarget)) {
  playerSrc = playerSrc.replace(safetyTarget, safetyReplacement);
  console.log('Updated portal & scroll attributes on LiveCameraPlayer.jsx container');
} else {
  console.error('safetyTarget not found in LiveCameraPlayer.jsx');
}

// Update closing tag of return in LiveCameraPlayer.jsx
const closingTarget = `        <AnimalCareFundDetailsModal
          isOpen={isFundDetailsOpen}
          onClose={() => setIsFundDetailsOpen(false)}
          fund={walletState.fund}
          onContribute={(amt) => handleOpenContribution(amt, animal)}
        />

      </div>
    </div>
  );
}`;

const closingReplacement = `        <AnimalCareFundDetailsModal
          isOpen={isFundDetailsOpen}
          onClose={() => setIsFundDetailsOpen(false)}
          fund={walletState.fund}
          onContribute={(amt) => handleOpenContribution(amt, animal)}
        />

      </div>
    </div>,
    document.body
  );
}`;

if (playerSrc.includes(closingTarget)) {
  playerSrc = playerSrc.replace(closingTarget, closingReplacement);
  console.log('Updated portal closing tag in LiveCameraPlayer.jsx');
} else {
  console.error('closingTarget not found in LiveCameraPlayer.jsx');
}

fs.writeFileSync(playerPath, playerSrc, 'utf8');
console.log('All scrollbar fixes successfully applied.');
