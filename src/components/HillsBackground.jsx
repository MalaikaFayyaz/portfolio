import { useMemo } from "react";
import { buildHillPath, nearHillY, farHillY, NEAR_PERIOD, FAR_PERIOD } from "../utils/terrain";

const TILE_COPIES = 3;
const FAR_SCROLL_FACTOR = 0.35;
const FAR_IDLE_FACTOR = 0.55;

// Keep the translation inside one tile period so the offset never grows
// unbounded; the duplicated tiles make the wrap invisible.
const wrap = (value, period) => ((value % period) + period) % period;

export default function HillsBackground({ vh, scrollX, idlePhase }) {
  const nearTile = useMemo(() => buildHillPath(NEAR_PERIOD, vh * 0.85, nearHillY), [vh]);
  const farTile = useMemo(() => buildHillPath(FAR_PERIOD, vh * 0.78, farHillY), [vh]);

  const nearOffset = wrap(scrollX + idlePhase, NEAR_PERIOD);
  const farOffset = wrap(scrollX * FAR_SCROLL_FACTOR + idlePhase * FAR_IDLE_FACTOR, FAR_PERIOD);

  return (
    <div className="pf-hills">
      <svg width={FAR_PERIOD * TILE_COPIES} height={vh}>
        {Array.from({ length: TILE_COPIES }, (_, i) => (
          <path
            key={i}
            d={farTile}
            fill="#2aa198"
            opacity="0.10"
            transform={`translate(${(i * FAR_PERIOD - farOffset).toFixed(2)} 0)`}
          />
        ))}
      </svg>
      <svg width={NEAR_PERIOD * TILE_COPIES} height={vh}>
        {Array.from({ length: TILE_COPIES }, (_, i) => (
          <path
            key={i}
            d={nearTile}
            fill="#b58900"
            opacity="0.14"
            transform={`translate(${(i * NEAR_PERIOD - nearOffset).toFixed(2)} 0)`}
          />
        ))}
      </svg>
    </div>
  );
}
