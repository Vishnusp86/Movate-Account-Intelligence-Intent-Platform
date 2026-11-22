"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Discovery accounts: Accounts that are not already clients or targets, or high-potential discovery
  const discoveryAccounts = useMemo(() => {
    return dbData.accounts.filter((a) => !a.is_client)
  }, [])

  const filtered = useMemo(() => {
    let list = discoveryAccounts
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
  }, [discoveryAccounts, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              New Account Discovery Workspace
            </h1>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              ZoomInfo & Multi-Source Prospecting
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover new enterprise prospects outside existing lists. Hard eligibility gate: Annual Revenue &gt; USD 10M strictly enforced.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <ShieldCheck className="size-3" />
            Pre-Score First Gate Active
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prospective accounts, industries..."
            className="pl-8 text-xs h-8.5 bg-white"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} qualified prospects
        </div>
      </div>

      {/* Discovery Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Prospective Company</th>
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3">Industry Vertical</th>
                <th className="py-3 px-3">Revenue Gate</th>
                <th className="py-3 px-3">Pre-Score</th>
                <th className="py-3 px-3">Tier Potential</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{account.name}</td>
                  <td className="py-3 px-3 font-mono text-blue-700">{account.domain}</td>
                  <td className="py-3 px-3 text-slate-700">{account.industry}</td>
                  <td className="py-3 px-3">
                    <Badge variant="success" className="text-[10px]">
                      {account.icp_status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {account.overall_priority_score} / 100
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {account.tier.split(":")[0]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/accounts/${account.domain}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      <span>Qualify</span>
                      <ArrowUpRight className="size-3" />
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
