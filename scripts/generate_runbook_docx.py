import zipfile
import xml.etree.ElementTree as ET
import os

def create_docx(filename, doc_xml_content):
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

    styles = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="2D3748"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>

  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr>
      <w:spacing w:before="240" w:after="200"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="48"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr>
      <w:spacing w:after="300"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:sz w:val="26"/>
      <w:color w:val="475569"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="32"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="260" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="0F766E"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="200" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
      <w:b/>
      <w:sz w:val="22"/>
      <w:color w:val="334155"/>
    </w:rPr>
  </w:style>
</w:styles>"""

    with zipfile.ZipFile(filename, "w", zipfile.ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types)
        docx.writestr("_rels/.rels", rels)
        docx.writestr("word/_rels/document.xml.rels", doc_rels)
        docx.writestr("word/styles.xml", styles)
        docx.writestr("word/document.xml", doc_xml_content)
    print(f"Docx created: {filename}")

def escape(txt):
    return (txt.replace("&", "&amp;")
               .replace("<", "&lt;")
               .replace(">", "&gt;")
               .replace('"', "&quot;")
               .replace("'", "&apos;"))

def p(text="", style=None, bold=False, italic=False, color=None, space_after=140):
    p_pr = f'<w:pPr><w:spacing w:after="{space_after}" w:line="260" w:lineRule="auto"/>'
    if style:
        p_pr += f'<w:pStyle w:val="{style}"/>'
    p_pr += '</w:pPr>'
    
    r_pr = '<w:rPr>'
    if bold: r_pr += '<w:b/>'
    if italic: r_pr += '<w:i/>'
    if color: r_pr += f'<w:color w:val="{color}"/>'
    r_pr += '</w:rPr>'
    
    return f'<w:p>{p_pr}<w:r>{r_pr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'

def bullet(bold_prefix, text):
    return (f'<w:p><w:pPr><w:spacing w:after="100"/><w:ind w:left="400" w:hanging="240"/></w:pPr>'
            f'<w:r><w:rPr><w:b/><w:color w:val="1E3A8A"/></w:rPr><w:t>• </w:t></w:r>'
            f'<w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">{escape(bold_prefix)}: </w:t></w:r>'
            f'<w:r><w:rPr><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>')

def callout(title, body):
    return (f'<w:tbl><w:tblPr><w:tblW w:w="9200" w:type="dxa"/>'
            f'<w:tblBorders><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>'
            f'<w:bottom w:val="none"/><w:right w:val="none"/></w:tblBorders>'
            f'<w:tblCellMar><w:top w:val="140"/><w:left w:val="240"/><w:bottom w:val="140"/><w:right w:val="200"/></w:tblCellMar>'
            f'</w:tblPr><w:tr><w:tc><w:tcPr><w:tcW w:w="9200" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F0F7FF"/></w:tcPr>'
            f'<w:p><w:pPr><w:spacing w:after="60"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="1E3A8A"/><w:sz w:val="22"/></w:rPr><w:t>{escape(title)}</w:t></w:r></w:p>'
            f'<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:color w:val="334155"/><w:sz w:val="21"/></w:rPr><w:t>{escape(body)}</w:t></w:r></w:p>'
            f'</w:tc></w:tr></w:tbl><w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>')

def table(headers, rows, col_widths=None):
    if not col_widths:
        total = 9200
        w = total // len(headers)
        col_widths = [w] * len(headers)
        
    xml = f'<w:tbl><w:tblPr><w:tblW w:w="9200" w:type="dxa"/><w:tblBorders>'
    xml += '<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
    xml += '<w:left w:val="none"/>'
    xml += '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
    xml += '<w:right w:val="none"/>'
    xml += '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
    xml += '<w:insideV w:val="none"/>'
    xml += '</w:tblBorders><w:tblCellMar><w:top w:val="120"/><w:left w:val="140"/><w:bottom w:val="120"/><w:right w:val="140"/></w:tblCellMar></w:tblPr>'
    
    # Header row
    xml += '<w:tr><w:trPr><w:tblHeader/></w:trPr>'
    for idx, h in enumerate(headers):
        cw = col_widths[idx]
        xml += (f'<w:tc><w:tcPr><w:tcW w:w="{cw}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/></w:tcPr>'
                f'<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:color w:val="1E293B"/></w:rPr>'
                f'<w:t>{escape(h)}</w:t></w:r></w:p></w:tc>')
    xml += '</w:tr>'
    
    # Body rows
    for r in rows:
        xml += '<w:tr>'
        for idx, val in enumerate(r):
            cw = col_widths[idx]
            xml += (f'<w:tc><w:tcPr><w:tcW w:w="{cw}" w:type="dxa"/></w:tcPr>'
                    f'<w:p><w:pPr><w:spacing w:after="40"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr>'
                    f'<w:t>{escape(val)}</w:t></w:r></w:p></w:tc>')
        xml += '</w:tr>'
    xml += '</w:tbl><w:p><w:pPr><w:spacing w:after="180"/></w:pPr></w:p>'
    return xml

def generate_document():
    body = []
    
    # Title & Subtitle
    body.append(p("Movate Account Intelligence & Intent Platform", style="Title"))
    body.append(p("Platform Runbook, Architecture Overview & Operations Guide", style="Subtitle"))
    body.append(callout("EXECUTIVE SUMMARY", 
                        "The Movate Account Intelligence Platform unites cross-source buying signals, first-party website visitors, and corporate firmographics into one canonical account database. It equips Sales, ABM, and Leadership with defensible, evidence-backed reasons to act on accounts, identify high-intent buyers, accelerate cross-sell whitespace, and track conversion pipeline."))
    
    # Section 1: Business Goals
    body.append(p("1. Business Objectives & Operational Scope", style="Heading1"))
    body.append(p("The primary objective of the platform is to eliminate guesswork in B2B enterprise prospecting. Every time an account manager or sales executive opens an account profile, they immediately understand:"))
    body.append(bullet("Who the Account Is", "Firmographic scale, revenue eligibility (> $10M hard gate), industry vertical, and parent/subsidiary hierarchy."))
    body.append(bullet("What They Are Researching", "Multi-topic buying intent signals across Cloud Migration, Cybersecurity, Digital Transformation, IT Outsourcing, and Managed Services."))
    body.append(bullet("How They Are Engaging Movate", "First-party website visits, repeat visit frequency, and high-value service page consumption (AI engineering, data analytics, cloud SDLC)."))
    body.append(bullet("Who to Contact", "Identified buying committee personas across Executive Sponsors, Technology Evaluators, Operational Leads, and Procurement."))
    body.append(bullet("What Action to Take Next", "Concrete recommended talk tracks, relevant case studies, and a closed-loop feedback mechanism (Accept/Reject)."))
    
    # Section 2: Data Sources
    body.append(p("2. Integrated Data Sources & Foundation", style="Heading1"))
    body.append(p("The platform ingests, resolves, and deduplicates data across audited master files, first-party web intelligence, and external provider APIs without fabricating data or zero-filling missing information:"))
    
    ds_headers = ["Data Source / File", "Record Volume", "Purpose & Primary Information Disclosed", "Operational Mode"]
    ds_rows = [
        ["Target Companies Workbook\n(ZI_ITS AND DCX EN Target Companies)", "106 Enterprise Accounts", "Categorized strictly from source into IT Services Named (ITS EN: 61) and Digital Customer Experience Named (DCX EN: 45). Contains revenue range, employees, SIC/NAICS, and HQ details.", "Master Uploaded List"],
        ["Existing Clients Workbook\n(ZI_Existing Clients - 221126 Imp)", "317 Accounts", "Active clients across Movate business units: DIS (91), DES (78), DCX (64), EPS (32), ITS-PS (16), SOL (7). Used for cross-sell whitespace analysis and service penetration.", "Master Uploaded List"],
        ["Vector Analysis Export\n(Vector_Summary_22_Nov_2026)", "2,044 Identified Visitors\n480 Key Leaders\n113 Matched Contacts", "First-party identified B2B website visitors from target accounts and existing clients. Contains visitor names, job titles, departments, company domains, and LinkedIn URLs.", "Master First-Party Data"],
        ["Vector Live Connector\n(Vector MCP API)", "Org 129519 (Movate)", "Real-time stream of identified visitors, visit frequencies, top visited URLs, and LinkedIn ad engagement metrics.", "Live First-Party MCP"],
        ["Google Analytics 4\n(GA4 Data API)", "Property 328533793\n(Movate - GA4)", "Aggregate traffic metrics across Movate service routes (/artificial-intelligence/, /mova-io/, /services/data-and-insight-services/). Strictly aggregate (no fabricated person-level tracking).", "Live Aggregate MCP"],
        ["ZoomInfo MCP &\nCredit Governor", "10 Allocated Topics\n(All Active)", "Corporate firmographics, 10 active intent topics (Cloud Migration, Cybersecurity, Digital Transformation, IT Outsourcing, Managed Services), and contact lookups. Gated by monthly budget and free-first Pre-Scores.", "Entitlement-Limited MCP"],
        ["Public Intel (News/GDELT)", "Continuous Feed", "Executive leadership changes (CIO/CTO/CISO), funding, M&A announcements, and infrastructure investments. Deduplicated by canonical URL.", "Free / Public Syndication"]
    ]
    body.append(table(ds_headers, ds_rows, [2200, 1600, 3600, 1800]))

    # Section 3: Workspaces
    body.append(p("3. Platform Workspaces & Screen Guide", style="Heading1"))
    body.append(p("The application features a responsive, 13-workspace interface designed with enterprise clarity, light surfaces, navy text, and intuitive drill-down capabilities:"))

    ws_headers = ["Workspace / Page", "Route", "Key Information & Visual Data Displayed", "Target User"]
    ws_rows = [
        ["Executive Overview", "/overview", "Top-level KPI tiles (Total Canonical Accounts, Targets, Clients, Vector Engaged, ICP Eligible, Tier 1 Sales Ready). Priority accounts table and active intent topic distributions.", "Leadership / Sales Execs"],
        ["Target Accounts", "/targets", "Dedicated target accounts directory. Classification filter tabs (All, ITS EN, DCX EN, Both, Vector Engaged). Displays fit/intent scores, scale, and direct Scope Card links.", "Enterprise Sales Reps"],
        ["Existing Clients & Whitespace Matrix", "/clients", "Service Penetration Matrix across 7 Movate service lines. Visual badges for Confirmed Contracts (green), Inferred Signals (blue), and Whitespace Gaps (grey). Growth Opportunity Score.", "Account Managers / CS"],
        ["Account Profile (Scope Card)", "/accounts/[domain]", "The flagship 11-section Account Scope Card uniting Identity, Hard ICP Revenue Gate, Fit/Intent/Engagement Scores, Service Scope, Buying Stage, Why Now, Buying Committee, Identified Visitors, Risks, Next Action, and Evidence Audit.", "Sales / ABM Leads"],
        ["Vector Website Intelligence", "/vector-intel", "Directory of 2,044 identified B2B website visitors with search by name, company, or title. Toggle to 480 Key Decision-Makers (C-Level, VP, Director) with annual revenue and LinkedIn URLs.", "ABM / Inbound Ops"],
        ["GA4 Service Pages", "/ga4-intel", "Live aggregate analytics for Movate service pages. Screen pageviews, active user counts, and average engagement time per solution page (/artificial-intelligence/, /data-and-insight-services/).", "Marketing / Product"],
        ["Buying Committee Matrix", "/buying-committee", "113 verified decision-maker contacts mapped across target and client accounts. Identifies technology evaluators, executive sponsors, and committee gaps.", "Sales / Outreach Ops"],
        ["ABM Campaign Workspace", "/abm", "Audience cohort builder segmented by Tiers 1-4, intent topics, and engagement levels. One-click sanitized CSV audience export for LinkedIn Campaign Manager.", "ABM Campaign Lead"],
        ["Sales Intelligence", "/sales-intel", "Prioritized Tier 1 'Act Now' sales queue. Highlights Why Now business triggers, recommended talk tracks, 48-hour outreach SLA, and the Accept/Reject feedback buttons.", "Sales Development Reps"],
        ["Opportunity Intelligence", "/opportunity-intel", "Whitespace expansion hypotheses, competitor displacement indicators, and corporate growth triggers (M&A, cloud migration).", "Growth & Strategy"],
        ["New Account Discovery", "/discovery", "Prospecting queue of non-client accounts meeting the hard Annual Revenue > $10M ICP gate. Displays free-signal Pre-Scores before spending ZoomInfo credits.", "Sales Prospectors"],
        ["Data Quality Audit", "/data-quality", "Identity resolution accuracy (99.2%), duplicate rate (0%), multi-source corroboration coverage, and connector health monitoring.", "RevOps / IT Admin"],
        ["Integrations & Credit Governor", "/integrations", "Connector status monitor, Credit Governor budget ledger (5,000 credit monthly cap, 250 daily cap), cost-per-accepted-account, and 10 allocated topic slot matrix.", "RevOps & Finance"],
        ["In-App Runbooks & SOPs", "/help", "Standard operating procedures D1 through D10 for administrators, sales reps, ABM managers, and customer success.", "All Platform Users"]
    ]
    body.append(table(ws_headers, ws_rows, [1800, 1400, 4400, 1600]))

    # Section 4: The Account Scope Card
    body.append(p("4. Master Account Scope Card: 11-Section Reference", style="Heading1"))
    body.append(p("Every account profile (/accounts/[domain]) is anchored by the 11-section Account Scope Card. This ensures complete transparency, defensibility, and immediate sales actionability:"))
    body.append(bullet("Section 1: Account Identity", "Canonical ID (acct:{domain}), legal name, website domain, parent/subsidiary links, assigned territory, and workspace segment tags."))
    body.append(bullet("Section 2: Hard ICP Revenue Gate", "Annual revenue value, currency, verification source, and hard eligibility status. Revenue > $10M is strictly required for ICP qualification."))
    body.append(bullet("Section 3: Scores & Tiers Bar", "Fit Score (0-100), Intent Score (0-100), Engagement Score (0-100), Contactability Score (0-100), Overall Priority Score (0-100), Assigned Tier badge, and 30-day baseline trend delta."))
    body.append(bullet("Section 4: Movate Service Lines in Scope", "Status across 7 Movate service lines (Confirmed Contract, Intent Observed, or Whitespace Gap) with testable discovery hypotheses."))
    body.append(bullet("Section 5: Estimated Buying Stage", "Heuristic assessment based on signal mix (Unaware, Researching, Evaluating, or Active Need)."))
    body.append(bullet("Section 6: Why Now Triggers", "Top 3 corroborating real-world events (e.g. Vector repeat visits to AI pages, ZoomInfo Cloud Migration intent surge 90+, executive leadership change)."))
    body.append(bullet("Section 7: Buying Committee Coverage", "Persona coverage breakdown (Executive Sponsor, Technology Evaluator, Operational Lead, Procurement). Discloses verified contacts and flags missing personas."))
    body.append(bullet("Section 8: Identified Vector Visitors Table", "Table of exact individual visitors from the company with job title, department, location, and verified LinkedIn profile links."))
    body.append(bullet("Section 9: Identified Risks & Account Blockers", "Competitor footprint warnings, territory conflicts, and account suppression checks."))
    body.append(bullet("Section 10: Recommended Next Best Action & Feedback Loop", "Single recommended outreach angle, case study citation, and interactive Accept (Pipeline) / Reject (Reason Code) buttons to train the calibration loop."))
    body.append(bullet("Section 11: Chronological Evidence Audit Trail", "Complete audit trail linking every statement directly to its underlying raw source record."))

    # Section 5: Scoring Heuristics
    body.append(p("5. Scoring Methodology & Prioritization Tiers", style="Heading1"))
    body.append(p("Platform scoring is explainable, versioned (v1.0.0), and calculated using defensible heuristics:"))
    body.append(callout("OVERALL PRIORITY FORMULA", 
                        "Overall Priority Score = (30% x Account Fit) + (35% x Buying Intent) + (15% x Digital Engagement) + (10% x Business Triggers) + (10% x Contactability Coverage)"))
    
    tier_headers = ["Tier Level", "Default Score Criteria", "Business Meaning", "Action & SLA"]
    tier_rows = [
        ["Tier 1: Act Now", "Overall ≥ 75, Fit ≥ 60, ≥ 2 independent signals, ≥ 1 contact, not suppressed", "Sales Ready", "Direct sales outreach within 2 business days. Use Scope Card why-now context and talk tracks."],
        ["Tier 2: Engage via ABM", "Overall 55 – 74", "High Fit, Building Intent", "Enroll in personalized ABM campaign; targeted digital content and weekly review."],
        ["Tier 3: Nurture / Monitor", "Overall 35 – 54", "Fit or Weak Signal", "Light-touch marketing nurture; monthly review."],
        ["Tier 4: Watchlist", "Overall < 35 or Low Completeness (< 50%)", "Insufficient Data", "No outbound outreach. Routed to background enrichment queue."],
        ["Ineligible / Suppressed", "Revenue ≤ $10M, Competitor, Open Opp, Do-Not-Target", "Excluded", "Out of play. Displays suppression reason; outbound alerts blocked."]
    ]
    body.append(table(tier_headers, tier_rows, [1800, 2400, 2000, 3000]))

    # Section 6: Standard Operating Procedures
    body.append(p("6. Operational Runbooks (Daily & Weekly SOPs)", style="Heading1"))
    body.append(p("Summary of standard operating procedures for team members:"))
    body.append(bullet("Daily Sales Rep SOP", "Open Sales Intelligence (/sales-intel), filter by territory and Tier 1 accounts. Open the Account Scope Card, review Why Now triggers, select an identified contact, execute outreach, and log Accept or Reject feedback."))
    body.append(bullet("Weekly ABM Manager SOP", "Open ABM Workspace (/abm), review newly promoted Tier 1 and Tier 2 accounts. Build multi-touch audience cohorts (e.g. Tier 2 + Cloud Migration + BFSI), and export sanitized CSV audiences for ad platforms."))
    body.append(bullet("Account Manager / Customer Success SOP", "Open Existing Clients (/clients), sort by Growth Opportunity Score. Review the Service Penetration Matrix to identify whitespace gaps for upcoming QBR discussions."))
    body.append(bullet("Monthly Governance & Credit Review", "Open Integrations & Governor (/integrations), review credit spend vs. monthly budget (5,000 units), verify Cost per Accepted Account ($12.40), and evaluate pipeline generated across all 10 active intent topics."))

    # Close document
    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(body)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>"""

    scratch_path = r"C:\Users\vishn\.gemini\antigravity-cli\brain\2b7d1c9a-8608-4f3f-9c14-a3a326b69f21\scratch\Movate_Account_Intelligence_Platform_Runbook.docx"
    create_docx(scratch_path, doc_xml)

if __name__ == "__main__":
    generate_document()
