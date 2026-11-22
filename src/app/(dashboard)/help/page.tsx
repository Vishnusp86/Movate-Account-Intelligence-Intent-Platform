import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle2, Shield, ArrowRight } from "lucide-react"

const runbooks = [
  {
    code: "D1",
    title: "Admin: First-Time Setup & Connector Check",
    audience: "Admin & Operations",
    steps: [
      "Confirm environment variables for Vector (Org 129519), GA4 (328533793), and ZoomInfo MCP.",
      "Review Credit Governor settings: monthly budget 5,000 credits, daily cap 250 units, TTLs configured.",
      "Confirm all 10 allocated ZoomInfo topics mapped to Movate service lines.",
      "Verify scoring weights (Fit 30%, Intent 35%, Engagement 15%, Trigger 10%, Contactability 10%).",
    ],
  },
  {
    code: "D2",
    title: "Operations: Master Excel & Vector Ingestion",
    audience: "Marketing Ops",
    steps: [
      "Upload master workbook files: Target accounts (106 rows), Existing clients (317 rows), Vector export (2,044 visitors).",
      "Confirm target classifications strictly use source column values (ITS EN / DCX EN). Never classify from company names.",
      "Execute identity resolution: exact canonical domain > ZoomInfo ID > normalised name.",
      "Review validation report: check duplicate rates and overlap distribution.",
    ],
  },
  {
    code: "D3",
    title: "Daily: Sales Representative Workflow",
    audience: "Enterprise Sales",
    steps: [
      "Open Sales Intelligence: filter by 'My Territory' and 'Tier 1: Act Now'.",
      "Open account profile: inspect the 11-section Account Scope Card, why-now triggers, and corroborating evidence.",
      "Review Buying Committee: select verified relevant persona.",
      "Reference suggested talk track and matched Movate case study.",
      "Click Accept (qualifies to pipeline) or Reject with mandatory reason code (trains calibration).",
    ],
  },
  {
    code: "D4",
    title: "Weekly: ABM Manager Workflow",
    audience: "ABM Lead",
    steps: [
      "Review Tier migrations: accounts promoted to Tier 1 or Tier 2.",
      "Build multi-touch cohorts: e.g. Tier 2 + Cloud Migration Intent + BFSI + Vector Visitor observed.",
      "Export sanitized audience for LinkedIn / ad platform upload (logged in audit trail).",
      "Review engagement heatmap across Movate service pages.",
    ],
  },
  {
    code: "D5",
    title: "Account Manager: Existing Clients QBR Planning",
    audience: "Customer Success & AMs",
    steps: [
      "Open Existing Clients: sort by Growth Opportunity Score.",
      "Inspect Service Penetration Matrix: identify Confirmed vs Inferred vs Unknown whitespace.",
      "Check triggers: executive departures, acquisitions, tech stack upgrades.",
      "Draft QBR cross-sell plan for adjacent uncontracted service lines.",
    ],
  },
  {
    code: "D6",
    title: "Monthly: ZoomInfo Credit & Cost Governance",
    audience: "Marketing Ops & Finance",
    steps: [
      "Reconcile provider_usage_ledger against ZoomInfo portal report.",
      "Review Cost per Accepted Account metric.",
      "Audit Topic Value Report: evaluate pipeline generated per intent topic.",
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Platform Runbooks & Standard Operating Procedures
            </h1>
            <Badge variant="outline" className="text-slate-700 bg-white">
              docs/RUNBOOKS.md
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            In-app standard operating procedures for Admin, Sales Reps, ABM Managers, and Marketing Operations.
          </p>
        </div>
      </div>

      {/* Runbook Cards */}
      <div className="space-y-4">
        {runbooks.map((rb) => (
          <Card key={rb.code} className="p-5 border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-mono">
                    {rb.code}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-900">{rb.title}</h3>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">
                  Primary Role: <span className="text-slate-600 font-semibold">{rb.audience}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              {rb.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="font-mono text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
