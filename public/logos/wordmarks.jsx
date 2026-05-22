// wordmarks.jsx — wordmark explorations for Nord Creative.
// All wordmarks render in currentColor so they invert cleanly on dark/light.

// Shared base styles for the type system. Geist gets us close to
// Suisse Int'l / GT America without the licensing.
const wmBase = {
  fontFamily: '"Geist", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontWeight: 500,
  color: 'currentColor',
  lineHeight: 0.9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

// W1 — All caps, tight tracking, balanced weight. The "A" in CREATIVE
// loses its crossbar — the resulting hollow triangle reads as a peak.
// This is the primary candidate.
const WordmarkW1 = ({ size = 40 }) => {
  // We render the wordmark as styled spans so the peak-A swap is precise.
  const A_peak = (
    <svg
      viewBox="0 0 100 100"
      style={{
        height: '1em',
        width: '0.78em',
        display: 'inline-block',
        verticalAlign: 'baseline',
        marginBottom: '-0.04em',
      }}
      aria-hidden="true"
    >
      {/* Left stroke */}
      <polygon points="50,8 6,92 22,92 50,38" fill="currentColor" />
      {/* Right stroke */}
      <polygon points="50,8 94,92 78,92 50,38" fill="currentColor" />
      {/* No crossbar — that's the move */}
    </svg>
  );
  return (
    <div style={{ ...wmBase, fontSize: size, display: 'inline-flex', alignItems: 'baseline', gap: '0.5em' }}>
      <span>NORD</span>
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <span>CRE</span>
        {A_peak}
        <span>TIVE</span>
      </span>
    </div>
  );
};

// W2 — Same caps system but with a thin compass-needle diamond as the
// separator between NORD and CREATIVE.
const WordmarkW2 = ({ size = 40 }) => {
  const needle = (
    <svg
      viewBox="0 0 20 100"
      style={{
        height: '1em',
        width: '0.18em',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginBottom: '0.08em',
      }}
      aria-hidden="true"
    >
      <polygon points="10,4 16,50 10,52 4,50" fill="currentColor" />
      <polygon points="10,96 16,50 10,48 4,50" fill="currentColor" opacity="0.35" />
    </svg>
  );
  return (
    <div style={{ ...wmBase, fontSize: size, display: 'inline-flex', alignItems: 'center', gap: '0.55em' }}>
      <span>NORD</span>
      {needle}
      <span>CREATIVE</span>
    </div>
  );
};

// W3 — Stacked editorial. NORD set heavier; CREATIVE set lighter and
// wider, sitting underneath like a subtitle on a film poster.
const WordmarkW3 = ({ size = 40 }) => (
  <div
    style={{
      fontFamily: wmBase.fontFamily,
      color: 'currentColor',
      textTransform: 'uppercase',
      lineHeight: 0.95,
      textAlign: 'left',
    }}
  >
    <div style={{ fontSize: size, fontWeight: 600, letterSpacing: '0.06em' }}>NORD</div>
    <div style={{ fontSize: size * 0.42, fontWeight: 400, letterSpacing: '0.42em', marginTop: size * 0.18, marginLeft: '2px' }}>
      CREATIVE
    </div>
  </div>
);

// W4 — Mixed case "Nord Creative" with a refined italic-ish tail.
// Lower-case set in a lighter weight; intended as the casual secondary.
const WordmarkW4 = ({ size = 40 }) => (
  <div
    style={{
      fontFamily: wmBase.fontFamily,
      fontSize: size,
      color: 'currentColor',
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 0.95,
    }}
  >
    Nord<span style={{ fontWeight: 300, letterSpacing: '-0.01em' }}>&nbsp;Creative</span>
  </div>
);

// W5 — Caps, but the V in CREATIVE is replaced with a sharper, taller
// peak glyph (a chevron). Pairs visually with the Peaks mark.
const WordmarkW5 = ({ size = 40 }) => {
  const V_peak = (
    <svg
      viewBox="0 0 100 100"
      style={{
        height: '1em',
        width: '0.78em',
        display: 'inline-block',
        verticalAlign: 'baseline',
        marginBottom: '-0.04em',
      }}
      aria-hidden="true"
    >
      <polyline
        points="6,8 50,92 94,8"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinejoin="miter"
      />
    </svg>
  );
  return (
    <div style={{ ...wmBase, fontSize: size, display: 'inline-flex', alignItems: 'baseline', gap: '0.5em' }}>
      <span>NORD</span>
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <span>CREATI</span>
        {V_peak}
        <span>E</span>
      </span>
    </div>
  );
};

// W6 — All caps with a coordinate marker prefix. Reads like a navigation
// bearing or a film slate — very on-brand for Greenland documentary work.
const WordmarkW6 = ({ size = 40 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.8em' }}>
    <span
      style={{
        fontFamily: '"Geist Mono", ui-monospace, monospace',
        fontSize: size * 0.42,
        color: 'currentColor',
        opacity: 0.7,
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      64°N
    </span>
    <span style={{ ...wmBase, fontSize: size }}>NORD CREATIVE</span>
  </div>
);

Object.assign(window, {
  WordmarkW1, WordmarkW2, WordmarkW3, WordmarkW4, WordmarkW5, WordmarkW6,
});
