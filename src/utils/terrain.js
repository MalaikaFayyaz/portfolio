// Terrain math — preserved from the original pixel-landscape prototype.
// hillY() defines the height profile of the rolling hills; buildHillPath()
// turns that profile into an SVG path so the terrain can be rendered as a
// filled silhouette and scrolled beneath the car.

export function hillY(x) {
  return (
    58 * Math.sin(x * 0.0011) +
    26 * Math.sin(x * 0.0027 + 1.3) +
    14 * Math.sin(x * 0.0006 + 0.6)
  );
}

export function buildHillPath(totalWidth, baseline, amp, step = 24) {
  let d = `M 0 ${baseline + 400}`;
  for (let x = 0; x <= totalWidth; x += step) {
    const y = baseline - hillY(x) * amp;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  d += ` L ${totalWidth.toFixed(1)} ${baseline + 400} Z`;
  return d;
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;