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
  const sectionRef      = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textPanelRef    = useRef<HTMLDivElement>(null);
  const progressBarRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const p = self.progress;

          if (videoWrapperRef.current) {
            const x = 8 * (1 - p);
            videoWrapperRef.current.style.clipPath =
              `polygon(${x}% 0, 100% 0, 100% 100%, 0% 100%)`;
          }

          if (textPanelRef.current) {
            const op = p < 0.5 ? 1 : Math.max(0, 1 - (p - 0.5) * 2);
            textPanelRef.current.style.opacity = String(op);
          }

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${p * 100}%`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "250vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#000000",
          display: "flex",
        }}
      >
        {/* Text panel */}
        <div
          ref={textPanelRef}
          style={{
            position: "relative",
            zIndex: 2,
            width: "48%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "clamp(80px, 8vw, 140px)",
            paddingRight: "2rem",
            background: "#000000",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1.5rem",
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
            Video production<br />in Greenland
          </h1>
          <p
            style={{
              fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.65,
              maxWidth: "440px",
            }}
          >
            Video and photography production across Greenland&apos;s diverse landscapes and environments.
          </p>
        </div>

        {/* Video with diagonal clip-path */}
        <div
          ref={videoWrapperRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <video
            src={`${CDN}P1%20HEADER.mp4`}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            zIndex: 10,
          }}
        >
          <div
            ref={progressBarRef}
            style={{ height: "100%", width: "0%", background: "rgba(255,255,255,0.4)" }}
          />
        </div>
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
    src: `${CDN}P18K.mp4`,
    preload: "auto" as const,
  },
  {
    label: "PROCESS",
    heading: "How we work",
    body: "Each production is planned around access, weather, and timing. We define a realistic setup from the start — allowing production to move efficiently in remote environments.",
    src: `${CDN}P14.mp4`,
    preload: "none" as const,
  },
  {
    label: "PROCESS",
    heading: "How we work",
    body: "Getting to the right location is often the most demanding part. Access can involve boats, helicopters, or long distances without infrastructure. We adapt each production to the conditions and logistics available — ensuring reliable execution in both urban and remote Arctic environments.",
    src: `${CDN}P46.mp4`,
    preload: "none" as const,
  },
];

function WorkingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vid1Ref    = useRef<HTMLVideoElement>(null);
  const vid2Ref    = useRef<HTMLVideoElement>(null);
  const vid3Ref    = useRef<HTMLVideoElement>(null);
  const currentRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(vid2Ref.current, { opacity: 0 });
      gsap.set(vid3Ref.current, { opacity: 0 });

      const vids = [vid1Ref.current, vid2Ref.current, vid3Ref.current];

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const p    = self.progress;
          const next = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;

          if (next !== currentRef.current) {
            vids.forEach((v, i) => {
              gsap.to(v, { opacity: i === next ? 1 : 0, duration: 0.6, overwrite: true });
            });
            currentRef.current = next;
            setStep(next);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const s = STEPS[step];

  const videoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  return (
    <div
      ref={sectionRef}
      data-snap="true"
      style={{ height: "400vh", position: "relative" }}
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
        {/* Stacked videos */}
        <video ref={vid1Ref} src={STEPS[0].src} preload={STEPS[0].preload} autoPlay muted loop playsInline style={videoStyle} />
        <video ref={vid2Ref} src={STEPS[1].src} preload={STEPS[1].preload} autoPlay muted loop playsInline style={videoStyle} />
        <video ref={vid3Ref} src={STEPS[2].src} preload={STEPS[2].preload} autoPlay muted loop playsInline style={videoStyle} />

        {/* Left gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.88) 45%, transparent 75%)",
            zIndex: 2,
          }}
        />

        {/* Text panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "42%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "clamp(80px, 8vw, 140px)",
            paddingRight: "2rem",
            zIndex: 3,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
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
              maxWidth: "520px",
            }}
          >
            {s.body}
          </p>

          {/* Step indicators */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(28px, 3vh, 48px)",
              left: "clamp(80px, 8vw, 140px)",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: "1px",
                  width: i === step ? "24px" : "12px",
                  background: i === step ? "#ffffff" : "rgba(255,255,255,0.2)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WhyUsSection
// ─────────────────────────────────────────────

const PANELS = [
  {
    title: "Local presence",
    body: "We combine visual storytelling with real experience working in Greenland's conditions.",
  },
  {
    title: "Logistics first",
    body: "We understand the logistics, the unpredictability, and what it takes to execute production in remote environments — without compromising quality.",
  },
  {
    title: "No compromises",
    body: "For companies operating in Greenland, this means fewer uncertainties, better planning, and content that reflects the reality of the environment.",
  },
];

function WhyUsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const panel1Ref  = useRef<HTMLDivElement>(null);
  const panel2Ref  = useRef<HTMLDivElement>(null);
  const panel3Ref  = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([labelRef.current, headingRef.current, ctaRef.current], { opacity: 0 });
      gsap.set([panel1Ref.current, panel2Ref.current, panel3Ref.current], { opacity: 0, y: 60 });

      const tl = gsap.timeline({ paused: true });

      tl.to(labelRef.current,  { opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
        .to(headingRef.current, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.15)
        .to(panel1Ref.current,  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.5)
        .to(panel2Ref.current,  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.65)
        .to(panel3Ref.current,  { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.8)
        .to(ctaRef.current,     { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.4);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 65%",
        onEnter: () => tl.play(),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const panelStyle = (i: number): React.CSSProperties => ({
    flex: "1 1 0",
    borderLeft: i > 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingLeft: "clamp(40px, 4vw, 70px)",
    paddingRight: "clamp(40px, 4vw, 70px)",
    paddingBottom: "clamp(60px, 14vh, 120px)",
  });

  return (
    <div
      ref={sectionRef}
      data-snap="true"
      style={{ height: "200vh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "#060606",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top heading */}
        <div
          style={{
            paddingTop: "clamp(50px, 7vh, 90px)",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div
            ref={labelRef}
            style={{
              fontSize: "13px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "1rem",
              fontWeight: 300,
            }}
          >
            WHY US
          </div>
          <div
            ref={headingRef}
            style={{
              fontSize: "clamp(28px, 2.78vw, 68px)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Why choose us for projects in Greenland
          </div>
        </div>

        {/* Panels */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <div ref={panel1Ref} style={panelStyle(0)}>
            <div style={{ width: "20px", height: "0.5px", background: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }} />
            <div style={{ fontSize: "clamp(28px, 2.78vw, 68px)", fontWeight: 300, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              {PANELS[0].title}
            </div>
            <p style={{ fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
              {PANELS[0].body}
            </p>
          </div>
          <div ref={panel2Ref} style={panelStyle(1)}>
            <div style={{ width: "20px", height: "0.5px", background: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }} />
            <div style={{ fontSize: "clamp(28px, 2.78vw, 68px)", fontWeight: 300, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              {PANELS[1].title}
            </div>
            <p style={{ fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
              {PANELS[1].body}
            </p>
          </div>
          <div ref={panel3Ref} style={panelStyle(2)}>
            <div style={{ width: "20px", height: "0.5px", background: "rgba(255,255,255,0.2)", marginBottom: "1.25rem" }} />
            <div style={{ fontSize: "clamp(28px, 2.78vw, 68px)", fontWeight: 300, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              {PANELS[2].title}
            </div>
            <p style={{ fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
              {PANELS[2].body}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          style={{
            flexShrink: 0,
            textAlign: "center",
            paddingTop: "clamp(20px, 2vh, 36px)",
            paddingBottom: "clamp(30px, 4vh, 56px)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(22px, 1.8vw, 36px)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "0.75rem",
            }}
          >
            Planning a project in Greenland?
          </div>
          <p
            style={{
              fontSize: "clamp(1.125rem, 1.15vw, 1.5rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
              maxWidth: "480px",
              margin: "0 auto 1.5rem",
            }}
          >
            Tell us about your project — we&apos;ll help define what&apos;s possible and how to approach it.
          </p>
          <a
            href="mailto:contact@nordcreative.dk"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 36px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.22)",
              background: btnHover ? "#ffffff" : "transparent",
              color: btnHover ? "#000000" : "rgba(255,255,255,0.85)",
              fontSize: "clamp(15px, 0.9vw, 19px)",
              fontWeight: 300,
              textDecoration: "none",
              cursor: "pointer",
              transition: "background 0.25s ease, color 0.25s ease",
            }}
          >
            Start your project
          </a>
        </div>
      </div>
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
