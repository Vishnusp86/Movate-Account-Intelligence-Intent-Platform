import Link from "next/link"
import { getExecutiveKpis, getAccounts, getVisitors } from "@/lib/db/repository"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Crosshair,
  Activity,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

export default function OverviewPage() {
  const kpis = getExecutiveKpis()
  const topAccounts = getAccounts({ limit: 8 }).items
  const recentVisitors = getVisitors({ limit: 6 }).items

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Executive Intelligence Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified account intelligence, cross-source buying intent, and real-time website engagement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-600 bg-white">
            Single Canonical Store: 235 Accounts
          </Badge>
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Verified Multi-Source Evidence
          </Badge>
        </div>
      </div>

      {/* Top 4 Primary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/targets">
          <Card className="hover:border-slate-300 transition-all hover:shadow-sm cursor-pointer p-5 gap-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Target Accounts</span>
              <div className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Crosshair className="size-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {kpis.targetAccounts}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
              <span className="font-semibold text-blue-700">61 ITS EN</span>
              <span>•</span>
              <span className="font-semibold text-indigo-700">45 DCX EN</span>
            </div>
          </Card>
        </Link>

        <Link href="/clients">
          <Card className="hover:border-slate-300 transition-all hover:shadow-sm cursor-pointer p-5 gap-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Existing Clients</span>
              <div className="size-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building2 className="size-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {kpis.existingClients}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              DIS, DES, DCX, EPS, ITS-PS
            </div>
          </Card>
        </Link>

        <Link href="/vector-intel">
          <Card className="hover:border-slate-300 transition-all hover:shadow-sm cursor-pointer p-5 gap-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Vector Visitors</span>
              <div className="size-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Activity className="size-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {kpis.totalIdentifiedVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <span className="font-semibold text-teal-700">{kpis.vectorEngagedAccounts}</span>
              <span>matched target/client accounts</span>
            </div>
          </Card>
        </Link>

        <Link href="/sales-intel">
          <Card className="hover:border-slate-300 transition-all hover:shadow-sm cursor-pointer p-5 gap-0 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Tier 1: Act Now</span>
              <div className="size-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Sparkles className="size-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              {kpis.tier1ActNow}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="font-medium text-blue-700">Sales Ready</span>
              <span>(Fit ≥ 60 + 2+ Signals)</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Secondary Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-200 bg-white">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">ICP Qualified (&gt;$10M)</div>
          <div className="text-lg font-bold text-slate-800 mt-0.5">{kpis.icpEligibleAccounts}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Strict Revenue Gate</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Tier 2: Engage via ABM</div>
          <div className="text-lg font-bold text-slate-800 mt-0.5">{kpis.tier2EngageABM}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-0.5">Building Intent</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Key Decision-Makers</div>
          <div className="text-lg font-bold text-slate-800 mt-0.5">{kpis.totalKeyDecisionMakers}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">VP / Director / C-Level</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Credit Governor Status</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">Active</div>
          <div className="text-[10px] text-slate-500 mt-0.5">420 / 5,000 Credits Used</div>
        </div>
      </div>

      {/* Main Grid: Priority Accounts Table & Recent Vector Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Accounts (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Priority Accounts (Tier 1 & High Intent)</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Accounts with verified fit, multi-source intent surge, and Vector website engagement.
                </CardDescription>
              </div>
              <Link
                href="/targets"
                className="text-xs text-blue-700 font-medium hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Account</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Vector Visitors</th>
                    <th className="py-2.5 px-4 text-right">Scope Card</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4">
                        <Link
                          href={`/accounts/${account.domain}`}
                          className="font-semibold text-slate-900 hover:text-blue-700"
                        >
                          {account.name}
                        </Link>
                        <div className="text-[10px] text-slate-400">{account.domain}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            account.target_classification === "ITS EN"
                              ? "info"
                              : account.target_classification === "DCX EN"
                              ? "purple"
                              : account.is_client
                              ? "success"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {account.account_segments}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span>{account.overall_priority_score}</span>
                          <span className="text-[10px] font-normal text-slate-400">/ 100</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={account.tier.includes("Tier 1") ? "default" : "secondary"}
                          className="text-[10px] whitespace-nowrap"
                        >
                          {account.tier.split(":")[0]}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3">
                        {account.vector_profiles_count > 0 ? (
                          <div className="flex items-center gap-1 text-teal-700 font-semibold">
                            <Activity className="size-3" />
                            <span>{account.vector_profiles_count} profiles</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None yet</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Link
                          href={`/accounts/${account.domain}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Col: Live Vector & GA4 Feeds */}
        <div className="space-y-4">
          <Card className="p-4 gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <Activity className="size-4 text-teal-600" />
                <span>Recent Identified Visitors</span>
              </div>
              <Link href="/vector-intel" className="text-[11px] text-blue-700 hover:underline">
                View 2,044
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentVisitors.map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{v.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium line-clamp-1">
                        {v.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {v.company_name} ({v.company_domain})
                      </div>
                    </div>
                    {v.linkedin_url && (
                      <a
                        href={`https://${v.linkedin_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 10 Allocated Topics Matrix Status */}
          <Card className="p-4 gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="size-4 text-blue-600" />
                <span>ZoomInfo Intent Topics (10)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                10 Active
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                "Cloud Migration",
                "Cybersecurity",
                "Digital Transformation",
                "IT Outsourcing",
                "Managed Services",
                "Data & Analytics",
                "Customer Experience Management",
                "Digital Workplace",
                "Artificial Intelligence",
                "Application Modernization",
              ].map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-50"
                >
                  <span className="text-slate-700 font-medium">{topic}</span>
                  <Badge variant="outline" className="text-[9px] text-slate-500">
                    Allocated
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
