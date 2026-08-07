export default function HillsBackground({ totalWidth, vh, scrollX, nearPath, farPath }) {
  return (
    <div className="pf-hills">
      <svg width={totalWidth * 0.6} height={vh} style={{ transform: `translateX(${-scrollX * 0.35}px)` }}>
        <path d={farPath} fill="#2aa198" opacity="0.10" />
      </svg>
      <svg width={totalWidth} height={vh} style={{ transform: `translateX(${-scrollX}px)` }}>
        <path d={nearPath} fill="#b58900" opacity="0.14" />
      </svg>
    </div>
  );
}

