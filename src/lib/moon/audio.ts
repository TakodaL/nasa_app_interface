let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.18;
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio(): void {
  const audio = context();
  if (audio && audio.state === "suspended") void audio.resume();
}

export function setMuted(next: boolean): void {
  muted = next;
  const audio = context();
  if (audio && master) master.gain.setTargetAtTime(next ? 0 : 0.18, audio.currentTime, 0.02);
}

export function isMuted(): boolean {
  return muted;
}

function tone(freq: number, when: number, dur: number, gain = 0.25): void {
  if (!ctx || !master || muted) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, when);
  amp.gain.setValueAtTime(0.0001, when);
  amp.gain.exponentialRampToValueAtTime(gain, when + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(amp);
  amp.connect(master);
  osc.start(when);
  osc.stop(when + dur + 0.02);
  osc.onended = () => {
    osc.disconnect();
    amp.disconnect();
  };
}

export function play(kind: "tap" | "send" | "lock" | "nope"): void {
  unlockAudio();
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  if (kind === "tap") tone(680, t, 0.07, 0.16);
  if (kind === "nope") tone(196, t, 0.14, 0.1);
  if (kind === "send") {
    tone(523, t, 0.1, 0.18);
    tone(659, t + 0.07, 0.12, 0.18);
    tone(784, t + 0.14, 0.18, 0.16);
  }
  if (kind === "lock") {
    tone(392, t, 0.16, 0.14);
    tone(523, t + 0.08, 0.18, 0.16);
    tone(659, t + 0.16, 0.2, 0.16);
    tone(784, t + 0.24, 0.32, 0.14);
  }
}

export function watchVisibility(): () => void {
  const onVis = () => {
    if (document.visibilityState === "visible" && ctx?.state === "suspended") void ctx.resume();
  };
  document.addEventListener("visibilitychange", onVis);
  return () => document.removeEventListener("visibilitychange", onVis);
}
