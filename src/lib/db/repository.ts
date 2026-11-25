import dbData from "@/data/canonical_database.json"

export interface IntentTopicItem {
  topic: string
  score: number
  surge: string
  service_line: string
}

export interface PageVisitedRecord {
  page_url: string
  page_title: string
  category: "AI & GenAI" | "Digital CX" | "Cloud & IT Ops" | "Data & Analytics" | "Industry Solutions" | "Executive & Overview" | string
  pageviews: number
  last_visited: string
}

export interface AccountPagesVisitedSummary {
  account_id: string
  account_name: string
  domain: string
  industry: string
  account_segments: string
  target_classification: string
  is_target: boolean
  is_client: boolean
  visitors_count: number
  total_pageviews: number
  top_page: string
  top_page_url: string
  top_category: string
  pages_visited: PageVisitedRecord[]
}

export interface CanonicalAccount {
  id: string
  name: string
  domain: string
  target_classification: "ITS EN" | "DCX EN" | "DCX + ITS EN" | "None" | string
  is_target: boolean
  is_client: boolean
  client_bu: string
  account_segments: string
  owner: string
  industry: string
  revenue_usd: number
  revenue_range: string
  employees: string
  employee_range: string
  icp_status: string
  is_icp: boolean
  vector_profiles_count: number
  has_vector_visitors: boolean
  fit_score: number
  intent_score: number
  engagement_score: number
  contactability_score: number
  overall_priority_score: number
  tier: "Tier 1: Act Now" | "Tier 2: Engage via ABM" | "Tier 3: Nurture / Monitor" | "Tier 4: Watchlist" | string
  data_completeness: number
  client_growth_score: number
  service_penetration: Record<string, "Confirmed" | "Inferred" | "Unknown">
  intent_topics: IntentTopicItem[]
  matched_contacts_count: number
  zoominfo_id: string
  vector_pages_visited?: PageVisitedRecord[]
  total_business_pageviews?: number
}

export interface VisitorRecord {
  id: string
  name: string
  first_name: string
  last_name: string
  linkedin_url: string
  title: string
  department: string
  industry: string
  company_name: string
  company_domain: string
  company_size: string
  company_linkedin_url: string
  location: string
  is_target_client?: boolean
  target_client_segment?: string
}

export interface KeyVisitorRecord {
  id: string
  seniority: string
  name: string
  title: string
  company: string
  industry: string
  annual_revenue: string
  utm_source: string
  utm_medium: string
  email: string
  linkedin_url: string
  date: string
  is_target_client: boolean
}

export interface MatchedContactRecord {
  id: string
  name: string
  account_id: string
  account_name: string
  account_domain: string
  its_en: boolean
  dcx_en: boolean
  ec: boolean
  segments: string
}

export interface CreditGovernorInfo {
  monthly_budget: number
  monthly_consumed: number
  daily_cap: number
  daily_consumed: number
  soft_cap_percent: number
  status: string
  cost_per_accepted_account: string
}

export interface TopicMatrixItem {
  topic: string
  status: string
  service_line: string
  substitutes: string
}

export interface AccountLevelBreakupRecord {
  id: string
  rank: number
  company: string
  domain: string
  revenue: string
  industry: string
  company_size: string
  visitors: number
  board: number
  c_level: number
  vp: number
  head: number
  director: number
  senior: number
  owner: number
  manager: number
  ic: number
  dcx_en: boolean
  its_en: boolean
  is_target: boolean
  is_client: boolean
  segment: string
}

const accountsList: CanonicalAccount[] = dbData.accounts as CanonicalAccount[]
const visitorsList: VisitorRecord[] = dbData.visitors as VisitorRecord[]
const keyVisitorsList: KeyVisitorRecord[] = dbData.key_visitors as KeyVisitorRecord[]
const matchedContactsList: MatchedContactRecord[] = dbData.matched_contacts as MatchedContactRecord[]
const creditGovernorData: CreditGovernorInfo = dbData.credit_governor as CreditGovernorInfo
const topicMatrixData: TopicMatrixItem[] = dbData.intent_topics_matrix as TopicMatrixItem[]
const accountBreakupList: AccountLevelBreakupRecord[] = ((dbData as any).account_level_breakup || []) as AccountLevelBreakupRecord[]

export interface AccountFilterOptions {
  query?: string
  classification?: string
  tier?: string
  is_target?: boolean
  is_client?: boolean
  is_icp?: boolean
  has_visitors?: boolean
  limit?: number
  offset?: number
}

export function getAccounts(options: AccountFilterOptions = {}) {
  let list = accountsList

  if (options.query) {
    const q = options.query.toLowerCase().trim()
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.domain.toLowerCase().includes(q) ||
        a.industry.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q)
    )
  }

  if (options.classification && options.classification !== "All") {
    list = list.filter((a) => a.target_classification === options.classification)
  }

  if (options.tier && options.tier !== "All") {
    list = list.filter((a) => a.tier.includes(options.tier || ""))
  }

  if (options.is_target !== undefined) {
    list = list.filter((a) => a.is_target === options.is_target)
  }

  if (options.is_client !== undefined) {
    list = list.filter((a) => a.is_client === options.is_client)
  }

  if (options.is_icp !== undefined) {
    list = list.filter((a) => a.is_icp === options.is_icp)
  }

  if (options.has_visitors !== undefined) {
    list = list.filter((a) => a.has_vector_visitors === options.has_visitors)
  }

  // Sort by overall priority descending
  list = [...list].sort((a, b) => b.overall_priority_score - a.overall_priority_score)

  const total = list.length
  const offset = options.offset || 0
  const limit = options.limit || 50
  const items = list.slice(offset, offset + limit)

  return { total, items, offset, limit }
}

function parseRevenueUsd(revStr?: string): number {
  if (!revStr) return 50000000
  const clean = revStr.replace(/[$,]/g, "").trim().toUpperCase()
  if (clean.includes("B")) {
    const num = parseFloat(clean.replace("B", ""))
    return isNaN(num) ? 50000000 : num * 1_000_000_000
  }
  if (clean.includes("M")) {
    const parts = clean.split("-").map((p) => parseFloat(p.replace("M", "").trim()))
    const val = parts.length > 1 ? (parts[0] + parts[1]) / 2 : parts[0]
    return isNaN(val) ? 50000000 : val * 1_000_000
  }
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 50000000 : parsed
}

function synthesizeProspectAccount(cleanQuery: string): CanonicalAccount | undefined {
  if (!cleanQuery || cleanQuery === "undefined" || cleanQuery === "null") return undefined
  const q = cleanQuery.toLowerCase().trim()

  // 1. Check accountBreakupList
  const breakupMatch = accountBreakupList.find(
    (b) =>
      b.domain?.toLowerCase().trim() === q ||
      b.company?.toLowerCase().trim() === q ||
      b.id?.toLowerCase().trim() === q
  )

  // 2. Check visitorsList
  const visitorMatch = visitorsList.find(
    (v) =>
      v.company_domain?.toLowerCase().trim() === q ||
      v.company_name?.toLowerCase().trim() === q
  )

  // 3. Check keyVisitorsList
  const keyVisitorMatch = keyVisitorsList.find(
    (k) =>
      k.company?.toLowerCase().trim() === q ||
      (k.email && k.email.includes("@") && k.email.split("@")[1].toLowerCase().trim() === q)
  )

  // 4. Check account_pages_visited
  const pagesSummary = getAccountPagesSummary()
  const pagesMatch = pagesSummary.find(
    (p) => p.domain?.toLowerCase().trim() === q || p.account_name?.toLowerCase().trim() === q
  )

  // If nothing matched at all and it does NOT look like a valid domain or name, return undefined
  if (!breakupMatch && !visitorMatch && !keyVisitorMatch && !pagesMatch && !q.includes(".")) {
    return undefined
  }

  // Derive domain
  let domain =
    breakupMatch?.domain ||
    visitorMatch?.company_domain ||
    pagesMatch?.domain ||
    (keyVisitorMatch?.email?.includes("@") ? keyVisitorMatch.email.split("@")[1].toLowerCase().trim() : null) ||
    q

  domain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()

  // Derive company name
  const name =
    breakupMatch?.company ||
    pagesMatch?.account_name ||
    visitorMatch?.company_name ||
    keyVisitorMatch?.company ||
    domain
      .split(".")[0]
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())

  // Revenue & employees
  const revenueRange = breakupMatch?.revenue || keyVisitorMatch?.annual_revenue || "$50M - $100M"
  const revenueUsd = parseRevenueUsd(revenueRange)
  const employees = breakupMatch?.company_size || visitorMatch?.company_size || "1,000 - 5,000 employees"
  const industry =
    breakupMatch?.industry ||
    pagesMatch?.industry ||
    visitorMatch?.industry ||
    keyVisitorMatch?.industry ||
    "Enterprise Technology & Services"

  // Visitor counts & pages visited
  const matchingVisitors = visitorsList.filter(
    (v) =>
      v.company_domain?.toLowerCase().trim() === domain ||
      (v.company_name && v.company_name.toLowerCase().trim() === name.toLowerCase().trim())
  )
  const visitorCount = breakupMatch?.visitors || matchingVisitors.length || (pagesMatch ? pagesMatch.visitors_count : 1)
  let pagesVisited = pagesMatch?.pages_visited || []
  if (pagesVisited.length === 0) {
    const summaryItem = getAccountPagesSummary().find((p) => p.domain?.toLowerCase().trim() === domain)
    if (summaryItem?.pages_visited && summaryItem.pages_visited.length > 0) {
      pagesVisited = summaryItem.pages_visited
    }
  }
  const totalBusinessPvs = pagesMatch?.total_pageviews || pagesVisited.reduce((s, p) => s + p.pageviews, 0) || (visitorCount * 3)

  // Classification & segments
  const isTarget = breakupMatch?.is_target || false
  const isClient = breakupMatch?.is_client || false
  const targetClassification = breakupMatch
    ? breakupMatch.its_en && breakupMatch.dcx_en
      ? "DCX + ITS EN"
      : breakupMatch.its_en
      ? "ITS EN"
      : breakupMatch.dcx_en
      ? "DCX EN"
      : "Vector Prospect"
    : "Vector Prospect"

  const segment =
    breakupMatch?.segment ||
    (isClient
      ? "Existing Client"
      : isTarget
      ? "Target Account"
      : "Vector Inbound Prospect")

  // Scoring
  const fitScore = breakupMatch?.c_level || breakupMatch?.vp ? 88 : 76
  const intentScore = totalBusinessPvs > 10 ? 92 : totalBusinessPvs > 0 ? 84 : 75
  const engagementScore = visitorCount >= 10 ? 95 : visitorCount >= 3 ? 82 : 68
  const contactabilityScore = matchingVisitors.length > 0 || keyVisitorMatch ? 86 : 60
  const overallPriority = Math.round(
    fitScore * 0.3 + intentScore * 0.35 + engagementScore * 0.2 + contactabilityScore * 0.15
  )

  const tier =
    overallPriority >= 85
      ? "Tier 1: Act Now"
      : overallPriority >= 75
      ? "Tier 2: Engage via ABM"
      : "Tier 3: Nurture / Monitor"

  const hasDcx = breakupMatch?.dcx_en || pagesVisited.some((p) => p.category === "Digital CX")
  const hasAi = pagesVisited.some((p) => p.category === "AI & GenAI")
  const hasCloud = breakupMatch?.its_en || pagesVisited.some((p) => p.category === "Cloud & IT Ops")
  const hasCyber = pagesVisited.some((p) => p.page_url.includes("cybersecurity") || p.page_url.includes("security"))

  return {
    id: `acct:${domain}`,
    name,
    domain,
    target_classification: targetClassification,
    is_target: isTarget,
    is_client: isClient,
    client_bu: isClient ? "Enterprise Digital Operations" : "",
    account_segments: segment,
    owner: "Territory Inbound Sales Representative",
    industry,
    revenue_usd: revenueUsd,
    revenue_range: revenueRange,
    employees,
    employee_range: employees,
    icp_status: "Qualified (> $10M Revenue ICP)",
    is_icp: true,
    vector_profiles_count: visitorCount,
    has_vector_visitors: true,
    fit_score: fitScore,
    intent_score: intentScore,
    engagement_score: engagementScore,
    contactability_score: contactabilityScore,
    overall_priority_score: overallPriority,
    tier,
    data_completeness: 85,
    client_growth_score: isClient ? 75 : 0,
    service_penetration: {
      "Digital CX": isClient && breakupMatch?.dcx_en ? "Confirmed" : hasDcx ? "Inferred" : "Unknown",
      "AI & GenAI": hasAi ? "Inferred" : "Unknown",
      "Cloud & IT Ops": isClient && breakupMatch?.its_en ? "Confirmed" : hasCloud ? "Inferred" : "Unknown",
      Cybersecurity: hasCyber ? "Inferred" : "Unknown",
    },
    intent_topics: [
      { topic: "AI Transformation", score: 88, surge: "Surging (92nd percentile)", service_line: "AI & GenAI" },
      { topic: "Cloud Architecture", score: 81, surge: "Elevated (84th percentile)", service_line: "Cloud & IT Ops" },
    ],
    matched_contacts_count: matchingVisitors.length,
    zoominfo_id: `zi-${domain.replace(/[^a-zA-Z0-9]/g, "-")}`,
    vector_pages_visited: pagesVisited,
    total_business_pageviews: totalBusinessPvs,
  }
}

export function getAccountById(id: string): CanonicalAccount | undefined {
  if (!id || id === "undefined" || id === "null") return undefined
  const cleanId = id.startsWith("acct:") ? id : `acct:${id}`
  const found = accountsList.find(
    (a) => a.id.toLowerCase() === cleanId.toLowerCase() || a.domain.toLowerCase() === id.toLowerCase()
  )
  if (found) return found
  return getAccountByDomain(id)
}

export function getAccountByDomain(domain: string): CanonicalAccount | undefined {
  if (!domain || domain === "undefined" || domain === "null") return undefined
  const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
  if (!clean) return undefined

  // 1. Search canonical accounts
  const canonical = accountsList.find(
    (a) =>
      a.domain.toLowerCase() === clean ||
      a.id.toLowerCase() === `acct:${clean}` ||
      a.name.toLowerCase() === clean
  )
  if (canonical) return canonical

  // 2. Synthesize dynamic prospect account for Vector-discovered company
  return synthesizeProspectAccount(clean)
}

export function getVisitors(options: { query?: string; domain?: string; limit?: number; offset?: number } = {}) {
  let list = visitorsList
  if (options.domain) {
    const d = options.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
    list = list.filter((v) => {
      if (!v.company_domain) return false
      const vd = v.company_domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
      return vd === d
    })
  }
  if (options.query) {
    const q = options.query.toLowerCase().trim()
    list = list.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.company_name?.toLowerCase().includes(q) ||
        v.title?.toLowerCase().includes(q) ||
        v.department?.toLowerCase().includes(q)
    )
  }

  const total = list.length
  const offset = options.offset || 0
  const limit = options.limit || 50
  return { total, items: list.slice(offset, offset + limit), offset, limit }
}

export function getKeyVisitors(options: { query?: string; seniority?: string; limit?: number; offset?: number } = {}) {
  let list = keyVisitorsList
  if (options.seniority && options.seniority !== "All") {
    list = list.filter((v) => v.seniority.toLowerCase().includes(options.seniority!.toLowerCase()))
  }
  if (options.query) {
    const q = options.query.toLowerCase().trim()
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q)
    )
  }

  const total = list.length
  const offset = options.offset || 0
  const limit = options.limit || 50
  return { total, items: list.slice(offset, offset + limit), offset, limit }
}

export function getMatchedContactsForAccount(domain: string): MatchedContactRecord[] {
  if (!domain) return []
  const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()

  const direct = matchedContactsList.filter(
    (c) => c.account_domain?.toLowerCase().trim() === clean
  )
  if (direct.length > 0) return direct

  // Check key decision-makers by email domain or company
  const keyMatches = keyVisitorsList.filter((k) => {
    if (k.email && k.email.includes("@")) {
      const emailDomain = k.email.split("@")[1].toLowerCase().trim()
      return emailDomain === clean
    }
    return false
  })

  if (keyMatches.length > 0) {
    return keyMatches.slice(0, 5).map((k) => ({
      id: k.id,
      name: `${k.name} (${k.title})`,
      account_id: `acct:${clean}`,
      account_name: k.company,
      account_domain: clean,
      its_en: true,
      dcx_en: false,
      ec: false,
      segments: k.seniority,
    }))
  }

  // Fallback to visitors
  const visMatches = visitorsList.filter((v) => {
    if (!v.company_domain) return false
    const vd = v.company_domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
    return vd === clean
  })

  return visMatches.slice(0, 5).map((v) => ({
    id: v.id,
    name: `${v.name} (${v.title || "Evaluator"})`,
    account_id: `acct:${clean}`,
    account_name: v.company_name,
    account_domain: clean,
    its_en: true,
    dcx_en: false,
    ec: false,
    segments: v.department || "Technology",
  }))
}

export function getExecutiveKpis() {
  const total = accountsList.length
  const targets = accountsList.filter((a) => a.is_target).length
  const clients = accountsList.filter((a) => a.is_client).length
  const vectorEngaged = accountsList.filter((a) => a.has_vector_visitors).length
  const icpEligible = accountsList.filter((a) => a.is_icp).length
  const tier1Count = accountsList.filter((a) => a.tier.includes("Tier 1")).length
  const tier2Count = accountsList.filter((a) => a.tier.includes("Tier 2")).length
  const totalVisitors = visitorsList.length
  const totalKeyVisitors = keyVisitorsList.length

  return {
    totalAccounts: total,
    targetAccounts: targets,
    existingClients: clients,
    vectorEngagedAccounts: vectorEngaged,
    icpEligibleAccounts: icpEligible,
    tier1ActNow: tier1Count,
    tier2EngageABM: tier2Count,
    totalIdentifiedVisitors: totalVisitors,
    totalKeyDecisionMakers: totalKeyVisitors,
  }
}

export function getCreditGovernor() {
  return creditGovernorData
}

export function getIntentTopicMatrix() {
  return topicMatrixData
}

export function getAccountLevelBreakup() {
  return accountBreakupList
}

export function getAccountPagesVisited(domain: string): PageVisitedRecord[] {
  if (!domain) return []
  const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim()
  const account = getAccountByDomain(domain)
  if (account?.vector_pages_visited && account.vector_pages_visited.length > 0) {
    return account.vector_pages_visited
  }
  const summary = getAccountPagesSummary().find(
    (p) => p.domain?.toLowerCase().trim() === clean
  )
  return summary?.pages_visited || []
}

export function getAccountPagesSummary(): AccountPagesVisitedSummary[] {
  return (dbData as unknown as { account_pages_visited?: AccountPagesVisitedSummary[] }).account_pages_visited || []
}
