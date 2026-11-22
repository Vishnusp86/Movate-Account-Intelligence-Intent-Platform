import { NextRequest, NextResponse } from "next/server"
import { getCreditGovernor, getIntentTopicMatrix } from "@/lib/db/repository"

// Provider Usage Ledger in memory
const usageLedger: Array<{
  id: string
  timestamp: string
  provider: string
  action: string
  target_account: string
  credits_consumed: number
  pre_score: number
  status: "Approved" | "Soft Cap Alert" | "Blocked (Cap Exceeded)"
}> = [
  {
    id: "tx-8810",
    timestamp: "2026-11-22T17:45:00Z",
    provider: "ZoomInfo MCP",
    action: "Search Intent Topics (10 Allocated)",
    target_account: "General Multi-Topic Query",
    credits_consumed: 0, // Free intent search
    pre_score: 82,
    status: "Approved"
  },
  {
    id: "tx-8809",
    timestamp: "2026-11-22T17:15:00Z",
    provider: "ZoomInfo MCP",
    action: "Company Firmographics Enrich",
    target_account: "Apple (apple.com)",
    credits_consumed: 1,
    pre_score: 94,
    status: "Approved"
  },
  {
    id: "tx-8808",
    timestamp: "2026-11-22T16:50:00Z",
    provider: "ZoomInfo MCP",
    action: "Target Account Batch Pre-Score Verification",
    target_account: "Batch 50 Targets (ITS/DCX EN)",
    credits_consumed: 0,
    pre_score: 88,
    status: "Approved"
  }
]

export async function GET() {
  const governor = getCreditGovernor()
  const topics = getIntentTopicMatrix()
  return NextResponse.json({
    governor,
    topics,
    ledger: usageLedger
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, target_account, pre_score = 0, requested_credits = 1 } = body
  const governor = getCreditGovernor()

  // Credit Governor Pre-Score Gate: Must be >= 60 to spend ZoomInfo credits
  if (pre_score < 60) {
    return NextResponse.json(
      {
        error: "Credit Governor Rejection: Free-first Pre-Score is below threshold (minimum 60 required). Rely on free signals first.",
        pre_score
      },
      { status: 403 }
    )
  }

  // Daily cap check
  if (governor.daily_consumed + requested_credits > governor.daily_cap) {
    return NextResponse.json(
      {
        error: `Credit Governor Block: Daily cap of ${governor.daily_cap} credits reached. Queued for tomorrow or admin override required.`
      },
      { status: 429 }
    )
  }

  // Ledger record
  const newTx = {
    id: `tx-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    provider: "ZoomInfo MCP",
    action: action || "Enrichment Call",
    target_account: target_account || "Unknown",
    credits_consumed: requested_credits,
    pre_score,
    status: "Approved" as const
  }
  usageLedger.unshift(newTx)

  return NextResponse.json({
    success: true,
    message: "Request authorized through ZoomInfo Credit Governor.",
    transaction: newTx
  })
}
