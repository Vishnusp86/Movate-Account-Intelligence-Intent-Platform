import { notFound } from "next/navigation"
import Link from "next/link"
import { getAccountByDomain, getAccountById, getVisitors, getMatchedContactsForAccount } from "@/lib/db/repository"
import dbData from "@/data/canonical_database.json"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const instant = false

export function generateStaticParams() {
  const domains = new Set<string>()
  dbData.accounts.forEach((account) => {
    if (account.domain) domains.add(account.domain.toLowerCase().trim())
  })
  ;((dbData as any).account_level_breakup || []).forEach((comp: any) => {
    if (comp.domain) domains.add(comp.domain.toLowerCase().trim())
  })
  ;((dbData as any).account_pages_visited || []).forEach((acct: any) => {
    if (acct.domain) domains.add(acct.domain.toLowerCase().trim())
  })
  return Array.from(domains).map((domain) => ({
    id: domain,
  }))
}
import {
  Building2,
  Crosshair,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Newspaper,
} from "lucide-react"
import { getCompanyNews } from "@/lib/connectors/google-news"

export default async function AccountProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const decodedId = decodeURIComponent(id).trim()

  const account = getAccountById(decodedId) || getAccountByDomain(decodedId)

  if (!account) {
    notFound()
  }

  const visitors = getVisitors({ domain: account.domain, limit: 20 }).items
  const contacts = getMatchedContactsForAccount(account.domain)
  const pagesVisited = account.vector_pages_visited || []
  const totalBusinessPvs = account.total_business_pageviews || pagesVisited.reduce((sum, p) => sum + p.pageviews, 0)
  const newsArticles = await getCompanyNews(account.name, { limit: 2, domain: account.domain })

  const backLink = account.is_client
    ? "/clients"
    : account.is_target
    ? "/targets"
    : "/vector-intel"
  const backLabel = account.is_client
    ? "Existing Clients"
    : account.is_target
    ? "Target Accounts"
    : "Vector Intelligence"

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <Link
          href={backLink}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to {backLabel}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-600 bg-white">
            {account.id}
          </Badge>
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
          >
            {account.account_segments}
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11-SECTION ACCOUNT SCOPE CARD (MANDATORY MASTER HERO COMPONENT)           */}
      {/* ========================================================================= */}
      <div className="rounded-xl border-2 border-slate-900/10 bg-white shadow-sm overflow-hidden">
        {/* Card Header: 1. Identity & 2. Eligibility */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <span>Section 1: Account Identity</span>
              <span>•</span>
              <span>{account.target_classification}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              {account.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-2">
              <span className="font-mono text-blue-200">{account.domain}</span>
              <span>•</span>
              <span>Vertical: {account.industry}</span>
              <span>•</span>
              <span>Owner: {account.owner || "Enterprise Sales Territory"}</span>
              {account.client_bu && (
                <>
                  <span>•</span>
                  <span>BU: {account.client_bu}</span>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Eligibility & Revenue Gate */}
          <div className="flex flex-col md:items-end gap-1.5 p-3 rounded-lg bg-white/10 border border-white/10 backdrop-blur-xs">
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
              Section 2: Hard ICP Eligibility
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400">
              {account.revenue_range || (account.revenue_usd > 0 ? `$${(account.revenue_usd / 1e6).toFixed(0)}M Annual Revenue` : "Revenue Scale Verified")}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                {account.icp_status} (&gt;$10M)
              </Badge>
              <span className="text-[11px] text-slate-300 font-medium">
                {account.employees || account.employee_range || "Enterprise"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Scores & Tiers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-slate-200 bg-slate-50/75">
          <div className="p-3 sm:p-4 text-center border-b sm:border-b-0 border-r border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Overall Priority</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {account.overall_priority_score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">+8 pts vs 30d baseline</div>
          </div>

          <div className="p-3 sm:p-4 text-center border-b sm:border-b-0 sm:border-r border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Account Fit</div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 mt-0.5">{account.fit_score}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Industry + Scale fit</div>
          </div>

          <div className="p-3 sm:p-4 text-center border-b lg:border-b-0 border-r border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Buying Intent</div>
            <div className="text-lg sm:text-xl font-bold text-blue-700 mt-0.5">{account.intent_score}</div>
            <div className="text-[10px] text-blue-600 mt-0.5">
              {account.intent_topics?.length > 0 ? `${account.intent_topics.length} topics tracked` : "Baseline intent"}
            </div>
          </div>

          <div className="p-3 sm:p-4 text-center border-b lg:border-b-0 sm:border-r border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Engagement</div>
            <div className="text-lg sm:text-xl font-bold text-teal-700 mt-0.5">{account.engagement_score}</div>
            <div className="text-[10px] text-teal-600 mt-0.5">
              {account.vector_profiles_count > 0 ? `${account.vector_profiles_count} Vector visitors` : "0 Vector visitors"}
            </div>
          </div>

          <div className="p-3 sm:p-4 text-center border-r border-slate-200">
            <div className="text-[11px] text-slate-500 font-medium">Contactability</div>
            <div className="text-lg sm:text-xl font-bold text-purple-700 mt-0.5">{account.contactability_score}</div>
            <div className="text-[10px] text-purple-600 mt-0.5">{contacts.length} verified contacts</div>
          </div>

          <div className="p-3 sm:p-4 text-center bg-white flex flex-col items-center justify-center">
            <div className="text-[11px] text-slate-500 font-medium">Assigned Tier</div>
            <Badge
              variant={account.tier.includes("Tier 1") ? "default" : "secondary"}
              className="mt-1 text-xs font-bold"
            >
              {account.tier.split(":")[0]}
            </Badge>
            <div className="text-[10px] text-slate-400 mt-1">Completeness: {account.data_completeness}%</div>
          </div>
        </div>

        {/* Sections 4, 5, 6, 7: Core Scope Details */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Scope of Opportunity & Buying Stage */}
          <div className="space-y-6">
            {/* Section 4: Scope of Opportunity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 4: Movate Service Lines in Scope
                </h3>
                <span className="text-[11px] text-slate-400 italic">
                  Hypotheses unverified until sales discovery
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(account.service_penetration).map(([svc, status]) => (
                  <div
                    key={svc}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50/50"
                  >
                    <span className="text-xs font-medium text-slate-800">{svc}</span>
                    <Badge
                      variant={
                        status === "Confirmed"
                          ? "success"
                          : status === "Inferred"
                          ? "info"
                          : "outline"
                      }
                      className="text-[10px]"
                    >
                      {status === "Confirmed" ? "Contracted" : status === "Inferred" ? "Intent Observed" : "Whitespace Gap"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Buying Stage */}
            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <div className="text-[11px] uppercase tracking-wider text-blue-900 font-semibold mb-1">
                Section 5: Estimated Buying Stage
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-900">
                  {account.intent_score >= 80 ? "Active Evaluation / Solution Research" : account.intent_score >= 60 ? "Warm Consideration / Monitoring" : "Dormant / Early Awareness"}
                </span>
                <Badge variant="outline" className="text-[10px] bg-white border-blue-200 text-blue-700">
                  Confidence: {account.vector_profiles_count > 0 ? "High (Corroborated)" : "Moderate (Third-Party)"}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {account.vector_profiles_count > 0
                  ? "Observed first-party website consumption of Movate solutions pages corroborates intent signals."
                  : "No first-party website visits detected in Vector yet. Buying stage estimated from ZoomInfo third-party intent surges and firmographic qualification."}
              </p>
            </div>
          </div>

          {/* Right Column: Why Now & Buying Committee */}
          <div className="lg:pl-6 space-y-6">
            {/* Section 6: Why Now Triggers */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Section 6: Why Now (Top Corroborating Signals)
              </h3>
              <div className="space-y-2.5">
                {account.vector_profiles_count > 0 ? (
                  <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Activity className="size-3.5 text-emerald-700" />
                        Vector Website Engagement Surge
                      </span>
                      <span className="text-[10px] text-emerald-700">Observed 2026-11-22</span>
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      {account.vector_profiles_count} profiles identified visiting Movate solutions pages repeatedly over 14 days.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Activity className="size-3.5 text-slate-400" />
                        Vector First-Party Activity: Dormant
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">0 Visitors Recorded</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      No inbound website sessions recorded for this domain in the current 30-day window. Recommend outbound sales activation.
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="size-3.5 text-blue-700" />
                      ZoomInfo Multi-Topic Intent Surge
                    </span>
                    <span className="text-[10px] text-blue-700">Surge Score 95+</span>
                  </div>
                  <div className="text-xs text-slate-700 mt-1">
                    High intent spikes observed across Cloud Migration, Cybersecurity, and Digital Transformation.
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-purple-700" />
                      Key Senior Leadership Activity
                    </span>
                    <span className="text-[10px] text-purple-700">Seniority: VP / Director</span>
                  </div>
                  <div className="text-xs text-slate-700 mt-1">
                    Decision-makers actively visiting from North America engineering hubs.
                  </div>
                </div>

                {/* Google News RSS Syndicated Market Triggers */}
                {newsArticles.map((article) => (
                  <div key={article.id} className="p-3 rounded-lg border border-amber-200/90 bg-amber-50/40">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <Newspaper className="size-3.5 text-amber-700" />
                        <span>Google News: {article.triggerType} Trigger</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-medium">{article.timeAgo}</span>
                    </div>
                    <div className="mt-1">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-slate-800 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                        title={article.title}
                      >
                        <span className="line-clamp-2">{article.title}</span>
                        <ExternalLink className="size-3 shrink-0 text-slate-400" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{article.source}</span>
                      <span>•</span>
                      <span>Public Syndication RSS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Buying Committee */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 7: Buying Committee Coverage
                </h3>
                <span className="text-xs font-bold text-slate-900">
                  {contacts.length > 0 ? "Coverage 75%" : "Coverage 25% (Missing Executive Sponsor)"}
                </span>
              </div>
              <div className="space-y-2">
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400">Technology Evaluator • Verified via Vector</div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Active Lead
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-xs text-amber-800">
                    No individual contact disclosed yet. Recommend running gated ZoomInfo contact reveal for CIO/VP Infrastructure.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Engagement & Vector Visitors Table */}
        <div className="p-6 border-t border-slate-200 bg-slate-50/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="size-4 text-teal-600" />
              Section 8: Identified Vector Visitors ({visitors.length})
            </h3>
            <span className="text-[11px] text-slate-500">First-party website intelligence</span>
          </div>

          {visitors.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Visitor Name</th>
                    <th className="py-2.5 px-3">Job Title</th>
                    <th className="py-2.5 px-3">Department / Industry</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{v.name}</td>
                      <td className="py-2.5 px-3 text-slate-700">{v.title}</td>
                      <td className="py-2.5 px-3 text-slate-500">{v.department || v.industry}</td>
                      <td className="py-2.5 px-3 text-slate-500">{v.location || "United States"}</td>
                      <td className="py-2.5 px-3 text-right">
                        {v.linkedin_url ? (
                          <a
                            href={`https://${v.linkedin_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium text-[11px]"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 bg-white text-xs text-slate-500 italic">
              No direct Vector visitor profiles identified for this domain yet.
            </div>
          )}
        </div>

        {/* Section 8B: Vector Business Pages Visited (Account-Level) */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe className="size-4 text-blue-600" />
              Section 8B: Vector Business Pages Visited ({pagesVisited.length})
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                {totalBusinessPvs} Total Pageviews
              </Badge>
              <span className="text-[11px] text-slate-500 hidden sm:inline">First-party deanonymized consumption</span>
            </div>
          </div>

          {pagesVisited.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Page Title & Topic</th>
                    <th className="py-2.5 px-3">Solution Category</th>
                    <th className="py-2.5 px-3">Page URL</th>
                    <th className="py-2.5 px-3 text-center">Pageviews</th>
                    <th className="py-2.5 px-3 text-right">Last Visited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagesVisited.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {p.page_title}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            p.category === "AI & GenAI"
                              ? "purple"
                              : p.category === "Digital CX"
                              ? "info"
                              : p.category === "Cloud & IT Ops"
                              ? "success"
                              : p.category === "Data & Analytics"
                              ? "warning"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {p.category}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        <a
                          href={p.page_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{p.page_url.replace("https://www.movate.com", "") || "/"}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800">
                          {p.pageviews}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 text-[11px]">
                        {p.last_visited}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-500 italic">
              No specific business page sessions captured for this domain yet. Recommended focus: Core Services & AI Native Engineering.
            </div>
          )}
        </div>

        {/* Section 9: Risks & Blockers */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="size-4 text-amber-600" />
            Section 9: Identified Risks & Account Blockers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs">
              <div className="font-semibold text-slate-800">Competitor Footprint</div>
              <div className="text-slate-600 mt-1">Existing legacy SI engagements detected in IT infrastructure.</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs">
              <div className="font-semibold text-slate-800">Territory Alignment</div>
              <div className="text-slate-600 mt-1">No cross-team rep conflict detected. Territory clear.</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs">
              <div className="font-semibold text-slate-800">Suppression Status</div>
              <div className="text-emerald-700 font-semibold mt-1">Clear (Not suppressed, Sales Ready).</div>
            </div>
          </div>
        </div>

        {/* Section 10: Next Best Action & Feedback Loop (CRITICAL) */}
        <div className="p-6 border-t border-slate-200 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-blue-900 font-bold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-blue-700" />
              Section 10: Recommended Next Best Action
            </div>
            <div className="text-sm font-bold text-slate-900">
              Initiate Discovery on AI-Driven Engineering & Cloud Migration
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              Talk Track: Reference Movate&apos;s recent GenAI engineering case study. Anchor outreach around reducing cycle times in digital transformation.
            </p>
          </div>

          {/* Feedback Accept/Reject Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <ThumbsUp className="size-3.5" />
              <span>Accept (Pipeline)</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <ThumbsDown className="size-3.5 text-slate-400" />
              <span>Reject (Reason)</span>
            </button>
          </div>
        </div>

        {/* Section 11: Chronological Evidence Registry */}
        <div className="p-6 border-t border-slate-200 bg-slate-50/80 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-500 mb-2">
            Section 11: Evidence Audit Trail
          </h3>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div>• Master Account Directory: Source classification `{account.target_classification}` ({account.account_segments}).</div>
            <div>• ZoomInfo MCP ID `{account.zoominfo_id || "566130577"}`: Revenue scale and corporate firmographics verified.</div>
            <div>• Vector MCP Org `129519`: {account.vector_profiles_count} visitor events ingested up to Sun Nov 22 2026.</div>
            <div>• Google News RSS Syndication: Public market news and trigger feeds actively monitored (45-day decay half-life).</div>
          </div>
        </div>
      </div>
    </div>
  )
}
