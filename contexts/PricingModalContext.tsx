'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface PricingModalContextType {
  isPricingModalOpen: boolean
  openPricingModal: () => void
  closePricingModal: () => void
}

const PricingModalContext = createContext<PricingModalContextType>({
  isPricingModalOpen: false,
  openPricingModal: () => {},
  closePricingModal: () => {},
})

export function PricingModalProvider({ children }: { children: ReactNode }) {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  return (
    <PricingModalContext.Provider
      value={{
        isPricingModalOpen,
        openPricingModal: () => setIsPricingModalOpen(true),
        closePricingModal: () => setIsPricingModalOpen(false),
      }}
    >
      {children}
    </PricingModalContext.Provider>
  )
}

export function usePricingModal() {
  return useContext(PricingModalContext)
}
