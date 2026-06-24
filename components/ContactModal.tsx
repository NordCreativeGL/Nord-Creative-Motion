'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useContactModal } from '@/contexts/ContactModalContext'
import { useLang } from '@/contexts/LanguageContext'

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const t = {
    en: {
      title: 'Contact us',
      subtitle: 'We respond within 24 hours.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      optional: 'optional',
      message: 'Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+45 00 00 00 00',
      messagePlaceholder: 'Tell us about your project...',
      send: 'Send message',
      sending: 'Sending...',
      successTitle: 'Thank you.',
      successBody: 'We will get back to you as soon as possible.',
      error: 'Something went wrong. Please try again or email us at contact@nordcreative.dk',
      close: 'Close',
    },
    da: {
      title: 'Kontakt os',
      subtitle: 'Vi svarer inden for 24 timer.',
      name: 'Navn',
      email: 'Email',
      phone: 'Telefon',
      optional: 'valgfrit',
      message: 'Besked',
      namePlaceholder: 'Dit navn',
      emailPlaceholder: 'din@email.dk',
      phonePlaceholder: '+45 00 00 00 00',
      messagePlaceholder: 'Fortæl os om dit projekt...',
      send: 'Send besked',
      sending: 'Sender...',
      successTitle: 'Tak.',
      successBody: 'Vi vender tilbage hurtigst muligt.',
      error: 'Noget gik galt. Prøv igen eller skriv direkte til contact@nordcreative.dk',
      close: 'Luk',
    },
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => nameRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      setStatus('idle')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeModal])

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontFamily: 'var(--font-geist-sans), sans-serif',
    fontSize: '15px',
    fontWeight: 300,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '8px',
    fontFamily: 'var(--font-geist-sans), sans-serif',
  }

  const isDisabled = status === 'sending' || !name.trim() || !email.trim() || !message.trim()

  return (
    <>
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: 'calc(100dvh - 48px)',
            overflowY: 'auto',
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '40px',
            position: 'relative',
            transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.15, 1)',
          }}
        >

          <button
            onClick={closeModal}
            aria-label={t[lang].close}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '20px',
              lineHeight: 1,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            ✕
          </button>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '12px',
              }}>{t[lang].successTitle}</p>
              <p style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '15px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
              }}>{t[lang].successBody}</p>
            </div>
          ) : (
            <>
              <h2 style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                color: '#ffffff',
                marginBottom: '8px',
                lineHeight: 1.1,
              }}>
                {t[lang].title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '32px',
              }}>
                {t[lang].subtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>{t[lang].name} *</label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t[lang].namePlaceholder}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t[lang].email} *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t[lang].emailPlaceholder}
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t[lang].phone} <span style={{ opacity: 0.5 }}>({t[lang].optional})</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder=""
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t[lang].message} *</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={t[lang].messagePlaceholder}
                    rows={4}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                {status === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,100,100,0.9)',
                  }}>
                    {t[lang].error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isDisabled}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.9)',
                    background: 'transparent',
                    color: '#ffffff',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: 'clamp(15px, 0.9vw, 19px)',
                    fontWeight: 300,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.4 : 1,
                    transition: 'background 0.2s ease, color 0.2s ease, opacity 0.2s ease',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={e => {
                    if (!isDisabled) {
                      e.currentTarget.style.background = '#ffffff'
                      e.currentTarget.style.color = '#000000'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                >
                  {status === 'sending' ? t[lang].sending : t[lang].send}
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px', marginBottom: '-4px' }}>
                  <Image
                    src="/logo-wordmark-transparent-kopi.png"
                    alt="Nord Creative"
                    width={612}
                    height={184}
                    style={{ width: '210px', height: 'auto', objectFit: 'contain', opacity: 0.35 }}
                  />
                </div>

                <p style={{
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontWeight: 300,
                  marginTop: '4px',
                }}>
                  <a href="mailto:contact@nordcreative.dk" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>contact@nordcreative.dk</a>
                  {' · '}
                  <a href="tel:+299245441" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>+299 245441</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
