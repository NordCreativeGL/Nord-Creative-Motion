'use client'

export default function IcebergPackagesSection({ id }: { id?: string }) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #06121D 0%, #031720 100%)',
      }}
    />
  )
}
