import { Suspense } from "react"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased">
        {/* Sidebar with Suspense boundary for usePathname() */}
        <Suspense fallback={<aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200/80 bg-white" />}>
          <DashboardSidebar />
        </Suspense>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Suspense fallback={<header className="h-16 border-b border-slate-200 bg-white" />}>
            <DashboardHeader />
          </Suspense>
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
            <Suspense fallback={<div className="p-8 text-xs text-slate-500">Loading workspace...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
