"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useContactModal } from "@/contexts/ContactModalContext";
import { usePricingModal } from "@/contexts/PricingModalContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = React.useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = {
    en: { home: 'Home', greenland: 'Greenland', web: 'Website Production', about: 'About', pricing: 'Pricing', cta: 'Work with us' },
    da: { home: 'Hjem', greenland: 'Grønland', web: 'Website Produktion', about: 'Om os', pricing: 'Priser', cta: 'Arbejd med os' },
  }
  const { openModal } = useContactModal();
  const { openPricingModal } = usePricingModal();

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
      } else if (currentScrollY > lastScrollY.current && currentScrollY > (pathname === '/web' ? 10 : heroHeight * 0.5)) {
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
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 relative">
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
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 uppercase lg:flex absolute left-1/2 -translate-x-1/2" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', letterSpacing: '0.08em' }}>
            <Link href="/" className="transition hover:text-white" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.location.href = '/'; } }}>{t[lang].home}</Link>
            <Link href="/greenland" className="transition hover:text-white" onClick={(e) => { if (pathname === '/greenland') { e.preventDefault(); window.location.href = '/greenland'; } }}>{t[lang].greenland}</Link>
            <Link href="/web" className="transition hover:text-white" onClick={(e) => { if (pathname === '/web') { e.preventDefault(); window.location.href = '/web'; } }}>{t[lang].web}</Link>
            {/* <Link href="/beyond-the-arctic" className="transition hover:text-white" onClick={(e) => { if (pathname === '/beyond-the-arctic') { e.preventDefault(); window.location.href = '/beyond-the-arctic'; } }}>Beyond the Arctic</Link> */}
            <Link href="/about" className="transition hover:text-white" onClick={(e) => { if (pathname === '/about') { e.preventDefault(); window.location.href = '/about'; } }}>{t[lang].about}</Link>
            <button onClick={openPricingModal} className="transition hover:text-white uppercase" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', letterSpacing: '0.08em' }}>{t[lang].pricing}</button>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => setLang('da')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: lang === 'da' ? '#ffffff' : 'rgba(255,255,255,0.32)', fontSize: 'clamp(11px, 0.72vw, 13px)', letterSpacing: '0.08em', fontWeight: 300, padding: '4px 2px', transition: 'color 0.2s ease', fontFamily: 'inherit' }}>DA</button>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', userSelect: 'none' }}>|</span>
              <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: lang === 'en' ? '#ffffff' : 'rgba(255,255,255,0.32)', fontSize: 'clamp(11px, 0.72vw, 13px)', letterSpacing: '0.08em', fontWeight: 300, padding: '4px 2px', transition: 'color 0.2s ease', fontFamily: 'inherit' }}>EN</button>
            </div>
            <button
              onClick={openModal}
              className="hidden lg:block"
              style={{
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 300,
                fontFamily: 'var(--font-geist-sans), sans-serif',
                color: 'white',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,.9)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
                cursor: 'pointer',
                transition: 'all .45s ease',
              }}
              onMouseEnter={(e) => {
                const isWeb = pathname === '/web';
                (e.currentTarget as HTMLElement).style.borderColor = isWeb ? 'rgba(143,227,216,.5)' : 'rgba(255,255,255,.9)';
                (e.currentTarget as HTMLElement).style.boxShadow = isWeb
                  ? 'inset 0 1px 0 rgba(255,255,255,.2), 0 0 44px rgba(143,227,216,.16)'
                  : 'inset 0 1px 0 rgba(255,255,255,.2), 0 0 70px rgba(255,255,255,.32)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.9)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.14)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {t[lang].cta}
            </button>
          </div>
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10"
            style={{ zIndex: 1001, position: 'relative', opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? 'none' : 'auto', transition: 'opacity 0.2s ease' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Åbn menu"
          >
            <>
              <span className="block w-5 h-px bg-white" />
              <span className="block w-5 h-px bg-white" />
              <span className="block w-5 h-px bg-white" />
            </>
          </button>
        </div>
      </header>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 1002,
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
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Luk menu"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '20px',
            fontWeight: 300,
            lineHeight: 1,
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          ✕
        </button>
        {[
          { label: 'Home', href: '/' },
          { label: 'Greenland', href: '/greenland' },
          { label: 'Website Production', href: '/web' },
          // { label: 'Beyond the Arctic', href: '/beyond-the-arctic' },
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
        <button
          onClick={() => {
            setMenuOpen(false);
            openPricingModal();
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{
            display: 'block',
            width: '28px',
            height: '0.5px',
            background: 'white',
            flexShrink: 0,
          }} />
          {t[lang].pricing}
        </button>
        <button
          onClick={() => {
            setMenuOpen(false);
            openModal();
          }}
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 300,
            fontFamily: 'var(--font-geist-sans), sans-serif',
            letterSpacing: 'normal',
            textTransform: 'none',
            marginTop: '4px',
            borderRadius: 8,
            padding: '6px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,.9)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14)',
            cursor: 'pointer',
          }}
        >
          {t[lang].cta}
        </button>
      </div>
    </>
  );
}
