# Movate Account Intelligence & Intent Platform: FINAL ANTIGRAVITY BUILD PACK

How to use:
1. Paste PART 1 and PART 2 together as the product specification (one message).
2. Save PART 4 into the repo as `docs/SCORING_SPEC.md`; the agent treats it as the source of truth.
3. Save PART 6 as `docs/RUNBOOKS.md` (the agent should also expose it in-app).
4. Run the PART 3 prompts one at a time (0, 1, 2, 2b, 3, 4, 5, 6), approving each stage before the next.
5. PART 5 is for you (ZoomInfo account manager call); put the answers into Integrations > ZoomInfo > Entitlements.

---

# PART 1: MASTER SPECIFICATION

## ROLE
Act as CTO, enterprise SaaS architect, senior full-stack engineer, data engineer, B2B revenue-operations architect, ABM strategist and product designer. Build **Movate Account Intelligence Platform**: one application, one canonical account database, four workspaces, one shared intelligence engine. This is NOT a static dashboard or mock-data prototype.

## BUSINESS GOAL
Give Sales and ABM a defensible, evidence-backed reason to act on each account and measure whether those actions create pipeline. Every time a user opens an account they must understand: who the company is, what it is researching, what changed recently, who the decision-makers are, which Movate services fit, what to do next, and what evidence supports that.

## NON-NEGOTIABLE RULES
1. Inspect before building. Read the repo, existing ZoomInfo/Vector/GA4 connections, Google News RSS and GDELT code, existing intent-topic data, Excel files (actual columns) and the 2,300 Vector visitor export. Do not overwrite working integrations or create duplicate connectors.
2. No fabricated data: no invented companies, contacts, emails, visitors, revenue, intent observations, API responses or endpoints. Missing data stays **missing (NULL / "Unknown")**, never zero.
3. A connector is "integrated" only after a real authenticated request succeeds. Otherwise build the interface, show status "Not authenticated / Missing permission", report what is needed, and continue.
4. Preserve all existing ZoomInfo intent topics and raw source records. Add new topics separately; never replace history.
5. Secrets only in backend environment variables. No credentials in frontend code, no browser calls to private MCP servers, no localStorage as a database.
6. Do not scrape sites where prohibited; respect robots.txt, ToS, rate limits and licensing. Do not auto-purchase or activate paid tools. Do not auto-upload data to ad platforms.
7. GA4 is aggregate only. Never present GA4 as account-level or person-level behaviour. Account identity comes only from Vector (or another authorised matching source).
8. Vector MCP (per its documentation) exposes read-only LinkedIn Ads performance and website visitor intelligence. Design the connector around what it actually returns; do not assume a general LinkedIn data API or full attribution.
9. Separate **observed data**, **AI interpretation** and **recommendation** everywhere. Every AI statement links to evidence. Hypotheses are labelled "Unverified until confirmed by Sales".
10. Do not classify DCX EN / ITS EN from company names. Use the source sheet values only.
11. Never discard an account silently: keep exclusion reasons and source history.
12. Prefer the existing repo architecture; add no unnecessary frameworks.

## STACK
Frontend: React or Next.js, TypeScript, Tailwind, Recharts, reusable table/filter components, server-side pagination.
Backend: Python FastAPI (or existing backend), REST, MCP clients, background workers and scheduler, structured logging, retries with backoff, rate-limit handling.
DB: PostgreSQL with migrations. Raw source tables separate from normalised intelligence tables. Backup procedure documented.
AI: LLM research with structured JSON output, evidence citations, confidence, service mapping.
Security: RBAC (Admin, ABM, Sales, Executive, Read-only), audit logs, field-level permission for contact data, data-retention settings.

## ACCOUNT UNIVERSES (one canonical company record, many relationships)
| Workspace | Source | Purpose |
|---|---|---|
| New Account Discovery | ZoomInfo + public intel | Find new prospects outside all uploaded lists |
| Target Accounts | Uploaded Excel | Prioritise DCX EN / ITS EN / both |
| Existing Clients (~300) | Uploaded Excel | Cross-sell, upsell, whitespace |
| ABM & Sales | All of the above | Activation, pipeline, feedback |

Target classification (from Excel values only): DCX Yes/ITS No = **DCX EN**; No/Yes = **ITS EN**; Yes/Yes = **DCX + ITS EN**; No/No = **Unclassified**. An account in both counts once in overall unique totals.
Client relationship status: Existing client, Existing prospect, Existing opportunity, Former client, New opportunity within existing client. A client also in the target list is never double-counted.

## ICP
Hard eligibility: **annual revenue > USD 10M**. Store original currency, original value, normalised USD, source, as-of date, confidence, and range-vs-exact flag. Missing or unreliable revenue = **Revenue Unknown** (not auto-qualified, not excluded: routed to an enrichment queue).
Configurable (admin-editable): employee size, geography, industries (Movate taxonomy: BFSI, insurance, healthcare, telecom, retail, manufacturing, technology, travel and hospitality, media, professional services), technology footprint, service relevance.
Exclusions (always with reason): existing clients, existing targets (from discovery view), non-independent subsidiaries, competitors, ineligible revenue, out-of-geography, do-not-target.
Three separate labels: **ICP Eligible** (revenue + fit), **High Intent** (strong evidence), **Sales Ready** (fit + intent + actionable contacts + not suppressed). Fit without intent is not high intent; intent without fit is not a priority.

## DATA SOURCES (modular connector registry)
Registry fields: provider, purpose, auth method, API availability, pricing class, free-tier limits, data fields, freshness, permissions, status, last successful sync.
- **ZoomInfo** (MCP/API, entitlement-limited): company firmographics, technographics, intent topics/scores/history, contacts (title, department, seniority, verification, licensed email/phone, LinkedIn URL if provided), parent/subsidiary. Target personas: CIO, CTO, CISO, CDO, VP/Director IT, Infrastructure, Cloud, Cybersecurity, Digital Transformation, Customer Experience, Procurement/Strategic Sourcing.
- **Vector MCP**: identified visitors, company, contact, pages, visits, timestamps, source/campaign if returned, LinkedIn Ads performance. Import the existing 2,300-record export; keep the originals; dedupe visits; weight service/pricing/case-study/solution pages and repeat visits higher; do not treat every visit as intent.
- **GA4 Data API**: users, sessions, engaged sessions, landing pages, traffic acquisition, campaigns, geography, conversions, service-page engagement. Aggregate website intelligence and landing-page analysis only.
- **Google News RSS**: per-company, alias, parent, leadership and topic queries. Store headline, publisher, date, URL, company association, topic, summary, signal type, confidence. Dedupe syndicated articles by canonical URL and title similarity.
- **GDELT** (DOC + available event/GKG datasets): M&A, funding, expansion, leadership, partnerships, infrastructure investment, incidents, regulation, restructuring. Configurable lookback, rate-limit aware. A cybersecurity incident or negative news is a *trigger to investigate*, never proof of a purchase requirement.
- **Free/public**: Google Alerts (deliver to RSS feed or email-ingest; no general API), SEC EDGAR, Companies House (UK), OpenCorporates/Wikidata for identity and parent data (verify terms), BuiltWith free API and Wappalyzer (limited lookups), GitHub API, Google Trends (market-level only), company career pages, public Greenhouse/Lever feeds, investor-relations pages, public procurement notices.
- **Optional paid (stub only, never auto-activate)**: Bombora, TechTarget Priority Engine, HG Insights, 6sense, Demandbase, G2, TrustRadius, UserGems, Intentsify. Require evidence of incremental account coverage versus ZoomInfo before recommending purchase; the Data Quality module reports this.
- **Future**: CRM integration (Salesforce/HubSpot/Dynamics) behind an interface, pending access and ownership approval.

## EXCEL / CSV IMPORT
Multi-sheet, header auto-detection, manual column mapping, validation, preview, duplicate detection (domain first, then normalised name + country, with fuzzy match scored and reviewed), import history, error report, re-import/update without losing history. Inspect the real files before assuming column names.

## IDENTITY RESOLUTION
Canonical account ID; tables for aliases, domains, parent/subsidiary. Match order: exact domain > ZoomInfo company ID > normalised legal name + country > fuzzy match with confidence. Matches below threshold go to a human review queue; no silent merges. Every merge is reversible and audited. Contacts resolved by email, then name + company.

## SIGNAL MODEL
Unified signal record: signal ID, canonical account ID, provider, source record ID, signal type, topic, observation date, publication date, ingestion date, evidence URL/reference, confidence, freshness, verification status, raw-record reference. Do not count syndicated or same-publisher/same-dataset items as independent evidence. Keep score audit history. Daily/weekly **account snapshots** (score, topics, evidence) for real trend analysis.

## SCORING AND ACCOUNT SCOPE
Implement exactly `docs/SCORING_SPEC.md` (Part 4). Scores must be explainable (reason codes, contributions, data completeness), configurable by admin, versioned, and never random.

## SUPPRESSION / NEGATIVE-SIGNAL ENGINE
Suppress or down-rank alerts and "Sales Ready" status for: open opportunities, competitors, do-not-target, inactive/former customers (route to win-back instead), owner conflicts, recently rejected accounts (cooldown), and topics irrelevant to Movate services. Show the suppression reason.

## OWNERSHIP AND TERRITORY
Account owner, territory and region mapping; conflict detection when multiple reps or teams would approach the same canonical account (including parent/subsidiary overlap); assignment and reassignment history.

## WORKSPACES AND SCREENS
Left-sidebar navigation: Executive Overview, New Account Discovery, Target Accounts, Existing Clients, Intent Intelligence, Vector Website Intelligence, Company News & Signals, Buying Committee, ABM Workspace, Sales Intelligence, Opportunity Intelligence, Data Quality, Integrations & Settings.
- **Executive Overview**: KPIs (unique accounts, new discovered, targets, clients, ICP-qualified, high intent, rising intent, accounts with Vector visitors, accounts with decision-makers, accounts with 2+ independent signals), charts linked to real records, global filter bar (date, industry, geography, revenue, employees, category, intent, service line, owner, source). Every KPI and chart drills down to account rows.
- **New Account Discovery**: ZoomInfo-led list of revenue>$10M accounts outside all lists; columns: name, website, industry, revenue, employees, HQ, fit, intent, engagement, confidence, topics, contacts, recent signals, service lines, next action; saved views, filters, CSV/Excel export.
- **Target Accounts**: classification filters (All, DCX EN, ITS EN, DCX + ITS EN, Unclassified) plus intent level, revenue, industry, country, owner, size, topics, Vector visitors, news, hiring, contact availability. Summary tiles as per spec; filtered export.
- **Existing Clients**: service penetration matrix (service lines × Confirmed / Inferred / Unknown; unrecorded is NOT absent), cross-sell/upsell/whitespace, leadership change, expansion, hiring, news, website engagement, intent, competitor evidence, Growth Opportunity Score.
- **Account Profile** (28 sections): overview, firmographics, revenue (with source/confidence), HQ and presence, parent/subsidiaries, Movate relationship, technology stack, intent topics, intent history, acceleration, Vector visitors, website engagement, LinkedIn Ads, news, GDELT events, hiring, leadership changes, transformation signals, contacts, buying committee, competitors, challenges, relevant services, opportunity hypotheses, next actions, source/confidence, chronological timeline with timestamp and source on every item, **plus the Account Scope Card (Part 4)**.
- **Buying Committee**: contacts grouped by executive, technology, operational, procurement, influencer, department head; missing personas; coverage score; verification status; job changes. Never imply a contact is evaluating Movate.
- **ABM Workspace**: tiers, segmentation (DCX/ITS/both, clients, industry, revenue, geography, service line, topic, visitor, engagement), account lists, campaign recommendations, engagement heatmap, coverage reports, content recommendations, high-intent alerts, controlled exports.
- **Sales Intelligence**: AI research brief (Account Overview, Why Now, Buying Signals, Intent Topics, Website Engagement, Business Triggers, Decision-Makers, Movate Service Alignment, Potential Challenges, Recommended Approach, Source Evidence), conversation starters, relevant case studies, assignment, accept/reject with reason codes, follow-up status, notes, opportunity linkage, activity history.
- **Opportunity Intelligence**: whitespace, competitor displacement, leadership change, technology adoption, hiring/expansion, M&A/funding, partnerships, overlap, parent/subsidiary, historical comparison, hypothesis generator.
- **Data Quality**: identity match accuracy, domain/contact match confidence, revenue source reliability, freshness, duplicate rate, missing data, source coverage (how many accounts have ZoomInfo, Vector, GA4, news, tech, contacts), ingestion failures, connector health, historical completeness.
- **Integrations & Settings**: connector registry/health, ICP editor, scoring weights editor, taxonomy editor, alert thresholds, users/roles, retention.
Global search (company, domain, contact, topic, industry, location). Server-side pagination, sorting, filtering, saved views, CSV/Excel export.

## INTENT TAXONOMY
Keep ZoomInfo topics as-is. Add a second Movate layer: Cloud, Cybersecurity, AI & Automation, IT Infrastructure, Digital Workplace, Customer Experience, Data (with the sub-topics listed in the original specification). Map each topic to service line, industry, buyer persona, commercial relevance, suggested content, ABM campaign and sales action. A topic name is not proof of a purchase decision.

## ALERTS AND AUTOMATION
Scheduled refresh per connector (configurable, entitlement-aware). Alerts: new high-intent account, significant acceleration, new visitor from a target/client, repeat visits, relevant executive hire, cloud/security hiring, major acquisition, expansion, client whitespace, tier promotion. Dedupe by underlying event; configurable thresholds; suppression-aware.

## DESIGN SYSTEM
Light theme only. White/soft-grey surfaces, navy text, restrained blue and teal accents, 8px spacing grid, subtle borders and soft shadows, dense but readable data tables, clear status chips (Observed / Inferred / Unverified), consistent icons. Avoid dark mode, neon, heavy gradients, oversized KPI cards, decorative charts, crowded layouts. Desktop-first, responsive.

## DATA GOVERNANCE
Contact and visitor identities are controlled data: permission-gated, audit-logged, retention-configurable, with correction and deletion procedures. Respect provider licence terms and privacy law (GDPR, India DPDP Act 2023, CAN-SPAM/CASL for outreach). Record consent/licence basis where known. Legal review before using visitor identities for outbound.

## DATABASE
Tables at minimum: accounts, account_aliases, account_domains, account_relationships, target_account_memberships, existing_client_memberships, account_owners, territories, contacts, contact_account_relationships, intent_topics, topic_service_mapping, account_intent_observations, vector_visitors, website_sessions, news_articles, business_events, hiring_signals, technology_observations, signals, account_scores, score_history, account_snapshots, account_scope_cards, suppression_rules, account_timelines, sales_feedback, opportunity_outcomes, abm_campaigns, opportunity_hypotheses, connector_configurations, connector_sync_history, import_jobs, import_errors, source_provenance, audit_logs, users, roles. Unique constraints on domain, source IDs and (account, source, source record).

## ACCEPTANCE CRITERIA
Complete only when verified with real data: ZoomInfo connected and topics preserved; Vector 2,300 records imported and account-matched; GA4 connected; News and GDELT signals flowing; multi-sheet Excel import works; DCX/ITS classification correct; clients separately identifiable; duplicates resolved; revenue eligibility enforced; discovery works; contacts displayed; history stored; every score explainable; AI summaries cite evidence; ABM can filter/export; Sales can view briefs and give feedback; suppression and ownership-conflict rules work; data quality measurable; every integration shows health; no hardcoded demo numbers. Produce a validation report listing every test and failure.

## EXECUTION RULES
Work in phases (audit, data foundation, ZoomInfo + Vector, external intel, intelligence engine, workspaces, QA). Stop after each phase with a summary, tests and open questions. Do not stop at a landing page or static components. Prioritise correctness, evidence, identity, history and usability over decoration.

---

# PART 2: ZOOMINFO CREDIT GOVERNOR AND TOPIC MANAGEMENT (part of the specification)

## ZoomInfo Credit Governor (new mandatory module)

CONTEXT: ZoomInfo credits and intent-topic slots are limited. Movate currently has 10 intent topics allocated by ZoomInfo but can actively use only 6 (confirm the exact entitlement; see Part 5). The platform must minimise ZoomInfo consumption and do most account research from free and already-owned sources, spending ZoomInfo only where it changes a sales or ABM decision.

### Rules
1. **Free-first pipeline.** For every account, collect free/owned signals first: Excel fields, Vector visitors, Google News RSS, GDELT, Google Alerts feeds, SEC EDGAR, Companies House, careers pages/job feeds, GA4 aggregate context, BuiltWith/Wappalyzer within free limits. Compute a **Pre-Score** from these only (no ZoomInfo calls).
2. **Gated ZoomInfo spend.** ZoomInfo calls are allowed only through a single `zoominfo_gateway` service that enforces:
   - Eligible populations, in priority order: (a) Target Accounts (DCX EN, ITS EN, DCX + ITS EN) with Pre-Score above threshold or Tier 1/2 status; (b) Existing Clients flagged with a whitespace hypothesis; (c) Discovery accounts that passed free-signal Pre-Score AND revenue > $10M.
   - Contact lookups only for Tier 1/Tier 2 accounts and only for missing personas in the buying committee (never bulk-pull all contacts).
   - Intent history/topic pulls for target and high-score accounts only; low-priority accounts rely on free signals.
3. **Cache and TTL.** Store every ZoomInfo response raw. Do not re-request an account/field inside its TTL (defaults: firmographics 90 days, technographics 60, contacts 30, intent per provider refresh cadence). Re-enrich early only on a material trigger (acquisition, leadership change, tier promotion).
4. **Budget ledger.** Table `provider_usage_ledger` records each call: provider, endpoint/tool, account, purpose, credits (or estimated units), user/job, timestamp, result. Dashboard shows credits used vs. monthly budget, by purpose, by workspace and by outcome (accounts that reached Tier 1, accepted by Sales, pipeline created) = **cost per accepted account**.
5. **Hard and soft caps.** Configurable monthly budget, daily cap and per-job cap. Soft cap at 80% sends an admin alert; hard cap blocks non-critical jobs and queues them. Admin can override with an audit-logged reason.
6. **Dry-run and approval.** Any batch over a threshold (default 50 records) first shows an estimate (accounts, fields, estimated credits) and requires admin approval. Never run bulk discovery pulls automatically.
7. **Idempotency.** Dedupe requests by canonical account + field set + TTL window so retries, re-imports and scheduled jobs never double-spend.
8. **Entitlement discovery.** On first connect, call the MCP/API tool list and record which tools, fields and limits the account actually has. Do not assume fields. Show entitlement status in Integrations.
9. **No circumvention.** Do not work around topic-slot, credit or licensing limits (no multiple logins, scraping ZoomInfo, or sharing exports). Operate within the contract.
10. **Account-level AI research is cheap and cached.** Generate research briefs from already-stored evidence first. Use an LLM budget with its own ledger, cache briefs by evidence hash, and regenerate only when new evidence arrives or on user request.

### Intent topic slot management (6 usable vs. 10 allocated)
- Keep the full list of 10 ZoomInfo-provided topics in `intent_topics` with fields: `zoominfo_topic_id`, `status` (Active / Allocated-not-active / Retired), `service_line`, `priority_rank`, `activated_on`, `retired_on`. Preserve all history of every topic; never delete.
- Build a **Topic Coverage Matrix** (Movate service line × active topic) showing which service lines have zero active intent coverage. Those lines are flagged "No ZoomInfo intent coverage: using free signals" in scoring.
- Build a **Topic Value Report**: for each topic, accounts surfaced, share that were target/ICP-eligible, Sales acceptance rate, pipeline influenced. Use it to recommend which 6 topics to keep active. Recommendation only; a human makes the change with ZoomInfo.
- **Scoring impact:** if a service line has no active topic, do not score its intent as zero. Mark completeness lower for that component, re-normalise weights, and let Vector, news, hiring and technology signals carry that line. Show a "Topic coverage gap" badge on affected accounts.
- Add a **substitute signal set** per service line (e.g., Cloud: cloud-engineer job postings + cloud migration news + Vector visits to cloud pages) so uncovered lines still get an evidence-based intent estimate.

### Research-first account workflow (what the app does per account)
1. Free-signal sweep (scheduled, cheap) → Pre-Score.
2. Pre-Score or target status above threshold → account enters "Research Queue".
3. Account-level research job gathers: latest news/GDELT, filings, hiring, tech clues, leadership changes, Vector activity → LLM synthesises evidence-cited hypotheses.
4. If still high-value and committee gaps exist → permit a ZoomInfo contact/intent call through the gateway (counted in ledger).
5. Account Scope Card and Tier updated; alerts fire only on material change.

### Acceptance additions
- Governor blocks calls beyond caps (tested); re-running the same import consumes zero credits; ledger totals reconcile with ZoomInfo's usage report; low-priority accounts get no ZoomInfo contact pulls; Topic Coverage Matrix and Topic Value Report render from real data.

---

# PART 3: STAGE PROMPTS (run one at a time, approve each stage)

### Prompt 0: Safety
Create a Git branch `account-intel-v1` and a backup of the project. Confirm the `data/imports/` folder contains: the target-account workbook (DCX EN / ITS EN), the existing-client workbook and the 2,300-record Vector export. Do not modify originals.

### Prompt 1: Inspect and plan (no code)
Read the full specification and `docs/SCORING_SPEC.md`. Do not write application code. Inspect the repository, existing integrations, every Excel sheet (list actual columns, types, null rates, duplicates), the Vector export, the ZoomInfo MCP tools and entitlements, Vector MCP tools, and GA4 properties. Produce: architecture document, data dictionary, integration matrix (status, auth, limits, missing permissions), database schema, identity-resolution design, phased plan, and a list of questions. Do not invent schemas or endpoints. Wait for my approval.

### Prompt 2: Data foundation
Implement PostgreSQL migrations, canonical accounts, aliases/domains, Excel import with mapping and preview, DCX/ITS classification, client classification, Vector visitor import with visit dedupe, overlap and duplicate detection, snapshots and score history tables. Test on the real files. Produce an import validation report: row counts in vs. out, duplicates found, unmatched rows, classification counts, overlap counts.

### Prompt 2b (run after Prompt 2, before ZoomInfo ingestion)
Implement the `zoominfo_gateway`, `provider_usage_ledger`, TTL cache, dry-run estimator, caps and approval flow described in the Credit Governor addendum, plus the free-signal Pre-Score and Research Queue. Add the intent topic status model (Active / Allocated-not-active / Retired) and the Topic Coverage Matrix. Unit-test: cap enforcement, idempotency, TTL skip, approval threshold, and that scoring does not treat an uncovered service line as zero. Show me the estimated monthly ZoomInfo consumption for my real account lists under the current rules before connecting anything.

### Prompt 3: Intelligence engine
Implement ZoomInfo ingestion (preserving existing topics), Vector integration, GA4 integration, Google News RSS, GDELT, signal model with dedupe and independence tracking, ICP eligibility, taxonomy, the scoring engine and Account Scope Card exactly per `docs/SCORING_SPEC.md`, suppression engine, ownership-conflict detection, evidence-backed AI research brief. Unit-test scoring, decay, missing-data handling, tier assignment, identity resolution and suppression.

### Prompt 4: Application
Build the light-theme enterprise UI and every workspace, the account profile with Scope Card, filters, charts, timelines, buying committee, ABM and Sales workflows, alerts and settings, all wired to real endpoints. No static demo values. Show empty/missing states honestly.

### Prompt 5: QA and validation
Audit everything: imports, overlaps, revenue filtering, identity matching, historical intent, contact association, duplicate prevention, API failures, permissions, scoring determinism, suppression, exports, every dashboard drill-down. List all failures, fix them, re-test, and write the validation report against the acceptance criteria.

### Prompt 6: Calibration (after 4-8 weeks of use)
Using sales feedback and opportunity outcomes, analyse which signals and weights correlate with accepted accounts and pipeline. Propose weight changes with evidence; apply only after my approval and version the scoring model.

---

# PART 4: SCORING & ACCOUNT SCOPE SPEC (save as docs/SCORING_SPEC.md)

All weights, thresholds and half-lives below are **initial heuristics, configurable and versioned**. They are not validated purchase probabilities. Say so in the UI.

## 3.1 Component scores (each 0-100, plus a completeness % and confidence)

**Account Fit** (is this the kind of company Movate wins?)
Industry relevance 25 · Revenue and employee suitability 20 · Technology environment 20 · Geography 15 · Strategic potential/enterprise complexity 20. Revenue ≤ $10M or out-of-ICP = ineligible (hard gate, not a low score). Revenue Unknown = "Eligibility pending".

**Buying Intent** (is it researching/looking now?)
ZoomInfo intent (score + surge, provider metrics preserved) 30 · Topic acceleration/new topics 20 · Independent research-source evidence 20 · Vector visitor evidence 15 · Business triggers (hiring, leadership, M&A, expansion, incident) 15.

**Engagement** (is it engaging with Movate?)
Service/solution/pricing/case-study page visits, repeat visits, identified-contact count, LinkedIn Ads engagement, campaign interactions, content downloads/form fills (if available).

**Contactability** (can we act?)
Buying Committee Coverage Score: persona coverage across executive, technology, operational, procurement; verified contacts; seniority. 

**Overall Priority** = default **Fit 30% + Intent 35% + Engagement 15% + Trigger timing 10% + Contactability 10%** (trigger timing = recency-weighted business triggers; contactability = committee coverage). Admin can edit weights; they must sum to 100.

## 3.2 Rules that make the score trustworthy
1. **Missing data is not zero.** Re-normalise weights over available components and show a Data Completeness % and a "low confidence" badge when below threshold (default 60%). Never rank low-completeness accounts as if they were fully measured.
2. **Recency decay.** Each signal contributes weight × exp(-ln2 × age / half-life). Defaults: ZoomInfo intent 30 days, Vector visit 14, news/GDELT trigger 45, hiring 30, leadership change 90, M&A 120. Configurable.
3. **Source cap.** No single provider may contribute more than 50% of the Intent score.
4. **Independence.** Corroboration counts distinct publisher/dataset families, not duplicate feeds. Add a corroboration multiplier (1.0 for one independent source, up to 1.25 for three or more).
5. **Acceleration labels** (preserve provider surge metrics where present): Rising, Sustained, New, Declining, No recent activity, Insufficient history, using the 7/14/30/45/60/90-day windows against baseline.
6. **Relevance gate.** Signals must map to a Movate service line; unmapped signals are shown but do not score.
7. **Negative-news rule.** Incidents/negative news produce a "Trigger to investigate" flag, small capped contribution, never a purchase assumption.
8. **Suppression** (Part 1) overrides tier: suppressed accounts show the reason and do not alert.
9. **Explainability.** Every score stores: component values, per-signal contributions, reason codes (e.g. `ZI_SURGE_CLOUD`, `VECTOR_REPEAT_PRICING`, `HIRING_CLOUD_ENG`), weights version, data completeness. UI shows "Why this score" and "What would raise it".
10. **Audit.** Every recalculation writes to score_history with model version and delta; alert only on material change (default ±10 points or tier change).

## 3.3 Tiers and sales actions (thresholds configurable; start with percentile-based cutoffs on first real data, then fix)
| Tier | Rule (default) | Meaning | Action / SLA |
|---|---|---|---|
| Tier 1: Act Now | Overall ≥ 75, Fit ≥ 60, ≥2 independent signals, ≥1 verified relevant contact, not suppressed | Sales Ready | Assign owner; outreach within 2 business days; use research brief |
| Tier 2: Engage via ABM | Overall 55-74 | Good fit, building intent | Add to ABM campaign; targeted content; review weekly |
| Tier 3: Nurture/Monitor | Overall 35-54 | Fit or weak signal | Light-touch marketing; monthly review |
| Tier 4: Watchlist | < 35 or low data completeness | Insufficient evidence | No outreach; enrichment queue |
| Not eligible / Suppressed | Revenue ≤ $10M, excluded, competitor, open opp, do-not-target | Out of play | Show reason; no alerts |

## 3.4 Existing-client Growth Opportunity Score (separate model)
Whitespace gap (services Unknown/Not recorded against ICP-relevant services, confirmed vs. inferred) 30 · Intent on non-current service lines 25 · Business triggers 15 · Engagement (site/Vector) 10 · Relationship health/contract timing (if CRM/Excel data exists) 10 · Contact coverage beyond current sponsor 10. Labels: Cross-sell (new service line), Upsell (more of existing), Whitespace (unknown, investigate), Renewal risk (competitor evidence, negative triggers).

## 3.5 Target-account scoring notes
Score DCX EN, ITS EN and DCX + ITS EN accounts with the same engine, but map intent topics to the relevant business-unit service lines and show BU-specific opportunity (an account in both gets a combined play and a coordination flag to avoid two uncoordinated approaches).

## 3.6 ACCOUNT SCOPE CARD (shown at the top of every account profile)
1. **Identity**: canonical ID, name, domain, parent/subsidiaries, relationships (Target-DCX / Target-ITS / Both / Client / Discovery), owner and territory.
2. **Eligibility**: revenue (value, source, date, confidence), ICP status, exclusions.
3. **Scores**: Fit, Intent, Engagement, Contactability, Overall, Tier, data completeness, trend vs. 30 days ago.
4. **Scope of opportunity**: Movate service lines in scope, each with status (Confirmed / Inferred / Unknown), supporting signals, relevant topics and a hypothesis labelled Unverified. Opportunity type: New logo / Cross-sell / Upsell / Whitespace / Win-back.
5. **Buying stage (heuristic)**: Unaware, Researching, Evaluating, Active need, based on observed signal mix; labelled as an estimate.
6. **Why now**: top three signals with source, date and link.
7. **Buying committee**: coverage %, present and missing personas, top contacts.
8. **Engagement**: Vector visitors, pages, last visit, LinkedIn Ads, GA4 context (aggregate only, labelled).
9. **Risks and blockers**: competitor evidence, negative news, owner conflict, open opportunity, stale data.
10. **Next best action**: single recommended action, owner, due date, content and talk track; accept/reject buttons with reason codes feeding the feedback loop.
11. **Evidence**: list of observations (provider, date, URL) behind every item above; AI interpretation clearly separated.

## 3.7 Feedback loop and calibration
Capture Sales accept/reject, reason codes, stage progression, opportunity created, pipeline value, win/loss. Report: precision of Tier 1 (accepted %), conversion by signal type, time from signal to opportunity, false-positive reasons. Use this to propose weight changes (Prompt 6). Hold out comparison against a simple baseline (e.g. ZoomInfo intent only) to prove the platform adds value.

---

# PART 5 (HUMAN REFERENCE): QUESTIONS FOR YOUR ZOOMINFO ACCOUNT MANAGER
(Contracts vary; the aim is to get written answers. Reference these in the Integrations page.)

**Intent topics**
1. My contract provides 10 intent topics, but only 6 are usable/active. Which number is my contractual entitlement, and what exactly limits it (topic slots, credits, an API vs. UI limit, or a plan tier)?
2. Can I swap topics, how often, and does swapping lose historical data or reset baselines? Is topic history retained for topics I retire?
3. Are topic changes self-serve or via you, and is there a lead time before data starts flowing?
4. Are my topics custom or from ZoomInfo's standard taxonomy? Can I get topics for Cloud, Cybersecurity, AI/Automation, IT infrastructure, Digital workplace, Customer experience and Data?
5. What does the intent score/signal mean (scale, strength labels, audience size, surge), and how is history exposed through the API/MCP? How far back can I pull?
6. Is intent returned at account level only, or also contact level? Any geography restrictions?

**Credits and API/MCP**
7. What actions consume credits (company enrich, contact enrich, intent pull, search, export, MCP/AI calls)? Are searches free but reveals charged?
8. What is my monthly credit and API call allowance, rate limits, overage policy and reset date? Do credits roll over?
9. Which fields and tools does my plan expose through the API and MCP (technographics, org charts, scoops/news, hiring, funding, contact verification, direct dials)?
10. Is there a usage/credit report or API endpoint so I can reconcile my cost ledger?
11. Does re-requesting the same record within a period re-charge credits? Is there a documented caching/refresh policy?
12. Are there bulk or CSV enrichment options cheaper than per-record API calls?

**Licensing and data use**
13. What are the terms for storing ZoomInfo data in an internal database, retention limits, caching duration and who may access it?
14. Any restrictions on using contact data in an internal platform, ABM audiences, ad-platform uploads, or exports?
15. GDPR/privacy: coverage for EU/UK/India contacts, and opt-out handling requirements.

**Value**
16. Can you share a coverage test against my target and client lists (match rate, revenue completeness, contacts per account, intent coverage)?
17. What would it cost to add topics or credits, and is there a trial of the extra topics to test with my Sales feedback loop?
18. Are other ZoomInfo products (e.g., Scoops/news, Copilot, Engage) already in my contract that I am not using?

Record answers in the platform (Integrations → ZoomInfo → Entitlements) and update the governor limits to match.

---

# PART 6: RUNBOOKS (agent: generate these as docs/RUNBOOKS.md and an in-app Help page)

## D1. Admin: first-time setup (one-off)
1. Create Git branch and backup; confirm the `data/imports/` files are unmodified originals.
2. Configure environment variables for ZoomInfo, Vector, GA4 (backend only).
3. Integrations → run connection test for each connector; record entitlements and limits; fix "Not authenticated" items.
4. Settings → ICP: confirm revenue > $10M, geographies, industries, exclusions.
5. Settings → Credit Governor: enter monthly budget, daily cap, per-job cap, approval threshold, TTLs from the ZoomInfo answers in Part 5.
6. Settings → Topics: confirm 10 allocated topics, mark the 6 active, map each to a service line, review the Coverage Matrix.
7. Settings → Scoring: review weights, half-lives, tier thresholds; save as model v1.
8. Users and roles: create Sales, ABM, Executive, Read-only users; confirm contact-data permission.
9. Run imports (D2), then review the Data Quality dashboard before inviting users.

## D2. Admin/Ops: importing Excel and Vector files
1. Upload the workbook → choose the sheet → confirm the detected header row.
2. Map columns (company, domain, DCX EN, ITS EN, owner, industry, etc.); save the mapping.
3. Review the preview and duplicate/fuzzy-match queue; approve or reject merges.
4. Run the import → open the import report (rows in/out, errors, classification counts, overlaps).
5. Verify spot-check: 10 random accounts against the source sheet; verify DCX/ITS/both counts equal the sheet.
6. Re-imports update records without losing history; never edit originals.

## D3. Daily: Sales rep
1. Open Sales Intelligence → filter "My accounts" and Tier 1/2 → check new alerts.
2. Open an account → read the Account Scope Card: why now, signals, services, committee gaps, risks.
3. Read the research brief; check evidence links for anything you will quote to the customer.
4. Pick a contact (verified, relevant persona); use the suggested talk track and case study.
5. Log the action; mark the account Accept / Reject with a reason code (the feedback trains calibration).
6. Treat hypotheses as unverified; update them after discovery calls.

## D4. Weekly: ABM manager
1. ABM Workspace → review tier changes and new high-intent accounts.
2. Build segments (e.g., Tier 2 + Cloud topic + BFSI); check campaign readiness and committee coverage.
3. Export the audience (CSV/Excel, controlled); upload to ad platforms manually after legal/consent check.
4. Check the Engagement heatmap and Vector visitors from target accounts; hand warm accounts to Sales.
5. Review campaign coverage report; record results against campaigns.

## D5. Existing Clients: account manager / customer success
1. Existing Clients → sort by Growth Opportunity Score.
2. Open the Service Penetration Matrix: note Confirmed vs. Inferred vs. Unknown; verify unknowns internally (CRM/contracts) before pitching.
3. Check triggers (leadership change, expansion, hiring, news) and competitor evidence.
4. Plan the QBR: cross-sell, upsell, whitespace actions; record decisions.

## D6. Monthly: credit and value review (Admin + Marketing Ops)
1. Credit dashboard: spend vs. budget; by purpose; by tier; cost per accepted account.
2. Reconcile with ZoomInfo's usage report; investigate differences.
3. Topic Value Report: which of the 6 active topics produced accepted accounts; which allocated-not-active topics might replace them; raise the request with your ZoomInfo account manager.
4. Review free-source coverage (news, hiring, filings) to decide whether more free substitutes can cut ZoomInfo pulls.
5. Adjust TTLs and thresholds; log the changes.

## D7. Weekly: data quality (Ops)
1. Data Quality: check connector health, ingestion failures, freshness, duplicate rate, identity-match confidence.
2. Clear the identity review queue and the Revenue Unknown enrichment queue.
3. Check source coverage (accounts with ZoomInfo, Vector, GA4, news, tech, contacts).
4. Fix mappings, rerun failed jobs, and record any issue.

## D8. When a connector fails
1. Integrations shows status and error; do not retry in a loop.
2. Check credentials/permissions/rate limit; retry once manually.
3. Platform keeps working on existing data; scores show lower completeness, not zero.
4. Contact the provider if it persists; log the incident and backfill the gap window.

## D9. Quarterly: scoring calibration
1. Review Tier 1 acceptance rate, conversion by signal, false-positive reasons.
2. Run Prompt 6 (Calibration); review proposed weight changes with Sales and ABM leaders.
3. Approve and publish scoring model v2; keep v1 history for comparison.

## D10. Privacy and offboarding
1. Contact/visitor data: access only for permitted roles; log exports.
2. Process correction/deletion requests via Settings → Data Governance; propagate to caches and exports.
3. Apply retention rules; remove leavers' access.
