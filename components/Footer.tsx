"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" data-snap="true" className="border-t border-white/10 pt-6 pb-16 min-h-[25vh] flex flex-col justify-center" style={{ position: 'relative', zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        <p className="text-white/40" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Website designed &amp; built by
        </p>
        <Image
          src="/logo-wordmark-transparent.png"
          alt="NordCreative"
          width={612}
          height={184}
          style={{ width: 'min(734px, 85vw)', height: 'auto', objectFit: 'contain', marginTop: '-80px', marginBottom: '-90px' }}
        />

        <p className="text-white/40" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Limits are for the uncreative
        </p>

        <p className="text-sm text-white/50">
          <a href="mailto:contact@nordcreative.dk" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">contact@nordcreative.dk</a>
          {' · '}
          <a href="tel:+299245441" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">+299 245441</a>
        </p>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="https://www.instagram.com/nordcreative_/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
          </a>
          <a href="https://www.youtube.com/@Nordcreative-visuals" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61587709075779&locale=da_DK" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        </div>

        <a href="/privacy" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
