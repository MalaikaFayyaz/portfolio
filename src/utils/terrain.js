// Terrain math for the scrolling pixel-landscape.
// Both hill profiles are exact integer-harmonic sums of a base wavelength,
// so profile(x + PERIOD) === profile(x). That lets HillsBackground render
// one period as a tile and translate it forever without any visible seam.

export const NEAR_PERIOD = 8400;
export const FAR_PERIOD = 6300;

const TAU = Math.PI * 2;

export function nearHillY(x) {
  const w = (TAU * x) / NEAR_PERIOD;
  return 54 * Math.sin(w) + 22 * Math.sin(2 * w + 0.9) + 10 * Math.sin(3 * w + 1.7);
}

export function farHillY(x) {
  const w = (TAU * x) / FAR_PERIOD;
  return 70 * Math.sin(w + 0.4) + 26 * Math.sin(2 * w + 2.1) + 12 * Math.sin(5 * w + 0.7);
}

// The road the car drives on is the near silhouette.
export const hillY = nearHillY;

export function buildHillPath(period, baseline, profile = nearHillY, step = 24) {
  // Extend the silhouette past both tile edges so adjacent copies overlap.
  // Edge-to-edge tiling shows hairline seams once sub-pixel offsets land on
  // fractional device pixels; a small overlap makes that impossible, and the
  // periodic profile keeps the overlapping curves pixel-identical.
  const start = -12;
  const end = period + 12;
  let d = `M ${start} ${(baseline + 400).toFixed(1)}`;
  for (let x = start; x <= end; x += step) {
    d += ` L ${x.toFixed(1)} ${(baseline - profile(x)).toFixed(1)}`;
  }
  d += ` L ${end.toFixed(1)} ${(baseline + 400).toFixed(1)} Z`;
  return d;
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;
