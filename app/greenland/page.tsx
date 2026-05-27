import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollManager from "@/components/ScrollManager";

export default function GreenlandPage() {
  return (
    <main style={{ background: '#000000' }}>
      <ScrollManager />
      <Header />

      {/* ── Section 1: Hero ── */}
      <section data-snap="true" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <video
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P1%20HEADER.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

        <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0 }}>
          <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
            <p style={{
              fontSize: '13px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '16px',
            }}>
              GREENLAND
            </p>
            <h1 style={{
              fontSize: 'clamp(28px, 2.78vw, 68px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'white',
              marginBottom: '20px',
              maxWidth: '800px',
            }}>
              Video production in Greenland
            </h1>
            <p style={{
              fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
            }}>
              Video and photography production across Greenland's diverse landscapes and environments.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Working in Greenland ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr',
            gap: '64px',
            alignItems: 'center',
          }}>
            <div>
              <p style={{
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '20px',
              }}>
                WORKING IN GREENLAND
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                Working in Greenland is different.
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: '20px',
              }}>
                Distances are long, weather changes quickly, and access to locations often requires careful planning and flexibility.
              </p>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                We produce video and photography in Greenland under these conditions — making it possible to document projects where logistics and environment would otherwise limit production.
              </p>
            </div>
            <div>
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P18K.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: 14,
                  maxHeight: '58vh',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: How we work ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#000', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: '0', paddingBottom: '0' }}>
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: '2rem',
            alignItems: 'center',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P14.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  aspectRatio: '9/16',
                  objectFit: 'cover',
                  borderRadius: 14,
                  maxHeight: 'min(50vh, 420px)',
                  width: '100%',
                }}
              />
              <video
                src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P46.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  aspectRatio: '9/16',
                  objectFit: 'cover',
                  borderRadius: 14,
                  maxHeight: 'min(50vh, 420px)',
                  width: '100%',
                }}
              />
            </div>
            <div>
              <p style={{
                fontSize: '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '20px',
              }}>
                PROCESS
              </p>
              <h2 style={{
                fontSize: 'clamp(28px, 2.78vw, 68px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'white',
                marginBottom: '28px',
              }}>
                How we work
              </h2>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
                marginBottom: '20px',
              }}>
                Each production is planned around access, weather, and timing. We define a realistic setup from the start — allowing production to move efficiently in remote environments.
              </p>
              <p style={{
                fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.65)',
              }}>
                Getting to the right location is often the most demanding part. Access can involve boats, helicopters, or long distances without infrastructure. We adapt each production to the conditions and logistics available — ensuring reliable execution in both urban and remote Arctic environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Why choose us ── */}
      <section data-snap="true" style={{ height: '100vh', background: '#060606', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 14, minHeight: 500 }}>
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P16.mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

            {/* Vertical divider */}
            <div style={{
              position: 'absolute',
              left: '66.66%',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(255,255,255,0.1)',
            }} />

            <div style={{
              position: 'relative',
              zIndex: 1,
              padding: '48px',
              display: 'flex',
              minHeight: 500,
            }}>
              {/* Left col — 2/3 */}
              <div style={{ width: '66.66%', paddingRight: '48px' }}>
                <p style={{
                  fontSize: '13px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                }}>
                  WHY US
                </p>
                <h2 style={{
                  fontSize: 'clamp(28px, 2.78vw, 68px)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  color: 'white',
                  marginBottom: '28px',
                  maxWidth: '640px',
                }}>
                  Why choose us for projects in Greenland
                </h2>
                <p style={{
                  fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '20px',
                  maxWidth: '560px',
                }}>
                  We combine visual storytelling with real experience working in Greenland's conditions.
                </p>
                <p style={{
                  fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '20px',
                  maxWidth: '560px',
                }}>
                  We understand the logistics, the unpredictability, and what it takes to execute production in remote environments — without compromising quality.
                </p>
                <p style={{
                  fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  maxWidth: '560px',
                }}>
                  For companies operating in Greenland, this means fewer uncertainties, better planning, and content that reflects the reality of the environment.
                </p>
              </div>

              {/* Right col — 1/3 */}
              <div style={{ width: '33.33%', paddingLeft: '40px', paddingTop: '52px' }}>
                <h3 style={{
                  fontSize: 'clamp(20px, 1.3vw, 28px)',
                  fontWeight: 300,
                  color: 'white',
                  marginBottom: '16px',
                  letterSpacing: '-0.01em',
                }}>
                  Planning a project in Greenland?
                </h3>
                <p style={{
                  fontSize: 'clamp(1.125rem, 1.15vw, 1.5rem)',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '32px',
                }}>
                  Tell us about your project — we'll help define what's possible and how to approach it.
                </p>
                <a
                  href="mailto:contact@nordcreative.dk"
                  className="hover:bg-white hover:text-black transition-colors duration-200"
                  style={{
                    display: 'inline-block',
                    border: '1px solid rgba(255,255,255,0.6)',
                    padding: '14px 32px',
                    borderRadius: '999px',
                    color: 'white',
                    fontSize: 'clamp(15px, 0.9vw, 19px)',
                    fontWeight: 300,
                    textDecoration: 'none',
                  }}
                >
                  Start your project
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
