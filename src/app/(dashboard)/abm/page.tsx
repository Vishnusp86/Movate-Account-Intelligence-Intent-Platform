"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Target,
  Search,
  Download,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function ABMWorkspacePage() {
  const [selectedTier, setSelectedTier] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  const accounts = dbData.accounts

  const filtered = useMemo(() => {
    let list = accounts
    if (selectedTier !== "All") {
      list = list.filter((a) => a.tier.includes(selectedTier))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.domain.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => b.overall_priority_score - a.overall_priority_score)
  }, [accounts, selectedTier, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              ABM Campaign & Segmentation Workspace
            </h1>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              Audience Activation
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build multi-touch ABM cohorts across Tiers 1-4, active intent topics, and website engagement signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = "Name,Domain,Classification,Segment,Overall Score,Tier\n"
              const rows = filtered
                .map((a) => `"${a.name}","${a.domain}","${a.target_classification}","${a.account_segments}",${a.overall_priority_score},"${a.tier}"`)
                .join("\n")
              const blob = new Blob([headers + rows], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const el = document.createElement("a")
              el.href = url
              el.download = `abm_audience_${selectedTier.toLowerCase()}.csv`
              el.click()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Export Campaign Audience (CSV)</span>
          </button>
        </div>
      </div>

      {/* Cohort Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          {["All", "Tier 1", "Tier 2", "Tier 3", "Tier 4"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedTier === tier
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cohort accounts..."
            className="pl-8 text-xs h-8.5 bg-white"
          />
        </div>
      </div>

      {/* Cohort Accounts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Account & Domain</th>
                <th className="py-3 px-3">Segment</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">Intent Score</th>
                <th className="py-3 px-3">Vector Engagement</th>
                <th className="py-3 px-3">Tier Assignment</th>
                <th className="py-3 px-4 text-right">Scope Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 100).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <Link
                      href={`/accounts/${a.domain}`}
                      className="font-semibold text-slate-900 hover:text-blue-700"
                    >
                      {a.name}
                    </Link>
                    <div className="text-[10px] text-slate-400">{a.domain}</div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="text-[10px]">
                      {a.account_segments}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{a.industry}</td>
                  <td className="py-3 px-3 font-semibold text-blue-700">{a.intent_score}</td>
                  <td className="py-3 px-3 text-teal-700 font-medium">
                    {a.vector_profiles_count > 0 ? `${a.vector_profiles_count} visitors` : "0 visitors"}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={a.tier.includes("Tier 1") ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {a.tier.split(":")[0]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/accounts/${a.domain}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <span>Open</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
