"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Activity,
  Search,
  ExternalLink,
  Shield,
  Download,
  Users,
  Eye,
  CheckCircle2,
  Building,
  Building2,
  Trophy,
  Target,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Flame,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"
import { AccountLevelBreakupRecord } from "@/lib/db/repository"

type TabType = "All" | "Key" | "TargetClient" | "AccountBreakup" | "PagesVisited"

export default function VectorIntelPage() {
  const [activeTab, setActiveTab] = useState<TabType>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [seniorityFilter, setSeniorityFilter] = useState("All")
  const [targetClientFilter, setTargetClientFilter] = useState("All")
  const [breakupFilter, setBreakupFilter] = useState("All")
  const [pagesVisitedFilter, setPagesVisitedFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const allVisitors = dbData.visitors as any[]
  const keyVisitors = dbData.key_visitors as any[]
  const accountBreakup = ((dbData as any).account_level_breakup || []) as AccountLevelBreakupRecord[]
  const accountPagesVisited = ((dbData as any).account_pages_visited || []) as any[]

  // Fast domain lookup map by company name
  const domainByCompanyName = useMemo(() => {
    const map = new Map<string, string>()
    dbData.accounts.forEach((a: any) => {
      if (a.name && a.domain) map.set(a.name.toLowerCase().trim(), a.domain.toLowerCase().trim())
    })
    accountBreakup.forEach((b: any) => {
      if (b.company && b.domain) map.set(b.company.toLowerCase().trim(), b.domain.toLowerCase().trim())
    })
    allVisitors.forEach((v: any) => {
      if (v.company_name && v.company_domain) map.set(v.company_name.toLowerCase().trim(), v.company_domain.toLowerCase().trim())
    })
    accountPagesVisited.forEach((p: any) => {
      if (p.account_name && p.domain) map.set(p.account_name.toLowerCase().trim(), p.domain.toLowerCase().trim())
    })
    return map
  }, [accountBreakup, allVisitors, accountPagesVisited])

  const getCleanDomain = (item: any): string => {
    if (!item) return ""
    if (item.domain && typeof item.domain === "string" && item.domain.trim()) {
      return item.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
    }
    if (item.company_domain && typeof item.company_domain === "string" && item.company_domain.trim()) {
      return item.company_domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
    }
    if (item.email && typeof item.email === "string" && item.email.includes("@")) {
      const emailDomain = item.email.split("@")[1]?.toLowerCase().trim()
      if (emailDomain && emailDomain.includes(".")) return emailDomain
    }
    const compName = (item.company || item.company_name || "").toLowerCase().trim()
    if (compName && domainByCompanyName.has(compName)) {
      return domainByCompanyName.get(compName)!
    }
    if (compName && compName.length > 2) {
      return compName
    }
    return ""
  }

  // All visitors from ITS EN, DCX EN target accounts and Existing Client accounts
  const targetClientVisitors = useMemo(() => {
    return allVisitors.filter((v) => v.is_target_client)
  }, [allVisitors])

  // Counts for Target/Client tab chips
  const tcCounts = useMemo(() => {
    return {
      all: targetClientVisitors.length,
      its: targetClientVisitors.filter((v) => v.target_client_segment?.includes("ITS EN")).length,
      dcx: targetClientVisitors.filter((v) => v.target_client_segment?.includes("DCX EN")).length,
      ec: targetClientVisitors.filter((v) => v.target_client_segment?.includes("EC")).length,
    }
  }, [targetClientVisitors])

  // Counts for Account Breakup tab chips
  const breakupCounts = useMemo(() => {
    return {
      all: accountBreakup.length,
      targets: accountBreakup.filter((c) => c.is_target).length,
      clients: accountBreakup.filter((c) => c.is_client).length,
      highIntent: accountBreakup.filter((c) => c.visitors >= 5).length,
    }
  }, [accountBreakup])

  // Counts for Pages Visited tab chips
  const pvCounts = useMemo(() => {
    return {
      all: accountPagesVisited.length,
      its: accountPagesVisited.filter((a) => a.target_classification?.includes("ITS EN") || a.account_segments?.includes("ITS EN")).length,
      dcx: accountPagesVisited.filter((a) => a.target_classification?.includes("DCX EN") || a.account_segments?.includes("DCX EN")).length,
      clients: accountPagesVisited.filter((a) => a.is_client).length,
      highIntent: accountPagesVisited.filter((a) => a.total_pageviews >= 20).length,
    }
  }, [accountPagesVisited])

  // Reset page when any filter or tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, seniorityFilter, targetClientFilter, breakupFilter, pagesVisitedFilter, pageSize])

  // Filtered dataset according to active tab
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    if (activeTab === "Key") {
      let list = keyVisitors
      if (seniorityFilter !== "All") {
        list = list.filter((v) => v.seniority?.toLowerCase().includes(seniorityFilter.toLowerCase()))
      }
      if (q) {
        list = list.filter(
          (v) =>
            v.name?.toLowerCase().includes(q) ||
            v.company?.toLowerCase().includes(q) ||
            v.title?.toLowerCase().includes(q)
        )
      }
      return list
    }

    if (activeTab === "TargetClient") {
      let list = targetClientVisitors
      if (targetClientFilter === "ITS EN") {
        list = list.filter((v) => v.target_client_segment?.includes("ITS EN"))
      } else if (targetClientFilter === "DCX EN") {
        list = list.filter((v) => v.target_client_segment?.includes("DCX EN"))
      } else if (targetClientFilter === "EC") {
        list = list.filter((v) => v.target_client_segment?.includes("EC"))
      }
      if (q) {
        list = list.filter(
          (v) =>
            v.name?.toLowerCase().includes(q) ||
            v.company_name?.toLowerCase().includes(q) ||
            v.company_domain?.toLowerCase().includes(q) ||
            v.title?.toLowerCase().includes(q) ||
            v.department?.toLowerCase().includes(q)
        )
      }
      return list
    }

    if (activeTab === "AccountBreakup") {
      let list = accountBreakup
      if (breakupFilter === "Targets") {
        list = list.filter((c) => c.is_target)
      } else if (breakupFilter === "Clients") {
        list = list.filter((c) => c.is_client)
      } else if (breakupFilter === "HighIntent") {
        list = list.filter((c) => c.visitors >= 5)
      }
      if (q) {
        list = list.filter(
          (c) =>
            c.company?.toLowerCase().includes(q) ||
            c.domain?.toLowerCase().includes(q) ||
            c.industry?.toLowerCase().includes(q)
        )
      }
      return list
    }

    if (activeTab === "PagesVisited") {
      let list = accountPagesVisited
      if (pagesVisitedFilter === "ITS EN") {
        list = list.filter((a) => a.target_classification?.includes("ITS EN") || a.account_segments?.includes("ITS EN"))
      } else if (pagesVisitedFilter === "DCX EN") {
        list = list.filter((a) => a.target_classification?.includes("DCX EN") || a.account_segments?.includes("DCX EN"))
      } else if (pagesVisitedFilter === "Clients") {
        list = list.filter((a) => a.is_client)
      } else if (pagesVisitedFilter === "HighIntent") {
        list = list.filter((a) => a.total_pageviews >= 20)
      }
      if (q) {
        list = list.filter(
          (a) =>
            a.account_name?.toLowerCase().includes(q) ||
            a.domain?.toLowerCase().includes(q) ||
            a.industry?.toLowerCase().includes(q) ||
            a.top_category?.toLowerCase().includes(q) ||
            a.pages_visited?.some((p: any) => p.page_title.toLowerCase().includes(q) || p.page_url.toLowerCase().includes(q))
        )
      }
      return list
    }

    // Default: "All"
    let list = allVisitors
    if (q) {
      list = list.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.company_name?.toLowerCase().includes(q) ||
          v.company_domain?.toLowerCase().includes(q) ||
          v.title?.toLowerCase().includes(q) ||
          v.department?.toLowerCase().includes(q)
      )
    }
    return list
  }, [
    activeTab,
    allVisitors,
    keyVisitors,
    targetClientVisitors,
    accountBreakup,
    accountPagesVisited,
    searchQuery,
    seniorityFilter,
    targetClientFilter,
    breakupFilter,
    pagesVisitedFilter,
  ])

  // Pagination calculations
  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedItems = filteredData.slice(startIndex, endIndex)

  // Smart page number pill generator
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (safePage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (safePage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages)
      }
    }
    return pages
  }, [totalPages, safePage])

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Vector Website Intelligence
            </h1>
            <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 text-xs">
              Org 129519 (Movate)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2,044 identified B2B website visitors across 1,741 companies, matched to ITS EN, DCX EN target accounts and Existing Clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="success" className="gap-1 text-xs py-0.5">
            <CheckCircle2 className="size-3" />
            Live Ingestion Active
          </Badge>
        </div>
      </div>

      {/* Primary 4 Navigation Tabs - Fully Touch-Scrollable on Mobile */}
      <div className="w-full overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs font-medium text-slate-600 min-w-max shadow-inner">
          {/* Tab 1: All Visitors */}
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
              activeTab === "All"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Users className="size-3.5 text-slate-500" />
            <span>All Identified Visitors ({allVisitors.length})</span>
          </button>

          {/* Tab 2: Key Decision-Makers */}
          <button
            type="button"
            onClick={() => setActiveTab("Key")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
              activeTab === "Key"
                ? "bg-white text-teal-800 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Shield className="size-3.5 text-teal-600" />
            <span>Key Decision-Makers ({keyVisitors.length})</span>
          </button>

          {/* Tab 3: Target & Client Visitors */}
          <button
            type="button"
            onClick={() => setActiveTab("TargetClient")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
              activeTab === "TargetClient"
                ? "bg-white text-blue-800 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Target className="size-3.5 text-blue-600" />
            <span>Target &amp; Client Visitors ({targetClientVisitors.length})</span>
          </button>

          {/* Tab 4: Account-Level Breakup */}
          <button
            type="button"
            onClick={() => setActiveTab("AccountBreakup")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
              activeTab === "AccountBreakup"
                ? "bg-white text-emerald-800 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Trophy className="size-3.5 text-amber-500" />
            <span>Account Breakup ({accountBreakup.length})</span>
          </button>

          {/* Tab 5: Account-Wise Pages Visited */}
          <button
            type="button"
            onClick={() => setActiveTab("PagesVisited")}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation cursor-pointer flex items-center gap-1.5 ${
              activeTab === "PagesVisited"
                ? "bg-white text-blue-800 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Globe className="size-3.5 text-blue-600" />
            <span>Pages Visited (Account-Wise) ({accountPagesVisited.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Sub-Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sub-Filters per Tab */}
        <div className="w-full sm:w-auto">
          {activeTab === "PagesVisited" && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-xs font-medium mr-1">Filter:</span>
              {[
                { label: "All Ranked", key: "All", count: pvCounts.all },
                { label: "ITS EN Targets", key: "ITS EN", count: pvCounts.its },
                { label: "DCX EN Targets", key: "DCX EN", count: pvCounts.dcx },
                { label: "Clients (EC)", key: "Clients", count: pvCounts.clients },
                { label: "High Volume (≥ 20 Views)", key: "HighIntent", count: pvCounts.highIntent },
              ].map((chip) => (
                <button
                  type="button"
                  key={chip.key}
                  onClick={() => setPagesVisitedFilter(chip.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    pagesVisitedFilter === chip.key
                      ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {chip.label} ({chip.count})
                </button>
              ))}
            </div>
          )}
          {activeTab === "Key" && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-xs font-medium mr-1">Seniority:</span>
              {["All", "C-Level", "VP", "Director", "Board"].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeniorityFilter(s)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    seniorityFilter === s
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {activeTab === "TargetClient" && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-xs font-medium mr-1">Segment:</span>
              {[
                { label: "All Matched", key: "All", count: tcCounts.all },
                { label: "ITS EN", key: "ITS EN", count: tcCounts.its },
                { label: "DCX EN", key: "DCX EN", count: tcCounts.dcx },
                { label: "Existing Clients (EC)", key: "EC", count: tcCounts.ec },
              ].map((chip) => (
                <button
                  type="button"
                  key={chip.key}
                  onClick={() => setTargetClientFilter(chip.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    targetClientFilter === chip.key
                      ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {chip.label} ({chip.count})
                </button>
              ))}
            </div>
          )}

          {activeTab === "AccountBreakup" && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-xs font-medium mr-1">Filter:</span>
              {[
                { label: "All Ranked", key: "All", count: breakupCounts.all },
                { label: "Targets (ITS & DCX)", key: "Targets", count: breakupCounts.targets },
                { label: "Clients (EC)", key: "Clients", count: breakupCounts.clients },
                { label: "High Volume (≥ 5 Visits)", key: "HighIntent", count: breakupCounts.highIntent },
              ].map((chip) => (
                <button
                  type="button"
                  key={chip.key}
                  onClick={() => setBreakupFilter(chip.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    breakupFilter === chip.key
                      ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {chip.label} ({chip.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "AccountBreakup"
                ? "Search company, domain, industry..."
                : "Search visitor, title, company..."
            }
            className="pl-9 text-xs h-9.5 bg-white w-full rounded-lg border-slate-300 shadow-2xs"
          />
        </div>
      </div>

      {/* Top Pagination & Range Bar - Touch Friendly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> entries
          </span>
          {searchQuery && (
            <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
              Filtered
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-xs">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="h-8 text-xs bg-slate-50 border border-slate-300 rounded-md px-2 text-slate-800 cursor-pointer touch-manipulation focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer touch-manipulation"
              title="First Page"
            >
              <ChevronsLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation flex items-center gap-1"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="px-2 font-semibold text-slate-800 text-xs whitespace-nowrap">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer touch-manipulation"
              title="Last Page"
            >
              <ChevronsRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Responsive Card View on Mobile + Desktop Table on Desktop */}
      <Card className="p-0 overflow-hidden shadow-xs border-slate-200">
        {/* ========================================================================= */}
        {/* 1. DESKTOP TABLE VIEW (Visible on tablet & desktop >= 768px)               */}
        {/* ========================================================================= */}
        <div className="hidden md:block overflow-x-auto">
          {/* VIEW 1: All Identified Visitors */}
          {activeTab === "All" && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-3">Job Title &amp; Department</th>
                  <th className="py-3 px-3">Company &amp; Domain</th>
                  <th className="py-3 px-3">Industry / Size</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-4 text-right">LinkedIn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No visitors match your search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{v.title}</div>
                        <div className="text-[10px] text-slate-400">{v.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        {getCleanDomain(v) ? (
                          <Link
                            href={`/accounts/${encodeURIComponent(getCleanDomain(v))}`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {v.company_name || v.company_domain}
                          </Link>
                        ) : (
                          <span className="font-medium text-slate-800">
                            {v.company_name || "Confidential Organization"}
                          </span>
                        )}
                        {v.company_domain && <div className="text-[10px] text-slate-400">{v.company_domain}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-700">{v.industry}</div>
                        <div className="text-[10px] text-slate-400">{v.company_size}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{v.location || "United States"}</td>
                      <td className="py-3 px-4 text-right">
                        {v.linkedin_url ? (
                          <a
                            href={`https://${v.linkedin_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-[11px]"
                          >
                            <span>Profile</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* VIEW 2: Key Decision-Makers */}
          {activeTab === "Key" && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Seniority</th>
                  <th className="py-3 px-3">Decision-Maker</th>
                  <th className="py-3 px-3">Job Title</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Revenue</th>
                  <th className="py-3 px-3">Business Email</th>
                  <th className="py-3 px-4 text-right">Target Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No key decision-makers match your filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            v.seniority.includes("C-Level") || v.seniority.includes("Board")
                              ? "default"
                              : v.seniority.includes("VP")
                              ? "info"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {v.seniority}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{v.name}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{v.title}</td>
                      <td className="py-3 px-3">
                        {getCleanDomain(v) ? (
                          <Link
                            href={`/accounts/${encodeURIComponent(getCleanDomain(v))}`}
                            className="font-semibold text-slate-900 hover:text-blue-700 hover:underline transition-colors block leading-tight"
                          >
                            {v.company}
                          </Link>
                        ) : (
                          <div className="font-semibold text-slate-900">{v.company}</div>
                        )}
                        <div className="text-[10px] text-slate-400">{v.industry}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-emerald-700">{v.annual_revenue}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{v.email || "Protected"}</td>
                      <td className="py-3 px-4 text-right">
                        {v.is_target_client ? (
                          <Badge variant="success" className="text-[10px]">
                            Matched Account
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-slate-500">
                            Prospect
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* VIEW 3: Target & Client Visitors */}
          {activeTab === "TargetClient" && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-3">Job Title &amp; Department</th>
                  <th className="py-3 px-3">Company &amp; Domain</th>
                  <th className="py-3 px-3">Target / Client Segment</th>
                  <th className="py-3 px-3">Industry / Size</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-4 text-right">LinkedIn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No target or client visitors match your filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{v.title}</div>
                        <div className="text-[10px] text-slate-400">{v.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        {getCleanDomain(v) ? (
                          <Link
                            href={`/accounts/${encodeURIComponent(getCleanDomain(v))}`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {v.company_name || v.company_domain}
                          </Link>
                        ) : (
                          <span className="font-medium text-slate-800">
                            {v.company_name || "Confidential Organization"}
                          </span>
                        )}
                        {v.company_domain && <div className="text-[10px] text-slate-400">{v.company_domain}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            v.target_client_segment?.includes("ITS") && v.target_client_segment?.includes("DCX")
                              ? "default"
                              : v.target_client_segment?.includes("EC") && (v.target_client_segment?.includes("ITS") || v.target_client_segment?.includes("DCX"))
                              ? "success"
                              : v.target_client_segment?.includes("ITS")
                              ? "info"
                              : v.target_client_segment?.includes("DCX")
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {v.target_client_segment || "Target Account"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-700">{v.industry}</div>
                        <div className="text-[10px] text-slate-400">{v.company_size}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{v.location || "United States"}</td>
                      <td className="py-3 px-4 text-right">
                        {v.linkedin_url ? (
                          <a
                            href={`https://${v.linkedin_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-[11px]"
                          >
                            <span>Profile</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* VIEW 4: Account-Level Breakup */}
          {activeTab === "AccountBreakup" && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4 text-center w-14">Rank</th>
                  <th className="py-3 px-4 min-w-[200px]">Company &amp; Domain</th>
                  <th className="py-3 px-3 text-center">Total Visits</th>
                  <th className="py-3 px-3">Target / Client Segment</th>
                  <th className="py-3 px-3 text-center">Seniority Breakdown</th>
                  <th className="py-3 px-3">Annual Revenue</th>
                  <th className="py-3 px-3">Industry / Scale</th>
                  <th className="py-3 px-4 text-right">Scope Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No companies match your search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((comp: AccountLevelBreakupRecord) => (
                    <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {comp.rank <= 3 ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                            #{comp.rank}
                          </span>
                        ) : comp.rank <= 10 ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                            #{comp.rank}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">#{comp.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/accounts/${encodeURIComponent(getCleanDomain(comp))}`}
                          className="font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                        >
                          {comp.company}
                        </Link>
                        <div className="text-[10px] text-slate-400">{comp.domain}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full border text-[11px] bg-slate-900 text-white border-slate-900 shadow-2xs">
                          {comp.visitors >= 10 && <Flame className="size-3 text-amber-400" />}
                          <span>{comp.visitors} Visits</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            comp.segment.includes("Target & Client") || (comp.is_target && comp.is_client)
                              ? "default"
                              : comp.segment.includes("ITS")
                              ? "info"
                              : comp.segment.includes("DCX")
                              ? "warning"
                              : comp.segment.includes("EC")
                              ? "success"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {comp.segment}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 text-[10px]">
                          {comp.c_level > 0 && (
                            <span className="px-1.5 py-0.5 rounded font-semibold bg-red-100 text-red-800" title="C-Level">
                              C:{comp.c_level}
                            </span>
                          )}
                          {comp.vp > 0 && (
                            <span className="px-1.5 py-0.5 rounded font-semibold bg-purple-100 text-purple-800" title="VP / AVP">
                              VP:{comp.vp}
                            </span>
                          )}
                          {comp.director > 0 && (
                            <span className="px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-800" title="Director">
                              Dir:{comp.director}
                            </span>
                          )}
                          {comp.manager > 0 && (
                            <span className="px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700" title="Manager">
                              Mgr:{comp.manager}
                            </span>
                          )}
                          {comp.ic > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-slate-500" title="Staff / IC">
                              IC:{comp.ic}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-emerald-700">
                        {comp.revenue || "Private / Undisclosed"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{comp.industry || "General"}</div>
                        <div className="text-[10px] text-slate-400">{comp.company_size || "Enterprise"}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/accounts/${encodeURIComponent(getCleanDomain(comp))}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                        >
                          <span>Scope Card</span>
                          <ArrowUpRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* VIEW 5: Account-Wise Pages Visited */}
          {activeTab === "PagesVisited" && (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Account &amp; Domain</th>
                  <th className="py-3 px-3">Segment</th>
                  <th className="py-3 px-3">Visitors</th>
                  <th className="py-3 px-3 text-center">Business Pageviews</th>
                  <th className="py-3 px-3">Top Pages Visited</th>
                  <th className="py-3 px-3">Solution Area</th>
                  <th className="py-3 px-4 text-right">Scope Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No accounts match your search or filter.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((acct: any) => (
                    <tr key={acct.account_id || acct.domain} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/accounts/${encodeURIComponent(getCleanDomain(acct))}`}
                          className="font-semibold text-slate-900 hover:text-blue-700 transition-colors text-sm block leading-tight"
                        >
                          {acct.account_name}
                        </Link>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{acct.domain}</div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            acct.target_classification === "ITS EN"
                              ? "info"
                              : acct.target_classification === "DCX EN"
                              ? "warning"
                              : acct.is_client
                              ? "success"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {acct.account_segments}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">
                          {acct.visitors_count}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">profiles</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200/60">
                          <Activity className="size-3 text-blue-500" />
                          <span>{acct.total_pageviews}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-md">
                        <div className="space-y-1">
                          {acct.pages_visited.slice(0, 3).map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                              <a
                                href={p.page_url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate text-slate-700 hover:text-blue-700 hover:underline max-w-[260px] inline-flex items-center gap-1"
                                title={p.page_title}
                              >
                                <span className="truncate">{p.page_title}</span>
                                <ExternalLink className="size-2.5 text-slate-400 shrink-0" />
                              </a>
                              <span className="text-[10px] font-semibold text-slate-500 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                                {p.pageviews} views
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            acct.top_category === "AI & GenAI"
                              ? "purple"
                              : acct.top_category === "Digital CX"
                              ? "info"
                              : acct.top_category === "Data & Analytics"
                              ? "warning"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {acct.top_category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/accounts/${encodeURIComponent(getCleanDomain(acct))}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                        >
                          <span>Scope Card</span>
                          <ArrowUpRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE CARD FEED (Visible on mobile screens < 768px)                   */}
        {/* ========================================================================= */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No results found matching your search.
            </div>
          ) : activeTab === "PagesVisited" ? (
            // Mobile Card for Account-Wise Pages Visited
            paginatedItems.map((acct: any) => (
              <div key={acct.account_id || acct.domain} className="p-3.5 space-y-2.5 bg-white hover:bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/accounts/${encodeURIComponent(getCleanDomain(acct))}`}
                      className="font-semibold text-slate-900 text-sm hover:text-blue-700 transition-colors leading-tight block"
                    >
                      {acct.account_name}
                    </Link>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{acct.domain}</div>
                  </div>

                  <div className="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-200/60 shrink-0">
                    <Activity className="size-3 text-blue-600" />
                    <span>{acct.total_pageviews} Views</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Badge
                    variant={
                      acct.target_classification === "ITS EN"
                        ? "info"
                        : acct.target_classification === "DCX EN"
                        ? "warning"
                        : acct.is_client
                        ? "success"
                        : "outline"
                    }
                    className="text-[10px]"
                  >
                    {acct.account_segments}
                  </Badge>
                  <span className="text-[11px] text-slate-500">{acct.industry}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-medium text-slate-700">{acct.visitors_count} visitors</span>
                </div>

                {/* Top Visited Pages List */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Top Pages Visited:</div>
                  {acct.pages_visited.slice(0, 3).map((p: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                      <a
                        href={p.page_url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-slate-800 hover:text-blue-700 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span className="truncate">{p.page_title}</span>
                        <ExternalLink className="size-2.5 text-slate-400 shrink-0" />
                      </a>
                      <span className="text-[10px] font-semibold text-slate-600 shrink-0 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {p.pageviews}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Link
                    href={`/accounts/${encodeURIComponent(getCleanDomain(acct))}`}
                    className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span>View Account Scope Card</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : activeTab === "AccountBreakup" ? (
            // Mobile Card for Account-Level Breakup
            paginatedItems.map((comp: AccountLevelBreakupRecord) => (
              <div key={comp.id} className="p-3.5 space-y-2.5 bg-white hover:bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center size-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs shrink-0">
                      #{comp.rank}
                    </span>
                    <div>
                      <Link
                        href={`/accounts/${encodeURIComponent(getCleanDomain(comp))}`}
                        className="font-semibold text-slate-900 text-sm hover:text-blue-700 transition-colors leading-tight block"
                      >
                        {comp.company}
                      </Link>
                      <div className="text-[11px] text-slate-400">{comp.domain}</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-xs bg-slate-900 text-white shrink-0 shadow-2xs">
                    {comp.visitors >= 10 && <Flame className="size-3 text-amber-400" />}
                    <span>{comp.visitors} Visits</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Badge
                    variant={
                      comp.segment.includes("Target & Client") || (comp.is_target && comp.is_client)
                        ? "default"
                        : comp.segment.includes("ITS")
                        ? "info"
                        : comp.segment.includes("DCX")
                        ? "warning"
                        : comp.segment.includes("EC")
                        ? "success"
                        : "outline"
                    }
                    className="text-[10px]"
                  >
                    {comp.segment}
                  </Badge>

                  <span className="text-[11px] text-emerald-700 font-medium">
                    {comp.revenue || "Private"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-500">{comp.industry || "General"}</span>
                </div>

                {/* Role Breakdown Bar */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 font-medium mr-1">Roles:</span>
                  {comp.c_level > 0 && (
                    <span className="px-1.5 py-0.5 rounded font-semibold bg-red-100 text-red-800">
                      C-Level: {comp.c_level}
                    </span>
                  )}
                  {comp.vp > 0 && (
                    <span className="px-1.5 py-0.5 rounded font-semibold bg-purple-100 text-purple-800">
                      VP: {comp.vp}
                    </span>
                  )}
                  {comp.director > 0 && (
                    <span className="px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-800">
                      Dir: {comp.director}
                    </span>
                  )}
                  {comp.manager > 0 && (
                    <span className="px-1.5 py-0.5 rounded font-medium bg-slate-200/70 text-slate-700">
                      Mgr: {comp.manager}
                    </span>
                  )}
                  {comp.ic > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-slate-500">
                      IC: {comp.ic}
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <Link
                    href={`/accounts/${encodeURIComponent(getCleanDomain(comp))}`}
                    className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span>View Account Scope Card</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Mobile Card for Visitors (All, Key, TargetClient)
            paginatedItems.map((v: any) => (
              <div key={v.id} className="p-3.5 space-y-2 bg-white hover:bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm leading-tight">{v.name}</div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">{v.title}</div>
                    {v.department && (
                      <div className="text-[11px] text-slate-400">{v.department}</div>
                    )}
                  </div>

                  {v.seniority ? (
                    <Badge
                      variant={
                        v.seniority.includes("C-Level") || v.seniority.includes("Board")
                          ? "default"
                          : v.seniority.includes("VP")
                          ? "info"
                          : "secondary"
                      }
                      className="text-[10px] shrink-0"
                    >
                      {v.seniority}
                    </Badge>
                  ) : v.target_client_segment ? (
                    <Badge variant="info" className="text-[10px] shrink-0">
                      {v.target_client_segment}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                  {getCleanDomain(v) ? (
                    <Link
                      href={`/accounts/${encodeURIComponent(getCleanDomain(v))}`}
                      className="font-medium text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <Building2 className="size-3 text-slate-400" />
                      <span>{v.company_name || v.company}</span>
                    </Link>
                  ) : (
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <Building2 className="size-3 text-slate-400" />
                      <span>{v.company_name || v.company || "Confidential Organization"}</span>
                    </span>
                  )}

                  {v.location && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                      <MapPin className="size-3 text-slate-400" />
                      <span>{v.location}</span>
                    </span>
                  )}
                </div>

                {v.linkedin_url && (
                  <div className="pt-1">
                    <a
                      href={`https://${v.linkedin_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50/60 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <span>View LinkedIn Profile</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ========================================================================= */}
        {/* Bottom Pagination Bar - Fully Responsive                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600">
          <div className="text-center sm:text-left">
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> entries
          </div>

          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="px-2 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation"
            >
              First
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation flex items-center gap-0.5"
            >
              <ChevronLeft className="size-3.5" />
              <span>Prev</span>
            </button>

            {/* Desktop page pills */}
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((page, idx) =>
                typeof page === "number" ? (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-7 h-7 px-2 rounded text-[11px] font-medium transition-colors cursor-pointer touch-manipulation ${
                      safePage === page
                        ? "bg-slate-900 text-white"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="px-1 text-slate-400">
                    ...
                  </span>
                )
              )}
            </div>

            {/* Mobile current page indicator */}
            <span className="sm:hidden px-2 font-semibold text-slate-800 text-xs">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation flex items-center gap-0.5"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="px-2 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 font-medium cursor-pointer touch-manipulation"
            >
              Last
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
