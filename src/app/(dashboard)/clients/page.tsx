"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

  const clientAccounts = useMemo(() => {
    return dbData.accounts.filter((a) => a.is_client)
  }, [])

  const filteredClients = useMemo(() => {
    let list = clientAccounts

    if (selectedBU !== "All") {
      list = list.filter((a) => a.client_bu === selectedBU)
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

  const buList = ["All", "DIS", "DES", "DCX", "EPS", "ITS - PS", "SOL"]

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
                key={bu}
                onClick={() => setSelectedBU(bu)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBU === bu
                    ? "bg-white text-emerald-800 shadow-xs font-semibold"
                    : "hover:text-slate-900"
                }`}
              >
                {bu}
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

      {/* Client Accounts & Service Penetration Matrix */}
      <Card className="p-0 overflow-hidden">
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
              {filteredClients.map((client) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
