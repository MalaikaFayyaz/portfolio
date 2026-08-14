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
    d += ` L ${x} ${y.toFixed(1)}`;
  }
  d += ` L ${totalWidth} ${baseline + 400} Z`;
  return d;
}
