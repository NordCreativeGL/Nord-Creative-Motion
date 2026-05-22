// final-app.jsx — focused selection: wordmark + L wide-needle icon only.

const FSurface = ({ tone = 'dark', children, style }) => {
  const bg = tone === 'dark' ? '#000' : '#fff';
  return (
    <V4BgContext.Provider value={bg}>
      <div style={{
        width:'100%', height:'100%',
        background: bg,
        color: tone === 'dark' ? '#fff' : '#000',
        display:'flex', flexDirection:'column',
        ...style,
      }}>
        {children}
      </div>
    </V4BgContext.Provider>
  );
};

const FCap = ({ children, tone = 'dark' }) => (
  <div style={{
    fontFamily:'"Geist Mono", ui-monospace, monospace',
    fontSize: 10, letterSpacing:'0.2em', textTransform:'uppercase',
    opacity: tone === 'dark' ? 0.45 : 0.5,
  }}>{children}</div>
);

const FBoard = ({ tone, label, children }) => (
  <FSurface tone={tone}>
    <div style={{ padding:'28px 32px 0', display:'flex', justifyContent:'space-between' }}>
      <FCap tone={tone}>{label}</FCap>
      <FCap tone={tone}>{tone === 'dark' ? 'on black' : 'on white'}</FCap>
    </div>
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {children}
    </div>
  </FSurface>
);

const App = () => (
  <DesignCanvas>
    <DCSection
      id="wordmark"
      title="1 — Wordmark"
      subtitle="NORD CREATIVE in Montserrat ExtraLight (200). Tracking 0.32em / word-spacing 0.32em. The O in NORD is split vertically. Two I variants: compass-needle diamond (primary) and plain I (alternate).">
      <DCArtboard id="wm-dark" label="With needle-I · on black" width={1000} height={320}>
        <FBoard tone="dark" label="Wordmark · needle I">
          <V4Wordmark size={36} weight={200} />
        </FBoard>
      </DCArtboard>
      <DCArtboard id="wm-light" label="With needle-I · on white" width={1000} height={320}>
        <FBoard tone="light" label="Wordmark · needle I">
          <V4Wordmark size={36} weight={200} />
        </FBoard>
      </DCArtboard>
      <DCArtboard id="wm-plain-dark" label="Plain I · on black" width={1000} height={320}>
        <FBoard tone="dark" label="Wordmark · plain I">
          <V4Wordmark size={36} weight={200} needleI={false} />
        </FBoard>
      </DCArtboard>
      <DCArtboard id="wm-plain-light" label="Plain I · on white" width={1000} height={320}>
        <FBoard tone="light" label="Wordmark · plain I">
          <V4Wordmark size={36} weight={200} needleI={false} />
        </FBoard>
      </DCArtboard>
    </DCSection>

    <DCSection
      id="icon"
      title="2 — Icon · L wide needle"
      subtitle="Split ring + compass needle (wide). Tips reach the inner edge of the ring; needle proportions match the I in the wordmark.">
      <DCArtboard id="icon-dark" label="On black" width={600} height={520}>
        <FBoard tone="dark" label="Icon · L wide">
          <IconNeedle size={260} stroke={3.5} needleHeight={93} needleWidth={23} />
        </FBoard>
      </DCArtboard>
      <DCArtboard id="icon-light" label="On white" width={600} height={520}>
        <FBoard tone="light" label="Icon · L wide">
          <IconNeedle size={260} stroke={3.5} needleHeight={93} needleWidth={23} />
        </FBoard>
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
