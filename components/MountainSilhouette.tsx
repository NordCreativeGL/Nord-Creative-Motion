"use client";
import { useEffect, useRef } from "react";

export default function MountainSilhouette() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const lastEl = document.getElementById("gl-why");

    function onScroll() {
      if (!svgEl || !lastEl) return;
      const pastEnd = window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      svgEl.style.opacity = !pastEnd ? "1" : "0";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1728 500"
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50vh",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 1,
      }}
    >
      <defs>
        <linearGradient id="backGrad" gradientUnits="userSpaceOnUse" x1="0" y1="220" x2="0" y2="500">
          <stop offset="0%" stopColor="#121220" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="midGrad" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="500">
          <stop offset="0%" stopColor="#0e0e1a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="frontGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="500">
          <stop offset="0%" stopColor="#0c0c18" />
          <stop offset="20%" stopColor="#030306" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <filter id="mtnDepth" x="-5%" y="-20%" width="110%" height="130%">
          <feDropShadow dx="0" dy="-8" stdDeviation="14" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Back: smooth rolling hills, peaks y=230–275 */}
      <path
        d="M 0,500 L 0,292
           C 120,292 200,254 280,252
           C 360,250 432,285 560,248
           C 668,220 762,268 904,264
           C 1046,260 1120,246 1302,253
           C 1482,260 1584,283 1728,286
           L 1728,500 Z"
        fill="url(#backGrad)"
      />

      {/* Middle: left wide rounded (x≈380, y≈178), right angular (x≈1050, y≈160) */}
      <path
        d="M 0,500 L 0,362
           C 98,360 218,202 380,178
           C 542,154 618,342 722,340
           C 826,338 900,182 1050,160
           C 1200,138 1304,336 1454,332
           C 1554,328 1632,343 1728,350
           L 1728,500 Z"
        fill="url(#midGrad)"
      />

      {/* Front: spire (x≈260,y=122), dome (x≈640,y=192), dominant (x≈944,y=50), low hill (x≈1250,y=252), ridge (x≈1560,y=148) */}
      <path
        d="M 0,500 L 0,392
           C 78,390 218,128 260,122
           C 302,116 386,344 432,344
           C 484,344 572,193 640,192
           C 706,191 764,316 820,316
           C 864,316 906,60 944,50
           C 982,40 1024,326 1094,330
           C 1164,334 1206,254 1250,252
           C 1296,250 1367,319 1404,319
           C 1436,319 1492,150 1562,148
           C 1628,146 1700,353 1728,370
           L 1728,500 Z"
        fill="url(#frontGrad)"
        filter="url(#mtnDepth)"
      />
    </svg>
  );
}
