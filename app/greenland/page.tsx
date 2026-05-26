"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollManager from "@/components/ScrollManager";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

gsap.registerPlugin(ScrollTrigger);

const CDN = "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/";

// ─────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────

function HeroSection() {
  const sectionRef         = useRef<HTMLDivElement>(null);
  const textBlockRef       = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [isStudio, setIsStudio] = useState(false);

  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const p = self.progress;
          if (textBlockRef.current) {
            textBlockRef.current.style.transform = `translateY(${p * 80}px)`;
            textBlockRef.current.style.opacity   = String(Math.max(0, 1 - p * 1.6));
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - p * 3));
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "220vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#000000",
        }}
      >
        {/* Video */}
        <video
          src={`${CDN}P1%20HEADER.mp4`}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,0.95) 100%)",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Text block — bottom left */}
        <div
          ref={textBlockRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: `0 0 clamp(28px, 4vh, 52px) clamp(80px, 8vw, 160px)`,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1rem",
              fontWeight: 300,
            }}
          >
            GREENLAND
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 2.78vw, 68px)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "1.25rem",
            }}
          >
            Video production in Greenland
          </h1>
          <p
            style={{
              fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.65,
              maxWidth: isStudio ? "520px" : "440px",
            }}
          >
            Video and photography production across Greenland&apos;s diverse
            landscapes and environments.
          </p>
        </div>

        {/* Scroll indicator — bottom right */}
        <div
          ref={scrollIndicatorRef}
          style={{
            position: "absolute",
            bottom: "clamp(28px, 4vh, 52px)",
            right: "clamp(28px, 3vw, 56px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 2,
          }}
        >
          <span
            style={{
              writingMode: "vertical-lr",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              fontWeight: 300,
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: "1px",
              height: "32px",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WorkingSection
// ─────────────────────────────────────────────

function WorkingSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const card1Ref     = useRef<HTMLDivElement>(null);
  const card2Ref     = useRef<HTMLDivElement>(null);
  const text0Ref     = useRef<HTMLDivElement>(null);
  const text1Ref     = useRef<HTMLDivElement>(null);
  const stepRef      = useRef(0);
  const textStateRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isStudio, setIsStudio] = useState(false);

  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(card1Ref.current, { y: "120%" });
      gsap.set(card2Ref.current, { y: "120%" });
      gsap.set(text1Ref.current, { opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const p = self.progress;

          // Card 1 rises: 0–40% of scroll
          const c1p = Math.min(1, Math.max(0, p / 0.4));
          if (card1Ref.current) {
            const y = 120 + (-52 - 120) * c1p;
            card1Ref.current.style.transform = `translateY(${y}%)`;
          }

          // Card 2 rises: 20–55% of scroll (staggered)
          const c2p = Math.min(1, Math.max(0, (p - 0.2) / 0.35));
          if (card2Ref.current) {
            const y = 120 + (-46 - 120) * c2p;
            card2Ref.current.style.transform = `translateY(${y}%)`;
          }

          // Step indicator — 3 states
          const newStep = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          if (newStep !== stepRef.current) {
            stepRef.current = newStep;
            setActiveStep(newStep);
          }

          // Text crossfade at 60%
          const newTextState = p >= 0.6 ? 1 : 0;
          if (newTextState !== textStateRef.current) {
            textStateRef.current = newTextState;
            gsap.to(text0Ref.current, {
              opacity: newTextState === 0 ? 1 : 0,
              duration: 0.4,
              overwrite: true,
            });
            gsap.to(text1Ref.current, {
              opacity: newTextState === 1 ? 1 : 0,
              duration: 0.4,
              overwrite: true,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const textPaddingLeft = isStudio
    ? "clamp(120px, 10vw, 200px)"
    : "clamp(80px, 8vw, 140px)";
  const cardWidth  = isStudio ? "200px" : "168px";
  const card1Right = isStudio ? "280px" : "220px";
  const card2Right = isStudio ? "60px"  : "32px";

  const textStateOverlay: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "1.5rem",
    fontWeight: 300,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "clamp(28px, 2.78vw, 68px)",
    fontWeight: 300,
    color: "#ffffff",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    marginBottom: "1.25rem",
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
    fontWeight: 300,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.65,
    maxWidth: "480px",
  };

  return (
    <div
      ref={sectionRef}
      data-snap="true"
      style={{ height: "350vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#000000",
        }}
      >
        {/* Background — P18K landscape */}
        <video
          src={`${CDN}P18K.mp4`}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Left gradient — content floats in darkness */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.92) 45%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          }}
        />

        {/* Text panel */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "44%",
            paddingLeft: textPaddingLeft,
            paddingRight: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          {/* Stacked text states */}
          <div style={{ position: "relative" }}>
            {/* State 0 */}
            <div ref={text0Ref}>
              <div style={labelStyle}>WORKING IN GREENLAND</div>
              <h2 style={headingStyle}>Working in Greenland is different.</h2>
              <p style={bodyStyle}>
                Distances are long, weather changes quickly, and access to
                locations often requires careful planning and flexibility. We
                produce video and photography in Greenland under these
                conditions — making it possible to document projects where
                logistics and environment would otherwise limit production.
              </p>
            </div>

            {/* State 1 — overlays state 0 */}
            <div ref={text1Ref} style={textStateOverlay}>
              <div style={labelStyle}>PROCESS</div>
              <h2 style={headingStyle}>How we work</h2>
              <p style={bodyStyle}>
                Each production is planned around access, weather, and timing.
                We define a realistic setup from the start — allowing
                production to move efficiently in remote environments. Getting
                to the right location is often the most demanding part. Access
                can involve boats, helicopters, or long distances without
                infrastructure. We adapt each production to the conditions and
                logistics available — ensuring reliable execution in both urban
                and remote Arctic environments.
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(28px, 3vh, 48px)",
              left: textPaddingLeft,
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: "1px",
                  width: i === activeStep ? "24px" : "12px",
                  background:
                    i === activeStep
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(255,255,255,0.2)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Portrait card 1 — P14 */}
        <div
          ref={card1Ref}
          style={{
            position: "absolute",
            right: card1Right,
            top: "50%",
            width: cardWidth,
            aspectRatio: "9/16",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 12px 60px rgba(0,0,0,0.85)",
            zIndex: 6,
          }}
        >
          <video
            src={`${CDN}P14.mp4`}
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          />
        </div>

        {/* Portrait card 2 — P46 */}
        <div
          ref={card2Ref}
          style={{
            position: "absolute",
            right: card2Right,
            top: "50%",
            width: cardWidth,
            aspectRatio: "9/16",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 16px 70px rgba(0,0,0,0.9)",
            zIndex: 7,
          }}
        >
          <video
            src={`${CDN}P46.mp4`}
            preload="none"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WhyUsSection — placeholder snap point
// ─────────────────────────────────────────────

function WhyUsSection() {
  return (
    <div
      data-snap="true"
      style={{
        minHeight: "100vh",
        background: "#060606",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 300,
        }}
      >
        Why Us — coming soon
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function GreenlandPage() {
  return (
    <main className="bg-black">
      <ScrollManager />
      <Header />
      <HeroSection />
      <WorkingSection />
      <WhyUsSection />
      <Footer />
      <BackToTop />
    </main>
  );
}
