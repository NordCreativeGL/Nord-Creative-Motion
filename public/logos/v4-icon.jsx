// v4-icon.jsx — Nord Creative split-circle icon family.
//
// Each icon: two arcs (left/right) with small gaps at top and bottom — same
// geometry as the existing brand icon — combined with the letter N rendered
// in Montserrat (same as the wordmark) so the two elements feel unified.
//
// Variants change WHERE the N sits and HOW THICK the arcs are.

// Shared arc geometry helper. Renders the two arcs with given stroke width
// and top/bottom gap angle.
const SplitRing = ({ stroke = 3.5, gapDeg = 12 }) => {
  // r is the centerline radius — half of viewBox minus half stroke so the
  // outer edge of the ring touches the viewBox edge.
  const r = 50 - stroke / 2;
  const half = (gapDeg / 2) * (Math.PI / 180); // half-gap in radians
  const dx = r * Math.sin(half);
  const dy = r * Math.cos(half);
  const xL = 50 - dx;
  const xR = 50 + dx;
  const yT = 50 - dy;
  const yB = 50 + dy;
  return (
    <>
      {/* Left arc — counterclockwise through left side */}
      <path
        d={`M ${xL} ${yT} A ${r} ${r} 0 0 0 ${xL} ${yB}`}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="butt"
      />
      {/* Right arc — clockwise through right side */}
      <path
        d={`M ${xR} ${yT} A ${r} ${r} 0 0 1 ${xR} ${yB}`}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="butt"
      />
    </>
  );
};

// IconA — N centered inside the ring.
// The most direct reading of the brief: "N inside the circle".
const IconA = ({ size = 96, stroke = 3.5, gapDeg = 12, nSize = 0.4, nWeight = 200 }) => (
  <span
    style={{
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      color: 'currentColor',
      lineHeight: 0,
      flex: '0 0 auto',
    }}
  >
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
      <SplitRing stroke={stroke} gapDeg={gapDeg} />
    </svg>
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Optical centring — Montserrat N's cap-height baseline sits a touch
        // below the geometric centre, so we nudge up by ~3% of the icon size.
        paddingBottom: size * 0.04,
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: nWeight,
        fontSize: size * nSize,
        lineHeight: 1,
        textTransform: 'uppercase',
        color: 'currentColor',
        pointerEvents: 'none',
      }}
    >
      N
    </span>
  </span>
);

// IconB — N at the top, occupying the top gap.
// The N reads as a north marker inside the ring; conceptually closest to a
// compass dial.
const IconB = ({ size = 96, stroke = 3.5, gapDeg = 32, nSize = 0.3, nWeight = 200 }) => (
  <span
    style={{
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      color: 'currentColor',
      lineHeight: 0,
      flex: '0 0 auto',
    }}
  >
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none">
      <SplitRing stroke={stroke} gapDeg={gapDeg} />
    </svg>
    {/* N positioned where the top gap is — sitting on the imaginary north line */}
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        // Top quarter — sits inside the upper portion of the ring.
        top: '20%',
        transform: 'translateX(-50%)',
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: nWeight,
        fontSize: size * nSize,
        lineHeight: 1,
        textTransform: 'uppercase',
        color: 'currentColor',
        pointerEvents: 'none',
      }}
    >
      N
    </span>
  </span>
);

// IconC — N centered, but larger and lighter (fills more of the ring).
// Reads as a monogram inside a frame.
const IconC = ({ size = 96, stroke = 3.5, gapDeg = 12, nSize = 0.62, nWeight = 200 }) => (
  <IconA size={size} stroke={stroke} gapDeg={gapDeg} nSize={nSize} nWeight={nWeight} />
);

// IconD — Pure split-circle with NO letter (for marks where the wordmark
// is right next to it — the N is implied by the adjacent wordmark).
const IconD = ({ size = 96, stroke = 3.5, gapDeg = 12 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" style={{ flex: '0 0 auto', color: 'currentColor' }}>
    <SplitRing stroke={stroke} gapDeg={gapDeg} />
  </svg>
);

// IconNeedle — Split ring with a compass needle inside.
// Same split-ring geometry as the O in the wordmark, plus the diamond
// needle from the I substitution — together they make the icon the
// concentrated form of the wordmark's two typographic moves.
const IconNeedle = ({
  size = 96,
  stroke = 3.5,
  gapDeg = 12,
  needleHeight = 80, // % of viewBox height
  needleWidth = 14,  // viewBox units (out of 100)
}) => {
  const nH = needleHeight / 2;
  const nW = needleWidth / 2;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" style={{ flex: '0 0 auto', color: 'currentColor' }}>
      <SplitRing stroke={stroke} gapDeg={gapDeg} />
      <polygon
        points={`50,${50 - nH} ${50 + nW},50 50,${50 + nH} ${50 - nW},50`}
        fill="currentColor"
      />
    </svg>
  );
};

Object.assign(window, { SplitRing, IconA, IconB, IconC, IconD, IconNeedle });
