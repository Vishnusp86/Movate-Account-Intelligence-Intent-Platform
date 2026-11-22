import { NextRequest, NextResponse } from "next/server"
import { getAccountById, getMatchedContactsForAccount, getVisitors } from "@/lib/db/repository"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const account = getAccountById(decodedId)

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  const contacts = getMatchedContactsForAccount(account.domain)
  const visitors = getVisitors({ domain: account.domain, limit: 100 })

  return NextResponse.json({
    account,
    contacts,
    visitors: visitors.items,
  })
}
