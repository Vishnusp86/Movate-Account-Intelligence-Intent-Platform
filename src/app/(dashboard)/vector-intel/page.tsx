"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function VectorIntelPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Key">("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [seniorityFilter, setSeniorityFilter] = useState("All")

  const allVisitors = dbData.visitors
  const keyVisitors = dbData.key_visitors

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

      {/* Visitors Table */}
      <Card className="p-0 overflow-hidden">
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
                {filteredVisitors.slice(0, 100).map((v: any) => (
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
                ))}
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
                {filteredVisitors.slice(0, 100).map((v: any) => (
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
