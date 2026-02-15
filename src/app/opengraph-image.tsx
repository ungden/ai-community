import { ImageResponse } from 'next/og'

export const alt = 'Alex Le AI - Cộng đồng học AI cho người đi làm'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1877f2 0%, #7c3aed 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>A</span>
        </div>

        {/* Title */}
        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
          Alex Le AI
        </h1>

        {/* Subtitle */}
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '28px', margin: 0 }}>
          Cộng đồng học AI cho người đi làm
        </p>
      </div>
    ),
    { ...size }
  )
}
