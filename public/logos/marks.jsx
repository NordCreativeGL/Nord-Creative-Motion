// marks.jsx — logo icon marks for Nord Creative
// Each mark is a pure SVG, viewBox 100x100. Color comes from currentColor
// so the same component renders correctly on black or white backgrounds
// when wrapped in a container that sets `color`.

const Mark = ({ size = 96, children, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeLinejoin="miter"
    strokeLinecap="butt"
    {...props}
  >
    {children}
  </svg>
);

// ───────────────────────────────────────────────────────────────────────
// A — Compass / North marker
// ───────────────────────────────────────────────────────────────────────

// A1 — Crossed needles. North is filled (solid diamond), the three other
// cardinal points are outlined. The asymmetry tells you which way is up.
const CompassA1 = ({ size }) => (
  <Mark size={size}>
    {/* North — filled */}
    <polygon points="50,6 56,50 50,52 44,50" fill="currentColor" />
    {/* South — outlined */}
    <polygon points="50,94 56,50 50,48 44,50" strokeWidth="1.5" />
    {/* East — outlined */}
    <polygon points="94,50 50,56 48,50 50,44" strokeWidth="1.5" />
    {/* West — outlined */}
    <polygon points="6,50 50,56 52,50 50,44" strokeWidth="1.5" />
    {/* Pivot dot */}
    <circle cx="50" cy="50" r="1.6" fill="currentColor" />
  </Mark>
);

// A2 — Lone vertical needle with cardinal tick marks. Quiet, almost a
// punctuation mark. Reads as a navigation indicator at favicon size.
const CompassA2 = ({ size }) => (
  <Mark size={size}>
    {/* Needle — top half filled, bottom half hollow */}
    <polygon points="50,8 57,50 50,54 43,50" fill="currentColor" />
    <polygon points="50,92 57,50 50,46 43,50" strokeWidth="1.5" />
    {/* Cardinal ticks */}
    <line x1="6" y1="50" x2="14" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <line x1="86" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="1.5" />
  </Mark>
);

// A3 — Compass enclosed in a thin circle. The most explicit "compass" read.
const CompassA3 = ({ size }) => (
  <Mark size={size}>
    <circle cx="50" cy="50" r="44" strokeWidth="1.25" />
    <polygon points="50,12 55,50 50,52 45,50" fill="currentColor" />
    <polygon points="50,88 55,50 50,48 45,50" strokeWidth="1.25" />
    <circle cx="50" cy="50" r="1.4" fill="currentColor" />
    {/* Cardinal ticks on the ring */}
    <line x1="14" y1="50" x2="18" y2="50" stroke="currentColor" strokeWidth="1.25" />
    <line x1="82" y1="50" x2="86" y2="50" stroke="currentColor" strokeWidth="1.25" />
  </Mark>
);

// ───────────────────────────────────────────────────────────────────────
// B — Mountain peaks
// ───────────────────────────────────────────────────────────────────────

// B1 — Two layered angular peaks, tall foreground + shorter background.
// The back peak's top is offset slightly to break symmetry.
const PeaksB1 = ({ size }) => (
  <Mark size={size}>
    {/* Back peak — outlined */}
    <polygon points="62,22 30,78 94,78" strokeWidth="1.5" />
    {/* Front peak — filled, with snow notch */}
    <polygon
      points="34,38 6,78 62,78"
      fill="currentColor"
    />
    {/* Snow line — thin notch carved into the filled peak */}
    <polyline
      points="26,50 30,54 34,50 38,55"
      stroke="#000"
      strokeWidth="1"
      style={{ mixBlendMode: 'difference' }}
    />
  </Mark>
);

// B2 — Three crisp peaks on a baseline. Stable, almost glyph-like.
const PeaksB2 = ({ size }) => (
  <Mark size={size}>
    {/* Baseline */}
    <line x1="8" y1="76" x2="92" y2="76" stroke="currentColor" strokeWidth="1.5" />
    {/* Peaks as thin chevrons */}
    <polyline
      points="14,76 32,42 50,68 68,30 86,76"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="miter"
    />
  </Mark>
);

// B3 — Peak inside a square frame (like a cropped film still).
const PeaksB3 = ({ size }) => (
  <Mark size={size}>
    <rect x="10" y="10" width="80" height="80" strokeWidth="1.25" />
    <polygon points="50,28 22,78 78,78" fill="currentColor" />
    {/* Smaller back peak */}
    <polygon points="68,42 50,78 86,78" strokeWidth="1.25" />
  </Mark>
);

// ───────────────────────────────────────────────────────────────────────
// C — Lens + horizon
// ───────────────────────────────────────────────────────────────────────

// C1 — Lens circle with a horizon and a sun/moon dot. Bridges camera +
// landscape literally and economically.
const LensC1 = ({ size }) => (
  <Mark size={size}>
    <circle cx="50" cy="50" r="42" strokeWidth="1.5" />
    {/* Horizon — clipped to the lens via a mask */}
    <defs>
      <clipPath id="lens-c1">
        <circle cx="50" cy="50" r="42" />
      </clipPath>
    </defs>
    <g clipPath="url(#lens-c1)">
      <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="62" cy="44" r="4.5" fill="currentColor" />
    </g>
  </Mark>
);

// C2 — Lens with peak silhouette inside. The peak's apex bisects the lens.
const LensC2 = ({ size }) => (
  <Mark size={size}>
    <circle cx="50" cy="50" r="42" strokeWidth="1.5" />
    <defs>
      <clipPath id="lens-c2">
        <circle cx="50" cy="50" r="42" />
      </clipPath>
    </defs>
    <g clipPath="url(#lens-c2)">
      <polygon points="50,30 18,80 82,80" fill="currentColor" />
      <polygon points="68,46 46,80 90,80" fill="currentColor" opacity="0.55" />
    </g>
  </Mark>
);

// C3 — Concentric lens (aperture suggestion) with a single notch at top:
// the notch reads as the North on a compass when viewed quickly.
const LensC3 = ({ size }) => (
  <Mark size={size}>
    <circle cx="50" cy="50" r="42" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="28" strokeWidth="1.25" />
    <circle cx="50" cy="50" r="2" fill="currentColor" />
    {/* North notch — small filled triangle at 12 o'clock */}
    <polygon points="50,2 54,12 46,12" fill="currentColor" />
  </Mark>
);

// ───────────────────────────────────────────────────────────────────────
// D — N monogram
// ───────────────────────────────────────────────────────────────────────

// D1 — N where the diagonal stroke is broken to form a peak. Reads as N
// first, peak second.
const MonoD1 = ({ size }) => (
  <Mark size={size}>
    {/* Left stem */}
    <rect x="16" y="14" width="11" height="72" fill="currentColor" />
    {/* Right stem */}
    <rect x="73" y="14" width="11" height="72" fill="currentColor" />
    {/* Diagonal turned into a peak: top-left of left stem → apex at center-bottom → top-right of right stem.
        Drawn as a filled quad with a notched top so the peak reads. */}
    <polygon points="27,14 50,62 73,14 73,28 50,76 27,28" fill="currentColor" />
  </Mark>
);

// D2 — N whose right stem is capped with a compass-needle diamond. Subtle
// but unmistakable once you see it.
const MonoD2 = ({ size }) => (
  <Mark size={size}>
    <rect x="16" y="20" width="10" height="66" fill="currentColor" />
    <polygon points="26,20 74,86 74,68 26,2" fill="currentColor" />
    {/* Right stem with needle cap */}
    <rect x="74" y="32" width="10" height="54" fill="currentColor" />
    <polygon points="79,4 86,32 79,36 72,32" fill="currentColor" />
  </Mark>
);

// D3 — Two parallel verticals (NN-style) with a single thin diagonal
// crossing them — a quieter, more editorial monogram.
const MonoD3 = ({ size }) => (
  <Mark size={size}>
    <line x1="22" y1="14" x2="22" y2="86" stroke="currentColor" strokeWidth="6" />
    <line x1="78" y1="14" x2="78" y2="86" stroke="currentColor" strokeWidth="6" />
    {/* Diagonal — thin, with a kink at center forming a peak vertex */}
    <polyline
      points="22,14 50,58 78,14"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </Mark>
);

Object.assign(window, {
  CompassA1, CompassA2, CompassA3,
  PeaksB1, PeaksB2, PeaksB3,
  LensC1, LensC2, LensC3,
  MonoD1, MonoD2, MonoD3,
});
