"use client"

import { useState } from "react"
import { Search, Bell, Shield, ChevronDown, CheckCircle2, Menu } from "lucide-react"
import { useSidebar } from "@/components/layout/sidebar-context"

export function DashboardHeader() {
  const [activeRole, setActiveRole] = useState<"ABM" | "Sales" | "Executive" | "Admin">("ABM")
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const { toggleMobile } = useSidebar()

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white px-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20">
      {/* Mobile Menu Toggle & Search Input */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={toggleMobile}
          aria-label="Open mobile navigation menu"
          className="md:hidden size-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex-1 relative">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, domains, contacts... (Cmd+K)"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Chip (Hidden on mobile/tablet) */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-800">
          <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Vector & GA4 Live Sync</span>
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Shield className="size-3.5 text-blue-600" />
            <span className="hidden sm:inline">Role:</span>
            <span>{activeRole}</span>
            <ChevronDown className="size-3 text-slate-400 ml-0.5" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-30">
              {(["ABM", "Sales", "Executive", "Admin"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role)
                    setRoleDropdownOpen(false)
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>{role}</span>
                  {activeRole === role && <CheckCircle2 className="size-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Bell */}
        <button
          aria-label="View alerts"
          className="relative size-8.5 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-blue-600" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 sm:border-l border-slate-200">
          <div className="size-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
            M
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">Movate Ops</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1">movate.com</div>
          </div>
        </div>
      </div>
    </header>
  )
}
