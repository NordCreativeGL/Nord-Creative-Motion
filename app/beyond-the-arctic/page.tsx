"use client";

import { useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollManager from "@/components/ScrollManager";

const GRID_VIDEOS = [
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P33%20MALLORCA.mp4",
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P61%20SOUTH%20AFRICA.mp4",
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P35%20INDONESIA.mp4",
];

export default function BeyondTheArcticPage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<boolean[]>([false, false, false]);

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(prev => prev.map((v, i) => (i === index ? true : v)));
    } else {
      video.pause();
      setPlaying(prev => prev.map((v, i) => (i === index ? false : v)));
    }
  };

  return (
    <main style={{ background: '#000000' }}>
      <ScrollManager />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section data-snap="true" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <video
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P60%20HEADER.mp4"
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
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />

        <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0 }}>
          <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
            <p style={{
              fontSize: '13px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '16px',
            }}>
              BEYOND THE ARCTIC
            </p>
            <h1 style={{
              fontSize: 'clamp(28px, 2.78vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: '20px',
              maxWidth: '800px',
            }}>
              Beyond the Arctic
            </h1>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '600px',
            }}>
              While Greenland is at the core of our work, we also collaborate with companies and organizations on projects in other locations.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Our work ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <p style={{
            fontSize: '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '16px',
          }}>
            OUR WORK
          </p>

          {/* H2 + body two-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '1rem',
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 2.78vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: 0,
            }}>
              Productions beyond Greenland
            </h2>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.625,
              color: 'rgba(255,255,255,0.65)',
            }}>
              While Greenland is at the core of our work, we also collaborate with companies and organizations on projects in other locations. This portfolio presents a selection of photography and film productions created beyond Greenland.
            </p>
          </div>

          {/* Interactive 3-column portrait grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {GRID_VIDEOS.map((src, i) => (
              <div
                key={i}
                onClick={() => togglePlay(i)}
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '9/16',
                  background: '#111',
                  cursor: 'pointer',
                  maxHeight: '701px',
                }}
              >
                <video
                  ref={el => { videoRefs.current[i] = el; }}
                  src={src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Play overlay — visible when paused */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: playing[i] ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }}>
                  <div style={{
                    border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <polygon points="6,3 17,10 6,17" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Quote + mixed layout ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem',
            alignItems: 'flex-end',
          }}>
            {/* Left col: quote + landscape video */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <p style={{
                fontSize: 'clamp(1.25rem, 1.4vw, 1.75rem)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.5,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}>
                "Strong visuals capture attention and enhance understanding. Good storytelling starts with observation."
              </p>
              <div style={{ width: '100%', height: '340px', borderRadius: 14, overflow: 'hidden' }}>
                <video
                  src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P22.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Right col: portrait video */}
            <div style={{ height: '702px', borderRadius: 14, overflow: 'hidden' }}>
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P23.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Adventure ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          {/* Label */}
          <p style={{
            fontSize: '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '8px',
          }}>
            ADVENTURE
          </p>

          {/* H2 */}
          <h2 style={{
            fontSize: 'clamp(22px, 2vw, 44px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '16px',
          }}>
            Adventure is in our DNA
          </h2>

          {/* Two landscape videos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}>
            <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', maxHeight: 'min(22vh, 180px)' }}>
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P59.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', maxHeight: 'min(22vh, 180px)' }}>
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P53A.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Ticker text */}
          <p style={{
            fontSize: 'clamp(0.875rem, 0.9vw, 1.1rem)',
            color: 'rgba(255,255,255,0.6)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            padding: '16px 0',
          }}>
            Attention to detail, subtle nuances, and layered storytelling define our work.{' '}
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            {' '}Sequences emerge naturally, creating rich, evocative, and harmonious visuals.
          </p>

          {/* Three portrait videos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
          }}>
            {[
              "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P24.mp4",
              "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P25.mp4",
              "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P26.mp4",
            ].map((src, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: 'hidden', aspectRatio: '9/16', maxHeight: 'min(28vh, 220px)' }}>
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
