"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Building,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function OpportunityIntelPage() {
  const accounts = dbData.accounts.filter((a) => a.is_client || a.tier.includes("Tier 1"))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Opportunity Intelligence & Whitespace Engine
            </h1>
            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
              Hypothesis Generator
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Correlate unserved service lines, leadership changes, tech adoption signals, and M&A expansion triggers.
          </p>
        </div>
      </div>

      {/* Opportunity Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.slice(0, 8).map((a) => (
          <Card key={a.id} className="p-5 gap-3 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/accounts/${a.domain}`}
                  className="font-bold text-sm text-slate-900 hover:text-blue-700"
                >
                  {a.name}
                </Link>
                <div className="text-[10px] text-slate-400 font-mono">{a.domain}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {a.account_segments}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-blue-600" />
                <span>Whitespace Play: AI Engineering & Cloud Migration</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Observed {a.vector_profiles_count} Vector visits to AI engineering service routes while external ZoomInfo shows Cloud Migration surge (score 90+).
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Hypothesis: <strong className="text-emerald-700">Cross-Sell Opportunity</strong>
              </span>
              <Link
                href={`/accounts/${a.domain}`}
                className="text-blue-700 font-medium hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>View Full Intel</span>
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
