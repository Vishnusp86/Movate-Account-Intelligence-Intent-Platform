"use client"

import * as React from "react"

interface SidebarContextType {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobile: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const toggleMobile = React.useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen, toggleMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
