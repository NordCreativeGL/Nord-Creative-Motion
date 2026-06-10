"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from '@/components/SideNav'
import PackIceCanvas from '@/components/PackIceCanvas'

const packages = [
  {
    title: 'Starter',
    subtext: 'Single-page or compact site. Clean, fast, and mobile-ready.',
    bullets: ['Custom design', 'Next.js development', 'Mobile optimised', 'Contact form', '1 round of revisions'],
  },
  {
    title: 'Business',
    subtext: 'Multi-page site with content management and custom animations.',
    bullets: ['Everything in Starter', 'Up to 6 pages', 'CMS integration', 'Scroll animations', '2 rounds of revisions'],
  },
  {
    title: 'Full Production',
    subtext: 'Website plus photo, drone, and video content — delivered as one package.',
    bullets: ['Everything in Business', 'Photography & drone', 'Video production', 'Content strategy', 'Dedicated project manager'],
  },
]

const mountainMarks = [
  {
    tier: 'I',
    points: '5,85 50,10 95,85',
    ground: '5,85 95,85'
  },
  {
    tier: 'II',
    points: '5,85 28,32 50,48 70,18 95,85',
    ground: '5,85 95,85'
  },
  {
    tier: 'III',
    points: '5,85 18,55 32,65 46,26 60,42 74,12 88,50 95,85',
    ground: '5,85 95,85'
  }
]

export default function WebPage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [isStudio, setIsStudio] = useState(false)
  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const sectionPadding = isMobile
    ? '80px 24px'
    : 'clamp(100px, 10vw, 160px) clamp(160px, 16vw, 220px)'

  return (
    <main style={{ background: '#060606' }}>
      <SideNav items={[
        { label: 'The Offer', id: 'web-offer' },
        { label: 'Packages', id: 'web-packages' },
        { label: 'Work with us', id: 'web-cta' },
      ]} />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section
        id="web-hero"
        style={{
          minHeight: '100dvh',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 80px' : 'clamp(140px, 14vw, 200px) clamp(160px, 16vw, 220px)',
        }}
      >
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          WEBSITE PRODUCTION
        </p>
        <div style={{
          display: 'inline-flex',
          border: '1px solid #333',
          borderRadius: '999px',
          padding: '6px 16px',
          marginBottom: '24px',
        }}>
          <span style={{
            fontSize: 'clamp(10px, 0.7vw, 12px)',
            letterSpacing: '0.15em',
            fontWeight: 300,
            color: '#888',
          }}>
            UNDER CONSTRUCTION
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
        }}>
          The web, built differently
        </h1>
        <p style={{
          fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '560px',
          marginTop: '24px',
        }}>
          We design and build high-performance websites for brands that take their visual identity seriously. No templates. No WordPress. Just code.
        </p>
      </section>

      {/* ── Section 3: The Offer ── */}
      <section
        id="web-offer"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: '#000000',
          padding: sectionPadding,
          paddingTop: isMobile ? '100px' : '120px',
        }}
      >
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '20px',
        }}>
          WHAT WE OFFER
        </p>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: '40px',
        }}>
          A website — Or everything it needs
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '1px',
          background: '#1a1a1a',
          border: '1px solid #1a1a1a',
          marginTop: '80px',
        }}>
          {[
            {
              label: 'WEBSITE DESIGN',
              description: 'Designed from scratch. No templates.',
              lines: ['6,9 34,9', '6,9 6,31 34,31 34,9', '6,19 34,19', '20,19 20,31'],
              dots: [[6,9],[34,9],[6,31],[34,31],[6,19],[34,19],[20,19],[20,31]]
            },
            {
              label: 'COPYWRITING',
              description: 'Words that match the visual.',
              lines: ['10,30 30,10', '14,26 24,16', '28,8 30,10 32,12'],
              dots: [[10,30],[30,10],[14,26],[24,16],[28,8],[32,12]]
            },
            {
              label: 'SEO',
              description: 'Found where it matters.',
              lines: ['14,10 26,10 30,20 26,30 14,30 10,20 14,10', '27,27 34,34'],
              dots: [[14,10],[26,10],[30,20],[26,30],[14,30],[10,20],[27,27],[34,34]]
            },
            {
              label: 'PHOTO & VIDEO',
              description: 'Content from our own productions.',
              lines: ['20,6 34,20 20,34 6,20 20,6', '20,6 20,20', '34,20 20,20', '20,34 20,20', '6,20 20,20'],
              dots: [[20,6],[34,20],[20,34],[6,20],[20,20]]
            },
            {
              label: 'DEVELOPMENT',
              description: 'Custom code. Fast and stable.',
              lines: ['16,8 8,20 16,32', '24,8 32,20 24,32'],
              dots: [[16,8],[8,20],[16,32],[24,8],[32,20],[24,32]]
            },
            {
              label: 'MAINTENANCE',
              description: 'We keep it running.',
              lines: ['20,6 29,9 34,18 32,28 24,34 14,33 7,26 6,16 10,9', '10,9 14,6', '10,9 7,13'],
              dots: [[20,6],[29,9],[34,18],[32,28],[24,34],[14,33],[7,26],[6,16],[10,9]]
            }
          ].map((icon) => (
            <div key={icon.label} style={{
              background: '#000000',
              padding: '40px 32px 36px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px',
            }}>
              <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
                {icon.lines.map((pts, i) => (
                  <polyline key={i} points={pts} stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ))}
                {icon.dots.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2" fill="white" />
                ))}
              </svg>
              <span style={{ fontSize: 'clamp(13px, 0.9vw, 15px)', letterSpacing: '0.1em', color: '#ffffff', fontWeight: 300, textTransform: 'uppercase' as const }}>
                {icon.label}
              </span>
              <p style={{ fontSize: 'clamp(12px, 0.75vw, 13px)', color: '#444', fontWeight: 300, lineHeight: 1.6 }}>
                {icon.description}
              </p>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '60px',
        }}>
          <div style={{ width: isMobile ? '100%' : '66%' }}>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
              marginBottom: '20px',
            }}>
              We build websites as a standalone service — designed, developed, and launched. Photography, drone footage, and video are not required.
            </p>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              But if you need content to go with it, we produce that too. One team, one brief, one result.
            </p>
          </div>
          <div style={{ width: isMobile ? '100%' : '33%' }}>
            <h3 style={{
              fontSize: 'clamp(20px, 1.3vw, 28px)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: 'white',
              marginBottom: '16px',
            }}>
              Already working with us on content?
            </h3>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.65)',
            }}>
              Adding a website to an existing production is seamless — the visual direction is already set.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Packages ── */}
      <section
        id="web-packages"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          background: '#060606',
          padding: sectionPadding,
          paddingTop: isMobile ? '100px' : '120px',
        }}
      >
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '20px',
        }}>
          PACKAGES
        </p>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: '48px',
        }}>
          Three ways to work with us
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          borderTop: '1px solid #1a1a1a',
          borderBottom: '1px solid #1a1a1a',
        }}>
          {packages.map((pkg, i) => (
            <div
              key={pkg.title}
              style={{
                position: 'relative',
                borderRight: i < 2 ? '1px solid #1a1a1a' : 'none',
              }}
            >
              <div style={{ paddingTop: '90%', position: 'relative' }}>
                <svg
                  viewBox="0 0 100 90"
                  preserveAspectRatio="none"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={0.2}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  <polyline points={mountainMarks[i].points} />
                  <polyline points={mountainMarks[i].ground} opacity={0.12} />
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: '10%',
                  paddingLeft: '8%',
                  paddingRight: '8%',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 'clamp(9px, 0.6vw, 11px)', letterSpacing: '0.3em', color: '#3a3a3a', marginBottom: 14 }}>
                    {mountainMarks[i].tier}
                  </span>
                  <h3 style={{ fontSize: 'clamp(20px, 1.4vw, 28px)', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 16 }}>
                    {pkg.title}
                  </h3>
                  <p style={{ fontSize: 'clamp(12px, 0.75vw, 13px)', color: '#444', fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
                    {pkg.subtext}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {pkg.bullets.map((bullet) => (
                      <li key={bullet} style={{ fontSize: 'clamp(10px, 0.65vw, 12px)', color: '#333', letterSpacing: '0.06em', lineHeight: 2.0 }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:contact@nordcreative.dk"
                    style={{
                      fontSize: 'clamp(11px, 0.7vw, 12px)',
                      color: '#555',
                      letterSpacing: '0.1em',
                      marginTop: 20,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    Get in touch →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section
        id="web-cta"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#000000',
          padding: sectionPadding,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <PackIceCanvas />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 72px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '24px',
          }}>
            Ready to build something worth seeing?
          </h2>
          <p style={{
            fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.65)',
          }}>
            Tell us about your project. We'll take it from there.
          </p>
          <a
            href="mailto:contact@nordcreative.dk"
            className="text-white hover:bg-white hover:text-black transition-colors duration-200"
            style={{
              display: isMobile ? 'block' : 'inline-block',
              border: '1px solid rgba(255,255,255,0.6)',
              borderRadius: '999px',
              padding: '14px 40px',
              fontSize: 'clamp(15px, 0.9vw, 19px)',
              fontWeight: 300,
              textDecoration: 'none',
              marginTop: '40px',
              width: isMobile ? '100%' : undefined,
              textAlign: isMobile ? 'center' as const : undefined,
            }}
          >
            Start your project
          </a>
        </div>
      </section>

      <Footer />
      <BackToTop />

      <style jsx global>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .url-cursor { animation: blink 1.1s step-end infinite; }
      `}</style>
    </main>
  );
}
