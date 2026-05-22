// nord-app.jsx — v2 logo presentation.
// Focused on a single direction: simple compass needle icon + NORD CREATIVE
// wordmark with horizontal split-O. Big, airy artboards.

// ── Surface + caption ──────────────────────────────────────────────────
const NSurface = ({ tone = 'dark', children, style }) => (
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

const NCaption = ({ children, tone = 'dark', style }) => (
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

// Hero artboard — single mark/wordmark dead-center with caption strip.
const HeroBoard = ({ tone, label, hint, children }) => (
  <NSurface tone={tone}>
    <div
      style={{
        padding: '24px 32px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <NCaption tone={tone}>{label}</NCaption>
      <NCaption tone={tone}>{hint}</NCaption>
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  </NSurface>
);

// Scale-row artboard — same mark shown at hero / nav / favicon sizes.
const ScaleRow = ({ tone, label, Icon }) => (
  <NSurface tone={tone}>
    <div
      style={{
        padding: '24px 32px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <NCaption tone={tone}>{label}</NCaption>
      <NCaption tone={tone}>120 · 48 · 24 · 16 px</NCaption>
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      {[120, 48, 24, 16].map((s) => (
        <div
          key={s}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              height: 120,
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
              fontSize: 9,
              opacity: 0.45,
              letterSpacing: '0.1em',
            }}
          >
            {s}px
          </div>
        </div>
      ))}
    </div>
  </NSurface>
);

// ── Lockup builder ────────────────────────────────────────────────────
const HLockup = ({ Icon, iconSize = 64, wmSize = 22, gap = 22 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
    <Icon size={iconSize} />
    <WordmarkPrimary size={wmSize} />
  </div>
);

const VLockup = ({ Icon, iconSize = 96, wmSize = 22, gap = 24 }) => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap,
    }}
  >
    <Icon size={iconSize} />
    <WordmarkPrimary size={wmSize} />
  </div>
);

// ── Context mocks ─────────────────────────────────────────────────────

const NavbarMock = ({ Icon, tone = 'dark' }) => (
  <NSurface tone={tone}>
    <div
      style={{
        borderBottom:
          tone === 'dark'
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(0,0,0,0.08)',
        padding: '22px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon size={22} />
        <WordmarkCompact size={12} />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 30,
          fontFamily: '"Geist", sans-serif',
          fontSize: 12,
          letterSpacing: '0.12em',
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
      {/* placeholder film still */}
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
          fontFamily: '"Geist", sans-serif',
          fontWeight: 300,
          fontSize: 44,
          letterSpacing: '-0.02em',
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
  </NSurface>
);

const FaviconGrid = ({ Icon, tone = 'dark' }) => (
  <NSurface tone={tone} style={{ padding: 32 }}>
    <NCaption tone={tone}>Icon at app / favicon sizes</NCaption>
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
              width: 92,
              height: 92,
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
              fontSize: 9,
              opacity: 0.45,
              letterSpacing: '0.1em',
            }}
          >
            {s}px
          </div>
        </div>
      ))}
    </div>
  </NSurface>
);

const BusinessCard = ({ Icon, surfaceTone = 'dark', cardTone = 'dark' }) => (
  <NSurface
    tone={surfaceTone}
    style={{ padding: 32, justifyContent: 'center', alignItems: 'center' }}
  >
    <div
      style={{
        width: 380,
        height: 230,
        background: cardTone === 'dark' ? '#000' : '#fff',
        color: cardTone === 'dark' ? '#fff' : '#000',
        boxShadow:
          surfaceTone === 'dark'
            ? '0 30px 60px -20px rgba(0,0,0,0.5)'
            : '0 30px 60px -20px rgba(0,0,0,0.18)',
        padding: 26,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Icon size={32} />
      <div>
        <WordmarkCompact size={13} />
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Geist Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.12em',
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
  </NSurface>
);

// ── Composition ───────────────────────────────────────────────────────
const App = () => (
  <DesignCanvas>
    <DCSection
      id="intro"
      title="Nord Creative — v2"
      subtitle="Single focused direction. Compass needle icon (refined from A2) + NORD CREATIVE wordmark where the O is split horizontally — the gap reads as a horizon line. Type set in Geist (matches the Vercel site)."
    >
      <DCArtboard id="brief" label="The concept" width={780} height={420}>
        <NSurface tone="dark" style={{ padding: 40 }}>
          <NCaption>Concept</NCaption>
          <div
            style={{
              marginTop: 22,
              fontFamily: '"Geist", sans-serif',
              fontSize: 24,
              fontWeight: 300,
              lineHeight: 1.35,
              letterSpacing: '-0.01em',
              maxWidth: 620,
            }}
          >
            The needle points north — vertical. The split in the O points
            across — horizontal. Together: a compass cross. Navigation +
            horizon, in one quiet system.
          </div>
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              gap: 36,
              fontFamily: '"Geist Mono", monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}
          >
            <span>type · geist 500 / 400</span>
            <span>palette · #000 · #fff</span>
            <span>min size · 16px</span>
          </div>
        </NSurface>
      </DCArtboard>
    </DCSection>

    {/* ─── Icon ─── */}
    <DCSection
      id="icon"
      title="The icon — compass needle"
      subtitle="N1 is the primary (cardinal ticks for legibility at small sizes). N2 strips the ticks for the quietest form. N3 adds a tiny pivot dot at center."
    >
      <DCArtboard id="icon-N1-dark" label="N1 · primary · on black" width={520} height={420}>
        <HeroBoard tone="dark" label="N1 · primary" hint="120px">
          <NeedleN1 size={160} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="icon-N1-light" label="N1 · primary · on white" width={520} height={420}>
        <HeroBoard tone="light" label="N1 · primary" hint="120px">
          <NeedleN1 size={160} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="icon-N2-dark" label="N2 · quiet · on black" width={520} height={420}>
        <HeroBoard tone="dark" label="N2 · no ticks" hint="120px">
          <NeedleN2 size={160} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="icon-N3-dark" label="N3 · with pivot · on black" width={520} height={420}>
        <HeroBoard tone="dark" label="N3 · with pivot dot" hint="120px">
          <NeedleN3 size={160} />
        </HeroBoard>
      </DCArtboard>

      <DCArtboard id="icon-scale-dark" label="Scale test — N1 on black" width={900} height={300}>
        <ScaleRow tone="dark" label="N1 across sizes" Icon={NeedleN1} />
      </DCArtboard>
      <DCArtboard id="icon-scale-light" label="Scale test — N1 on white" width={900} height={300}>
        <ScaleRow tone="light" label="N1 across sizes" Icon={NeedleN1} />
      </DCArtboard>
    </DCSection>

    {/* ─── Wordmark ─── */}
    <DCSection
      id="wordmark"
      title="The wordmark — NORD with split O"
      subtitle="O is cut horizontally; the gap is the horizon. NORD set in Geist 500, CREATIVE in 400 for a quiet hierarchy. Letter-spacing 0.16em gives the editorial / film-credit feel without losing density."
    >
      <DCArtboard id="wm-primary-dark" label="Primary · on black" width={780} height={340}>
        <HeroBoard tone="dark" label="Primary wordmark" hint="single line">
          <WordmarkPrimary size={42} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="wm-primary-light" label="Primary · on white" width={780} height={340}>
        <HeroBoard tone="light" label="Primary wordmark" hint="single line">
          <WordmarkPrimary size={42} />
        </HeroBoard>
      </DCArtboard>

      <DCArtboard id="wm-stacked-dark" label="Stacked · on black" width={520} height={420}>
        <HeroBoard tone="dark" label="Stacked variant" hint="editorial">
          <WordmarkStacked size={64} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="wm-stacked-light" label="Stacked · on white" width={520} height={420}>
        <HeroBoard tone="light" label="Stacked variant" hint="editorial">
          <WordmarkStacked size={64} />
        </HeroBoard>
      </DCArtboard>

      <DCArtboard id="wm-vsplit-dark" label="Vertical-split O · alt · on black" width={780} height={340}>
        <HeroBoard tone="dark" label="Alt — O split vertically" hint="comparison">
          <WordmarkPrimary size={42} splitOrientation="v" />
        </HeroBoard>
      </DCArtboard>
    </DCSection>

    {/* ─── Lockups ─── */}
    <DCSection
      id="lockups"
      title="Lockups"
      subtitle="Icon + wordmark. Horizontal lockup for navbars and signatures; vertical lockup for headers, splash, business cards."
    >
      <DCArtboard id="lockup-h-dark" label="Horizontal · on black" width={900} height={340}>
        <HeroBoard tone="dark" label="Horizontal lockup" hint="primary">
          <HLockup Icon={NeedleN1} iconSize={64} wmSize={24} gap={26} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="lockup-h-light" label="Horizontal · on white" width={900} height={340}>
        <HeroBoard tone="light" label="Horizontal lockup" hint="primary">
          <HLockup Icon={NeedleN1} iconSize={64} wmSize={24} gap={26} />
        </HeroBoard>
      </DCArtboard>

      <DCArtboard id="lockup-v-dark" label="Vertical · on black" width={520} height={460}>
        <HeroBoard tone="dark" label="Vertical lockup" hint="splash / card">
          <VLockup Icon={NeedleN1} iconSize={110} wmSize={22} gap={32} />
        </HeroBoard>
      </DCArtboard>
      <DCArtboard id="lockup-v-light" label="Vertical · on white" width={520} height={460}>
        <HeroBoard tone="light" label="Vertical lockup" hint="splash / card">
          <VLockup Icon={NeedleN1} iconSize={110} wmSize={22} gap={32} />
        </HeroBoard>
      </DCArtboard>
    </DCSection>

    {/* ─── In context ─── */}
    <DCSection
      id="context"
      title="In context"
      subtitle="The system in use — navbar, favicon scale, business card."
    >
      <DCArtboard id="nav-dark" label="Navbar — on black" width={1000} height={480}>
        <NavbarMock Icon={NeedleN1} tone="dark" />
      </DCArtboard>
      <DCArtboard id="nav-light" label="Navbar — on white" width={1000} height={480}>
        <NavbarMock Icon={NeedleN1} tone="light" />
      </DCArtboard>

      <DCArtboard id="fav-dark" label="Favicon scale — black" width={620} height={340}>
        <FaviconGrid Icon={NeedleN1} tone="dark" />
      </DCArtboard>
      <DCArtboard id="fav-light" label="Favicon scale — white" width={620} height={340}>
        <FaviconGrid Icon={NeedleN1} tone="light" />
      </DCArtboard>

      <DCArtboard id="card-dark" label="Card — black on light" width={520} height={340}>
        <BusinessCard Icon={NeedleN1} surfaceTone="light" cardTone="dark" />
      </DCArtboard>
      <DCArtboard id="card-light" label="Card — white on dark" width={520} height={340}>
        <BusinessCard Icon={NeedleN1} surfaceTone="dark" cardTone="light" />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
