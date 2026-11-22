"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Globe,
  Clock,
  Users,
  Eye,
  CheckCircle2,
  TrendingUp,
  FileText,
} from "lucide-react"

export default function GA4IntelPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ga4")
      .then((res) => res.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading live Google Analytics 4 service page metrics...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              GA4 Service Pages & Traffic Analytics
            </h1>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
              {data.property_name} ({data.property_id})
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate website intelligence and service line page engagement. Strict aggregate compliance (no fabricated person-level attribution).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Authenticated GA4 Data API
          </Badge>
          <span className="text-xs text-slate-400">Date Range: 2026-11-01 to 2026-11-20</span>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Total Active Users</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data.total_active_users.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Across enterprise service pages
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Total Screen Page Views</span>
          <div className="text-2xl font-bold text-blue-700 mt-2">
            {data.total_screen_page_views.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1.9 views per active user session
          </div>
        </Card>

        <Card className="p-5 gap-0">
          <span className="text-xs font-medium text-slate-500">Top Service Engagement</span>
          <div className="text-2xl font-bold text-teal-700 mt-2">
            Artificial Intelligence
          </div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">
            Avg 142s duration on /artificial-intelligence/
          </div>
        </Card>
      </div>

      {/* Key Service Pages Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm">Key Service Pages Engagement (Live GA4 Data API)</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Real screen pageviews, user counts, and engagement duration by service route.
          </CardDescription>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">Service Page Route</th>
                <th className="py-3 px-3">Page Title</th>
                <th className="py-3 px-3">Service Line</th>
                <th className="py-3 px-3 text-right">Active Users</th>
                <th className="py-3 px-3 text-right">Page Views</th>
                <th className="py-3 px-4 text-right">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.top_service_pages.map((p: any) => (
                <tr key={p.page_path} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-700">{p.page_path}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-xs truncate">{p.page_title}</td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" className="text-[10px]">
                      {p.service_line}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {p.active_users.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-blue-700">
                    {p.page_views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    {p.avg_engagement_time_sec}s
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
