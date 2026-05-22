// v4-wordmark.jsx — "NORD CREATIVE" wordmark with two typographic moves:
//   - The O in NORD is split vertically (no needle inside — just a clean cut)
//   - The I in CREATIVE is replaced with a compass needle (diamond, sharp at
//     both ends, same shape as the icon's would-be needle)
// Montserrat ExtraLight, wide tracking, with a space between the two words.

const v4Type = {
  fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
  textTransform: 'uppercase',
  color: 'currentColor',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

// Background context — the colour of the surface behind the wordmark.
const V4BgContext = React.createContext('#000');

// ── Split O ───────────────────────────────────────────────────────────
// The O is cut vertically. No needle inside — just a clean gap, same
// visual language as the split ring in the icon.
const V4SplitO = ({ gapWidth = '0.10em' }) => {
  const bg = React.useContext(V4BgContext);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      O
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'calc(50% - var(--v4-ls, 0em) / 2)',
          top: '8%',
          bottom: '8%',
          width: gapWidth,
          background: bg,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
};

// ── Needle I ──────────────────────────────────────────────────────────
// The I in CREATIVE is replaced with a vertical diamond — a compass
// needle. Sharp tips at both ends.
//
// Slot: the needle sits inside an inline-block that's as wide as an
// average Montserrat capital (~0.5em). The diamond is CENTRED inside
// that slot, so letter-spacing applies symmetrically — the gap from
// T to the needle and from the needle to V are identical and match the
// spacing between all other letters.
//
// Alignment: the diamond is drawn slightly taller than cap-height with
// symmetric overshoot, so the sharp tips appear visually level with the
// flat tops/bottoms of the surrounding caps.
const V4NeedleI = ({
  slotWidth = '0.5em',     // matches an average Montserrat cap width
  diamondWidth = '0.18em', // visual width of the diamond inside the slot
  height = '0.74em',       // slight overshoot above cap-height only
  overshoot = '0.03em',    // bottom sits 0.03em below baseline
  nudgeLeft = '0.14em',
}) => (
  <span
    style={{
      display: 'inline-block',
      width: slotWidth,
      height,
      position: 'relative',
      verticalAlign: 'baseline',
      marginBottom: `calc(0px - ${overshoot})`,
      flex: '0 0 auto',
    }}
  >
    <svg
      viewBox="0 0 10 50"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `calc(50% - ${nudgeLeft})`,
        top: 0,
        height: '100%',
        width: diamondWidth,
        transform: 'translateX(-50%)',
        overflow: 'visible',
      }}
      fill="currentColor"
    >
      <polygon points="5,0 10,25 5,50 0,25" />
    </svg>
  </span>
);

// ── Primary wordmark ──────────────────────────────────────────────────
const V4Wordmark = ({
  size = 28,
  weight = 200,
  tracking = '0.32em',
  wordSpace = '0.32em',
  bg, // overrides context
  splitO = true, // toggle split in the O
  needleI = true, // toggle compass-needle I
  oGapWidth,
  iHeight,
  iWidth,
}) => {
  const content = (
    <div
      style={{
        ...v4Type,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        wordSpacing: wordSpace,
        '--v4-ls': tracking,
        display: 'inline-block',
      }}
    >
      <span>N</span>
      {splitO ? <V4SplitO gapWidth={oGapWidth} /> : <span>O</span>}
      <span>RD CREAT</span>
      {needleI ? <V4NeedleI height={iHeight} width={iWidth} /> : <span>I</span>}
      <span>VE</span>
    </div>
  );
  return bg !== undefined ? (
    <V4BgContext.Provider value={bg}>{content}</V4BgContext.Provider>
  ) : content;
};

const V4WordmarkSmall = ({ size = 12, weight = 300, tracking = '0.32em', bg }) => (
  <V4Wordmark size={size} weight={weight} tracking={tracking} bg={bg} />
);

Object.assign(window, {
  V4BgContext,
  V4SplitO,
  V4NeedleI,
  V4Wordmark,
  V4WordmarkSmall,
});
