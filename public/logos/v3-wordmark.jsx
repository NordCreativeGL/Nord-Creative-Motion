// v3-wordmark.jsx — NORDCREATIVE wordmark.
//
// Strategy: use the real Montserrat O letter and overlay a thin vertical
// strip of background colour to create the split. This guarantees perfect
// letter proportions — the O is the actual typeface glyph, not a hand-drawn
// approximation.
//
// The background colour comes from BgContext (set by the surface). The
// strip width and position are tuned by eye to fall exactly through the
// optical centre of the O.

const BgContext = React.createContext('#000');

const V3SplitO = ({
  // Width of the gap cut through the O glyph. Wider = the compass needle
  // has room to breathe.
  gapWidth = '0.18em',
  // How tall the needle is, as a fraction of the line height. Spans the
  // full height of the O glyph — tip-to-tip touches near the top/bottom
  // of the O's ring.
  needleHeight = '0.7em',
  // Width of the needle SVG. Slightly narrower than the gap so the
  // diamond reads as a separate object floating in the slot.
  needleWidth = '0.12em',
}) => {
  const bg = React.useContext(BgContext);
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      O
      {/* Background-coloured strip that erases the middle of the O */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'calc(50% - var(--nc-ls, 0em) / 2)',
          top: '8%',
          bottom: '8%',
          width: gapWidth,
          background: bg,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />
      {/* Symmetric compass needle — sharp at both ends, full height.
          Tip-to-tip diamond that spans the height of the O. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 10 50"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 'calc(50% - var(--nc-ls, 0em) / 2)',
          // Centre vertically over the O glyph.
          top: `calc(50% - ${needleHeight} / 2 + 0.02em)`,
          width: needleWidth,
          height: needleHeight,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        fill="currentColor"
      >
        {/* Single filled diamond — sharp tips top and bottom, widest at centre. */}
        <polygon points="5,0 10,25 5,50 0,25" />
      </svg>
    </span>
  );
};

const v3TypeBase = {
  fontFamily: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
  textTransform: 'uppercase',
  color: 'currentColor',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

// Primary wordmark.
// `bg` should match the surface background so the split strip is invisible
// against the background — only "cutting" through the O glyph.
const V3Wordmark = ({
  size = 28,
  weight = 200,
  tracking = '0.42em',
  bg, // overrides context
  gapWidth,
  needleHeight,
  needleWidth,
  needle = true, // set to false to get a plain split (no compass needle)
}) => {
  const content = (
    <div
      style={{
        ...v3TypeBase,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        '--nc-ls': tracking,
      }}
    >
      <span>N</span>
      {needle ? (
        <V3SplitO
          gapWidth={gapWidth}
          needleHeight={needleHeight}
          needleWidth={needleWidth}
        />
      ) : (
        // Plain split (no needle) — keeps the strip but skips the SVG.
        <V3SplitO
          gapWidth={gapWidth || '0.05em'}
          needleHeight="0"
          needleWidth="0"
        />
      )}
      <span>RDCREATIVE</span>
    </div>
  );
  return bg !== undefined ? (
    <BgContext.Provider value={bg}>{content}</BgContext.Provider>
  ) : content;
};

Object.assign(window, { BgContext, V3SplitO, V3Wordmark });
