"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer') ?? document.getElementById('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRingVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if ((window as any).__snapLock) return;
    (window as any).__snapLock = true;

    const startY = window.scrollY;
    const duration = 900;
    const startTime = performance.now();
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY * (1 - ease(progress)));
      if (progress < 1) requestAnimationFrame(step);
      else {
        setTimeout(() => {
          (window as any).__snapLock = false;
        }, 500);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s ease",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="48" height="48"
          viewBox="0 0 48 48"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <circle
            cx="24" cy="24" r="22"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            strokeDasharray="138"
            strokeDashoffset={ringVisible ? 0 : 138}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.25, 0.1, 0.15, 1), opacity 0.3s ease',
              opacity: ringVisible ? 1 : 0
            }}
          />
        </svg>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="20" x2="12" y2="4" />
          <polyline points="6 10 12 4 18 10" />
        </svg>
      </span>
    </button>
  );
}
