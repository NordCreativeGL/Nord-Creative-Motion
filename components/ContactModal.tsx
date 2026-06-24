'use client'
import { useEffect, useRef, useState } from 'react'
import { useContactModal } from '@/contexts/ContactModalContext'

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

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
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '40px',
            position: 'relative',
            transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.15, 1)',
          }}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            aria-label="Luk"
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
              }}>Tak.</p>
              <p style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '15px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
              }}>Vi vender tilbage hurtigst muligt.</p>
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
                Kontakt os
              </h2>
              <p style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '32px',
              }}>
                Vi svarer inden for 24 timer.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Navn *</label>
                  <input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Dit navn"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="din@email.dk"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Telefon <span style={{ opacity: 0.5 }}>(valgfrit)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+45 00 00 00 00"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Besked *</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Fortæl os om dit projekt..."
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: 'none',
                    }}
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
                    Noget gik galt. Prøv igen eller skriv direkte til contact@nordcreative.dk
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
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
                    cursor: status === 'sending' || !name.trim() || !email.trim() || !message.trim() ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' || !name.trim() || !email.trim() || !message.trim() ? 0.4 : 1,
                    transition: 'background 0.2s ease, color 0.2s ease, opacity 0.2s ease',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={e => {
                    if (status !== 'sending') {
                      e.currentTarget.style.background = '#ffffff'
                      e.currentTarget.style.color = '#000000'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                >
                  {status === 'sending' ? 'Sender...' : 'Send besked'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
