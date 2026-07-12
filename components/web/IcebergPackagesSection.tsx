'use client'

export default function IcebergPackagesSection({ id }: { id?: string }) {
  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #081826 0%, #031b26 100%)',
      }}
    />
  )
}
