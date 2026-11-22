"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Crosshair,
  Search,
  Activity,
  ArrowUpDown,
  ExternalLink,
  Filter,
  Download,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function TargetAccountsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "ITS EN" | "DCX EN" | "Both" | "Vector">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const allAccounts = dbData.accounts

  // Filter accounts where is_target is true
  const targetAccounts = useMemo(() => {
    return allAccounts.filter((a) => a.is_target)
  }, [allAccounts])

  const filteredAccounts = useMemo(() => {
    let list = targetAccounts

    if (activeTab === "ITS EN") {
      list = list.filter((a) => a.target_classification === "ITS EN" || a.target_classification === "DCX + ITS EN")
    } else if (activeTab === "DCX EN") {
      list = list.filter((a) => a.target_classification === "DCX EN" || a.target_classification === "DCX + ITS EN")
    } else if (activeTab === "Both") {
      list = list.filter((a) => a.target_classification === "DCX + ITS EN")
    } else if (activeTab === "Vector") {
      list = list.filter((a) => a.vector_profiles_count > 0)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.domain.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q)
      )
    }

    return list.sort((a, b) => b.overall_priority_score - a.overall_priority_score)
  }, [targetAccounts, activeTab, searchQuery])

  // Counts
  const counts = {
    all: targetAccounts.length,
    its: targetAccounts.filter((a) => a.target_classification === "ITS EN" || a.target_classification === "DCX + ITS EN").length,
    dcx: targetAccounts.filter((a) => a.target_classification === "DCX EN" || a.target_classification === "DCX + ITS EN").length,
    both: targetAccounts.filter((a) => a.target_classification === "DCX + ITS EN").length,
    vector: targetAccounts.filter((a) => a.vector_profiles_count > 0).length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Target Accounts Workspace
            </h1>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              {targetAccounts.length} Enterprise Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized DCX EN and ITS EN enterprise named accounts. Grounded in source classification values.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = "Name,Domain,Classification,Revenue Range,Employees,Overall Score,Tier\n"
              const rows = filteredAccounts
                .map((a) => `"${a.name}","${a.domain}","${a.target_classification}","${a.revenue_range}","${a.employees}",${a.overall_priority_score},"${a.tier}"`)
                .join("\n")
              const blob = new Blob([headers + rows], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const el = document.createElement("a")
              el.href = url
              el.download = `target_accounts_${activeTab.toLowerCase()}.csv`
              el.click()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Segment Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="overflow-x-auto max-w-full pb-1">
          <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600 whitespace-nowrap">
            <button
              onClick={() => setActiveTab("All")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "All" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              All Targets ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab("ITS EN")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "ITS EN" ? "bg-white text-blue-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              ITS EN ({counts.its})
            </button>
            <button
              onClick={() => setActiveTab("DCX EN")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "DCX EN" ? "bg-white text-purple-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              DCX EN ({counts.dcx})
            </button>
            <button
              onClick={() => setActiveTab("Both")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "Both" ? "bg-white text-slate-900 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              Both ({counts.both})
            </button>
            <button
              onClick={() => setActiveTab("Vector")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === "Vector" ? "bg-white text-teal-700 shadow-xs font-semibold" : "hover:text-slate-900"
              }`}
            >
              <Activity className="size-3 text-teal-600" />
              <span>Vector Engaged ({counts.vector})</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts, domains..."
            className="pl-8 text-xs h-8.5 bg-white"
          />
        </div>
      </div>

      {/* Target Accounts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Account & Domain</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Revenue / Employees</th>
                <th className="py-3 px-3">Vector Visitors</th>
                <th className="py-3 px-3">Fit / Intent</th>
                <th className="py-3 px-3">Overall Score</th>
                <th className="py-3 px-3">Tier Status</th>
                <th className="py-3 px-4 text-right">Scope Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <Link
                      href={`/accounts/${account.domain}`}
                      className="font-semibold text-slate-900 hover:text-blue-700 text-xs"
                    >
                      {account.name}
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-0.5">{account.domain}</div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        account.target_classification === "ITS EN"
                          ? "info"
                          : account.target_classification === "DCX EN"
                          ? "purple"
                          : "default"
                      }
                      className="text-[10px]"
                    >
                      {account.target_classification}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">
                      {account.revenue_range || (account.revenue_usd > 0 ? `$${(account.revenue_usd / 1e6).toFixed(0)}M` : "Unknown")}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {account.employees || account.employee_range || "Scale verified"}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {account.vector_profiles_count > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold text-[10px]">
                        <Activity className="size-3" />
                        {account.vector_profiles_count} visitors
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No visit yet</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[11px] font-medium text-slate-700">
                      Fit: <span className="font-semibold text-slate-900">{account.fit_score}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Intent: <span className="font-semibold text-blue-700">{account.intent_score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-sm text-slate-900">
                      {account.overall_priority_score}
                      <span className="text-[10px] font-normal text-slate-400 ml-0.5">/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={account.tier.includes("Tier 1") ? "default" : "secondary"}
                      className="text-[10px] whitespace-nowrap"
                    >
                      {account.tier.split(":")[0]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/accounts/${account.domain}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      <span>Scope Card</span>
                      <ExternalLink className="size-3 text-slate-400" />
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
