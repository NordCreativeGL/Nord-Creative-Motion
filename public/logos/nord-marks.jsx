// nord-marks.jsx — refined compass-needle marks.
// Same direction as A2 but cleaned up. Three weight options so you can
// pick the one that holds best across sizes.

const NMark = ({ size = 96, children, ...props }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    {children}
  </svg>
);

// N1 — Primary. Lone vertical needle: top half filled, bottom half hollow.
// Two small cardinal ticks (E/W). Pure, minimal, reads at any size.
const NeedleN1 = ({ size }) => (
  <NMark size={size}>
    <polygon points="50,8 57,50 50,53 43,50" fill="currentColor" />
    <polygon
      points="50,92 57,50 50,47 43,50"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    <line x1="6" y1="50" x2="13" y2="50" stroke="currentColor" strokeWidth="1.6" />
    <line x1="87" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="1.6" />
  </NMark>
);

// N2 — Thinner, more elongated needle. No cardinal ticks. The quietest
// version — works beautifully at small sizes, almost like punctuation.
const NeedleN2 = ({ size }) => (
  <NMark size={size}>
    <polygon points="50,6 55,50 50,52 45,50" fill="currentColor" />
    <polygon
      points="50,94 55,50 50,48 45,50"
      stroke="currentColor"
      strokeWidth="1.4"
      fill="none"
    />
  </NMark>
);

// N3 — Same lone needle, with a tiny pivot dot at center. The dot is
// almost invisible at small sizes; at large sizes it gives the mark a
// fulcrum.
const NeedleN3 = ({ size }) => (
  <NMark size={size}>
    <polygon points="50,8 56,50 50,52 44,50" fill="currentColor" />
    <polygon
      points="50,92 56,50 50,48 44,50"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="50" cy="50" r="1.2" fill="currentColor" />
  </NMark>
);

Object.assign(window, { NeedleN1, NeedleN2, NeedleN3 });
