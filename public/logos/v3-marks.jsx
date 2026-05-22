// v3-marks.jsx — minimal compass / north marks for Nord Creative v3.
// Vocabulary: a circle, a vertical gap, a needle. Nothing else.

const V3 = ({ size = 96, children, ...props }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" {...props} />
);

// M1 — Split circle. Same shape as the O in the wordmark, scaled up.
// The mark IS the typographic move. Quietest possible compass abstraction.
const MarkSplitCircle = ({ size, weight = 'thin' }) => {
  const sw = weight === 'thin' ? 3.2 : weight === 'regular' ? 5 : 6.8;
  const r = 50 - sw / 2;
  const g = 6;
  const yi = Math.sqrt(r * r - g * g);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw}>
      <path d={`M ${50 - g} ${50 - yi} A ${r} ${r} 0 1 0 ${50 - g} ${50 + yi}`} />
      <path d={`M ${50 + g} ${50 - yi} A ${r} ${r} 0 1 1 ${50 + g} ${50 + yi}`} />
    </svg>
  );
};

// M2 — Circle with a thin vertical line through the centre.
// Reads as N–S axis / compass meridian. Different from M1: the circle
// is closed, the needle is the only interruption.
const MarkCircleNeedle = ({ size }) => (
  <V3 size={size}>
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3.2" />
    <line x1="50" y1="14" x2="50" y2="86" stroke="currentColor" strokeWidth="3.2" />
  </V3>
);

// M3 — Circle with an asymmetric needle: filled triangle pointing up
// (north), open triangle pointing down. Still very thin.
const MarkAsymNeedle = ({ size }) => (
  <V3 size={size}>
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
    {/* North — filled */}
    <polygon points="50,16 54,50 50,51 46,50" fill="currentColor" />
    {/* South — line only */}
    <line x1="50" y1="50" x2="50" y2="84" stroke="currentColor" strokeWidth="2" />
  </V3>
);

// M4 — Just a circle with a single tick at the top (north marker).
// Almost a punctuation glyph.
const MarkNorthTick = ({ size }) => (
  <V3 size={size}>
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="3" />
    <line x1="50" y1="4" x2="50" y2="14" stroke="currentColor" strokeWidth="3" />
  </V3>
);

// M5 — Crosshair: full vertical + horizontal lines through a circle.
// The most navigational read; sits like a viewfinder.
const MarkCrosshair = ({ size }) => (
  <V3 size={size}>
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
    <line x1="50" y1="14" x2="50" y2="86" stroke="currentColor" strokeWidth="3" />
    <line x1="14" y1="50" x2="86" y2="50" stroke="currentColor" strokeWidth="3" />
  </V3>
);

Object.assign(window, {
  MarkSplitCircle,
  MarkCircleNeedle,
  MarkAsymNeedle,
  MarkNorthTick,
  MarkCrosshair,
});
