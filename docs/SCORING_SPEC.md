# Movate Account Intelligence & Intent Platform: SCORING & ACCOUNT SCOPE SPECIFICATION

All weights, thresholds, and half-lives below are **initial heuristics, configurable and versioned**. They are not validated purchase probabilities. The UI explicitly discloses this to all users.

---

## 1. Component Scores (each 0–100, plus Data Completeness % and Confidence Level)

### 1.1 Account Fit (0–100) — Is this the kind of company Movate wins?
- **Industry Relevance (25 points)**: Alignment with Movate target verticals: BFSI, Insurance, Healthcare, Telecom, Retail/CPG/Manufacturing, Technology, Travel & Hospitality, Media, Professional Services.
- **Revenue & Employee Suitability (20 points)**: Scale fit. Annual revenue > $100M: 20 pts, $50M–$100M: 15 pts, $10M–$50M: 10 pts. Hard gate: Annual revenue ≤ USD 10M is strictly **Ineligible**. Revenue Unknown: **"Eligibility pending"**.
- **Technology Environment (20 points)**: Modern enterprise stack, cloud adoption, digital transformation indicators.
- **Geography (15 points)**: North America (US/Canada), UK/Europe, APAC/ANZ enterprise hubs.
- **Strategic Potential & Enterprise Complexity (20 points)**: Multi-business unit structure, global presence, parent/subsidiary hierarchy.

### 1.2 Buying Intent (0–100) — Is it researching/looking right now?
- **ZoomInfo Intent (30 points)**: Signal score (60–100) and audience strength surge across all 10 allocated topics (Cloud Migration, Cybersecurity, Digital Transformation, IT Outsourcing, Managed Services, etc.).
- **Topic Acceleration / New Topics (20 points)**: Surge velocity over 7/14/30-day windows compared to 90-day baseline.
- **Independent Research-Source Evidence (20 points)**: Corroboration from distinct publisher families (Google News RSS, GDELT, public alerts).
- **Vector Visitor Evidence (15 points)**: Identified account visit counts, repeat visit frequency, and high-value URL weight (pricing, solutions, case studies, AI services).
- **Business Triggers (15 points)**: Executive leadership changes (CIO, CTO, CISO), M&A, hiring surges (cloud/security/AI roles), expansion notices.

### 1.3 Engagement (0–100) — Is it engaging directly with Movate?
- Service/solution/pricing page visits (e.g. `/artificial-intelligence/`, `/services/data-and-insight-services/`, `/mova-io/`).
- Repeat visits over 14/30-day windows.
- Identified contact count from Vector (visitor profiles with job titles, departments, LinkedIn URLs).
- LinkedIn Ads impressions/clicks (via Vector LinkedIn connector).
- Form fills / contact requests.

### 1.4 Contactability (0–100) — Can sales act immediately?
- **Buying Committee Coverage Score**:
  - Executive Sponsor (CIO, CTO, CDO, C-Level)
  - Technology Evaluator (VP/Director IT, Infrastructure, Cloud, Security)
  - Operational Lead (Director/Manager Operations, CX)
  - Procurement / Strategic Sourcing
- Seniority distribution and contact verification status.

### 1.5 Overall Priority Score
$$\text{Overall Priority} = 0.30 \times \text{Fit} + 0.35 \times \text{Intent} + 0.15 \times \text{Engagement} + 0.10 \times \text{Trigger Timing} + 0.10 \times \text{Contactability}$$

---

## 2. Rules that Make the Score Trustworthy

1. **Missing Data is Not Zero**:
   Re-normalize weights dynamically over available components. Compute a **Data Completeness %**. If completeness < 60%, display a prominent **"Low Confidence (Data Completeness X%)"** badge.
2. **Recency Decay**:
   Each signal decays exponentially:
   $$\text{Weight}_{\text{decayed}} = \text{Weight} \times \exp\left(-\frac{\ln(2) \times \text{age}}{\text{half-life}}\right)$$
   - ZoomInfo Intent: 30 days
   - Vector Visit: 14 days
   - News / GDELT Trigger: 45 days
   - Hiring Signal: 30 days
   - Leadership Change: 90 days
   - M&A / Major Event: 120 days
3. **Source Cap**:
   No single provider may contribute more than **50%** of the Intent score.
4. **Independence Multiplier**:
   Corroboration counts distinct publisher/dataset families:
   - 1 independent source: $1.0\times$
   - 2 independent sources: $1.15\times$
   - 3+ independent sources: $1.25\times$
5. **Acceleration Labels**:
   - `Rising`: Intent score increased > 15 pts over prior 14 days
   - `Sustained`: Intent score stable (±5 pts) at elevated level for > 30 days
   - `New`: First observed intent signal within past 14 days
   - `Declining`: Intent score decreased > 15 pts over prior 14 days
   - `No recent activity`: No signals in past 45 days
   - `Insufficient history`: Fewer than 2 observation windows
6. **Relevance Gate**:
   Signals must map to a Movate service line (Cloud, Cybersecurity, AI/Automation, IT Infrastructure, Digital Workplace, Customer Experience, Data). Unmapped signals are preserved in raw logs but do not contribute points.
7. **Negative News Rule**:
   Cybersecurity incidents or negative news trigger an **"Investigate Trigger"** flag with a small capped score contribution, never an assumption of purchase.
8. **Suppression Engine**:
   Suppresses "Sales Ready" status and alerts for open opportunities, competitors, do-not-target accounts, or cooldown periods. The suppression reason is always displayed.
9. **Explainability**:
   Every score stores exact reason codes (e.g. `ZI_SURGE_CYBERSECURITY`, `VECTOR_REPEAT_PRICING`, `HIRING_CLOUD_ENG`), weights version, and completeness.
10. **Audit Trail**:
    Every score update writes to `score_history` with timestamp, delta, and triggering signal.

---

## 3. Account Tiers & Sales SLAs

| Tier | Default Rule | Meaning | Recommended Action & SLA |
|---|---|---|---|
| **Tier 1: Act Now** | Overall ≥ 75, Fit ≥ 60, ≥ 2 independent signals, ≥ 1 verified contact, not suppressed | Sales Ready | Direct Sales outreach within 2 business days; utilize research brief and why-now talk tracks |
| **Tier 2: Engage via ABM** | Overall 55–74 | Good fit, building intent | Enroll in targeted ABM campaigns, customized content, weekly review |
| **Tier 3: Nurture / Monitor** | Overall 35–54 | Fit or weak signal | Light-touch marketing nurture, monthly review |
| **Tier 4: Watchlist** | < 35 or Low Data Completeness (< 50%) | Insufficient evidence | No outbound; route to data enrichment queue |
| **Suppressed / Ineligible** | Revenue ≤ $10M, Competitor, Open Opp, Do-Not-Target | Excluded | Display exclusion reason; block outbound alerts |

---

## 4. Existing Client Growth Opportunity Score (Separate Model)

$$\begin{aligned}
\text{Growth Opportunity Score} = & \; 0.30 \times \text{Whitespace Gap (Unserved Services)} \\
& + 0.25 \times \text{Intent on Non-Contracted Lines} \\
& + 0.15 \times \text{Business Triggers (Expansion, Leadership)} \\
& + 0.10 \times \text{Digital Engagement (Vector Visits)} \\
& + 0.10 \times \text{Relationship Health / Tenacity} \\
& + 0.10 \times \text{Contact Coverage Beyond Sponsor}
\end{aligned}$$

- **Service Penetration Matrix**: Every service line classified as `Confirmed` (active contract), `Inferred` (signals present), or `Unknown` (whitespace opportunity).
- Opportunity Types:
  - `Cross-sell`: New service line expansion
  - `Upsell`: Volume or scope expansion of current service
  - `Whitespace`: High-fit unserved service line to investigate
  - `Renewal Risk`: Competitor presence or negative leadership trigger

---

## 5. Account Scope Card (Mandatory Top-of-Profile Card)

Every account profile features the 11-section Scope Card:
1. **Identity**: Canonical Account ID, Legal Name, Domain, Parent/Subsidiary links, Workspace relationships (`Target-DCX`, `Target-ITS`, `Both`, `Existing Client`, `Discovery`), Owner, Territory.
2. **Eligibility**: Annual Revenue (value, source, confidence), Employee count, ICP eligibility badge.
3. **Scores & Tiers**: Fit, Intent, Engagement, Contactability, Overall Priority, Tier badge, Data Completeness %, 30-day score delta.
4. **Scope of Opportunity**: In-scope Movate service lines with Confirmed / Inferred / Unknown badges and testable hypotheses.
5. **Buying Stage (Heuristic)**: `Unaware`, `Researching`, `Evaluating`, or `Active Need`.
6. **Why Now**: Top 3 corroborating signals with source provider, observation date, and evidence link.
7. **Buying Committee**: Coverage %, identified personas, missing decision-makers.
8. **Engagement Summary**: Vector visitor count, top pages viewed, last visit timestamp, LinkedIn ads touchpoints, aggregate GA4 context.
9. **Risks & Blockers**: Competitor presence, negative news, ownership conflicts, stale signals.
10. **Next Best Action**: Recommended concrete step, assigned owner, due date, talk track, and Accept / Reject buttons with reason codes.
11. **Evidence Registry**: Comprehensive list of raw observations backing every statement.
