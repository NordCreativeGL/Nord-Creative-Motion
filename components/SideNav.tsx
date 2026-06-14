"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = { label: string; id: string };

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'What we offer', id: 'services' },
  { label: 'Greenland', id: 'greenland' },
  { label: 'Based in Greenland', id: 'based' },
  { label: 'Work with us', id: 'cta' },
];

export default function SideNav({ items = DEFAULT_ITEMS }: { items?: NavItem[] }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState('');
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestId = '';
      let closestDist = Infinity;
      itemsRef.current.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const sectionCenter = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(viewportCenter - sectionCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      });
      setActive(closestId);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="max-[1024px]:hidden"
      style={{
        position: 'fixed',
        left: '28px',
        bottom: '40px',
        top: 'auto',
        transform: 'none',
        zIndex: 50,
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '10px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {items.map(({ label, id }) => {
        const isActive = active === id;
        const isHovered = hovered === id;
        return (
          <div
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered('')}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: isActive ? '28px' : '16px',
                height: '0.5px',
                background: isActive ? 'white' : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                transition: 'width 0.2s ease, background 0.2s ease',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? 'rgba(255,255,255,0.6)' : isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0)',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
