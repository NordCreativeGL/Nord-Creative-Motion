"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = React.useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > heroHeight * 0.5) {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-sm" : "bg-transparent"
        }`}
        style={{
          transform: (!visible && !menuOpen) ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
          zIndex: 1001,
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            style={{ display: 'block' }}
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.location.href = '/';
              }
            }}
          >
            <Image
              src="/logo-icon.png"
              alt="Nord Creative"
              height={50}
              width={50}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 lg:flex">
            <Link href="/" className="transition hover:text-white" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.location.href = '/'; } }}>Home</Link>
            <Link href="/greenland" className="transition hover:text-white" onClick={(e) => { if (pathname === '/greenland') { e.preventDefault(); window.location.href = '/greenland'; } }}>Greenland</Link>
            <Link href="/web" className="transition hover:text-white" onClick={(e) => { if (pathname === '/web') { e.preventDefault(); window.location.href = '/web'; } }}>Website Production</Link>
            <Link href="/beyond-the-arctic" className="transition hover:text-white" onClick={(e) => { if (pathname === '/beyond-the-arctic') { e.preventDefault(); window.location.href = '/beyond-the-arctic'; } }}>Beyond the Arctic</Link>
            <Link href="/about" className="transition hover:text-white" onClick={(e) => { if (pathname === '/about') { e.preventDefault(); window.location.href = '/about'; } }}>About</Link>
          </nav>
          <a
            href="mailto:contact@nordcreative.dk"
            className="hidden rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black lg:block"
          >
            Work with us
          </a>
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10"
            style={{ zIndex: 1001, position: 'relative' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 300, lineHeight: 1 }}>✕</span>
            ) : (
              <>
                <span className="block w-5 h-px bg-white" />
                <span className="block w-5 h-px bg-white" />
                <span className="block w-5 h-px bg-white" />
              </>
            )}
          </button>
        </div>
      </header>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          paddingTop: '80px',
          paddingRight: '28px',
          gap: '28px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {[
          { label: 'Home', href: '/' },
          { label: 'Greenland', href: '/greenland' },
          { label: 'Website Production', href: '/web' },
          { label: 'Beyond the Arctic', href: '/beyond-the-arctic' },
          { label: 'About', href: '/about' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              window.location.href = href;
            }}
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              display: 'block',
              width: '28px',
              height: '0.5px',
              background: 'white',
              flexShrink: 0,
            }} />
            {label}
          </a>
        ))}
        <a
          href="mailto:contact@nordcreative.dk"
          style={{
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: '4px',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '999px',
            padding: '10px 24px',
          }}
        >
          Work with us
        </a>
      </div>
    </>
  );
}
