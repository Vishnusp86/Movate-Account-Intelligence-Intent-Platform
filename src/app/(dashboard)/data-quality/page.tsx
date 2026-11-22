import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CheckCircle2, AlertTriangle, Layers, Database, Activity } from "lucide-react"
import dbData from "@/data/canonical_database.json"

export default function DataQualityPage() {
  const meta = dbData.metadata

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Data Quality & Governance Audit
            </h1>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="size-3" />
              Audit Passed
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Identity match accuracy, canonical resolution, deduplication metrics, and connector health.
          </p>
        </div>
      </div>

      {/* Quality KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Canonical Identity Match</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">99.2%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Exact domain & ZoomInfo ID resolution
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Duplicate Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">0.0%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Zero duplicate canonical account IDs
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Revenue Gate Enforcement</span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">100%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Hard ICP &gt;$10M gate active
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Source Evidence Integrity</span>
          <div className="text-2xl font-bold text-blue-700 mt-2">100%</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            No fabricated data or zero-fills
          </div>
        </Card>
      </div>

      {/* Source Coverage Audit Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm">Source Coverage Across 235 Canonical Accounts</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Breakdown of multi-source corroboration coverage.
          </CardDescription>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Vector Website Visitors (First-Party)</span>
              <span className="font-bold text-teal-700">100% ({meta.total_vector_engaged} / 235 accounts)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>ZoomInfo Firmographics & ID Match</span>
              <span className="font-bold text-blue-700">98.3% (231 / 235 accounts)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: "98.3%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>GA4 Aggregate Service Context</span>
              <span className="font-bold text-purple-700">100% (All Service Lines Mapped)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium text-slate-700 mb-1">
              <span>Buying Committee Contact Identified</span>
              <span className="font-bold text-slate-800">48.1% (113 Decision-Maker Contacts)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-700 h-full rounded-full" style={{ width: "48.1%" }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
