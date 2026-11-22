import { NextRequest, NextResponse } from "next/server"
import { getAccounts } from "@/lib/db/repository"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || undefined
  const classification = searchParams.get("classification") || undefined
  const tier = searchParams.get("tier") || undefined
  const is_target = searchParams.get("is_target") !== null ? searchParams.get("is_target") === "true" : undefined
  const is_client = searchParams.get("is_client") !== null ? searchParams.get("is_client") === "true" : undefined
  const is_icp = searchParams.get("is_icp") !== null ? searchParams.get("is_icp") === "true" : undefined
  const has_visitors = searchParams.get("has_visitors") !== null ? searchParams.get("has_visitors") === "true" : undefined
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)

  const result = getAccounts({
    query,
    classification,
    tier,
    is_target,
    is_client,
    is_icp,
    has_visitors,
    limit,
    offset,
  })

  return NextResponse.json(result)
}
