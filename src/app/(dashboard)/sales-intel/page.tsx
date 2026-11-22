"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  Search,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function SalesIntelligencePage() {
  const [feedbackState, setFeedbackState] = useState<Record<string, "Accepted" | "Rejected">>({})
  const [searchQuery, setSearchQuery] = useState("")

  const tier1Accounts = useMemo(() => {
    return dbData.accounts.filter((a) => a.tier.includes("Tier 1"))
  }, [])

  const filtered = useMemo(() => {
    let list = tier1Accounts
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
  }, [tier1Accounts, searchQuery])

  const handleFeedback = (domain: string, action: "Accepted" | "Rejected") => {
    setFeedbackState((prev) => ({ ...prev, [domain]: action }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sales Intelligence & Action Queue
            </h1>
            <Badge variant="default" className="text-white bg-slate-900">
              {tier1Accounts.length} Tier 1 Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Accounts meeting the Sales Ready threshold (Overall ≥ 75, Fit ≥ 60, ≥2 corroborating signals, not suppressed). 2-business-day outreach SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <Clock className="size-3" /> SLA: 48h Outreach
          </Badge>
        </div>
      </div>

      {/* Priority Action Cards */}
      <div className="space-y-4">
        {filtered.map((account) => {
          const feedback = feedbackState[account.domain]
          return (
            <Card
              key={account.id}
              className="p-5 border-l-4 border-l-blue-600 hover:shadow-xs transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/accounts/${account.domain}`}
                      className="text-base font-bold text-slate-900 hover:text-blue-700"
                    >
                      {account.name}
                    </Link>
                    <Badge variant="outline" className="text-[10px]">
                      {account.account_segments}
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      Overall: {account.overall_priority_score}/100
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-mono text-slate-600">{account.domain}</span> •{" "}
                    <span>{account.industry}</span> •{" "}
                    <span className="font-semibold text-emerald-700">{account.revenue_range || "Revenue Verified"}</span>
                  </div>

                  <p className="text-xs text-slate-700 max-w-3xl leading-relaxed mt-2">
                    <strong className="text-slate-900">Why Now:</strong> Surging intent on Cloud Migration & AI engineering corroborated by {account.vector_profiles_count} Vector visitors to Movate solution pages.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Recommended Talk Track:</span>
                    <span>Reference recent enterprise AI SDLC acceleration benchmarks. Anchor on reducing release cycle times.</span>
                  </div>
                </div>

                {/* Right Actions & Feedback */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0">
                  <Link
                    href={`/accounts/${account.domain}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <span>Account Scope Card</span>
                    <ExternalLink className="size-3" />
                  </Link>

                  {/* Feedback Action Buttons */}
                  <div className="flex items-center gap-1.5 mt-1">
                    {feedback ? (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        feedback === "Accepted" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {feedback === "Accepted" ? "✓ Accepted to Pipeline" : "✕ Rejected (Logged)"}
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleFeedback(account.domain, "Accepted")}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          <ThumbsUp className="size-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleFeedback(account.domain, "Rejected")}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition-colors shadow-2xs"
                        >
                          <ThumbsDown className="size-3 text-slate-400" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
