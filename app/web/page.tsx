"use client";

import { useState, useEffect } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SideNav from '@/components/SideNav'

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
    points: '10,55 50,10 90,55',
    ground: '5,55 95,55'
  },
  {
    tier: 'II',
    points: '8,55 32,25 50,38 68,15 90,55',
    ground: '5,55 95,55'
  },
  {
    tier: 'III',
    points: '5,55 18,38 30,46 42,20 54,34 68,12 80,38 92,55',
    ground: '3,55 97,55'
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
        { label: 'The Proof', id: 'web-proof' },
        { label: 'The Offer', id: 'web-offer' },
        { label: 'Packages', id: 'web-packages' },
        { label: 'Work with us', id: 'web-cta' },
      ]} />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section
        id="web-hero"
        style={{
          minHeight: isMobile ? '100dvh' : '100vh',
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

      {/* ── Section 2: Proof ── */}
      <section
        id="web-proof"
        style={{
          background: '#060606',
          padding: sectionPadding,
        }}
      >
        <p style={{
          fontSize: 'clamp(11px, 0.7vw, 13px)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '20px',
        }}>
          THE PROOF
        </p>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 72px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: '28px',
        }}>
          You're already on one
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          margin: '48px 0 48px 0',
        }}>
          <div style={{
            width: 'clamp(320px, 60vw, 680px)',
            height: '52px',
            background: '#0a0a0a',
            border: '1px solid #252525',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 22px',
            gap: '10px',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="5" width="8" height="6" rx="1" stroke="#444" strokeWidth="1.5"/>
              <path d="M4 5V3.5a2 2 0 1 1 4 0V5" stroke="#444" strokeWidth="1.5"/>
            </svg>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#666',
              letterSpacing: '0.02em',
              flexGrow: 1,
            }}>
              nordcreative.dk/web
            </span>
            <span className="url-cursor" style={{ color: '#444', fontSize: '13px' }}>|</span>
          </div>
        </div>
        <p style={{
          fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '640px',
          marginBottom: '20px',
        }}>
          This site was built by us. Scroll-animated, cinematic, fast — built entirely from scratch on Next.js. That's the standard we hold every project to.
        </p>
        <p style={{
          fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
          lineHeight: 1.65,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '640px',
        }}>
          No page builders. No themes. Every line of code written with purpose.
        </p>
      </section>

      {/* ── Section 3: The Offer ── */}
      <section
        id="web-offer"
        style={{
          background: '#000000',
          padding: sectionPadding,
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
          background: '#060606',
          padding: sectionPadding,
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
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gap: '24px',
        }}>
          {packages.map((pkg, i) => (
            <div
              key={pkg.title}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4,
                padding: isMobile ? '32px 24px' : '48px 40px',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <svg
                width="80"
                height="48"
                viewBox="0 0 100 60"
                fill="none"
                style={{ marginBottom: '20px', display: 'block' }}
              >
                <polyline points={mountainMarks[i].ground} stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25" />
                <polyline points={mountainMarks[i].points} stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
              </svg>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                {mountainMarks[i].tier}
              </span>
              <h3 style={{
                fontSize: 'clamp(20px, 1.3vw, 28px)',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                color: 'white',
                marginBottom: '12px',
              }}>
                {pkg.title}
              </h3>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '28px',
              }}>
                {pkg.subtext}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flexGrow: 1 }}>
                {pkg.bullets.map((bullet) => (
                  <li key={bullet} style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '10px',
                  }}>
                    — {bullet}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:contact@nordcreative.dk"
                style={{
                  fontSize: 'clamp(15px, 0.9vw, 19px)',
                  fontWeight: 300,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Get in touch →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section
        id="web-cta"
        style={{
          background: '#000000',
          padding: sectionPadding,
          textAlign: 'center',
        }}
      >
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
