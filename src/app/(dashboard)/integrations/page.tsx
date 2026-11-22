"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Cpu,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  RefreshCw,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function IntegrationsPage() {
  const governor = dbData.credit_governor
  const topics = dbData.intent_topics_matrix

  const connectors = [
    {
      name: "Vector MCP",
      purpose: "First-party website visitor identification & LinkedIn ads performance",
      auth: "OAuth 2.0 (PropelAuth)",
      status: "Connected & Ingesting",
      details: "Org ID 129519 (Movate) • Role: Owner • Freshness: Sun Nov 22 2026",
      type: "First-Party Owned",
    },
    {
      name: "Google Analytics 4 (GA4)",
      purpose: "Aggregate service pages, active users, and traffic acquisition metrics",
      auth: "Data API Protobuf Client",
      status: "Connected & Ingesting",
      details: "Property ID properties/328533793 (Movate - GA4) • Aggregate Mode Only",
      type: "First-Party Owned",
    },
    {
      name: "ZoomInfo MCP",
      purpose: "Corporate firmographics, contacts, scoops, and intent topics",
      auth: "MCP Tool Access",
      status: "Connected (Gated by Governor)",
      details: "10 Allocated Intent Topics • Free-First Pre-Score Gating Enforced",
      type: "Entitlement-Limited",
    },
    {
      name: "Google News & GDELT",
      purpose: "Leadership changes, funding, M&A, and public corporate event triggers",
      auth: "Public Syndication Feeds",
      status: "Active & Monitored",
      details: "Deduplication by canonical URL and title similarity",
      type: "Free / Public",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Integrations & ZoomInfo Credit Governor
            </h1>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              Modular Connector Registry
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforce free-first account research, strict monthly credit caps, and 10 allocated intent topic slot management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Governor Active
          </Badge>
        </div>
      </div>

      {/* Credit Governor Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Monthly Credit Allowance</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {governor.monthly_consumed} / {governor.monthly_budget.toLocaleString()}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "8.4%" }} />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">8.4% consumed (Soft Cap: 80%)</div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Daily Safety Cap</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {governor.daily_consumed} / {governor.daily_cap}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {governor.daily_cap - governor.daily_consumed} credits remaining today
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Pre-Score Gate Threshold</span>
          <div className="text-2xl font-bold text-blue-700 mt-2">
            Pre-Score ≥ 60
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Free-first data required before ZI spend
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Cost Per Accepted Account</span>
          <div className="text-2xl font-bold text-teal-700 mt-2">
            {governor.cost_per_accepted_account}
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">
            Sales accepted ROI metric
          </div>
        </Card>
      </div>

      {/* Connector Registry Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Active Data Connectors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectors.map((c) => (
            <Card key={c.name} className="p-4 gap-2 border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Database className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.auth}</div>
                  </div>
                </div>
                <Badge variant={c.status.includes("Connected") ? "success" : "secondary"} className="text-[10px]">
                  {c.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">{c.purpose}</p>
              <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100 mt-1">
                {c.details}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 10 Allocated Intent Topics Matrix Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">ZoomInfo Intent Topic Matrix (All 10 Allocated Topics Active)</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Mapped to Movate service lines with substitute free signal triggers.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            10 / 10 Allocated Topics Active
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Allocated ZoomInfo Topic</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Mapped Movate Service Line</th>
                <th className="py-3 px-4">Substitute Free Signals (Fallback)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((t) => (
                <tr key={t.topic} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.topic}</td>
                  <td className="py-3 px-3">
                    <Badge variant="success" className="text-[10px]">
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-medium text-blue-700">{t.service_line}</td>
                  <td className="py-3 px-4 text-slate-600">{t.substitutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
