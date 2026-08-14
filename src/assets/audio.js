// Lightweight, dependency-free synthesized audio engine using the Web Audio
// API. No external audio files are required: ambient pads, engine hum, and
// UI blips are all generated procedurally. Autoplay policies are respected —
// the AudioContext is only created/resumed after a user gesture.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.engineGain = null;
    this.engineOsc = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.ambientStarted = false;
    this.engineStarted = false;
    this.muted = false;
  }

  ensureCtx() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.55;
    this.masterGain.connect(this.ctx.destination);
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.55, this.ctx.currentTime + 0.15);
    }
  }

  isMuted() {
    return this.muted;
  }

  async resume() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
    }
    this.startAmbient();
  }

  // ---- Ambient pad loop: soft, calm, playful retro chords ----
  startAmbient() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain || this.ambientStarted) return;
    this.ambientStarted = true;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(this.masterGain);
    this.ambientGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.2);

    const notes = [130.81, 164.81, 196.0, 261.63]; // C3 E3 G3 C4 - calm major chord
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "triangle" : "sine";
      osc.frequency.value = freq;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.015;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3 + i;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      const noteGain = ctx.createGain();
      noteGain.gain.value = 0.22 / (i + 1);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.ambientGain);
      osc.start();
    });

    // Soft twinkling arpeggio blips every few seconds for a playful retro feel
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0];
    const pluck = () => {
      if (!this.ctx || !this.ambientGain) return;
      const t = this.ctx.currentTime;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      osc.connect(g);
      g.connect(this.ambientGain);
      osc.start(t);
      osc.stop(t + 1.5);
      window.setTimeout(pluck, 2600 + Math.random() * 3600);
    };
    window.setTimeout(pluck, 1800);
  }

  // ---- Driving sound: gentle engine hum + rolling texture ----
  startEngine() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain || this.engineStarted) return;
    this.engineStarted = true;

    this.engineGain = ctx.createGain();
    this.engineGain.gain.value = 0;
    this.engineGain.connect(this.masterGain);

    this.engineFilter = ctx.createBiquadFilter();
    this.engineFilter.type = "lowpass";
    this.engineFilter.frequency.value = 320;
    this.engineFilter.connect(this.engineGain);

    this.engineOsc = ctx.createOscillator();
    this.engineOsc.type = "sawtooth";
    this.engineOsc.frequency.value = 55;
    this.engineOsc.connect(this.engineFilter);
    this.engineOsc.start();

    this.engineOsc2 = ctx.createOscillator();
    this.engineOsc2.type = "triangle";
    this.engineOsc2.frequency.value = 84;
    this.engineOsc2.connect(this.engineFilter);
    this.engineOsc2.start();

    this.engineGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.6);
  }

  // speed: 0..1 normalized
  updateEngine(speed) {
    if (!this.ctx || !this.engineOsc || !this.engineOsc2 || !this.engineFilter || !this.engineGain) return;
    const t = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1, speed));
    this.engineOsc.frequency.linearRampToValueAtTime(50 + clamped * 55, t + 0.08);
    this.engineOsc2.frequency.linearRampToValueAtTime(80 + clamped * 70, t + 0.08);
    this.engineFilter.frequency.linearRampToValueAtTime(260 + clamped * 900, t + 0.08);
    const targetGain = 0.05 + clamped * 0.09;
    this.engineGain.gain.linearRampToValueAtTime(targetGain, t + 0.12);
  }

  stopEngineFade() {
    if (!this.ctx || !this.engineGain) return;
    this.engineGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
  }

  // ---- UI blip: short futuristic digital flash ----
  playUiBlip() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2200, t + 0.09);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.045, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 500;

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.18);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2600, t + 0.02);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t + 0.02);
    g2.gain.linearRampToValueAtTime(0.02, t + 0.03);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc2.connect(g2);
    g2.connect(this.masterGain);
    osc2.start(t + 0.02);
    osc2.stop(t + 0.14);
  }

  playClick() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }
}

export const audioEngine = new AudioEngine();