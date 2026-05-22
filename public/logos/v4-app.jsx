// v4-app.jsx — focused presentation of the v4 system.
// Deliverables required by the brief:
//   1. Icon mark alone
//   2. Wordmark alone (NORD CREATIVE with space)
//   3. Full lockup (icon + wordmark)
//   4. Everything on black AND on white.

const V4Surface = ({ tone = 'dark', children, style }) => {
  const bg = tone === 'dark' ? '#000' : '#fff';
  return (
    <V4BgContext.Provider value={bg}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          color: tone === 'dark' ? '#fff' : '#000',
          display: 'flex',
          flexDirection: 'column',
          ...style
        }}>
        {children}
      </div>
    </V4BgContext.Provider>
  );
};


const V4Cap = ({ children, tone = 'dark', style }) =>
<div
  style={{
    fontFamily: '"Geist Mono", ui-monospace, monospace',
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    opacity: tone === 'dark' ? 0.45 : 0.5,
    color: tone === 'dark' ? '#fff' : '#000',
    ...style
  }}>
  
    {children}
  </div>;


const V4Hero = ({ tone, label, hint, children, pad = 32 }) =>
<V4Surface tone={tone}>
    <div
    style={{
      padding: `${pad}px ${pad + 4}px 0`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }}>
    
      <V4Cap tone={tone}>{label}</V4Cap>
      {hint && <V4Cap tone={tone}>{hint}</V4Cap>}
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  </V4Surface>;


// Lockup — icon left, wordmark right.
const Lockup = ({ Icon, iconSize = 64, wmSize = 22, gap = 26, iconStroke = 3.5 }) =>
<div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
    <Icon size={iconSize} stroke={iconStroke} />
    <V4Wordmark size={wmSize} weight={200} />
  </div>;


// Scale row — same icon at multiple sizes (favicon test).
const ScaleRow = ({ tone, Icon, stroke = 3.5, sizes = [120, 64, 32, 20] }) =>
<V4Surface tone={tone}>
    <div style={{ padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between' }}>
      <V4Cap tone={tone}>Scale</V4Cap>
      <V4Cap tone={tone}>{sizes.join(' · ')} px</V4Cap>
    </div>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
      {sizes.map((s) =>
    <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={s} stroke={stroke} />
          </div>
          <div style={{ fontFamily: '"Geist Mono", monospace', fontSize: 9, opacity: 0.45, letterSpacing: '0.1em' }}>
            {s}px
          </div>
        </div>
    )}
    </div>
  </V4Surface>;


// ── Composition ───────────────────────────────────────────────────────
const App = () =>
<DesignCanvas>
    <DCSection
    id="intro"
    title="Nord Creative — v4"
    subtitle="Built directly from your reference assets. New wordmark: NORD CREATIVE (with space) in Montserrat ExtraLight + wide tracking. New icon family: the existing split-circle geometry (gaps top + bottom) with the letter N placed inside the ring — both in the same typeface so the elements feel unified.">
    
      <DCArtboard id="brief" label="The brief" width={840} height={360}>
        <V4Surface tone="dark" style={{ padding: 40 }}>
          <V4Cap>Approach</V4Cap>
          <div style={{ marginTop: 22, fontFamily: '"Montserrat", sans-serif', fontWeight: 200, fontSize: 24, lineHeight: 1.4, maxWidth: 640 }}>
            Wordmark stays pure typography. The icon carries the compass meaning — split-ring + N — and reuses the same Montserrat ExtraLight so the symbol and the wordmark read as one family.
          </div>
        </V4Surface>
      </DCArtboard>
    </DCSection>

    {/* ─── Wordmark ─── */}
    <DCSection
    id="wordmark"
    title="1 — Wordmark alone"
    subtitle="NORD CREATIVE in Montserrat ExtraLight (200) with 0.42em letter-spacing and 0.42em additional word-spacing. The O in NORD has a clean vertical split (matches the icon's split-ring). The I in CREATIVE is replaced with a compass-needle diamond — needle is the only literal compass reference left in the wordmark.">
    
      <DCArtboard id="wm-dark" label="On black — with needle-I" width={900} height={300}>
        <V4Hero tone="dark" label="Wordmark · with needle-I" hint="primary">
          <V4Wordmark size={32} weight={200} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="wm-light" label="On white — with needle-I" width={900} height={300}>
        <V4Hero tone="light" label="Wordmark · with needle-I" hint="primary">
          <V4Wordmark size={32} weight={200} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="wm-plain-dark" label="On black — plain I (no needle)" width={900} height={300}>
        <V4Hero tone="dark" label="Wordmark · plain I" hint="comparison">
          <V4Wordmark size={32} weight={200} needleI={false} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="wm-plain-light" label="On white — plain I (no needle)" width={900} height={300}>
        <V4Hero tone="light" label="Wordmark · plain I" hint="comparison">
          <V4Wordmark size={32} weight={200} needleI={false} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="wm-large-dark" label="Large — on black" width={1200} height={340}>
        <V4Hero tone="dark" label="Hero scale" hint="56px · needle-I">
          <V4Wordmark size={56} weight={200} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="wm-large-plain-dark" label="Large plain — on black" width={1200} height={340}>
        <V4Hero tone="dark" label="Hero scale" hint="56px · plain I">
          <V4Wordmark size={56} weight={200} needleI={false} />
        </V4Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── Icon — variations ─── */}
    <DCSection
    id="icon-variants"
    title="2 — Icon alone · the compass mark"
    subtitle="Split ring + compass needle inside. The icon is the concentrated form of the two typographic moves in the wordmark: the split O and the needle I, fused into a single mark. Shown across three needle sizes — small, medium, and large.">
    
      <DCArtboard id="icon-needle-S-dark" label="S · thin needle · on black" width={500} height={460}>
        <V4Hero tone="dark" label="Thin needle" hint="tips at inner edge">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={10} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="icon-needle-S-light" label="S · thin needle · on white" width={500} height={460}>
        <V4Hero tone="light" label="Thin needle" hint="tips at inner edge">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={10} />
        </V4Hero>
      </DCArtboard>

      <DCArtboard id="icon-needle-M-dark" label="M · medium needle · on black" width={500} height={460}>
        <V4Hero tone="dark" label="Medium needle" hint="tips at inner edge">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={14} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="icon-needle-M-light" label="M · medium needle · on white" width={500} height={460}>
        <V4Hero tone="light" label="Medium needle" hint="tips at inner edge">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={14} />
        </V4Hero>
      </DCArtboard>

      <DCArtboard id="icon-needle-L-dark" label="L · wide needle · on black" width={500} height={460}>
        <V4Hero tone="dark" label="Wide needle" hint="ratio matches CREATIVE I">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={23} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="icon-needle-L-light" label="L · wide needle · on white" width={500} height={460}>
        <V4Hero tone="light" label="Wide needle" hint="ratio matches CREATIVE I">
          <IconNeedle size={200} stroke={3.5} needleHeight={93} needleWidth={23} />
        </V4Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── Stroke weight comparison ─── */}
    <DCSection
    id="icon-strokes"
    title="Icon · stroke weights"
    subtitle="The brief says 'thin to light'. Thin (3.5) matches Montserrat 200's stem weight visually. Medium (6) is a middle ground. Thick (12) matches your existing reference icon. Pick the one that holds best at your most-used sizes.">
    
      <DCArtboard id="stroke-thin" label="Thin · stroke 3.5" width={460} height={420}>
        <V4Hero tone="dark" label="Thin" hint="stroke 3.5">
          <IconA size={180} stroke={3.5} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="stroke-medium" label="Medium · stroke 6" width={460} height={420}>
        <V4Hero tone="dark" label="Medium" hint="stroke 6">
          <IconA size={180} stroke={6} nWeight={300} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="stroke-thick" label="Thick · stroke 12 (your current)" width={460} height={420}>
        <V4Hero tone="dark" label="Thick" hint="stroke 12 · current">
          <IconA size={180} stroke={12} nWeight={500} />
        </V4Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── Lockup ─── */}
    <DCSection
    id="lockup"
    title="3 — Full lockup"
    subtitle="Icon left, wordmark right, vertically centred. The lockup uses the primary icon (A · N centered).">
    
      <DCArtboard id="lock-dark" label="On black" width={1000} height={300}>
        <V4Hero tone="dark" label="Lockup" hint="Icon A · Wordmark">
          <Lockup Icon={IconA} iconSize={64} wmSize={22} gap={28} iconStroke={3.5} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="lock-light" label="On white" width={1000} height={300}>
        <V4Hero tone="light" label="Lockup" hint="Icon A · Wordmark">
          <Lockup Icon={IconA} iconSize={64} wmSize={22} gap={28} iconStroke={3.5} />
        </V4Hero>
      </DCArtboard>

      <DCArtboard id="lock-B-dark" label="With Icon B · on black" width={1000} height={300}>
        <V4Hero tone="dark" label="Lockup — alt" hint="Icon B (N at top)">
          <Lockup Icon={IconB} iconSize={64} wmSize={22} gap={28} iconStroke={3.5} />
        </V4Hero>
      </DCArtboard>
      <DCArtboard id="lock-C-dark" label="With Icon C · on black" width={1000} height={300}>
        <V4Hero tone="dark" label="Lockup — alt" hint="Icon C (N large)">
          <Lockup Icon={IconC} iconSize={64} wmSize={22} gap={28} iconStroke={3.5} />
        </V4Hero>
      </DCArtboard>

      <DCArtboard id="lock-hero-dark" label="Hero scale · on black" width={1200} height={380}>
        <V4Hero tone="dark" label="Hero" hint="lockup at scale">
          <Lockup Icon={IconA} iconSize={120} wmSize={32} gap={40} iconStroke={3.5} />
        </V4Hero>
      </DCArtboard>
    </DCSection>

    {/* ─── Scale tests ─── */}
    <DCSection
    id="scale"
    title="Icon · scale test"
    subtitle="Same icon at app / favicon sizes. Thin stroke holds down to ~24px; below that the medium stroke reads better.">
    
      <DCArtboard id="scale-A-dark" label="Icon A · thin · on black" width={1000} height={300}>
        <ScaleRow tone="dark" Icon={IconA} stroke={3.5} />
      </DCArtboard>
      <DCArtboard id="scale-A-light" label="Icon A · thin · on white" width={1000} height={300}>
        <ScaleRow tone="light" Icon={IconA} stroke={3.5} />
      </DCArtboard>
      <DCArtboard id="scale-A-medium" label="Icon A · medium · on black" width={1000} height={300}>
        <ScaleRow tone="dark" Icon={(p) => <IconA {...p} nWeight={300} />} stroke={6} />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);