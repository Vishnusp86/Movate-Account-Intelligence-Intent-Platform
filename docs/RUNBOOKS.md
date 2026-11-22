# Movate Account Intelligence & Intent Platform: RUNBOOKS (OPERATIONAL SOPS)

---

## D1. Admin: First-Time Setup & Configuration
1. **Repository & Safety**:
   - Ensure clean branch `account-intel-v1` with backups preserved.
   - Confirm original files in root: `ZI_ITS AND DCX EN Target Companies_221126 IMP.xlsx`, `ZI_Existing Clients - 221126 Imp.xlsx`, and `Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx`.
2. **Connector Authentication Check**:
   - Navigate to **Integrations & Settings**.
   - Check status for Vector MCP (Org `129519`, `movate.marketing@movate.com`), GA4 (`properties/328533793`), and ZoomInfo MCP.
3. **Credit Governor Initialization**:
   - Set monthly credit allowance (default 5,000 units), daily cap (250 units), and approval threshold (50 records).
   - Verify TTL settings: Firmographics 90 days, Technographics 60 days, Contacts 30 days.
4. **Taxonomy & Topics**:
   - Verify all 10 allocated ZoomInfo topics mapped to Movate service lines.
   - Review Topic Coverage Matrix.
5. **Scoring Model Calibration**:
   - Verify weights sum to 100%. Save as Model Version `v1.0.0`.

---

## D2. Operations: Master Excel & Vector Ingestion
1. **File Upload & Sheet Selection**:
   - Existing Clients: Sheet `Existing Clients - 221126-` (317 accounts).
   - Target Accounts: Sheet `ZI_ITS AND DCX EN Target Compan` (106 accounts).
   - Vector Summary: Sheets `Account Intelligence` (235 accounts), `Matched Contacts` (113 contacts), `Vector_ All Visitors` (2,044 visitors), `Key Visitors` (480 senior visitors).
2. **Column Mapping Verification**:
   - Confirm Target accounts map to `ITS EN` and `DCX EN` strictly from column `Targeted Accounts ITS EN and DCX EN`.
   - Never classify from company names.
3. **Deduplication & Identity Resolution**:
   - Match by Canonical Domain > ZoomInfo Company ID > Normalised Name.
   - Unmatched rows go to the Review Queue; no silent merges.
4. **Validation Report Generation**:
   - Review rows in vs rows out, duplicate rate, match confidence, and overlap counts.

---

## D3. Daily: Sales Representative Workflow
1. **Workspace Review**:
   - Open **Sales Intelligence**; filter by "My Territory" and "Tier 1: Act Now".
   - Check new alerts for accounts with rising intent or recent Vector visitors.
2. **Account Investigation**:
   - Open target account profile; inspect the **Account Scope Card**.
   - Review the "Why Now" triggers and corroborating evidence links.
   - Inspect the **Buying Committee**: verify relevant persona (e.g. VP Infrastructure or Director CX).
3. **Outreach & Talk Track**:
   - Reference the suggested talk track and matched Movate case study.
   - Do not claim "we saw you on our website"; use observed intent topics as context for relevance.
4. **Feedback Logging**:
   - Click **Accept** (qualifies account, moves to pipeline) or **Reject** with mandatory reason code (`Bad Timing`, `No Budget`, `Wrong Persona`, `Competitor Locked`, `No Need`).
   - Feedback directly trains the scoring calibration engine.

---

## D4. Weekly: ABM Manager Workflow
1. **Tier Migration Audit**:
   - Open **ABM Workspace**; review accounts promoted from Tier 3 to Tier 2, or Tier 2 to Tier 1.
2. **Segment Building**:
   - Construct multi-touch audiences: e.g. `Tier 2` + `Cloud Migration Intent` + `BFSI Vertical` + `Vector Visitor Observed`.
   - Verify committee coverage score across the cohort.
3. **Audience Export**:
   - Export sanitized audience for LinkedIn / ad platform upload.
   - Log export in audit ledger for compliance.
4. **Engagement Heatmap**:
   - Review heatmap of target account visits by Movate service page.
   - Coordinate with Sales on warm accounts crossing the engagement threshold.

---

## D5. Customer Success / Account Manager: Existing Clients
1. **Growth Opportunity Prioritization**:
   - Open **Existing Clients** workspace; sort by `Growth Opportunity Score`.
2. **Service Penetration Analysis**:
   - Inspect the **Service Penetration Matrix**: identify `Confirmed` vs `Inferred` vs `Unknown` service lines.
   - For `Unknown` lines, verify with internal delivery teams before pitching.
3. **Trigger Monitoring**:
   - Check for recent executive departures/hires, M&A announcements, or new tech adoption signals.
4. **QBR & Expansion Planning**:
   - Draft cross-sell play for adjacent service lines based on active intent signals.

---

## D6. Monthly: ZoomInfo Credit & Cost Governance
1. **Spend vs. Budget Reconciliation**:
   - Open **Integrations > Credit Governor**.
   - Compare `provider_usage_ledger` against monthly quota and ZoomInfo portal usage report.
   - Compute **Cost per Accepted Account**.
2. **Topic Value Review**:
   - Review which of the 10 allocated topics generated high-intent pipeline.
   - Identify low-performing topics and plan potential swaps with ZoomInfo AM.
3. **TTL & Cache Health**:
   - Check cache hit rate (target > 85%).
   - Adjust TTLs if firmographics or technographics change frequency dictates.

---

## D7. Weekly: Data Quality & Identity Review
1. **Data Quality Dashboard**:
   - Review identity match accuracy and duplicate rate.
   - Clear the **Revenue Unknown** queue by running free secondary lookups (SEC EDGAR, filings).
2. **Source Coverage Metrics**:
   - Monitor % of accounts with ZoomInfo, Vector, GA4, News, and Contact data.
3. **Connector Health**:
   - Ensure latency and error rates across all MCP connections remain under 1%.

---

## D8. Connector Outage & Fallback Procedures
1. **Detection**:
   - In-app notification and Integrations page show connector status as "Degraded" or "Disconnected".
2. **Non-Blocking Operation**:
   - Platform remains fully operational using cached data.
   - Scores re-normalize data completeness rather than dropping to zero.
3. **Resolution**:
   - Check token expiration (e.g. Vector OAuth token, GA4 service credentials).
   - Re-authenticate via the Integrations panel; trigger single manual retry.

---

## D9. Quarterly: Scoring Model Calibration
1. **Performance Analysis**:
   - Measure conversion rate of Tier 1 accounts to Sales Accepted Opportunities.
   - Analyze correlation of individual signals (ZoomInfo surge vs Vector visit vs leadership trigger).
2. **Heuristic Calibration**:
   - Propose weight adjustments based on empirical conversion data.
   - Publish Model Version `v2.0.0` with version history preserved.

---

## D10. Privacy, Compliance & Data Governance
1. **Access Controls**:
   - Contact email and phone visibility restricted to Sales and Admin roles.
2. **Right to Be Forgotten / Opt-Out**:
   - Process contact deletion requests via Settings > Data Governance.
   - Cascade deletion to local cache and export archives.
3. **Attribution Disclaimers**:
   - GA4 data displayed as aggregate only; never person-level.
   - Heuristics labelled as "Estimates — Unverified until confirmed by Sales".
