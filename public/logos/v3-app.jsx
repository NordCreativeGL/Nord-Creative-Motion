// v3-app.jsx — clean, minimal logo presentation matching reference screenshot.

const V3Surface = ({ tone = 'dark', children, style }) => {
  const bg = tone === 'dark' ? '#000' : '#fff';
  return (
    <BgContext.Provider value={bg}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          color: tone === 'dark' ? '#fff' : '#000',
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {children}
      </div>
    </BgContext.Provider>
  );
};

const V3Cap = ({ children, tone = 'dark', style }) => (
  <div
    style={{
      fontFamily: '"Geist Mono", ui-monospace, monospace',
      fontSize: 10,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      opacity: tone === 'dark' ? 0.45 : 0.5,
      color: tone === 'dark' ? '#fff' : '#000',
      ...style,
    }}
  >
    {children}
  </div>
);

// Hero artboard with a single centered piece.
const V3Hero = ({ tone, label, hint, children, pad = 32 }) => (
  <V3Surface tone={tone}>
    <div
      style={{
        padding: `${pad}px ${pad + 4}px 0`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <V3Cap tone={tone}>{label}</V3Cap>
      {hint && <V3Cap tone={tone}>{hint}</V3Cap>}
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </V3Surface>
);

// Scale row — same mark at multiple sizes.
const V3ScaleRow = ({ tone, Icon, sizes = [120, 48, 24, 16] }) => (
  <V3Surface tone={tone}>
    <div style={{ padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between' }}>
      <V3Cap tone={tone}>Scale test</V3Cap>
      <V3Cap tone={tone}>{sizes.join(' · ')} px</V3Cap>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      {sizes.map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={s} />
          </div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, opacity: 0.45, letterSpacing: '0.1em' }}>
            {s}px
          </div>
        </div>
      ))}
    </div>
  </V3Surface>
);

// Lockup — horizontal: icon left, wordmark right.
const HLock = ({ Icon, iconSize = 48, wmSize = 18, gap = 22, wmWeight = 200 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
    <Icon size={iconSize} />
    <V3Wordmark size={wmSize} weight={wmWeight} />
  </div>
);

// Lockup — vertical: icon above wordmark.
const VLock = ({ Icon, iconSize = 96, wmSize = 18, gap = 28, wmWeight = 200 }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap }}>
    <Icon size={iconSize} />
    <V3Wordmark size={wmSize} weight={wmWeight} />
  </div>
);

// Navbar mock
const NavMock = ({ Icon, tone = 'dark', iconSize = 24, wmSize = 11 }) => (
  <V3Surface tone={tone}>
    <div
      style={{
        borderBottom: tone === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        padding: '22px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {Icon ? <Icon size={iconSize} /> : null}
        <V3Wordmark size={wmSize} weight={300} tracking="0.45em" />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 300,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.75,
        }}
      >
        <span>Home</span>
        <span>Greenland</span>
        <span>Beyond the Arctic</span>
        <span>About</span>
      </div>
    </div>
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            tone === 'dark'
              ? 'repeating-linear-gradient(115deg, transparent 0 24px, rgba(255,255,255,0.025) 24px 25px)'
              : 'repeating-linear-gradient(115deg, transparent 0 24px, rgba(0,0,0,0.04) 24px 25px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 36,
          bottom: 36,
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 200,
          fontSize: 48,
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
        }}
      >
        Visual storytelling
        <br />
        from Greenland.
      </div>
      <div
        style={{
          position: 'absolute',
          right: 36,
          top: 32,
          fontFamily: '"Geist Mono", monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          opacity: 0.55,
        }}
      >
        Reel · 2026
      </div>
    </div>
  </V3Surface>
);

const FavGrid = ({ Icon, tone = 'dark' }) => (
  <V3Surface tone={tone} style={{ padding: 32 }}>
    <V3Cap tone={tone}>Icon at app / favicon sizes</V3Cap>
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
        justifyItems: 'center',
        gap: 16,
        marginTop: 22,
      }}
    >
      {[64, 32, 24, 16].map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: s >= 64 ? 18 : 12,
              background: tone === 'dark' ? '#0a0a0a' : '#f4f4f4',
              border: tone === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={s} />
          </div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, opacity: 0.45, letterSpacing: '0.1em' }}>
            {s}px
          </div>
        </div>
      ))}
    </div>
  </V3Surface>
);

const Card = ({ Icon, surfaceTone = 'light', cardTone = 'dark', iconSize = 32 }) => {
  const cardBg = cardTone === 'dark' ? '#000' : '#fff';
  return (
  <V3Surface tone={surfaceTone} style={{ padding: 32, justifyContent: 'center', alignItems: 'center' }}>
    <BgContext.Provider value={cardBg}>
    <div
      style={{
        width: 380,
        height: 230,
        background: cardBg,
        color: cardTone === 'dark' ? '#fff' : '#000',
        boxShadow: surfaceTone === 'light' ? '0 30px 60px -20px rgba(0,0,0,0.18)' : '0 30px 60px -20px rgba(0,0,0,0.5)',
        padding: 26,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {Icon ? <Icon size={iconSize} /> : <V3Wordmark size={11} weight={300} />}
      <div>
        {Icon ? <V3Wordmark size={11} weight={300} /> : null}
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 300,
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.6,
            lineHeight: 1.7,
          }}
        >
          Qaqortoq · Greenland
          <br />
          contact@nordcreative.dk
          <br />
          +45 30 49 30 46
        </div>
      </div>
    </div>
    </BgContext.Provider>
  </V3Surface>
  );
};

// ── Composition ───────────────────────────────────────────────────────
const App = () => (
  <DesignCanvas>
    <DCSection
      id="intro"
      title="Nord Creative — v3"
      subtitle="Single-word NORDCREATIVE in Montserrat ExtraLight with wide tracking — matches the reference screenshot. The O is split with a wider vertical gap, and a compass needle sits inside the slot: the O becomes a small compass. Several minimal external mark options that all speak the same simple visual language: a circle, a line, nothing extra."
    >
      <DCArtboard id="ref-match" label="Wordmark — direct match to reference" width={900} height={300}>
        <V3Hero tone="dark" label="NORDCREATIVE" hint="Montserrat 200 · 0.42em">
          <V3Wordmark size={26} weight={200} tracking="0.42em" />
        </V3Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── Wordmark studies ─── */}
    <DCSection
      id="wordmark"
      title="Wordmark — compass needle in the O"
      subtitle="The O is cut with a wide vertical slot; a compass needle sits inside it (filled north, outlined south). The O is now a compass. ExtraLight (200) is the primary — matches your reference. Light (300) is the fallback for very small sizes where 200 starts to disappear."
    >
      <DCArtboard id="wm-200-dark" label="ExtraLight (200) · on black" width={900} height={300}>
        <V3Hero tone="dark" label="Primary" hint="200 · 0.42em tracking">
          <V3Wordmark size={28} weight={200} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="wm-200-light" label="ExtraLight (200) · on white" width={900} height={300}>
        <V3Hero tone="light" label="Primary" hint="200 · 0.42em tracking">
          <V3Wordmark size={28} weight={200} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="wm-300-dark" label="Light (300) · on black" width={900} height={300}>
        <V3Hero tone="dark" label="Small-size variant" hint="300 · 0.42em tracking">
          <V3Wordmark size={28} weight={300} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="wm-300-light" label="Light (300) · on white" width={900} height={300}>
        <V3Hero tone="light" label="Small-size variant" hint="300 · 0.42em tracking">
          <V3Wordmark size={28} weight={300} />
        </V3Hero>
      </DCArtboard>

      <DCArtboard id="wm-large" label="At hero scale" width={1200} height={360}>
        <V3Hero tone="dark" label="Hero scale" hint="48px">
          <V3Wordmark size={48} weight={200} tracking="0.42em" />
        </V3Hero>
      </DCArtboard>

      <DCArtboard id="wm-tracking-comparison" label="Tracking comparison" width={1200} height={420}>
        <V3Surface tone="dark" style={{ padding: '28px 32px' }}>
          <V3Cap>Tracking options</V3Cap>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 36 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, opacity: 0.4, width: 60 }}>0.30</span>
              <V3Wordmark size={24} weight={200} tracking="0.30em" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 36 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, opacity: 0.4, width: 60 }}>0.42</span>
              <V3Wordmark size={24} weight={200} tracking="0.42em" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 36 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, opacity: 0.4, width: 60 }}>0.55</span>
              <V3Wordmark size={24} weight={200} tracking="0.55em" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 36 }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 10, opacity: 0.4, width: 60 }}>0.70</span>
              <V3Wordmark size={24} weight={200} tracking="0.70em" />
            </div>
          </div>
        </V3Surface>
      </DCArtboard>
    </DCSection>

    {/* ─── Mark options ─── */}
    <DCSection
      id="marks"
      title="Mark options — circle + line vocabulary"
      subtitle="Five minimal directions. M1 is the most conceptual: the icon IS the O from the wordmark, just scaled up — a brand built from a single shape. M2–M5 add progressively more compass cues."
    >
      <DCArtboard id="m1-dark" label="M1 · Split circle (= the O)" width={460} height={420}>
        <V3Hero tone="dark" label="M1 · Split circle" hint="= O from wordmark">
          <MarkSplitCircle size={140} weight="thin" />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="m2-dark" label="M2 · Circle + needle" width={460} height={420}>
        <V3Hero tone="dark" label="M2 · Circle + needle" hint="N–S axis">
          <MarkCircleNeedle size={140} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="m3-dark" label="M3 · Asymmetric needle" width={460} height={420}>
        <V3Hero tone="dark" label="M3 · Asymmetric needle" hint="north emphasised">
          <MarkAsymNeedle size={140} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="m4-dark" label="M4 · North tick" width={460} height={420}>
        <V3Hero tone="dark" label="M4 · North tick" hint="quietest">
          <MarkNorthTick size={140} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="m5-dark" label="M5 · Crosshair" width={460} height={420}>
        <V3Hero tone="dark" label="M5 · Crosshair" hint="viewfinder">
          <MarkCrosshair size={140} />
        </V3Hero>
      </DCArtboard>

      <DCArtboard id="m1-light" label="M1 · on white" width={460} height={420}>
        <V3Hero tone="light" label="M1 · Split circle" hint="on white">
          <MarkSplitCircle size={140} weight="thin" />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="m2-light" label="M2 · on white" width={460} height={420}>
        <V3Hero tone="light" label="M2 · Circle + needle" hint="on white">
          <MarkCircleNeedle size={140} />
        </V3Hero>
      </DCArtboard>

      <DCArtboard id="marks-scale" label="Scale test — M2" width={1100} height={300}>
        <V3ScaleRow tone="dark" Icon={MarkCircleNeedle} />
      </DCArtboard>
      <DCArtboard id="marks-scale-m1" label="Scale test — M1" width={1100} height={300}>
        <V3ScaleRow tone="dark" Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} />
      </DCArtboard>
    </DCSection>

    {/* ─── Lockups ─── */}
    <DCSection
      id="lockups"
      title="Lockups"
      subtitle="Mark + wordmark combinations. M1 lockup is conceptually tightest — the icon repeats the O, making the brand a single coherent gesture."
    >
      <DCArtboard id="lock-m1-h" label="M1 · horizontal" width={900} height={300}>
        <V3Hero tone="dark" label="Horizontal lockup" hint="M1 split-circle">
          <HLock Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} iconSize={56} wmSize={22} gap={28} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="lock-m2-h" label="M2 · horizontal" width={900} height={300}>
        <V3Hero tone="dark" label="Horizontal lockup" hint="M2 needle">
          <HLock Icon={MarkCircleNeedle} iconSize={56} wmSize={22} gap={28} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="lock-m3-h" label="M3 · horizontal" width={900} height={300}>
        <V3Hero tone="dark" label="Horizontal lockup" hint="M3 asymmetric">
          <HLock Icon={MarkAsymNeedle} iconSize={56} wmSize={22} gap={28} />
        </V3Hero>
      </DCArtboard>

      <DCArtboard id="lock-m1-v" label="M1 · vertical" width={520} height={460}>
        <V3Hero tone="dark" label="Vertical lockup" hint="M1">
          <VLock Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} iconSize={100} wmSize={20} gap={32} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="lock-m2-v" label="M2 · vertical" width={520} height={460}>
        <V3Hero tone="dark" label="Vertical lockup" hint="M2">
          <VLock Icon={MarkCircleNeedle} iconSize={100} wmSize={20} gap={32} />
        </V3Hero>
      </DCArtboard>
      <DCArtboard id="lock-m3-v" label="M3 · vertical" width={520} height={460}>
        <V3Hero tone="dark" label="Vertical lockup" hint="M3">
          <VLock Icon={MarkAsymNeedle} iconSize={100} wmSize={20} gap={32} />
        </V3Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── In context ─── */}
    <DCSection
      id="context"
      title="In context"
      subtitle="The wordmark works on its own (matches your reference shot exactly). With or without an icon — both are valid signatures depending on the use."
    >
      <DCArtboard id="nav-wordmark-only" label="Navbar — wordmark only" width={1100} height={500}>
        <NavMock Icon={null} tone="dark" />
      </DCArtboard>
      <DCArtboard id="nav-m1" label="Navbar — with M1" width={1100} height={500}>
        <NavMock Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} tone="dark" iconSize={22} />
      </DCArtboard>
      <DCArtboard id="nav-m2" label="Navbar — with M2" width={1100} height={500}>
        <NavMock Icon={MarkCircleNeedle} tone="dark" iconSize={22} />
      </DCArtboard>

      <DCArtboard id="fav-m1" label="Favicon — M1" width={640} height={360}>
        <FavGrid Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} tone="dark" />
      </DCArtboard>
      <DCArtboard id="fav-m2" label="Favicon — M2" width={640} height={360}>
        <FavGrid Icon={MarkCircleNeedle} tone="dark" />
      </DCArtboard>
      <DCArtboard id="fav-m3" label="Favicon — M3" width={640} height={360}>
        <FavGrid Icon={MarkAsymNeedle} tone="dark" />
      </DCArtboard>

      <DCArtboard id="card-wmonly" label="Card — wordmark only" width={520} height={360}>
        <Card Icon={null} surfaceTone="light" cardTone="dark" />
      </DCArtboard>
      <DCArtboard id="card-m1" label="Card — with M1" width={520} height={360}>
        <Card Icon={(p) => <MarkSplitCircle {...p} weight="thin" />} surfaceTone="light" cardTone="dark" iconSize={32} />
      </DCArtboard>
      <DCArtboard id="card-m2" label="Card — with M2" width={520} height={360}>
        <Card Icon={MarkCircleNeedle} surfaceTone="dark" cardTone="light" iconSize={32} />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
