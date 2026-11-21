import React from 'react';

/**
 * Realistic 3D Reaction Icons for Nandankanan Sanctuary
 * Provides premium, volumetric, richly lit 3D illustrations
 * with transparent backgrounds, specular highlights, and natural depth.
 */
export default function Realistic3DIcon({ iconKey, size = 28, className = '', effect = null }) {
  const pixelSize = typeof size === 'number' ? size : parseInt(size, 10) || 28;

  // Render the specific realistic 3D icon
  const renderIcon = () => {
    switch (iconKey) {
      /* =========================================================================
         1. SANCTUARY ANIMALS (Tiger, Lion, Elephant, Deer, Bear, Birds/Peacock)
         ========================================================================= */
      case 'tiger':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="tiger_head" cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#FFA439" />
                <stop offset="45%" stopColor="#E66700" />
                <stop offset="85%" stopColor="#A83800" />
                <stop offset="100%" stopColor="#752200" />
              </radialGradient>
              <radialGradient id="tiger_ear" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFA69E" />
                <stop offset="65%" stopColor="#E26D5C" />
                <stop offset="100%" stopColor="#9E2A2B" />
              </radialGradient>
              <radialGradient id="tiger_eye" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF275" />
                <stop offset="50%" stopColor="#FFB703" />
                <stop offset="90%" stopColor="#D48B00" />
                <stop offset="100%" stopColor="#3A1C00" />
              </radialGradient>
              <linearGradient id="tiger_muzzle" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F7F1E5" />
                <stop offset="100%" stopColor="#DDD0B8" />
              </linearGradient>
              <filter id="shadow_3d" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Ears */}
              <circle cx="15" cy="18" r="9" fill="#9E2A2B" />
              <circle cx="15" cy="18" r="6" fill="url(#tiger_ear)" />
              <path d="M10 13 Q15 9 20 15 Z" fill="#221105" />

              <circle cx="49" cy="18" r="9" fill="#9E2A2B" />
              <circle cx="49" cy="18" r="6" fill="url(#tiger_ear)" />
              <path d="M44 15 Q49 9 54 13 Z" fill="#221105" />

              {/* Head Base */}
              <circle cx="32" cy="34" r="23" fill="url(#tiger_head)" />
              <ellipse cx="32" cy="32" rx="22.5" ry="21" fill="none" stroke="#FFC97A" strokeWidth="0.8" opacity="0.6" />

              {/* Tiger Stripes */}
              <path d="M32 12 L30 19 L32 21 L34 19 Z" fill="#201108" />
              <path d="M26 14 L28 20 L25 21 Z" fill="#201108" />
              <path d="M38 14 L36 20 L39 21 Z" fill="#201108" />
              <path d="M10 30 Q17 29 19 32 Q16 34 10 33 Z" fill="#201108" />
              <path d="M54 30 Q47 29 45 32 Q48 34 54 33 Z" fill="#201108" />
              <path d="M12 36 Q19 37 20 40 Q16 41 11 39 Z" fill="#201108" />
              <path d="M52 36 Q45 37 44 40 Q48 41 53 39 Z" fill="#201108" />

              {/* White Muzzle & Whisker Pads */}
              <ellipse cx="27" cy="42" rx="7.5" ry="5.5" fill="url(#tiger_muzzle)" />
              <ellipse cx="37" cy="42" rx="7.5" ry="5.5" fill="url(#tiger_muzzle)" />
              <ellipse cx="32" cy="47" rx="5" ry="3.5" fill="url(#tiger_muzzle)" />

              {/* Eyes */}
              <ellipse cx="23" cy="29" rx="4.2" ry="4.8" fill="url(#tiger_eye)" stroke="#221105" strokeWidth="0.8" />
              <ellipse cx="41" cy="29" rx="4.2" ry="4.8" fill="url(#tiger_eye)" stroke="#221105" strokeWidth="0.8" />
              <ellipse cx="23" cy="29" rx="1.8" ry="3.8" fill="#110500" />
              <ellipse cx="41" cy="29" rx="1.8" ry="3.8" fill="#110500" />
              <circle cx="21.8" cy="27.5" r="1.3" fill="#FFFFFF" />
              <circle cx="39.8" cy="27.5" r="1.3" fill="#FFFFFF" />

              {/* Nose */}
              <path d="M29 37 Q32 36 35 37 Q33 41 32 42 Q31 41 29 37 Z" fill="#E26D5C" />
              <ellipse cx="32" cy="38" rx="2.5" ry="1.2" fill="#FFA69E" />

              {/* Mouth & Whisker Dots */}
              <path d="M32 42 L32 45 M32 45 Q28 47 25 45 M32 45 Q36 47 39 45" fill="none" stroke="#221105" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="24" cy="41" r="0.8" fill="#221105" />
              <circle cx="27" cy="43" r="0.8" fill="#221105" />
              <circle cx="40" cy="41" r="0.8" fill="#221105" />
              <circle cx="37" cy="43" r="0.8" fill="#221105" />
            </g>
          </svg>
        );

      case 'lion':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="lion_mane" cx="45%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#C47A14" />
                <stop offset="50%" stopColor="#8C4A00" />
                <stop offset="90%" stopColor="#542500" />
                <stop offset="100%" stopColor="#301200" />
              </radialGradient>
              <radialGradient id="lion_face" cx="38%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#FFD166" />
                <stop offset="60%" stopColor="#F4A261" />
                <stop offset="100%" stopColor="#C46D1E" />
              </radialGradient>
              <radialGradient id="lion_eye" cx="35%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#F9DF74" />
                <stop offset="60%" stopColor="#DDA15E" />
                <stop offset="100%" stopColor="#4A2500" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Voluminous 3D Lion Mane */}
              <circle cx="32" cy="33" r="27" fill="url(#lion_mane)" />
              <path d="M12 20 Q18 10 28 9 Q35 7 42 10 Q52 14 53 26 Q57 38 48 48 Q38 58 26 56 Q12 53 8 41 Q6 28 12 20 Z" fill="url(#lion_mane)" />
              {/* Mane Locks */}
              <path d="M15 15 Q24 20 22 28 Q13 25 15 15 Z" fill="#693003" opacity="0.6" />
              <path d="M49 15 Q40 20 42 28 Q51 25 49 15 Z" fill="#693003" opacity="0.6" />
              <path d="M8 35 Q18 36 18 42 Q9 43 8 35 Z" fill="#522300" opacity="0.7" />
              <path d="M56 35 Q46 36 46 42 Q55 43 56 35 Z" fill="#522300" opacity="0.7" />

              {/* Ears */}
              <circle cx="20" cy="18" r="5.5" fill="#C47A14" />
              <circle cx="20" cy="18" r="3.2" fill="#FFC97A" />
              <circle cx="44" cy="18" r="5.5" fill="#C47A14" />
              <circle cx="44" cy="18" r="3.2" fill="#FFC97A" />

              {/* Sculpted Face */}
              <circle cx="32" cy="35" r="17" fill="url(#lion_face)" />
              <ellipse cx="32" cy="34" rx="16.5" ry="15.5" fill="none" stroke="#FFE3A8" strokeWidth="0.8" opacity="0.6" />

              {/* Eyes */}
              <ellipse cx="25" cy="31" rx="3.5" ry="4" fill="url(#lion_eye)" stroke="#381D00" strokeWidth="0.7" />
              <ellipse cx="39" cy="31" rx="3.5" ry="4" fill="url(#lion_eye)" stroke="#381D00" strokeWidth="0.7" />
              <circle cx="25" cy="31" r="1.8" fill="#1C0E00" />
              <circle cx="39" cy="31" r="1.8" fill="#1C0E00" />
              <circle cx="24.2" cy="29.8" r="1.1" fill="#FFFFFF" />
              <circle cx="38.2" cy="29.8" r="1.1" fill="#FFFFFF" />

              {/* Broad Lion Nose */}
              <path d="M29 37 Q32 36 35 37 L34 41 Q32 42.5 30 41 Z" fill="#602804" />
              <ellipse cx="32" cy="38" rx="2.5" ry="1.2" fill="#8F3F08" />

              {/* Muzzle */}
              <ellipse cx="28" cy="44" rx="5.5" ry="4" fill="#FFF2DC" />
              <ellipse cx="36" cy="44" rx="5.5" ry="4" fill="#FFF2DC" />
              <path d="M32 42 L32 45 Q32 47 29 47 M32 45 Q32 47 35 47" fill="none" stroke="#381D00" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'elephant':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="ele_body" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#A8B2C1" />
                <stop offset="50%" stopColor="#6C7A89" />
                <stop offset="90%" stopColor="#45505C" />
                <stop offset="100%" stopColor="#2A323A" />
              </radialGradient>
              <radialGradient id="ele_ear_pink" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFC2D1" />
                <stop offset="70%" stopColor="#E898AC" />
                <stop offset="100%" stopColor="#A05A6B" />
              </radialGradient>
              <linearGradient id="tusk" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="80%" stopColor="#FFF8E7" />
                <stop offset="100%" stopColor="#E2D4B7" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Big 3D Flapping Ears */}
              <ellipse cx="14" cy="30" rx="12" ry="16" fill="url(#ele_body)" />
              <ellipse cx="15" cy="30" rx="8" ry="11" fill="url(#ele_ear_pink)" opacity="0.85" />

              <ellipse cx="50" cy="30" rx="12" ry="16" fill="url(#ele_body)" />
              <ellipse cx="49" cy="30" rx="8" ry="11" fill="url(#ele_ear_pink)" opacity="0.85" />

              {/* Head */}
              <circle cx="32" cy="30" r="19" fill="url(#ele_body)" />
              <ellipse cx="32" cy="28" rx="18.5" ry="17.5" fill="none" stroke="#C2CBD6" strokeWidth="0.8" opacity="0.6" />

              {/* Gleaming White Tusks */}
              <path d="M22 38 Q20 48 15 50 Q22 45 25 39 Z" fill="url(#tusk)" stroke="#D4C5A5" strokeWidth="0.5" />
              <path d="M42 38 Q44 48 49 50 Q42 45 39 39 Z" fill="url(#tusk)" stroke="#D4C5A5" strokeWidth="0.5" />

              {/* Curled Trunk */}
              <path d="M28 34 Q26 44 28 50 Q30 55 35 55 Q40 54 41 49 Q41 45 37 45 Q34 46 34 49" fill="none" stroke="url(#ele_body)" strokeWidth="8.5" strokeLinecap="round" />
              <path d="M29 37 Q28 42 29 46 M29 42 Q30 45 32 47" fill="none" stroke="#909DAE" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

              {/* Eyes */}
              <circle cx="23" cy="25" r="3.2" fill="#20252A" />
              <circle cx="41" cy="25" r="3.2" fill="#20252A" />
              <circle cx="22.2" cy="24" r="1.1" fill="#FFFFFF" />
              <circle cx="40.2" cy="24" r="1.1" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'deer':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="deer_fur" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#E59850" />
                <stop offset="60%" stopColor="#C46820" />
                <stop offset="100%" stopColor="#7E3708" />
              </radialGradient>
              <linearGradient id="deer_antler" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D8B18A" />
                <stop offset="50%" stopColor="#A46E43" />
                <stop offset="100%" stopColor="#5E381C" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Branching 3D Antlers */}
              <path d="M22 20 Q16 12 10 10 M17 14 Q12 18 10 22 M21 16 Q18 8 20 4 M20 10 Q26 8 28 5" fill="none" stroke="url(#deer_antler)" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M42 20 Q48 12 54 10 M47 14 Q52 18 54 22 M43 16 Q46 8 44 4 M44 10 Q38 8 36 5" fill="none" stroke="url(#deer_antler)" strokeWidth="2.6" strokeLinecap="round" />

              {/* Ears */}
              <ellipse cx="14" cy="25" rx="6.5" ry="12" transform="rotate(-35 14 25)" fill="url(#deer_fur)" />
              <ellipse cx="15" cy="25" rx="3.5" ry="8" transform="rotate(-35 15 25)" fill="#FEE5D8" />
              <ellipse cx="50" cy="25" rx="6.5" ry="12" transform="rotate(35 50 25)" fill="url(#deer_fur)" />
              <ellipse cx="49" cy="25" rx="3.5" ry="8" transform="rotate(35 49 25)" fill="#FEE5D8" />

              {/* Deer Head */}
              <ellipse cx="32" cy="37" rx="15" ry="17" fill="url(#deer_fur)" />
              <ellipse cx="32" cy="35" rx="14.5" ry="16.5" fill="none" stroke="#FFD1A4" strokeWidth="0.8" opacity="0.6" />

              {/* Chital White Rosettes / Spots */}
              <circle cx="24" cy="30" r="1.3" fill="#FFFFFF" opacity="0.85" />
              <circle cx="28" cy="28" r="1.3" fill="#FFFFFF" opacity="0.85" />
              <circle cx="36" cy="28" r="1.3" fill="#FFFFFF" opacity="0.85" />
              <circle cx="40" cy="30" r="1.3" fill="#FFFFFF" opacity="0.85" />
              <circle cx="22" cy="35" r="1.2" fill="#FFFFFF" opacity="0.85" />
              <circle cx="42" cy="35" r="1.2" fill="#FFFFFF" opacity="0.85" />

              {/* Eyes */}
              <ellipse cx="23" cy="32" rx="3.8" ry="4.2" fill="#1C1005" />
              <ellipse cx="41" cy="32" rx="3.8" ry="4.2" fill="#1C1005" />
              <circle cx="22" cy="30.5" r="1.4" fill="#FFFFFF" />
              <circle cx="40" cy="30.5" r="1.4" fill="#FFFFFF" />

              {/* White Muzzle & Dark Nose */}
              <ellipse cx="32" cy="46" rx="8" ry="6.5" fill="#FFF4EA" />
              <ellipse cx="32" cy="43.5" rx="3.2" ry="2" fill="#201108" />
              <path d="M32 45.5 L32 48" stroke="#201108" strokeWidth="1" />
            </g>
          </svg>
        );

      case 'bear':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="bear_fur" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#4A3B32" />
                <stop offset="50%" stopColor="#2B1E16" />
                <stop offset="90%" stopColor="#190F0A" />
                <stop offset="100%" stopColor="#0B0604" />
              </radialGradient>
              <radialGradient id="bear_muzzle" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FDE2B8" />
                <stop offset="65%" stopColor="#E0B678" />
                <stop offset="100%" stopColor="#AF8341" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Rounded Shaggy Ears */}
              <circle cx="16" cy="18" r="8" fill="url(#bear_fur)" />
              <circle cx="16" cy="18" r="4.5" fill="#805B43" />
              <circle cx="48" cy="18" r="8" fill="url(#bear_fur)" />
              <circle cx="48" cy="18" r="4.5" fill="#805B43" />

              {/* Head */}
              <circle cx="32" cy="34" r="21" fill="url(#bear_fur)" />
              <ellipse cx="32" cy="33" rx="20.5" ry="19.5" fill="none" stroke="#755643" strokeWidth="0.8" opacity="0.6" />

              {/* Sloth Bear Cream/Tan Muzzle */}
              <ellipse cx="32" cy="42" rx="10.5" ry="8.5" fill="url(#bear_muzzle)" />
              
              {/* Button Leathery Nose */}
              <path d="M28 38.5 Q32 37.5 36 38.5 Q34 42 32 43 Q30 42 28 38.5 Z" fill="#0E0805" />
              <ellipse cx="32" cy="39.2" rx="2.8" ry="1.2" fill="#3D291D" />

              {/* Eyes */}
              <circle cx="23" cy="29" r="3.2" fill="#120A06" />
              <circle cx="41" cy="29" r="3.2" fill="#120A06" />
              <circle cx="22.2" cy="28" r="1.1" fill="#FFFFFF" />
              <circle cx="40.2" cy="28" r="1.1" fill="#FFFFFF" />

              {/* Mouth */}
              <path d="M32 43 L32 46 M32 46 Q28 48 26 46 M32 46 Q36 48 38 46" fill="none" stroke="#1C1008" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'peacock':
      case 'bird':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="peacock_neck" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#00C4CC" />
                <stop offset="45%" stopColor="#0077B6" />
                <stop offset="85%" stopColor="#023E8A" />
                <stop offset="100%" stopColor="#001845" />
              </radialGradient>
              <linearGradient id="crest_gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#D4A373" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Majestic 3D Fan Crest Feathers */}
              <path d="M32 20 L24 8 M32 20 L28 6 M32 20 L32 5 M32 20 L36 6 M32 20 L40 8" stroke="#0077B6" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="24" cy="8" r="2.8" fill="url(#crest_gold)" stroke="#0077B6" strokeWidth="0.8" />
              <circle cx="28" cy="6" r="2.8" fill="url(#crest_gold)" stroke="#0077B6" strokeWidth="0.8" />
              <circle cx="32" cy="5" r="3.2" fill="url(#crest_gold)" stroke="#0077B6" strokeWidth="0.8" />
              <circle cx="36" cy="6" r="2.8" fill="url(#crest_gold)" stroke="#0077B6" strokeWidth="0.8" />
              <circle cx="40" cy="8" r="2.8" fill="url(#crest_gold)" stroke="#0077B6" strokeWidth="0.8" />

              {/* Sleek Royal Head & Graceful Neck */}
              <ellipse cx="32" cy="30" rx="14" ry="16" fill="url(#peacock_neck)" />
              <ellipse cx="32" cy="29" rx="13.5" ry="15.5" fill="none" stroke="#72EFDD" strokeWidth="0.8" opacity="0.6" />

              {/* White Orbital Markings */}
              <ellipse cx="26" cy="27" rx="4.5" ry="3.5" fill="#FFFFFF" />
              <ellipse cx="38" cy="27" rx="4.5" ry="3.5" fill="#FFFFFF" />

              {/* Eyes */}
              <circle cx="26" cy="27" r="2.4" fill="#001845" />
              <circle cx="38" cy="27" r="2.4" fill="#001845" />
              <circle cx="25.2" cy="26.2" r="0.9" fill="#FFFFFF" />
              <circle cx="37.2" cy="26.2" r="0.9" fill="#FFFFFF" />

              {/* Golden Curved Beak */}
              <path d="M29 33 Q32 30 35 33 L32 44 Z" fill="#FFC300" stroke="#CC8B00" strokeWidth="0.6" />
              <path d="M29 33 Q32 34 35 33" stroke="#996500" strokeWidth="0.8" />
            </g>
          </svg>
        );

      /* =========================================================================
         2. HEARTS & LOVE (Red Love, Green Support, Heart Hands, Heart Eyes)
         ========================================================================= */
      case 'heart_red':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="heart_red_grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="30%" stopColor="#E60039" />
                <stop offset="75%" stopColor="#A70028" />
                <stop offset="100%" stopColor="#590015" />
              </radialGradient>
              <linearGradient id="heart_shine" x1="0%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              <path d="M32 54 C16 42 6 31 6 19 C6 10.5 12.5 4 21 4 C26 4 30 7 32 10.5 C34 7 38 4 43 4 C51.5 4 58 10.5 58 19 C58 31 48 42 32 54 Z" fill="url(#heart_red_grad)" />
              {/* Glossy Specular Reflection */}
              <ellipse cx="20" cy="14" rx="7" ry="4" transform="rotate(-30 20 14)" fill="url(#heart_shine)" />
            </g>
          </svg>
        );

      case 'heart_green':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="heart_green_grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="35%" stopColor="#10B981" />
                <stop offset="75%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              <path d="M32 54 C16 42 6 31 6 19 C6 10.5 12.5 4 21 4 C26 4 30 7 32 10.5 C34 7 38 4 43 4 C51.5 4 58 10.5 58 19 C58 31 48 42 32 54 Z" fill="url(#heart_green_grad)" />
              <ellipse cx="20" cy="14" rx="7" ry="4" transform="rotate(-30 20 14)" fill="#FFFFFF" opacity="0.6" />
            </g>
          </svg>
        );

      case 'heart_eyes':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="emoji_gold" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="50%" stopColor="#FFB703" />
                <stop offset="85%" stopColor="#FB8500" />
                <stop offset="100%" stopColor="#C05621" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              <circle cx="32" cy="32" r="25" fill="url(#emoji_gold)" />
              <ellipse cx="32" cy="30" rx="24.5" ry="23.5" fill="none" stroke="#FFF3B0" strokeWidth="0.8" opacity="0.6" />

              {/* Left Heart Eye */}
              <g transform="translate(14, 18) scale(0.38)">
                <path d="M32 54 C16 42 6 31 6 19 C6 10.5 12.5 4 21 4 C26 4 30 7 32 10.5 C34 7 38 4 43 4 C51.5 4 58 10.5 58 19 C58 31 48 42 32 54 Z" fill="#E60039" />
              </g>

              {/* Right Heart Eye */}
              <g transform="translate(32, 18) scale(0.38)">
                <path d="M32 54 C16 42 6 31 6 19 C6 10.5 12.5 4 21 4 C26 4 30 7 32 10.5 C34 7 38 4 43 4 C51.5 4 58 10.5 58 19 C58 31 48 42 32 54 Z" fill="#E60039" />
              </g>

              {/* Big Joyful Smile */}
              <path d="M20 38 Q32 52 44 38 Q32 44 20 38 Z" fill="#4A1E00" />
              <path d="M26 43 Q32 49 38 43 Q32 47 26 43 Z" fill="#FF5C8A" />
            </g>
          </svg>
        );

      case 'cute_face':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <g filter="url(#shadow_3d)">
              <circle cx="32" cy="32" r="25" fill="url(#emoji_gold)" />
              
              {/* Happy Upturned Eyes */}
              <path d="M20 28 Q24 23 28 28" fill="none" stroke="#4A1E00" strokeWidth="3" strokeLinecap="round" />
              <path d="M36 28 Q40 23 44 28" fill="none" stroke="#4A1E00" strokeWidth="3" strokeLinecap="round" />

              {/* Rosy Blushing Cheeks */}
              <circle cx="18" cy="35" r="5" fill="#FF6B6B" opacity="0.65" />
              <circle cx="46" cy="35" r="5" fill="#FF6B6B" opacity="0.65" />

              {/* Sweet Smile */}
              <path d="M27 38 Q32 44 37 38" fill="none" stroke="#4A1E00" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'heart_hands':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <linearGradient id="skin_tone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFDFBA" />
                <stop offset="60%" stopColor="#E2A76F" />
                <stop offset="100%" stopColor="#B36B34" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* 3D Hands joining to form heart shape */}
              <path d="M12 44 Q10 32 18 24 Q24 18 32 28 Q40 18 46 24 Q54 32 52 44 Q48 50 32 54 Q16 50 12 44 Z" fill="none" stroke="url(#skin_tone)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Inner Radiant Heart */}
              <path d="M32 46 C24 40 19 34 19 28 C19 24 22 21 26 21 C29 21 31 23 32 25 C33 23 35 21 38 21 C42 21 45 24 45 28 C45 34 40 40 32 46 Z" fill="#FF4D6D" opacity="0.75" />
            </g>
          </svg>
        );

      /* =========================================================================
         3. NATURE, FOREST & WATER (Leaf, Tree, Water Drop, Butterfly, Flower)
         ========================================================================= */
      case 'leaf':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="leaf_grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="50%" stopColor="#2D6A4F" />
                <stop offset="90%" stopColor="#1B4332" />
                <stop offset="100%" stopColor="#081C15" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Botanical Leaf */}
              <path d="M12 52 Q18 24 48 10 Q54 38 34 48 Q22 54 12 52 Z" fill="url(#leaf_grad)" />
              {/* Veins */}
              <path d="M14 50 Q28 36 46 12" stroke="#74C69D" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M26 38 Q32 32 38 34" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
              <path d="M32 30 Q38 24 44 26" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
              
              {/* 3D Dewdrop */}
              <circle cx="28" cy="28" r="4.5" fill="#A7F3D0" opacity="0.85" />
              <circle cx="27" cy="26.5" r="1.5" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'tree':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="tree_canopy" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="55%" stopColor="#2D6A4F" />
                <stop offset="100%" stopColor="#081C15" />
              </radialGradient>
              <linearGradient id="tree_trunk" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8C5322" />
                <stop offset="100%" stopColor="#432818" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Trunk */}
              <path d="M28 38 L26 56 Q32 58 38 56 L36 38 Z" fill="url(#tree_trunk)" />
              {/* Canopy Tufts */}
              <circle cx="32" cy="24" r="16" fill="url(#tree_canopy)" />
              <circle cx="22" cy="30" r="12" fill="url(#tree_canopy)" />
              <circle cx="42" cy="30" r="12" fill="url(#tree_canopy)" />
              <circle cx="32" cy="18" r="11" fill="#74C69D" opacity="0.6" />
            </g>
          </svg>
        );

      case 'water_drop':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="drop_grad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#A0E7E5" />
                <stop offset="45%" stopColor="#00B4D8" />
                <stop offset="85%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#023E8A" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              <path d="M32 6 C32 6 12 32 12 42 C12 53 21 58 32 58 C43 58 52 53 52 42 C52 32 32 6 32 6 Z" fill="url(#drop_grad)" />
              {/* Curved Glint */}
              <ellipse cx="25" cy="38" rx="5" ry="11" transform="rotate(-25 25 38)" fill="#FFFFFF" opacity="0.65" />
              <circle cx="38" cy="46" r="3" fill="#FFFFFF" opacity="0.4" />
            </g>
          </svg>
        );

      case 'cherry_blossom':
      case 'flower':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="petal_pink" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF0F5" />
                <stop offset="50%" stopColor="#FFB7C5" />
                <stop offset="85%" stopColor="#FF6B8B" />
                <stop offset="100%" stopColor="#D9385C" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* 5 Petals */}
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <path
                  key={i}
                  d="M32 32 Q24 16 32 8 Q40 16 32 32 Z"
                  fill="url(#petal_pink)"
                  transform={`rotate(${angle} 32 32)`}
                />
              ))}
              {/* Golden Center */}
              <circle cx="32" cy="32" r="5" fill="#FFE066" stroke="#D4A373" strokeWidth="0.8" />
              <circle cx="32" cy="32" r="2.5" fill="#E76F51" />
            </g>
          </svg>
        );

      case 'butterfly':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="wing_blue" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#00F5D4" />
                <stop offset="40%" stopColor="#00BBF9" />
                <stop offset="85%" stopColor="#4361EE" />
                <stop offset="100%" stopColor="#1D2A44" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Left Upper Wing */}
              <path d="M30 30 Q16 12 8 20 Q4 32 28 34 Z" fill="url(#wing_blue)" />
              {/* Left Lower Wing */}
              <path d="M30 34 Q14 36 12 46 Q20 54 30 38 Z" fill="url(#wing_blue)" />
              {/* Right Upper Wing */}
              <path d="M34 30 Q48 12 56 20 Q60 32 36 34 Z" fill="url(#wing_blue)" />
              {/* Right Lower Wing */}
              <path d="M34 34 Q50 36 52 46 Q44 54 34 38 Z" fill="url(#wing_blue)" />

              {/* Butterfly Body */}
              <ellipse cx="32" cy="34" rx="2.5" ry="12" fill="#1A1A24" />
              {/* Antennae */}
              <path d="M32 23 Q27 15 25 14 M32 23 Q37 15 39 14" stroke="#1A1A24" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rainbow':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <g filter="url(#shadow_3d)">
              <path d="M10 46 A24 24 0 0 1 54 46" fill="none" stroke="#FF4D6D" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M13 46 A21 21 0 0 1 51 46" fill="none" stroke="#FFA200" strokeWidth="3.2" />
              <path d="M16 46 A18 18 0 0 1 48 46" fill="none" stroke="#FFDE59" strokeWidth="3.2" />
              <path d="M19 46 A15 15 0 0 1 45 46" fill="none" stroke="#70E000" strokeWidth="3.2" />
              <path d="M22 46 A12 12 0 0 1 42 46" fill="none" stroke="#00BA88" strokeWidth="3.2" />
              <path d="M25 46 A9 9 0 0 1 39 46" fill="none" stroke="#7209B7" strokeWidth="3.2" />
              
              {/* 3D Puffy Cloud Bases */}
              <ellipse cx="14" cy="46" rx="7" ry="5" fill="#FFFFFF" />
              <circle cx="11" cy="44" r="4.5" fill="#F0F4F8" />
              <ellipse cx="50" cy="46" rx="7" ry="5" fill="#FFFFFF" />
              <circle cx="53" cy="44" r="4.5" fill="#F0F4F8" />
            </g>
          </svg>
        );

      /* =========================================================================
         4. NOURISHMENT, REWARDS & CHEERS (Meat, Honey, Paw, Fire, Crown, Applause, Sparkles)
         ========================================================================= */
      case 'paw':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="paw_gold" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#DFCA98" />
                <stop offset="45%" stopColor="#C8A96B" />
                <stop offset="85%" stopColor="#8A6828" />
                <stop offset="100%" stopColor="#4A340C" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Main Heel Pad */}
              <path d="M22 42 C20 34 26 30 32 30 C38 30 44 34 42 42 C40 48 36 50 32 50 C28 50 24 48 22 42 Z" fill="url(#paw_gold)" />
              {/* 4 Toe Pads */}
              <ellipse cx="16" cy="27" rx="4.5" ry="6" transform="rotate(-30 16 27)" fill="url(#paw_gold)" />
              <ellipse cx="26" cy="20" rx="4.8" ry="6.5" transform="rotate(-10 26 20)" fill="url(#paw_gold)" />
              <ellipse cx="38" cy="20" rx="4.8" ry="6.5" transform="rotate(10 38 20)" fill="url(#paw_gold)" />
              <ellipse cx="48" cy="27" rx="4.5" ry="6" transform="rotate(30 48 27)" fill="url(#paw_gold)" />
            </g>
          </svg>
        );

      case 'meat':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="meat_red" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="50%" stopColor="#C9184A" />
                <stop offset="90%" stopColor="#800F2F" />
                <stop offset="100%" stopColor="#590D22" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Marble Fat Border */}
              <path d="M16 24 C14 12 36 8 46 16 C56 24 58 44 44 50 C32 56 18 50 14 38 Z" fill="#FFF0F3" stroke="#FFB3C1" strokeWidth="1.5" />
              {/* Succulent Meat Core */}
              <path d="M19 25 C17 15 35 12 43 18 C51 24 53 41 41 46 C30 51 20 46 17 36 Z" fill="url(#meat_red)" />
              {/* Marbled Fat Striations */}
              <path d="M26 22 Q32 26 30 32 M36 24 Q42 30 40 38" stroke="#FFF0F3" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
              {/* Bone Ring */}
              <circle cx="28" cy="30" r="4.8" fill="#FFFFFF" stroke="#E2D4B7" strokeWidth="1" />
              <circle cx="28" cy="30" r="2.2" fill="#800F2F" />
            </g>
          </svg>
        );

      case 'honey_pot':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="pot_clay" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E07A5F" />
                <stop offset="60%" stopColor="#C44536" />
                <stop offset="100%" stopColor="#772E25" />
              </radialGradient>
              <radialGradient id="honey_gold" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="55%" stopColor="#F4A261" />
                <stop offset="100%" stopColor="#E76F51" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Clay Pot */}
              <ellipse cx="32" cy="18" rx="14" ry="4" fill="#A83226" />
              <path d="M18 18 Q12 34 16 48 Q20 54 32 54 Q44 54 48 48 Q52 34 46 18 Z" fill="url(#pot_clay)" />
              <ellipse cx="32" cy="17" rx="13.5" ry="3.5" fill="none" stroke="#F4A261" strokeWidth="0.8" opacity="0.6" />

              {/* Dripping Amber Honey */}
              <path d="M19 18 Q25 24 30 20 Q35 26 38 18 Q41 22 45 18 L46 22 Q42 27 38 24 Q36 32 32 32 Q28 32 26 24 Q22 28 18 22 Z" fill="url(#honey_gold)" />
              <circle cx="32" cy="35" r="2" fill="url(#honey_gold)" />

              {/* Dipper Stick */}
              <line x1="42" y1="10" x2="34" y2="24" stroke="#DDA15E" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'fire':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="fire_outer" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#FFBA08" />
                <stop offset="40%" stopColor="#F48C06" />
                <stop offset="75%" stopColor="#DC2F02" />
                <stop offset="100%" stopColor="#6A040F" />
              </radialGradient>
              <radialGradient id="fire_inner" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FFEE8C" />
                <stop offset="100%" stopColor="#FF9E00" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Outer Volumetric Flame */}
              <path d="M32 6 C32 6 46 22 46 36 C46 47 38 56 32 56 C26 56 18 47 18 36 C18 24 28 18 28 18 C28 18 26 26 30 28 C34 30 36 24 32 6 Z" fill="url(#fire_outer)" />
              {/* Inner Hot Core */}
              <path d="M32 26 C32 26 40 35 40 43 C40 49 36 53 32 53 C28 53 24 49 24 43 C24 37 30 33 30 33 C30 33 29 38 31 39 C33 40 34 37 32 26 Z" fill="url(#fire_inner)" />
            </g>
          </svg>
        );

      case 'crown':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="crown_gold" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF3B0" />
                <stop offset="40%" stopColor="#FFD166" />
                <stop offset="80%" stopColor="#E09F3E" />
                <stop offset="100%" stopColor="#9E2A2B" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* 3D Imperial Gold Crown */}
              <path d="M10 24 L18 46 L46 46 L54 24 L42 34 L32 14 L22 34 Z" fill="url(#crown_gold)" stroke="#FFD166" strokeWidth="1" strokeLinejoin="round" />
              {/* Crown Base Rim */}
              <rect x="16" y="44" width="32" height="6" rx="3" fill="#D48B00" stroke="#FFE3A8" strokeWidth="0.8" />
              {/* Jewels */}
              <circle cx="22" cy="47" r="2.2" fill="#E60039" />
              <circle cx="32" cy="47" r="2.4" fill="#00B4D8" />
              <circle cx="42" cy="47" r="2.2" fill="#10B981" />
              {/* Scepter Pearls on Peaks */}
              <circle cx="10" cy="24" r="2.5" fill="#FFF8E7" />
              <circle cx="32" cy="14" r="3" fill="#FFF8E7" />
              <circle cx="54" cy="24" r="2.5" fill="#FFF8E7" />
            </g>
          </svg>
        );

      case 'applause':
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <linearGradient id="clap_skin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFDFBA" />
                <stop offset="70%" stopColor="#E2A76F" />
                <stop offset="100%" stopColor="#9C5221" />
              </linearGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Left Hand */}
              <path d="M22 28 C20 22 26 16 30 20 L35 28 L28 40 L20 36 Z" fill="url(#clap_skin)" transform="rotate(-15 25 30)" />
              {/* Right Hand */}
              <path d="M42 28 C44 22 38 16 34 20 L29 28 L36 40 L44 36 Z" fill="url(#clap_skin)" transform="rotate(15 39 30)" />
              {/* Impact Sparks */}
              <path d="M32 14 L32 8 M24 16 L18 12 M40 16 L46 12" stroke="#FFD166" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'sparkles':
      default:
        return (
          <svg viewBox="0 0 64 64" width={pixelSize} height={pixelSize} className="overflow-visible">
            <defs>
              <radialGradient id="star_gold" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFE066" />
                <stop offset="80%" stopColor="#F4A261" />
                <stop offset="100%" stopColor="#E76F51" />
              </radialGradient>
            </defs>
            <g filter="url(#shadow_3d)">
              {/* Large Central 4-Point Star */}
              <path d="M32 6 Q32 28 10 32 Q32 32 32 54 Q32 32 54 32 Q32 28 32 6 Z" fill="url(#star_gold)" />
              {/* Satellite Small Stars */}
              <path d="M16 12 Q16 18 10 20 Q16 20 16 26 Q16 20 22 20 Q16 18 16 12 Z" fill="#FFE066" />
              <path d="M48 40 Q48 46 42 48 Q48 48 48 54 Q48 48 54 48 Q48 46 48 40 Z" fill="#FFE066" />
            </g>
          </svg>
        );
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 transition-transform duration-200 select-none ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
    >
      {renderIcon()}
    </span>
  );
}
