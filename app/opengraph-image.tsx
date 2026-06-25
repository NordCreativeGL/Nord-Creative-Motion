import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nord Creative — Visual Production from Greenland'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '32px' }}
        >
          <path d="M 44.956 2.015 A 48.25 48.25 0 0 0 44.956 97.985" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <path d="M 55.044 2.015 A 48.25 48.25 0 0 1 55.044 97.985" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <polygon points="50,3.5 61.5,50 50,96.5 38.5,50" fill="#ffffff" />
        </svg>
        <div
          style={{
            color: '#ffffff',
            fontSize: '52px',
            fontWeight: 300,
            letterSpacing: '0.15em',
            marginBottom: '16px',
          }}
        >
          NORD CREATIVE
        </div>
        <div
          style={{
            color: '#888888',
            fontSize: '22px',
            fontWeight: 300,
            letterSpacing: '0.1em',
          }}
        >
          VIDEO · PHOTO · DRONE · GREENLAND
        </div>
      </div>
    ),
    { ...size }
  )
}
