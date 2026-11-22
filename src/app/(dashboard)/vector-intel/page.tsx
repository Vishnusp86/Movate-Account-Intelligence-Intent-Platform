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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function VectorIntelPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Key">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [seniorityFilter, setSeniorityFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const allVisitors = dbData.visitors
  const keyVisitors = dbData.key_visitors

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, seniorityFilter, pageSize])

  const filteredVisitors = useMemo(() => {
    if (activeTab === "Key") {
      let list = keyVisitors
      if (seniorityFilter !== "All") {
        list = list.filter((v) => v.seniority.toLowerCase().includes(seniorityFilter.toLowerCase()))
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        list = list.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.company.toLowerCase().includes(q) ||
            v.title.toLowerCase().includes(q)
        )
      }
      return list
    }

    let list = allVisitors
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.company_name.toLowerCase().includes(q) ||
          v.company_domain.toLowerCase().includes(q) ||
          v.title.toLowerCase().includes(q) ||
          v.department.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeTab, allVisitors, keyVisitors, searchQuery, seniorityFilter])

  // Pagination calculations
  const totalItems = filteredVisitors.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex)

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Vector Website & Visitor Intelligence
            </h1>
            <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200">
              Org 129519 (Movate)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2,044 identified B2B website visitors matched against target enterprise accounts and existing clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Live Ingestion Active
          </Badge>
          <span className="text-xs text-slate-400">Freshness: Sun Nov 22 2026</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "All" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
            }`}
          >
            All Identified Visitors ({allVisitors.length})
          </button>
          <button
            onClick={() => setActiveTab("Key")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "Key" ? "bg-white text-teal-800 shadow-xs font-semibold" : "hover:text-slate-900"
            }`}
          >
            <Shield className="size-3.5 text-teal-600" />
            <span>Key Decision-Makers ({keyVisitors.length})</span>
          </button>
        </div>

        {activeTab === "Key" && (
          <div className="flex items-center gap-1 text-xs">
            {["All", "C-Level", "VP", "Director", "Board"].map((s) => (
              <button
                key={s}
                onClick={() => setSeniorityFilter(s)}
                className={`px-2.5 py-1 rounded border text-[11px] ${
                  seniorityFilter === s
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor, title, company..."
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
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> {activeTab === "Key" ? "decision-makers" : "visitors"}
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
              <option value={200}>200</option>
              <option value={500}>500</option>
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

      {/* Visitors Table */}
      <Card className="p-0 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {activeTab === "All" ? (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-3">Job Title & Department</th>
                  <th className="py-3 px-3">Company & Domain</th>
                  <th className="py-3 px-3">Industry / Size</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-4 text-right">LinkedIn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No visitors match your search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedVisitors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{v.title}</div>
                        <div className="text-[10px] text-slate-400">{v.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/accounts/${v.company_domain}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {v.company_name}
                        </Link>
                        <div className="text-[10px] text-slate-400">{v.company_domain}</div>
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
          ) : (
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
                {paginatedVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No key decision-makers match your filter.
                    </td>
                  </tr>
                ) : (
                  paginatedVisitors.map((v: any) => (
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
                        <div className="font-semibold text-slate-900">{v.company}</div>
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
        </div>

        {/* Bottom Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-slate-900">{endIndex}</strong> of{" "}
            <strong className="text-slate-900">{totalItems.toLocaleString()}</strong> entries
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
