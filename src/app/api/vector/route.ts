import { NextRequest, NextResponse } from "next/server"
import { getVisitors, getKeyVisitors } from "@/lib/db/repository"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "all"
  const query = searchParams.get("query") || undefined
  const domain = searchParams.get("domain") || undefined
  const seniority = searchParams.get("seniority") || undefined
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  if (type === "key") {
    const result = getKeyVisitors({ query, seniority, limit, offset })
    return NextResponse.json(result)
  }

  const result = getVisitors({ query, domain, limit, offset })
  return NextResponse.json(result)
}
