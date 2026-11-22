"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Search,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Download,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

const serviceColumns = [
  "Cloud & DevOps",
  "Cybersecurity",
  "AI & Automation",
  "IT Infrastructure",
  "Digital Workplace",
  "Customer Experience (CX)",
  "Data & Insight Services",
]

export default function ExistingClientsPage() {
  const [selectedBU, setSelectedBU] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const clientAccounts = useMemo(() => {
    return dbData.accounts.filter((a) => a.is_client)
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBU, searchQuery, pageSize])

  const filteredClients = useMemo(() => {
    let list = clientAccounts

    if (selectedBU !== "All") {
      list = list.filter((a) => a.client_bu === selectedBU || a.client_bu.startsWith(selectedBU))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.domain.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q) ||
          a.client_bu.toLowerCase().includes(q)
      )
    }

    return list.sort((a, b) => (b.client_growth_score || 0) - (a.client_growth_score || 0))
  }, [clientAccounts, selectedBU, searchQuery])

  const buList = [
    { label: "All", count: clientAccounts.length },
    { label: "DIS", count: clientAccounts.filter((a) => a.client_bu.startsWith("DIS")).length },
    { label: "DES", count: clientAccounts.filter((a) => a.client_bu.startsWith("DES")).length },
    { label: "DCX", count: clientAccounts.filter((a) => a.client_bu.includes("DCX")).length },
    { label: "EPS", count: clientAccounts.filter((a) => a.client_bu.startsWith("EPS")).length },
    { label: "ITS - PS", count: clientAccounts.filter((a) => a.client_bu.includes("ITS")).length },
    { label: "SOL", count: clientAccounts.filter((a) => a.client_bu === "SOL").length },
  ]

  // Pagination calculations
  const totalItems = filteredClients.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedClients = filteredClients.slice(startIndex, endIndex)

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Existing Clients & Whitespace Matrix
            </h1>
            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
              {clientAccounts.length} Active Client Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Account penetration matrix across Movate service lines. Identify cross-sell, upsell, and unserved whitespace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" /> Confirmed Contract
          </Badge>
          <Badge variant="info" className="gap-1">
            <Sparkles className="size-3" /> Inferred Signal
          </Badge>
          <Badge variant="outline" className="gap-1 text-slate-500">
            <HelpCircle className="size-3" /> Whitespace Gap
          </Badge>
        </div>
      </div>

      {/* BU Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="overflow-x-auto max-w-full pb-1">
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600 whitespace-nowrap">
            {buList.map((bu) => (
              <button
                key={bu.label}
                onClick={() => setSelectedBU(bu.label)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBU === bu.label
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "hover:text-slate-900"
                }`}
              >
                {bu.label} ({bu.count})
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, owner, domain..."
            className="pl-8 text-xs h-8.5 bg-white"
          />
        </div>
      </div>

      {/* Top Pagination & Range Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 px-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> client accounts
          </span>
          {searchQuery && (
            <Badge variant="outline" className="text-[10px]">
              Filtered by &ldquo;{searchQuery}&rdquo;
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="h-7 text-[11px] bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={300}>All (284)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="First Page"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Previous Page"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-2 font-medium text-slate-700 text-[11px]">
              Page {safePage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Next Page"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
              title="Last Page"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Client Accounts & Service Penetration Matrix */}
      <Card className="p-0 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">Client Account</th>
                <th className="py-3 px-3">BU / Owner</th>
                <th className="py-3 px-3 text-center">Growth Score</th>
                {serviceColumns.map((col) => (
                  <th key={col} className="py-3 px-2 text-center whitespace-nowrap min-w-[100px]">
                    {col}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No client accounts match your search filter.
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/accounts/${client.domain}`}
                        className="font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {client.name}
                      </Link>
                      <div className="text-[10px] text-slate-400">{client.domain}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{client.client_bu || "DIS"}</div>
                      <div className="text-[10px] text-slate-400">{client.owner || "Vertical AM"}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        <TrendingUp className="size-3" />
                        <span>{client.client_growth_score || 85}</span>
                      </div>
                    </td>

                    {/* 7 Service Columns */}
                    {serviceColumns.map((svc) => {
                      const status = (client.service_penetration as Record<string, string>)[svc] || "Unknown"
                      return (
                        <td key={svc} className="py-3 px-2 text-center">
                          {status === "Confirmed" && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Confirmed
                            </span>
                          )}
                          {status === "Inferred" && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              Inferred
                            </span>
                          )}
                          {status === "Unknown" && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                              Whitespace
                            </span>
                          )}
                        </td>
                      )
                    })}

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/accounts/${client.domain}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        <span>QBR Intel</span>
                        <ArrowUpRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> client accounts
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-[11px] font-medium"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-[11px] font-medium flex items-center gap-0.5"
            >
              <ChevronLeft className="size-3" />
              <span>Prev</span>
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((page, idx) =>
                typeof page === "number" ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-7 h-7 px-2 rounded text-[11px] font-medium transition-colors ${
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

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-[11px] font-medium flex items-center gap-0.5"
            >
              <span>Next</span>
              <ChevronRight className="size-3" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              className="px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-[11px] font-medium"
            >
              Last
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
