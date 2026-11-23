// Web Audio API Synthesizer untuk suasana desa cozy & efek suara pixel retro lembut
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmTimer = null;
    this.isPlayingBgm = false;
    this.noteIndex = 0;

    // Tangga nada pentatonik hangat (C major / G major cozy pastoral progression)
    this.melodyNotes = [
      261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 392.00,
      329.63, 261.63, 220.00, 261.63, 293.66, 329.63, 261.63, 196.00
    ];
  }

  ensureContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.muted;
  }

  playTone(freq, duration = 0.14, type = 'sine', volume = 0.06, slideFreq = null) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playSfx(name) {
    if (this.muted) return;
    switch (name) {
      case 'step':
        this.playTone(135 + Math.random() * 25, 0.05, 'triangle', 0.025, 95);
        break;
      case 'hoe':
        this.playTone(170, 0.11, 'square', 0.04, 85);
        break;
      case 'water':
        this.playTone(340, 0.12, 'sine', 0.05, 520);
        setTimeout(() => this.playTone(460, 0.1, 'sine', 0.04, 620), 65);
        break;
      case 'plant':
        this.playTone(290, 0.09, 'triangle', 0.05, 420);
        break;
      case 'harvest':
      case 'pickup':
        this.playTone(440, 0.1, 'triangle', 0.06, 587.33);
        setTimeout(() => this.playTone(587.33, 0.14, 'triangle', 0.06, 880), 80);
        break;
      case 'coin':
      case 'buy':
        this.playTone(587.33, 0.09, 'sine', 0.07);
        setTimeout(() => this.playTone(880, 0.18, 'sine', 0.07), 75);
        break;
      case 'talk':
        this.playTone(380 + Math.random() * 90, 0.06, 'sine', 0.04);
        break;
      case 'fish':
        this.playTone(310, 0.15, 'sine', 0.06, 480);
        setTimeout(() => this.playTone(520, 0.18, 'triangle', 0.07, 740), 120);
        break;
      case 'sleep':
        this.playTone(392, 0.2, 'sine', 0.05);
        setTimeout(() => this.playTone(329.63, 0.22, 'sine', 0.05), 180);
        setTimeout(() => this.playTone(261.63, 0.35, 'sine', 0.05), 360);
        break;
      case 'save':
        this.playTone(523.25, 0.1, 'sine', 0.05);
        setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.05), 90);
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.06), 180);
        break;
      default:
        this.playTone(440, 0.08, 'sine', 0.03);
    }
  }

  startBgm() {
    if (this.muted || this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.bgmTimer = setInterval(() => {
      if (this.muted || document.hidden) return;
      const ctx = this.ensureContext();
      if (!ctx) return;
      const freq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
      this.noteIndex++;
      // Nada kalimba/harp lembut
      this.playTone(freq, 0.65, 'sine', 0.022);
      if (this.noteIndex % 4 === 1) {
        this.playTone(freq * 0.5, 1.1, 'triangle', 0.015);
      }
    }, 850);
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new SoundEngine();
