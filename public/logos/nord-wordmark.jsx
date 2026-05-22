// nord-wordmark.jsx — NORD CREATIVE wordmark with split O.
// The O in NORD is split. With a horizontal split the gap reads as a
// horizon line — the orthogonal companion to the vertical compass needle.

// ── SplitO ────────────────────────────────────────────────────────────
// Inline SVG O sized to sit alongside Geist capital letters. Two halves
// drawn as stroked arcs, separated by a small gap.
//
// Tuned by eye to Geist Medium (500) against rendered N/R/D:
//   - SVG height ≈ 0.78em (cap-height + overshoot top & bottom)
//   - O fills viewBox edge-to-edge (no internal padding)
//   - Stroke width 13 of 100 viewBox units ≈ matches Geist 500 stem
//   - Vertical position: bottom of O sits ~0.02em below baseline (overshoot)
const SplitO = ({ orientation = 'h', gap = 4 }) => {
  // O fills viewBox: outer radius = 50, so path centerline radius = 50 - sw/2.
  const sw = 13;
  const r = 50 - sw / 2; // 43.5
  const cx = 50, cy = 50;
  const g = gap; // viewBox units; total cut height = 2*g
  // Endpoint where cut line y = cy ± g meets the circle of radius r.
  const xi = Math.sqrt(r * r - g * g);
  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        height: '0.78em',
        width: '0.78em',
        display: 'inline-block',
        verticalAlign: 'baseline',
        // Push SVG down so its bottom sits ~0.02em below baseline (overshoot),
        // matching how real round-letter glyphs sit.
        transform: 'translateY(0.02em)',
        flex: '0 0 auto',
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="butt"
    >
      {orientation === 'h' ? (
        <>
          {/* Top half — large arc over the top */}
          <path d={`M ${cx - xi} ${cy - g} A ${r} ${r} 0 1 1 ${cx + xi} ${cy - g}`} />
          {/* Bottom half — large arc under the bottom */}
          <path d={`M ${cx - xi} ${cy + g} A ${r} ${r} 0 1 0 ${cx + xi} ${cy + g}`} />
        </>
      ) : (
        <>
          {/* Left half */}
          <path d={`M ${cx - g} ${cy - xi} A ${r} ${r} 0 1 0 ${cx - g} ${cy + xi}`} />
          {/* Right half */}
          <path d={`M ${cx + g} ${cy - xi} A ${r} ${r} 0 1 1 ${cx + g} ${cy + xi}`} />
        </>
      )}
    </svg>
  );
};

// ── Base type styles ──────────────────────────────────────────────────
const typeBase = {
  fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  textTransform: 'uppercase',
  color: 'currentColor',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

// ── Wordmark variants ─────────────────────────────────────────────────

// WV1 — Primary. Single line, horizontal split-O. "NORD CREATIVE"
const WordmarkPrimary = ({ size = 32, splitOrientation = 'h', gap = 4 }) => (
  <div
    style={{
      ...typeBase,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: '0.16em',
      display: 'inline-flex',
      alignItems: 'baseline',
    }}
  >
    {/* NORD */}
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      <span>N</span>
      <SplitO orientation={splitOrientation} gap={gap} />
      <span>RD</span>
    </span>
    {/* gap between words — wider than letter-spacing */}
    <span style={{ display: 'inline-block', width: '0.7em' }} />
    {/* CREATIVE — slightly lighter weight for hierarchy */}
    <span style={{ fontWeight: 400, letterSpacing: '0.16em' }}>CREATIVE</span>
  </div>
);

// WV2 — Stacked editorial. NORD large with split O, CREATIVE small below.
const WordmarkStacked = ({ size = 40, splitOrientation = 'h', gap = 4 }) => (
  <div style={{ ...typeBase, textAlign: 'left' }}>
    <div
      style={{
        fontSize: size,
        fontWeight: 500,
        letterSpacing: '0.08em',
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
    >
      <span>N</span>
      <SplitO orientation={splitOrientation} gap={gap} />
      <span>RD</span>
    </div>
    <div
      style={{
        fontSize: size * 0.34,
        fontWeight: 400,
        letterSpacing: '0.38em',
        marginTop: size * 0.18,
        // Optical correction — push CREATIVE in slightly to compensate for
        // the trailing extra space caused by letter-spacing on the last char.
        marginLeft: '2px',
      }}
    >
      CREATIVE
    </div>
  </div>
);

// WV3 — Compact single line for navbars. Lighter overall weight.
const WordmarkCompact = ({ size = 14, splitOrientation = 'h', gap = 4 }) => (
  <div
    style={{
      ...typeBase,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: '0.18em',
      display: 'inline-flex',
      alignItems: 'baseline',
    }}
  >
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      <span>N</span>
      <SplitO orientation={splitOrientation} gap={gap} />
      <span>RD</span>
    </span>
    <span style={{ display: 'inline-block', width: '0.6em' }} />
    <span style={{ fontWeight: 400 }}>CREATIVE</span>
  </div>
);

Object.assign(window, {
  SplitO,
  WordmarkPrimary,
  WordmarkStacked,
  WordmarkCompact,
});
