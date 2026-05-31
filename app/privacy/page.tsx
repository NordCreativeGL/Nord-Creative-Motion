export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ maxWidth: '560px', width: '100%' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>Privacy Policy</p>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '1rem' }}>
          <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>Nord Creative</strong><br />
          contact@nordcreative.dk · +299 245441<br />
          Qaqortoq, Greenland
        </p>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '1rem' }}>
          We do not collect personal data through this website. When you contact us by email, we use your information only to respond to your inquiry. We do not share your data with third parties.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
          Questions? <a href="mailto:contact@nordcreative.dk" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline' }}>contact@nordcreative.dk</a>
        </p>
      </div>
    </main>
  )
}
