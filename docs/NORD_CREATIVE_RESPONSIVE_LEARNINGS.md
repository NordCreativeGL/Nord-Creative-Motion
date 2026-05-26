# NORD CREATIVE — RESPONSIVE LEARNINGS
## Multi-screen layout: hvad der virker, hvad der ikke virker, hvad der er låst

---

## 1. SKÆRM-REFERENCE

| Skærm | CSS viewport | Breakpoint |
|---|---|---|
| MacBook 16" M-series | **1728px** (IKKE 1440px) | default |
| Mac Studio | **2132px** | `min-[1900px]:` |

**Kritisk regel:** Mål altid `window.innerWidth` med DevTools **lukket**. Docked DevTools-panel spiser ~160px og giver falske værdier.

**Brug aldrig `2xl:` (1536px) til Studio-only ændringer** — 1536px aktiverer på MacBook (1728px). Brug altid `min-[1900px]:`.

---

## 2. FONT-KONSISTENS — BEKRÆFTEDE VÆRDIER (gælder hele sitet)

| Element | MacBook | Studio | Clamp-værdi |
|---|---|---|---|
| Headings | ~48px | ~64px | `clamp(28px, 2.78vw, 68px)` |
| Body | ~20px | ~24px | `clamp(1.125rem, 1.15vw, 1.5rem)` |
| Buttons | ~16px | ~19px | `clamp(15px, 0.9vw, 19px)` |

Disse værdier er testet og godkendt på begge skærme. Brug dem på alle komponenter — afvig ikke uden grund.

---

## 3. SEKTION-FOR-SEKTION STATUS OG REGLER

### HeroSection
- **Status:** Låst — rør ikke
- Logo-animation: untouchable
- Ring/nål: fully responsive via `getBoundingClientRect()`
- `oTargetY = wmRect.top + wmRect.height * 0.4`, `needleTargetY = wmRect.top + wmRect.height * 0.41`
- Revert aldrig til hardcodede pixels her

### ServicesSection
- **Status:** Godkendt på begge skærme ✅
- Studio-fix: `min-[1900px]:max-w-[1700px]`
- Fonts skalerer korrekt med clamp

### GreenlandSection
- **Status:** Godkendt på begge skærme ✅
- Kolonnesplit: `width: 46%` (tekst) / `width: 54%` (billede) — rør ikke
- Inner wrapper: `paddingLeft: clamp(180px, 18vw, 260px)` + `maxWidth: clamp(680px, 40vw, 820px)`
- **Bruger inline styles** — ingen Tailwind breakpoints mulige i denne komponent
- På Studio er der en smule mere sort mellem tekstblok og billedkolonne end på MacBook. Det er en accepteret trade-off — det er ikke fixbart uden at bryde noget andet. Det er done.

### CTABanner
- **Status:** Godkendt på begge skærme ✅
- Tekstposition: `bottom: 3%`
- Fonts: heading/body/button følger site-wide clamp-værdier

### BasedInGreenland
- **Status:** Godkendt på begge skærme ✅
- Fonts: site-wide clamp-værdier anvendt
- **Tekstkolonne layout:**
  - `flex: '0 0 50%'`
  - `paddingLeft: isStudio ? 'clamp(300px, 17vw, 400px)' : 'clamp(160px, 16vw, 220px)'`
  - `transform: 'translateX(150px)'` — **static inline style, rør det ikke**
  - `isStudio` defineret som `window.innerWidth >= 1900`
- **Body tekst maxWidth:** `isStudio ? '540px' : '510px'` på alle tre paragraffer
- **"We work here" heading paddingLeft:** `isStudio ? 'clamp(120px, 10vw, 180px)' : 'clamp(160px, 18vw, 240px)'`
- **Globe finalScale:** `Math.round(2050 * (window.innerWidth / 1728))` — proportional med viewport
- **Globe lerp og final state:** bruger variablen `finalScale` — ikke hardcodet `2050`
- **Globe slutposition:** `cx = W * 0.74`, `cy = H * 0.51` — proportional, rør ikke
- Globe-størrelsen er godkendt på begge skærme. Slutpositionen er ikke justeret for Studio — accepteret beslutning.

### Footer
- **Status:** Ikke rørt endnu ❌

---

## 4. GLOBALE TEKNISKE REGLER

### GSAP
- Altid module-level registration
- Altid `gsap.context()` med cleanup
- Scroll trigger threshold: `sectionTop - window.innerHeight * 0.5`
- Primary ease: `cubic-bezier(0.25, 0.1, 0.15, 1)`

### Responsive strategi
- Tailwind breakpoints: brug `min-[1900px]:` til alt der kun skal gælde Studio
- Inline styles (fx BasedInGreenland): brug `isStudio` useState + useEffect med `window.innerWidth >= 1900`
- `clamp()` til fonts — altid
- Fixed pixels til layout accepteres kun hvis der er en isStudio-check

### isStudio pattern (når Tailwind ikke er muligt)
```tsx
const [isStudio, setIsStudio] = useState(false)
useEffect(() => {
  const check = () => setIsStudio(window.innerWidth >= 1900)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])
```

---

## 5. HVAD VI LÆRTE PÅ DEN HÅRDE MÅDE

- `2xl:` (1536px) aktiverer på MacBook 16" (1728px) — aldrig bruge til Studio-only
- GreenlandSection bruger kun inline styles — ingen Tailwind breakpoints virker der
- `translateX(150px)` i BasedInGreenland ligner animation men er et static inline style. Det er alligevel låst — rør det ikke.
- DevTools åben → falsk viewport-måling. Mål altid med DevTools lukket.
- Læs komponenten inden du skriver prompten — aldrig omvendt
- Send aldrig samme prompt igen uden ændringer
- Percentage-baserede kolonnebredder (`width: 46%`) giver proportionalt bredere kolonner på Studio — ethvert padding-baseret layout skaber mere dead space på den bredere skærm
- `marginLeft: auto` bryder alignment med andre sektioner
- Fixed pixel bredder (`width: 640px`) giver for aggressiv tekstwrap ved max font-størrelser

---

## 6. GODKENDT JSX-STRUKTUR — SNAPSHOT (må ikke afviges uden grund)

### ServicesSection.tsx
```tsx
return (
  <div id="services" ref={sectionRef} style={{ height: "400vh" }}>
    <div
      style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      className="bg-black flex items-center"
    >
      <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16 w-full grid grid-cols-2 gap-16 min-[1900px]:gap-24 items-center h-full">
        {/* Left: text */}
        <div>
          <div ref={labelRef} className="text-sm tracking-[0.25em] uppercase text-white/50 mb-6">What we offer</div>
          <h2 className="text-4xl md:text-5xl min-[1900px]:text-[clamp(48px,3vw,68px)] font-light text-white mb-4 leading-tight">
            <div ref={line1Ref}>Visual work for brands,</div>
            <div ref={line2Ref}>companies and projects</div>
          </h2>
          <div ref={accentRef} className="text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] text-white/40 font-light mb-8">— with a story to tell or a product to sell</div>
          <div ref={bodyRef} className="text-lg min-[1900px]:text-[clamp(18px,1.2vw,26px)] text-white/60 leading-relaxed">
            We create visual content for companies working in environments where access, logistics, and conditions require planning and flexibility — helping businesses stand out and gain visibility with customers and investors.
          </div>
        </div>
        {/* Right: 9:16 card stack */}
        <div className="flex justify-center items-center h-full">
          <div style={{ position: "relative", width: CARD_W, height: `calc(${CARD_H} + 44px)`, marginTop: "48px" }}>
            {/* Card 1 */}
            <div ref={card1Ref} style={{ borderRadius: 16, overflow: "hidden", transformOrigin: "bottom center" }}>
              <img src={services[0].src} alt={services[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[0].title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{services[0].description}</p>
              </div>
            </div>
            {/* Card 2 */}
            <div ref={card2Ref} style={{ position: "absolute", top: 0, left: 0, right: 0, height: CARD_H, zIndex: 4, borderRadius: 16, overflow: "hidden", transformOrigin: "bottom center" }}>
              <video src={services[1].src} preload="none" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[1].title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{services[1].description}</p>
              </div>
            </div>
            {/* Card 3 */}
            <div ref={card3Ref} style={{ position: "absolute", top: 0, left: 0, right: 0, height: CARD_H, zIndex: 5, borderRadius: 16, overflow: "hidden", transformOrigin: "bottom center" }}>
              <video src={services[2].src} preload="none" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[2].title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{services[2].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
```

### GreenlandSection.tsx
```tsx
return (
  <div id="greenland" data-snap="true" ref={sectionRef} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '100vh', position: 'relative', background: 'black', overflow: 'hidden' }}>
    {/* Left: text column */}
    <div style={{ width: '46%', display: 'flex', flexDirection: 'column', justifyContent: 'center', perspective: '900px' }}>
      <div style={{ maxWidth: 'clamp(680px, 40vw, 820px)', paddingLeft: 'clamp(180px, 18vw, 260px)' }}>
        <div ref={labelRef} style={{ fontSize: '0.875rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 24 }}>Greenland</div>
        <div style={{ marginBottom: 24 }}>
          <div ref={line1Ref} style={{ fontSize: 'clamp(2.25rem, 2.8vw, 4rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>Visual work made</div>
          <div ref={line2Ref} style={{ fontSize: 'clamp(2.25rem, 2.8vw, 4rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>for atmosphere,</div>
          <div ref={line3Ref} style={{ fontSize: 'clamp(2.25rem, 2.8vw, 4rem)', fontWeight: 300, color: '#ffffff', lineHeight: 1.25 }}>trust and attention</div>
        </div>
        <div ref={bodyRef} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.625, marginBottom: 28 }}>
          Commercial visuals and Arctic environments, created for companies and brands in Greenland.
        </div>
        <Link ref={linkRef} href="/greenland" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', width: 'fit-content', marginTop: '1.2rem', padding: '14px 36px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)', background: btnHover ? '#ffffff' : 'transparent', color: btnHover ? '#000000' : 'rgba(255,255,255,0.85)', fontSize: 'clamp(15px, 0.9vw, 19px)', fontWeight: 400, letterSpacing: '0.01em', textDecoration: 'none', cursor: 'pointer', transition: 'background 0.25s ease, color 0.25s ease' }}>
          Explore our work in Greenland
        </Link>
      </div>
    </div>
    {/* Right: video column */}
    <div style={{ width: '54%', height: '100vh', display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem 2.5rem 1rem', gap: '0.75rem' }}>
      <div ref={video1Ref} style={{ position: 'relative', flex: 1, width: '100%', borderRadius: 14, overflow: 'hidden' }}>
        <video src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P18K.mp4" preload="none" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
      </div>
      <div ref={video2Ref} style={{ position: 'relative', flex: 1, width: '100%', borderRadius: 14, overflow: 'hidden' }}>
        <video src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P21.mp4" preload="none" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
      </div>
    </div>
  </div>
);
```

### CTABanner.tsx
```tsx
return (
  <section id="cta" data-snap="true" ref={sectionRef} style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
    <div ref={cardRef} style={{ width: '70vw', aspectRatio: '3/2', borderRadius: 22, overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 0 0 0.5px rgba(255,255,255,0.10), 0 20px 120px rgba(0,0,0,0.95), 0 0 140px rgba(0,0,0,0.8)' }}>
      <video preload="none" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P69%20N.mp4" />
      <svg viewBox="0 0 18 12" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path fill="rgba(0,0,0,0.85)" d="m0,6h18v6H0zm3,0a4,4 0 0,0 8,0a4,4 0 0,0-8,0" />
      </svg>
      <div style={{ position: 'absolute', right: 0, bottom: '3%', width: '39%', height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2rem 1.5rem 1rem' }}>
        <div ref={headingRef} style={{ fontSize: 'clamp(28px,2.78vw,68px)', fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '0.5rem', textShadow: '0 2px 16px rgba(0,0,0,0.9)' }}>Planning a project<br />in Greenland?</div>
        <div ref={bodyRef} style={{ fontSize: 'clamp(1.125rem,1.15vw,1.5rem)', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>Tell us about your project — we'll help define what's possible and how to approach it.</div>
        <div ref={btnRef} style={{ display: 'inline-flex', width: 'fit-content', padding: '13px 30px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.22)', background: btnHover ? '#ffffff' : 'transparent', color: btnHover ? '#000000' : 'rgba(255,255,255,0.88)', fontSize: 'clamp(15px,0.9vw,19px)', cursor: 'pointer', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))', transition: 'background 0.25s ease, color 0.25s ease' }}>Work with us</div>
      </div>
    </div>
  </section>
);
```

### BasedInGreenland.tsx
```tsx
return (
  <section ref={sectionRef} id="based" data-snap="true" style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }} />
    <video ref={videoRef} src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/BEAUTY.mp4" preload="none" autoPlay muted loop playsInline style={{ display: 'none' }} />
    <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: isStudio ? 'clamp(300px, 17vw, 400px)' : 'clamp(160px, 16vw, 220px)', paddingRight: '1rem', zIndex: 2, transform: 'translateX(150px)' }}>
      <div ref={labelRef} style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>Based in Greenland</div>
      <div ref={heading1Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em' }}>We live here</div>
      <div ref={heading2Ref} style={{ fontSize: 'clamp(28px, 2.78vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2rem', display: 'block', width: '100%', paddingLeft: isStudio ? 'clamp(120px, 10vw, 180px)' : 'clamp(160px, 18vw, 240px)' }}>We work here</div>
      <p ref={body1Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: isStudio ? '540px' : '510px' }}>We are based in Qaqortoq in South Greenland, where we live and work close to the nature that inspires us every day.</p>
      <p ref={body2Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', marginBottom: '1rem', maxWidth: isStudio ? '540px' : '510px' }}>We are available for projects across all of Greenland, from remote landscapes to towns and industrial sites, creating photography and film that document people, places, and projects in their natural context.</p>
      <p ref={body3Ref} style={{ fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', maxWidth: isStudio ? '540px' : '510px' }}>This allows us to operate efficiently in locations where production is often limited by logistics and conditions.</p>
      <a ref={readMoreRef} href="/about" style={{ display: 'inline-block', width: 'fit-content', marginTop: '2rem', padding: '14px 32px', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '999px', color: 'white', fontSize: 'clamp(15px, 0.9vw, 19px)', fontWeight: 300, textDecoration: 'none', transition: 'background 0.3s ease, color 0.3s ease' }}>Read more about us</a>
    </div>
  </section>
);
```

---

## 7. ÅBNE OPGAVER

| Opgave | Prioritet |
|---|---|
| Footer — font-konsistens + layout | Næste |
| Global desktop godkendelse — screenshot alle sektioner begge skærme | Efter footer |
| `/greenland`, `/about`, `/work`, `/contact` | Efter desktop |
| Mobile pass — hele sitet | Sidst |
