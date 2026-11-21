/**
 * Web Audio API based bio-acoustic sound engine for Nandankanan wildlife.
 * Generates realistic animal vocalizations and ambient sanctuary acoustics.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTigerRoar() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Master gain
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.7, now + 0.3);
  master.gain.exponentialRampToValueAtTime(0.4, now + 1.2);
  master.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
  master.connect(ctx.destination);

  // Low guttural oscillator
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(85, now);
  osc1.frequency.exponentialRampToValueAtTime(60, now + 0.6);
  osc1.frequency.exponentialRampToValueAtTime(45, now + 1.8);
  osc1.frequency.linearRampToValueAtTime(35, now + 2.5);

  // Roar modulation (growl)
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();
  mod.frequency.value = 28; // growl rate
  modGain.gain.value = 25;
  mod.connect(osc1.frequency);
  mod.start(now);
  mod.stop(now + 2.5);

  // Sub bass resonance
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(55, now);
  sub.frequency.exponentialRampToValueAtTime(40, now + 2.0);

  // Lowpass filter for chest rumble
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + 2.2);

  osc1.connect(filter);
  sub.connect(filter);
  filter.connect(master);

  osc1.start(now);
  sub.start(now);
  osc1.stop(now + 2.5);
  sub.stop(now + 2.5);
}

export function playLionRoar() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.75, now + 0.4);
  master.gain.exponentialRampToValueAtTime(0.5, now + 1.6);
  master.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(95, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 1.0);
  osc.frequency.exponentialRampToValueAtTime(50, now + 2.8);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(260, now);
  filter.Q.value = 3.5;

  osc.connect(filter);
  filter.connect(master);

  osc.start(now);
  osc.stop(now + 3.0);
}

export function playElephantTrumpet() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.65, now + 0.2);
  master.gain.exponentialRampToValueAtTime(0.4, now + 1.1);
  master.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(540, now + 0.4);
  osc.frequency.exponentialRampToValueAtTime(410, now + 1.2);
  osc.frequency.exponentialRampToValueAtTime(220, now + 1.9);

  // Tremolo/flutter of trunk
  const trem = ctx.createOscillator();
  const tremGain = ctx.createGain();
  trem.frequency.value = 38;
  tremGain.gain.value = 45;
  trem.connect(osc.frequency);
  trem.start(now);
  trem.stop(now + 1.9);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(650, now);
  filter.Q.value = 4;

  osc.connect(filter);
  filter.connect(master);

  osc.start(now);
  osc.stop(now + 1.9);
}

export function playPeafowlCry() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.6, now + 0.15);
  master.gain.exponentialRampToValueAtTime(0.01, now + 1.4);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(1150, now + 0.35);
  osc.frequency.exponentialRampToValueAtTime(720, now + 1.4);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;

  osc.connect(filter);
  filter.connect(master);

  osc.start(now);
  osc.stop(now + 1.4);
}

export function playDeerCall() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.5, now + 0.05);
  master.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.7);

  osc.connect(master);
  osc.start(now);
  osc.stop(now + 0.7);
}

export function playBearGrunt() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.01, now);
  master.gain.exponentialRampToValueAtTime(0.6, now + 0.1);
  master.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
  master.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(75, now + 0.6);
  osc.frequency.exponentialRampToValueAtTime(50, now + 1.2);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 280;

  osc.connect(filter);
  filter.connect(master);

  osc.start(now);
  osc.stop(now + 1.2);
}

let ambientSource = null;
let ambientGain = null;

export function toggleRainforestAmbience(enable = true) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (!enable || ambientSource) {
    if (ambientGain) {
      ambientGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      setTimeout(() => {
        if (ambientSource) {
          try { ambientSource.stop(); } catch(e){}
          ambientSource = null;
          ambientGain = null;
        }
      }, 1000);
    }
    return false;
  }

  // Create ambient white noise for rustling leaves & water
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.08;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = buffer;
  whiteNoise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 850;
  filter.Q.value = 1.2;

  ambientGain = ctx.createGain();
  ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
  ambientGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5);

  whiteNoise.connect(filter);
  filter.connect(ambientGain);
  ambientGain.connect(ctx.destination);

  whiteNoise.start();
  ambientSource = whiteNoise;
  return true;
}


// =========================================================================
// BIOMETRIC SCANNER & VHF RADIO AUDIO SYNTHESIZERS
// =========================================================================

export function playBiometricScanSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Chirping telemetry frequency sweep
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
  osc.frequency.setValueAtTime(1200, now + 0.2);
  osc.frequency.exponentialRampToValueAtTime(3200, now + 0.35);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
  gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.45);
}

export function playTargetLockedSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Dual tone confirmation ping
  [1500, 2200].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    const start = now + (i * 0.1);
    gain.gain.setValueAtTime(0.01, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.3);
  });
}

export function playRadioSquelchSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Static burst
  const bufferSize = ctx.sampleRate * 0.35;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.18;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1800;
  bandpass.Q.value = 3.0;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
  gain.gain.setValueAtTime(0.25, now + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  noise.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.35);
}

// 4-Track Ambient Nature Synthesizer
let mixerTracks = {
  wind: null,
  water: null,
  rain: null,
  crickets: null
};

export function updateAmbientTrack(trackName, volume) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (volume <= 0) {
    if (mixerTracks[trackName]) {
      try {
        mixerTracks[trackName].gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
        setTimeout(() => {
          if (mixerTracks[trackName] && mixerTracks[trackName].source) {
            try { mixerTracks[trackName].source.stop(); } catch(e){}
            mixerTracks[trackName] = null;
          }
        }, 500);
      } catch(e) {}
    }
    return;
  }

  if (mixerTracks[trackName]) {
    mixerTracks[trackName].gain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.2);
    return;
  }

  // Create new track source
  if (trackName === 'wind' || trackName === 'rain' || trackName === 'water') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    if (trackName === 'wind') {
      filter.type = 'lowpass';
      filter.frequency.value = 350;
    } else if (trackName === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      filter.Q.value = 0.8;
    } else if (trackName === 'water') {
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 2.2;
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.35, now + 0.5);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start();
    mixerTracks[trackName] = { source, gain: gainNode };
  } else if (trackName === 'crickets') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 4600;

    const mod = ctx.createOscillator();
    mod.type = 'square';
    mod.frequency.value = 14; // chirp cadence

    const modGain = ctx.createGain();
    modGain.gain.value = 400;
    mod.connect(osc.frequency);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(volume * 0.18, now + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    mod.start();
    mixerTracks[trackName] = { source: osc, gain: gainNode, mod };
  }
}

/**
 * Synthesizes a crisp, dynamic reaction pop with pitch scaled by combo streak.
 * Provides immediate, delightful tactile audio feedback for stream reactions.
 */
export function playReactionPop(comboCount = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Pitch rises dynamically with rapid combo clicks (460Hz up to 920Hz)
    const baseFreq = Math.min(920, 460 + Math.max(0, comboCount - 1) * 35);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {
    // AudioContext suspended or blocked
  }
}

/**
 * Synthesizes a triumphant, sparkling multi-tone chord for Hold-to-Charge Mega Bursts.
 */
export function playMegaReactionBurst() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Celebratory C-Major arpeggiated chime [C5, E5, G5, C6]
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);

      gain.gain.setValueAtTime(0.01, now + idx * 0.045);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.045 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.55);
    });
  } catch (e) {
    // AudioContext suspended or blocked
  }
}

