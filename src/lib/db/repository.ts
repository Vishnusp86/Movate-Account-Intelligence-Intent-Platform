import dbData from "@/data/canonical_database.json"

export interface IntentTopicItem {
  topic: string
  score: number
  surge: string
  service_line: string
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

export function getAccountById(id: string): CanonicalAccount | undefined {
  const cleanId = id.startsWith("acct:") ? id : `acct:${id}`
  return accountsList.find((a) => a.id === cleanId || a.domain === id)
}

export function getAccountByDomain(domain: string): CanonicalAccount | undefined {
  const clean = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
  return accountsList.find((a) => a.domain.toLowerCase() === clean)
}

export function getVisitors(options: { query?: string; domain?: string; limit?: number; offset?: number } = {}) {
  let list = visitorsList
  if (options.domain) {
    list = list.filter((v) => v.company_domain === options.domain)
  }
  if (options.query) {
    const q = options.query.toLowerCase().trim()
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.company_name.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.department.toLowerCase().includes(q)
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
  return matchedContactsList.filter((c) => c.account_domain === domain)
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
