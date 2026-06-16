"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from "@/components/SideNav";
import NorthernLights from "@/components/NorthernLights";
import MountainSilhouette from "@/components/MountainSilhouette";
import ScrollExpandHero from "@/components/ScrollExpandHero";

export default function GreenlandPage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <main style={{ background: '#000000' }}>
      {!isMobile && <SideNav items={[
        { label: 'Working in Greenland', id: 'gl-working' },
        { label: 'How we work', id: 'gl-process' },
        { label: 'Why choose us', id: 'gl-why' },
      ]} />}
      <Header />
      <NorthernLights />

      <ScrollExpandHero />

      <MountainSilhouette />

      {/* ── Section 2: Working in Greenland ── */}
      <section id="gl-working" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', position: 'relative', zIndex: 1, paddingTop: isMobile ? '80px' : undefined, paddingBottom: isMobile ? '64px' : undefined }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 3fr', gap: isMobile ? '28px' : '64px', alignItems: 'stretch' }}>
            <div>
              <p style={{
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '20px',
              }}>
                WORKING IN GREENLAND
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                Working in Greenland is different.
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                Distances are long. Weather changes fast. Getting to the right location often takes planning, the right contacts, and flexibility. We've worked in these conditions long enough that they're part of how we plan — not something we work around.
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
                  height: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How we work ── */}
      <section id="gl-process" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', paddingTop: isMobile ? '80px' : '0', paddingBottom: isMobile ? '64px' : '0', position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16" style={{ maxHeight: isMobile ? 'none' : '100vh', overflow: isMobile ? 'visible' : 'hidden' }}>
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
                PROCESS
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                How we work
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                Every production starts with the practical questions: which locations, what time of year, and what the conditions are likely to be. We know the terrain and the seasonal patterns — which means we can plan accurately and adapt when needed. Whether it's a town centre or a remote location, the preparation is the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Why choose us ── */}
      <section id="gl-why" data-snap="true" style={{ height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100dvh' : undefined, background: 'transparent', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', overflow: isMobile ? 'visible' : 'hidden', position: 'relative', zIndex: 1, paddingTop: isMobile ? '60px' : undefined, paddingBottom: isMobile ? '60px' : undefined }}>
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, minHeight: isMobile ? 'auto' : 500 }}>
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
                  WHY US
                </p>
                <h2 style={{
                  fontSize: isMobile ? '20px' : 'clamp(28px, 2.78vw, 68px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: 'white',
                  marginBottom: isMobile ? '16px' : '28px',
                  maxWidth: '640px',
                }}>
                  What you get when you work with us
                </h2>
                <p style={{
                  fontSize: isMobile ? '14px' : 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  maxWidth: '560px',
                }}>
                  A team that knows Greenland — the locations, the light, the seasons, and the realities of working here. That shows in how productions are planned and in the final work. For companies in Greenland, it means working with people who already understand the context. We also build websites for companies in Greenland — if you need both production and a website, it can be handled as one project.
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
                  Planning a project in Greenland?
                </h3>
                <p style={{
                  fontSize: isMobile ? '14px' : 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '32px',
                }}>
                  Tell us about your project — we'll help define what's possible and how to approach it.
                </p>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
                  <a
                    href="mailto:contact@nordcreative.dk"
                    className="text-white hover:bg-white hover:text-black transition-colors duration-200"
                    style={{
                      display: isMobile ? 'block' : 'inline-block',
                      border: '1px solid rgba(255,255,255,0.6)',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      fontSize: 'clamp(15px, 0.9vw, 19px)',
                      fontWeight: 300,
                      textDecoration: 'none',
                      width: isMobile ? '100%' : undefined,
                      textAlign: isMobile ? 'center' as const : undefined,
                    }}
                  >
                    Start your project
                  </a>
                  <a
                    href="/web"
                    className="text-white hover:bg-white hover:text-black transition-colors duration-200"
                    style={{
                      display: isMobile ? 'block' : 'inline-block',
                      border: '1px solid rgba(255,255,255,0.6)',
                      padding: '14px 32px',
                      borderRadius: '999px',
                      fontSize: 'clamp(15px, 0.9vw, 19px)',
                      fontWeight: 300,
                      textDecoration: 'none',
                      width: isMobile ? '100%' : undefined,
                      textAlign: isMobile ? 'center' as const : undefined,
                    }}
                  >
                    See our website production
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
