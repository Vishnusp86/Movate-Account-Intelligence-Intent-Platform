"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function BuyingCommitteePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("All")

  const contacts = dbData.matched_contacts

  const filteredContacts = useMemo(() => {
    let list = contacts

    if (segmentFilter !== "All") {
      list = list.filter((c) => c.segments.includes(segmentFilter))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.account_name.toLowerCase().includes(q) ||
          c.account_domain.toLowerCase().includes(q)
      )
    }

    return list
  }, [contacts, segmentFilter, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Buying Committee & Decision-Maker Matrix
            </h1>
            <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200">
              {contacts.length} Matched Contacts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persona coverage across Target Accounts and Existing Clients. Contacts mapped to canonical accounts without fabricating evaluation intent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Vector Visitor Matched
          </Badge>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600">
          {["All", "ITS EN", "DCX EN", "EC"].map((seg) => (
            <button
              key={seg}
              onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                segmentFilter === seg
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              {seg === "All" ? "All Contacts" : seg}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contact, account, domain..."
            className="pl-8 text-xs h-8.5 bg-white"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Contact Key & Name</th>
                <th className="py-3 px-3">Matched Account</th>
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3">Account Segments</th>
                <th className="py-3 px-3">Persona Classification</th>
                <th className="py-3 px-4 text-right">Account Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-xs">{c.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{c.id}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{c.account_name}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{c.account_domain}</td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="text-[10px]">
                      {c.segments}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      Technology / Operational
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/accounts/${c.account_domain}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      <span>Scope Card</span>
                      <ArrowRight className="size-3" />
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
