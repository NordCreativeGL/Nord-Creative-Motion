// app.jsx — Nord Creative logo exploration.
// Composes mark + wordmark components onto a DesignCanvas, grouped by
// concept (A/B/C/D) and presented on both black and white backgrounds.

const { useState, useEffect } = React;

// ───────────────────────────────────────────────────────────────────────
// Shared display helpers
// ───────────────────────────────────────────────────────────────────────

const Surface = ({ tone = 'dark', children, style }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: tone === 'dark' ? '#000' : '#fff',
      color: tone === 'dark' ? '#fff' : '#000',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {children}
  </div>
);

const Caption = ({ children, tone = 'dark' }) => (
  <div
    style={{
      fontFamily: '"Geist Mono", ui-monospace, monospace',
      fontSize: 10,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      opacity: tone === 'dark' ? 0.45 : 0.5,
      color: tone === 'dark' ? '#fff' : '#000',
    }}
  >
    {children}
  </div>
);

// One artboard layout for a single concept on a single surface tone.
// Shows three sizes of the mark (XL / M / favicon), then the lockup below.
const ConceptBoard = ({ tone, label, marks, Lockup }) => (
  <Surface tone={tone}>
    {/* Header strip */}
    <div
      style={{
        padding: '24px 32px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <Caption tone={tone}>{label}</Caption>
      <Caption tone={tone}>{tone === 'dark' ? 'on black' : 'on white'}</Caption>
    </div>

    {/* Marks row */}
    <div
      style={{
        flex: '1 1 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        padding: '0 32px',
      }}
    >
      {marks.map(([Cmp, sublabel], i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 14,
              color: 'currentColor',
            }}
          >
            <Cmp size={92} />
            <Cmp size={36} />
            <Cmp size={16} />
          </div>
          <Caption tone={tone}>{sublabel}</Caption>
        </div>
      ))}
    </div>

    {/* Lockup strip */}
    <div
      style={{
        borderTop:
          tone === 'dark'
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
        padding: '28px 32px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Lockup.Icon size={44} />
        <Lockup.Wordmark size={26} />
      </div>
      <Caption tone={tone}>lockup</Caption>
    </div>
  </Surface>
);

// Tiny lockup component variants. Each concept passes one in.
const LockupRow = ({ Icon, Wordmark, iconSize = 44, wmSize = 26, gap = 18 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap }}>
    <Icon size={iconSize} />
    <Wordmark size={wmSize} />
  </div>
);

// ───────────────────────────────────────────────────────────────────────
// Context artboards — favicon, navbar, business card, film slate
// ───────────────────────────────────────────────────────────────────────

const NavbarMock = ({ Icon, Wordmark, tone = 'dark' }) => (
  <Surface tone={tone}>
    <div
      style={{
        borderBottom:
          tone === 'dark'
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon size={22} />
        <Wordmark size={13} />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 28,
          fontFamily: '"Geist", sans-serif',
          fontSize: 12,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        <span>Work</span>
        <span>About</span>
        <span>Contact</span>
      </div>
    </div>
    {/* Hero */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* placeholder still — diagonal stripes suggest a film frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            tone === 'dark'
              ? 'repeating-linear-gradient(115deg, transparent 0 22px, rgba(255,255,255,0.025) 22px 23px)'
              : 'repeating-linear-gradient(115deg, transparent 0 22px, rgba(0,0,0,0.04) 22px 23px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 32,
          bottom: 32,
          fontFamily: '"Geist", sans-serif',
          fontSize: 38,
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          maxWidth: '70%',
        }}
      >
        Cinematic storytelling
        <br />
        from 64° north.
      </div>
      <div
        style={{
          position: 'absolute',
          right: 32,
          top: 32,
          fontFamily: '"Geist Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.15em',
          opacity: 0.5,
          textTransform: 'uppercase',
        }}
      >
        Reel — 2026
      </div>
    </div>
  </Surface>
);

const FaviconMock = ({ Icon, tone = 'dark' }) => (
  <Surface tone={tone} style={{ padding: 32 }}>
    <Caption tone={tone}>Icon at favicon / app sizes</Caption>
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        gap: 16,
        marginTop: 24,
      }}
    >
      {[64, 32, 24, 16].map((s) => (
        <div
          key={s}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: s >= 64 ? 18 : 12,
              background: tone === 'dark' ? '#0a0a0a' : '#f4f4f4',
              border:
                tone === 'dark'
                  ? '1px solid rgba(255,255,255,0.06)'
                  : '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={s} />
          </div>
          <div
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: 10,
              opacity: 0.5,
            }}
          >
            {s}px
          </div>
        </div>
      ))}
    </div>
  </Surface>
);

const BusinessCard = ({ Icon, Wordmark, tone = 'dark' }) => (
  <Surface tone={tone === 'dark' ? 'light' : 'dark'} style={{ padding: 32, justifyContent: 'center', alignItems: 'center' }}>
    {/* Card sits on the opposite-tone surface so both sides of the system show */}
    <div
      style={{
        width: 360,
        height: 220,
        background: tone === 'dark' ? '#000' : '#fff',
        color: tone === 'dark' ? '#fff' : '#000',
        boxShadow:
          tone === 'dark'
            ? '0 30px 60px -20px rgba(0,0,0,0.4)'
            : '0 30px 60px -20px rgba(0,0,0,0.18)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Icon size={36} />
      <div>
        <Wordmark size={14} />
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Geist Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.6,
            lineHeight: 1.6,
          }}
        >
          Nuuk · Greenland
          <br />
          hello@nordcreative.dk
        </div>
      </div>
    </div>
  </Surface>
);

// ───────────────────────────────────────────────────────────────────────
// Page assembly
// ───────────────────────────────────────────────────────────────────────

const App = () => {
  // Pick the "primary" mark per concept for the lockup; the others are
  // shown as variations.
  const concepts = [
    {
      id: 'A',
      title: 'A · Compass / North marker',
      subtitle:
        'Reads "Nord" literally — direction, navigation, a film crew\'s waypoint. Tested as crossed needles, lone needle, and ringed compass.',
      marks: [
        [CompassA1, 'A1 · crossed needle'],
        [CompassA2, 'A2 · lone needle'],
        [CompassA3, 'A3 · ringed'],
      ],
      primary: CompassA1,
      wordmark: WordmarkW2, // needle separator pairs naturally with compass
    },
    {
      id: 'B',
      title: 'B · Mountain peaks',
      subtitle:
        'Greenland silhouette — angular, geometric, never illustrative. Three takes: layered peaks, chevron range, framed peak.',
      marks: [
        [PeaksB1, 'B1 · layered'],
        [PeaksB2, 'B2 · chevron range'],
        [PeaksB3, 'B3 · framed peak'],
      ],
      primary: PeaksB1,
      wordmark: WordmarkW5, // V-as-peak echoes the mark
    },
    {
      id: 'C',
      title: 'C · Lens + horizon',
      subtitle:
        'The lens bridges "creative" and landscape. The horizon, peak, and aperture rings each set a different mood.',
      marks: [
        [LensC1, 'C1 · horizon'],
        [LensC2, 'C2 · peak inside'],
        [LensC3, 'C3 · aperture'],
      ],
      primary: LensC1,
      wordmark: WordmarkW1,
    },
    {
      id: 'D',
      title: 'D · N monogram',
      subtitle:
        'Letter-led. The diagonal hides a peak; the right stem can carry a needle cap; a quieter parallel-stems version reads as editorial.',
      marks: [
        [MonoD1, 'D1 · peak diagonal'],
        [MonoD2, 'D2 · needle cap'],
        [MonoD3, 'D3 · parallel stems'],
      ],
      primary: MonoD1,
      wordmark: WordmarkW1,
    },
  ];

  return (
    <DesignCanvas>
      {/* Intro section — design rationale */}
      <DCSection
        id="intro"
        title="Nord Creative — logo system"
        subtitle="Four icon directions × six wordmark explorations. Each concept shown on black + on white, with mark sizes from hero (92px) down to favicon (16px), plus the lockup. The strongest pairings then appear in context (navbar, favicon grid, business card)."
      >
        <DCArtboard id="brief" label="Brief recap" width={760} height={420}>
          <Surface tone="dark" style={{ padding: 36 }}>
            <Caption>The brief</Caption>
            <div
              style={{
                marginTop: 18,
                fontFamily: '"Geist", sans-serif',
                fontSize: 22,
                lineHeight: 1.35,
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: '#fff',
                maxWidth: 600,
              }}
            >
              Film studio meets Arctic explorer. Minimal, cinematic,
              confident. The mark must hold at <em style={{ fontStyle: 'normal', textDecoration: 'underline', textUnderlineOffset: 4 }}>16px</em> and feel
              inevitable at 600px. Quiet confidence — never flashy.
            </div>
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                gap: 32,
                fontFamily: '"Geist Mono", monospace',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span>type · geist</span>
              <span>palette · #000 / #fff</span>
              <span>accent · #c8d8e8 (sparingly)</span>
            </div>
          </Surface>
        </DCArtboard>
      </DCSection>

      {concepts.map((c) => (
        <DCSection key={c.id} id={`concept-${c.id}`} title={c.title} subtitle={c.subtitle}>
          <DCArtboard id={`${c.id}-dark`} label={`${c.id} · on black`} width={760} height={520}>
            <ConceptBoard
              tone="dark"
              label={c.title}
              marks={c.marks}
              Lockup={{ Icon: c.primary, Wordmark: c.wordmark }}
            />
          </DCArtboard>
          <DCArtboard id={`${c.id}-light`} label={`${c.id} · on white`} width={760} height={520}>
            <ConceptBoard
              tone="light"
              label={c.title}
              marks={c.marks}
              Lockup={{ Icon: c.primary, Wordmark: c.wordmark }}
            />
          </DCArtboard>
        </DCSection>
      ))}

      {/* Wordmark explorations standalone */}
      <DCSection
        id="wordmarks"
        title="Wordmark explorations"
        subtitle="Six takes on the type. W1 (peak-A) is the primary candidate — the missing crossbar in CREATIVE reads as a mountain once you see it, but the word still reads cleanly first. W2 pairs naturally with the Compass mark; W5 with the Peaks mark."
      >
        {[
          ['W1', 'W1 · peak A (primary)', WordmarkW1],
          ['W2', 'W2 · needle separator', WordmarkW2],
          ['W3', 'W3 · editorial stack', WordmarkW3],
          ['W5', 'W5 · chevron V', WordmarkW5],
          ['W4', 'W4 · mixed case', WordmarkW4],
          ['W6', 'W6 · 64°N slate', WordmarkW6],
        ].map(([id, label, Wm]) => (
          <DCArtboard key={id} id={`wm-${id}`} label={label} width={520} height={260}>
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', height: '100%' }}>
              <Surface tone="dark" style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wm size={id === 'W3' ? 32 : 22} />
                </div>
              </Surface>
              <Surface tone="light" style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wm size={id === 'W3' ? 32 : 22} />
                </div>
              </Surface>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      {/* In context — strongest lockup pairings shown working */}
      <DCSection
        id="context"
        title="In context"
        subtitle="The two strongest pairings — Compass A1 + W2, and Peaks B1 + W5 — shown working as a navbar, an app-icon grid, and a business card. This is where the system has to feel inevitable."
      >
        <DCArtboard id="nav-compass" label="Navbar — Compass A1 + W2" width={900} height={460}>
          <NavbarMock Icon={CompassA1} Wordmark={WordmarkW2} tone="dark" />
        </DCArtboard>
        <DCArtboard id="nav-peaks" label="Navbar — Peaks B1 + W5" width={900} height={460}>
          <NavbarMock Icon={PeaksB1} Wordmark={WordmarkW5} tone="dark" />
        </DCArtboard>

        <DCArtboard id="fav-compass" label="Favicon scale — Compass A1" width={620} height={340}>
          <FaviconMock Icon={CompassA1} tone="dark" />
        </DCArtboard>
        <DCArtboard id="fav-peaks" label="Favicon scale — Peaks B1" width={620} height={340}>
          <FaviconMock Icon={PeaksB1} tone="light" />
        </DCArtboard>
        <DCArtboard id="fav-mono" label="Favicon scale — Monogram D1" width={620} height={340}>
          <FaviconMock Icon={MonoD1} tone="dark" />
        </DCArtboard>

        <DCArtboard id="card-compass" label="Card — Compass A1 + W2" width={520} height={340}>
          <BusinessCard Icon={CompassA1} Wordmark={WordmarkW2} tone="dark" />
        </DCArtboard>
        <DCArtboard id="card-peaks" label="Card — Peaks B1 + W5" width={520} height={340}>
          <BusinessCard Icon={PeaksB1} Wordmark={WordmarkW5} tone="light" />
        </DCArtboard>
        <DCArtboard id="card-lens" label="Card — Lens C1 + W1" width={520} height={340}>
          <BusinessCard Icon={LensC1} Wordmark={WordmarkW1} tone="dark" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
