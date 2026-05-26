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
  const labelRef           = useRef<HTMLDivElement>(null);
  const h1Ref              = useRef<HTMLHeadingElement>(null);
  const bodyRef            = useRef<HTMLParagraphElement>(null);
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
      // Text block staggered entrance on load
      gsap.from([labelRef.current, h1Ref.current, bodyRef.current], {
        opacity: 0,
        y: 18,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.12,
      });

      // Scroll indicator fades in after text
      gsap.from(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#000",
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
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.68) 88%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 42%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      {/* Text block — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: `0 0 clamp(32px, 4.5vh, 56px) clamp(80px, 8vw, 160px)`,
          zIndex: 2,
        }}
      >
        <div
          ref={labelRef}
          style={{
            fontSize: "13px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.32)",
            marginBottom: "1rem",
            fontWeight: 300,
          }}
        >
          GREENLAND
        </div>
        <h1
          ref={h1Ref}
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
          ref={bodyRef}
          style={{
            fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.65,
            maxWidth: isStudio ? "500px" : "420px",
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
          bottom: "clamp(28px, 4vh, 48px)",
          right: "28px",
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
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: "0.5px",
            height: "28px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)",
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WorkingSection
// ─────────────────────────────────────────────

const STEPS = [
  {
    label: "WORKING IN GREENLAND",
    heading: "Working in Greenland is different.",
    body: "Distances are long, weather changes quickly, and access to locations often requires careful planning and flexibility. We produce video and photography in Greenland under these conditions — making it possible to document projects where logistics and environment would otherwise limit production.",
  },
  {
    label: "PROCESS",
    heading: "How we work",
    body: "Each production is planned around access, weather, and timing. We define a realistic setup from the start — allowing production to move efficiently in remote environments. Getting to the right location is often the most demanding part. Access can involve boats, helicopters, or long distances without infrastructure. We adapt each production to the conditions and logistics available — ensuring reliable execution in both urban and remote Arctic environments.",
  },
];

function WorkingSection() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const card1Ref     = useRef<HTMLDivElement>(null);
  const card2Ref     = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const [step, setStep]         = useState(0);
  const [isStudio, setIsStudio] = useState(false);

  useEffect(() => {
    const check = () => setIsStudio(window.innerWidth >= 1900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Both cards start hidden
      gsap.set(card1Ref.current, { scale: 0.82, opacity: 0 });
      gsap.set(card2Ref.current, { scale: 0.82, opacity: 0 });

      // Card 1 enters when section scrolls into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          if (animatingRef.current) return;
          gsap.to(card1Ref.current, {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          // Scrolled back above section — reset both cards and step
          gsap.to(card1Ref.current, { scale: 0.82, opacity: 0, duration: 0.35, ease: "power2.in" });
          gsap.to(card2Ref.current, { scale: 0.82, opacity: 0, duration: 0.35, ease: "power2.in" });
          if (textRef.current) gsap.set(textRef.current, { opacity: 1, y: 0 });
          setStep(0);
          animatingRef.current = false;
        },
      });

      // Step transition at 50% of the 300vh scroll distance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center top",
        onEnter: () => {
          if (animatingRef.current) return;
          animatingRef.current = true;

          // Card 1 exits
          gsap.to(card1Ref.current, {
            scale: 0.88,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          });

          // Text crossfades to step 1
          gsap.to(textRef.current, {
            opacity: 0,
            y: 6,
            duration: 0.3,
            onComplete: () => {
              setStep(1);
              gsap.to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.35,
                delay: 0.05,
              });
            },
          });

          // Card 2 enters
          gsap.to(card2Ref.current, {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            delay: 0.15,
            onComplete: () => { animatingRef.current = false; },
          });
        },
        onLeaveBack: () => {
          if (animatingRef.current) return;
          animatingRef.current = true;

          // Card 2 exits
          gsap.to(card2Ref.current, {
            scale: 0.82,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          });

          // Text crossfades back to step 0
          gsap.to(textRef.current, {
            opacity: 0,
            y: -6,
            duration: 0.3,
            onComplete: () => {
              setStep(0);
              gsap.to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.35,
                delay: 0.05,
              });
            },
          });

          // Card 1 re-enters
          gsap.to(card1Ref.current, {
            scale: 1,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            delay: 0.15,
            onComplete: () => { animatingRef.current = false; },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const s              = STEPS[step];
  const textPaddingL   = isStudio ? "clamp(120px, 10vw, 200px)" : "clamp(80px, 8vw, 140px)";
  const cardWidth      = isStudio ? "220px" : "185px";
  const cardHeight     = isStudio ? "390px" : "328px";

  const cardStyle: React.CSSProperties = {
    width: cardWidth,
    height: cardHeight,
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow:
      "0 20px 80px rgba(0,0,0,0.95), 0 0 0 0.5px rgba(255,255,255,0.06)",
    position: "relative",
  };

  const cardGradient: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100px",
    background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
  };

  const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  return (
    <div
      ref={sectionRef}
      data-snap="true"
      style={{ height: "300vh", position: "relative" }}
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
        {/* Text panel — left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "44%",
            paddingLeft: textPaddingL,
            paddingRight: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Vertically centered text */}
          <div
            style={{ flex: 1, display: "flex", alignItems: "center" }}
          >
            <div ref={textRef}>
              <div
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.32)",
                  marginBottom: "1.5rem",
                  fontWeight: 300,
                }}
              >
                {s.label}
              </div>
              <h2
                style={{
                  fontSize: "clamp(28px, 2.78vw, 68px)",
                  fontWeight: 300,
                  color: "#ffffff",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.25rem",
                }}
              >
                {s.heading}
              </h2>
              <p
                style={{
                  fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.65,
                  maxWidth: "460px",
                }}
              >
                {s.body}
              </p>
            </div>
          </div>

          {/* Step indicator — bottom */}
          <div
            style={{
              paddingBottom: isStudio ? "60px" : "48px",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  height: "1px",
                  width: i === step ? "22px" : "10px",
                  background:
                    i === step
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(255,255,255,0.2)",
                  transition: "width 0.4s ease, background 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Card slot — right, both cards stacked at center */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "48%",
          }}
        >
          {/* Card 1 — P14 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div ref={card1Ref} style={cardStyle}>
              <video
                src={`${CDN}P14.mp4`}
                autoPlay
                muted
                loop
                playsInline
                style={videoStyle}
              />
              <div style={cardGradient} />
            </div>
          </div>

          {/* Card 2 — P46 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div ref={card2Ref} style={cardStyle}>
              <video
                src={`${CDN}P46.mp4`}
                preload="none"
                autoPlay
                muted
                loop
                playsInline
                style={videoStyle}
              />
              <div style={cardGradient} />
            </div>
          </div>
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
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.25)",
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
