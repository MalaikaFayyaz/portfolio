export default function CarSVG({ rotation }) {
  return (
    <svg width="86" height="54" viewBox="0 0 86 54" style={{ transform: `rotate(${rotation}deg)`, transition: "transform 60ms linear" }}>
      <ellipse cx="43" cy="46" rx="34" ry="4" fill="#00212b" opacity="0.5" />
      <path d="M8 36 Q6 22 22 20 L30 10 Q34 6 42 6 L58 6 Q64 6 66 12 L72 20 Q80 21 80 32 Q80 38 74 38 L14 38 Q8 38 8 36 Z" fill="#b58900" stroke="#00212b" strokeWidth="2" />
      <path d="M32 20 L37 12 Q39 10 43 10 L56 10 Q60 10 62 14 L66 20 Z" fill="#2aa198" opacity="0.85" />
      <circle cx="47" cy="17" r="5.2" fill="#eee8d5" />
      <circle cx="49" cy="15.5" r="2.1" fill="#073642" />
      <circle cx="22" cy="40" r="8" fill="#073642" stroke="#eee8d5" strokeWidth="2" />
      <circle cx="66" cy="40" r="8" fill="#073642" stroke="#eee8d5" strokeWidth="2" />
      <circle cx="22" cy="40" r="2.6" fill="#eee8d5" />
      <circle cx="66" cy="40" r="2.6" fill="#eee8d5" />
    </svg>
  );
}
