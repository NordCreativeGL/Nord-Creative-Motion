"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from "@/components/SideNav";
import NorthernLights from "@/components/NorthernLights";
import MountainSilhouette from "@/components/MountainSilhouette";
import ScrollExpandHero from "@/components/ScrollExpandHero";
import { useLang } from '@/contexts/LanguageContext'
import { useContactModal } from '@/contexts/ContactModalContext'

export default function GreenlandPage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isMedium, setIsMedium] = useState(false)
  useEffect(() => {
    const check = () => setIsMedium(window.innerWidth >= 1024 && window.innerWidth < 1728)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { lang } = useLang()
  const { openModal } = useContactModal()

  const t = {
    en: {
      working: "Distances are long. Weather changes fast. Getting to a location can take more planning than the shoot itself. We've worked in these conditions long enough that they're part of how we plan — not something we work around.",
      process: "Every production starts with the same questions: which locations, how to get there, and what time of year makes sense. We know the terrain and how access changes with the seasons — so the practical side is worked out before we arrive, not figured out on the day.",
      whyH: 'What you get when you work with us',
      whyB: "A team that knows Greenland — the locations, the light, and how conditions affect what's possible. That shows in how productions are planned and in the final work. For companies in Greenland, it means working with people who already understand the context.",
      whyWebsite: 'We also build websites for companies in Greenland — if you need both production and a website, we can handle it as one project.',
      cta1: 'Start your project', cta2: 'See our website production',
      ctaHeading: "Planning a project in Greenland?",
      ctaBody: "Tell us what you're after — we'll work out the how.",
      nav1: 'Working in Greenland',
      nav2: 'How we work',
      nav3: 'Why choose us',
      eyebrow1: 'WORKING IN GREENLAND',
      eyebrow2: 'PROCESS',
      eyebrow3: 'WHY US',
      workH: 'Working in Greenland is different',
      processH: 'How we work',
    },
    da: {
      working: 'Afstandene er lange. Vejret skifter hurtigt. At nå frem til en lokalitet kan kræve mere planlægning end selve optagelsen. Vi har arbejdet under disse vilkår længe nok til at de er en del af vores tilgang — ikke noget vi finder ud af undervejs.',
      process: 'Enhver produktion starter med de samme spørgsmål: hvilke lokaliteter, hvordan vi kommer derhen og hvilken tid på året der giver mening. Vi kender terrænet og ved hvordan adgangen ændrer sig med årstiderne — så det praktiske er på plads, inden vi ankommer.',
      whyH: 'Det får du, når du arbejder med os',
      whyB: 'Et team der kender Grønland — lokaliteterne, lyset og hvordan forholdene påvirker hvad der er muligt. Det ses i, hvordan produktioner planlægges og i det færdige produkt. For virksomheder i Grønland betyder det at arbejde med nogen der allerede forstår konteksten.',
      whyWebsite: 'Vi bygger også websites til virksomheder i Grønland — har du brug for både produktion og et website, kan vi samle det i ét projekt.',
      cta1: 'Start dit projekt', cta2: 'Se vores webproduktion',
      ctaHeading: "Planlægger du et projekt i Grønland?",
      ctaBody: "Fortæl os hvad du ønsker — vi finder ud af hvordan.",
      nav1: 'At arbejde i Grønland',
      nav2: 'Sådan arbejder vi',
      nav3: 'Hvorfor os',
      eyebrow1: 'AT ARBEJDE I GRØNLAND',
      eyebrow2: 'PROCES',
      eyebrow3: 'HVORFOR OS',
      workH: 'Grønland stiller andre krav',
      processH: 'Sådan arbejder vi',
    }
  }

  return (
    <main style={{ background: '#000000' }}>
      {!isMobile && <SideNav items={[
        { label: t[lang].nav1, id: 'gl-working' },
        { label: t[lang].nav2, id: 'gl-process' },
        { label: t[lang].nav3, id: 'gl-why' },
      ]} />}
      <Header />
      <NorthernLights />

      <ScrollExpandHero />

      <MountainSilhouette />

      {/* ── Section 2: Working in Greenland ── */}
      <section id="gl-working" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', position: 'relative', zIndex: 1, paddingTop: isMobile ? '80px' : undefined, paddingBottom: isMobile ? '64px' : undefined }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16" style={isMedium ? { maxWidth: 'calc(100vw - 480px)' } : undefined}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 3fr', gap: isMobile ? '28px' : '64px', alignItems: 'stretch' }}>
            <div>
              <p style={{
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '20px',
              }}>
                {t[lang].eyebrow1}
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                {lang === 'da' ? (<>Grønland stiller<br />andre krav</>) : t[lang].workH}
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                {t[lang].working}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <video
                src="https://cdn.nordcreative.dk/P18K.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: 14,
                  maxHeight: '58vh',
                  width: '100%',
                  height: 'auto',
                  alignSelf: 'flex-start',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How we work ── */}
      <section id="gl-process" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', paddingTop: isMobile ? '80px' : '0', paddingBottom: isMobile ? '64px' : '0', position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16" style={{ maxHeight: isMobile ? 'none' : '100vh', overflow: isMobile ? 'visible' : 'hidden', ...(isMedium ? { maxWidth: 'calc(100vw - 480px)' } : {}) }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', gap: isMobile ? '28px' : '2rem', alignItems: isMobile ? 'flex-start' : 'center', maxHeight: isMobile ? 'none' : '90vh', overflow: isMobile ? 'visible' : 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <video
                src="https://cdn.nordcreative.dk/P14.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{
                  aspectRatio: '9/16',
                  objectFit: 'cover',
                  borderRadius: 14,
                  width: '100%',
                  display: 'block',
                }}
              />
              <video
                src="https://cdn.nordcreative.dk/P46.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{
                  aspectRatio: '9/16',
                  objectFit: 'cover',
                  borderRadius: 14,
                  width: '100%',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ order: isMobile ? -1 : 0 }}>
              <p style={{
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '20px',
              }}>
                {t[lang].eyebrow2}
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                {t[lang].processH}
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                {t[lang].process}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Why choose us ── */}
      <section id="gl-why" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', position: 'relative', zIndex: 1, paddingTop: isMobile ? '60px' : undefined, paddingBottom: isMobile ? '60px' : undefined }}>
        <div className="mx-auto max-w-7xl px-6 w-full" style={isMedium ? { maxWidth: 'calc(100vw - 480px)' } : undefined}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, aspectRatio: isMobile ? undefined : '16/9', minHeight: isMobile ? 'auto' : 500 }}>
            <video
              src="https://cdn.nordcreative.dk/P16.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

            {/* Vertical divider */}
            <div style={{
              position: 'absolute',
              left: '66.66%',
              top: '48px',
              bottom: '48px',
              width: '1px',
              background: 'rgba(255,255,255,0.1)',
              display: isMobile ? 'none' : 'block',
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '32px 24px' : '48px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: isMobile ? 'auto' : 500 }}>
              {/* Left col — 2/3 */}
              <div style={{ width: isMobile ? '100%' : '66.66%', paddingRight: isMobile ? '0' : '48px', marginBottom: isMobile ? '24px' : undefined }}>
                <p style={{
                  fontSize: '13px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                }}>
                  {t[lang].eyebrow3}
                </p>
                <h2 style={{
                  fontSize: isMobile ? '20px' : 'clamp(28px, 2.3vw, 68px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: 'white',
                  marginBottom: isMobile ? '16px' : '28px',
                  maxWidth: '640px',
                  minHeight: isMobile ? 'auto' : '2.4em',
                }}>
                  {t[lang].whyH}
                </h2>
                <p style={{
                  fontSize: isMobile ? '14px' : 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  maxWidth: '640px',
                }}>
                  {t[lang].whyB}
                </p>
                <p style={{
                  fontSize: isMobile ? '14px' : 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  maxWidth: '640px',
                  marginTop: '24px',
                }}>
                  {t[lang].whyWebsite}
                </p>
              </div>

              {/* Right col — 1/3 */}
              <div style={{ width: isMobile ? '100%' : '33.33%', paddingLeft: isMobile ? '0' : '40px', paddingTop: isMobile ? '0' : '52px' }}>
                <h3 style={{
                  fontSize: 'clamp(20px, 1.3vw, 28px)',
                  fontWeight: 300,
                  color: 'white',
                  marginBottom: isMobile ? '12px' : '16px',
                  letterSpacing: '-0.01em',
                }}>
                  {t[lang].ctaHeading}
                </h3>
                <p style={{
                  fontSize: isMobile ? '14px' : 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '32px',
                }}>
                  {t[lang].ctaBody}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={openModal}
                    className="text-white bg-transparent hover:bg-white/20 transition-colors duration-200"
                    style={{
                      display: 'block',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      fontSize: 'clamp(17px, 1.1vw, 20px)',
                      fontWeight: 300,
                      width: '100%',
                      textAlign: 'center' as const,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-geist-sans), sans-serif',
                    }}
                  >
                    {t[lang].cta1}
                  </button>
                  <a
                    href="/web"
                    className="text-white bg-transparent hover:bg-white/20 transition-colors duration-200"
                    style={{
                      display: 'block',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      fontSize: 'clamp(17px, 1.1vw, 20px)',
                      fontWeight: 300,
                      textDecoration: 'none',
                      width: '100%',
                      textAlign: 'center' as const,
                      marginTop: isMobile ? '0' : '72px',
                    }}
                  >
                    {t[lang].cta2}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
