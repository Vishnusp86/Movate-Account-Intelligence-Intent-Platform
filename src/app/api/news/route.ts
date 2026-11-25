import { NextRequest, NextResponse } from "next/server"
import { getCompanyNews } from "@/lib/connectors/google-news"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q") || searchParams.get("company") || searchParams.get("domain") || ""
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? parseInt(limitParam, 10) : 5

  if (!q.trim()) {
    return NextResponse.json(
      { error: "Query parameter 'q' or 'company' is required" },
      { status: 400 }
    )
  }

  const articles = await getCompanyNews(q, { limit })

  return NextResponse.json({
    query: q,
    count: articles.length,
    articles,
    timestamp: new Date().toISOString(),
    source: "Google News RSS",
  })
}
