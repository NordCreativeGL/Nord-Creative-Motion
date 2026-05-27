"use client";

import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    const smoothScrollTo = (targetY: number): Promise<void> => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const duration = 900;
        const startTime = performance.now();
        const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          window.scrollTo(0, startY + diff * ease(progress));
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };

    const handleSnap = (direction: 'up' | 'down') => {
      const vh = window.innerHeight;
      const servicesEl = document.getElementById('services');
      const servicesTop = servicesEl ? servicesEl.getBoundingClientRect().top + window.scrollY : vh;

      const snapElements = Array.from(document.querySelectorAll('[data-snap="true"]'));
      const dataSnapPoints = snapElements.map(el => el.getBoundingClientRect().top + window.scrollY);

      const allSnapPoints = [
        0,
        ...(servicesEl ? [servicesTop, servicesTop + vh * 1.5, servicesTop + vh * 3] : []),
        ...dataSnapPoints,
      ].sort((a, b) => a - b);

      const currentY = window.scrollY;
      const threshold = 50;

      let targetY: number | null = null;

      if (direction === 'down') {
        targetY = allSnapPoints.find(p => p > currentY + threshold) ?? null;
      } else {
        const prev = [...allSnapPoints].reverse().find(p => p < currentY - threshold);
        targetY = prev ?? null;
      }

      if (targetY === null) return;

      (window as any).__snapLock = true;
      smoothScrollTo(targetY).then(() => {
        setTimeout(() => {
          (window as any).__snapLock = false;
        }, 500);
      });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if ((window as any).__snapLock) return;
      if (Math.abs(e.deltaY) < 10) return;
      const direction = e.deltaY > 0 ? 'down' : 'up';
      handleSnap(direction);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return null;
}
