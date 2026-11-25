"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/layout/sidebar-context"
import {
  LayoutDashboard,
  Crosshair,
  Building2,
  Compass,
  Activity,
  BarChart3,
  Users,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  Cpu,
  BookOpen,
  Zap,
  X,
} from "lucide-react"

const navigationGroups = [
  {
    title: "Core Workspaces",
    items: [
      {
        title: "Executive Overview",
        href: "/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Target Accounts",
        href: "/targets",
        icon: Crosshair,
        badge: "106",
      },
      {
        title: "Existing Clients",
        href: "/clients",
        icon: Building2,
        badge: "317",
      },
      {
        title: "Account Discovery",
        href: "/discovery",
        icon: Compass,
      },
    ],
  },
  {
    title: "Intelligence & Engagement",
    items: [
      {
        title: "Vector Visitors",
        href: "/vector-intel",
        icon: Activity,
        badge: "2,044",
      },
      {
        title: "GA4 Service Pages",
        href: "/ga4-intel",
        icon: BarChart3,
      },
      {
        title: "Buying Committee",
        href: "/buying-committee",
        icon: Users,
        badge: "113",
      },
      {
        title: "Sales Intelligence",
        href: "/sales-intel",
        icon: Sparkles,
        badge: "Tier 1",
      },
      {
        title: "Opportunity Intel",
        href: "/opportunity-intel",
        icon: Lightbulb,
      },
    ],
  },
  {
    title: "System & Governance",
    items: [
      {
        title: "Data Quality",
        href: "/data-quality",
        icon: ShieldCheck,
      },
      {
        title: "Integrations & Governor",
        href: "/integrations",
        icon: Cpu,
      },
      {
        title: "Runbooks & Help",
        href: "/help",
        icon: BookOpen,
      },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
            <Zap className="size-4.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm tracking-tight leading-none flex items-center gap-1.5">
              Movate
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Intel
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 leading-none">
              Account & Intent Platform
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden size-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {group.title}
            </div>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="px-2 py-2 rounded-lg border border-slate-200/60 bg-white">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
            <span>Credit Governor</span>
            <span className="text-emerald-700 font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "8.4%" }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>420 / 5,000 ZI</span>
            <span>8.4%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200/80 bg-white flex-col select-none">
        <SidebarContent />
      </aside>

      {/* Mobile Slide-in Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-250">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
