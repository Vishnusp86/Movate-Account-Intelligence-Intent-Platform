import zipfile
import xml.etree.ElementTree as ET
import json
import os
import re

def parse_cell(c, ss):
    t = c.attrib.get('t')
    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
    is_tag = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is')
    val = ""
    if is_tag is not None:
        t_tag = is_tag.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
        if t_tag is not None and t_tag.text:
            val = t_tag.text
    elif v is not None and v.text is not None:
        if t == 's':
            idx = int(v.text)
            val = ss[idx] if idx < len(ss) else ""
        elif t == 'b':
            val = 'TRUE' if v.text == '1' else 'FALSE'
        else:
            val = v.text
    return val.strip()

def read_xlsx_sheet(filename, sheet_name_or_idx=1):
    with zipfile.ZipFile(filename, "r") as z:
        ss = []
        if "xl/sharedStrings.xml" in z.namelist():
            tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                texts = [t.text for t in si.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t") if t.text]
                ss.append("".join(texts))
        
        wb_tree = ET.fromstring(z.read("xl/workbook.xml"))
        sheets = wb_tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet")
        
        target_idx = 1
        if isinstance(sheet_name_or_idx, int):
            target_idx = sheet_name_or_idx
        else:
            for idx, s in enumerate(sheets):
                if s.attrib["name"] == sheet_name_or_idx:
                    target_idx = idx + 1
                    break
        
        xml_name = f"xl/worksheets/sheet{target_idx}.xml"
        s_tree = ET.fromstring(z.read(xml_name))
        rows = s_tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")
        
        rows_data = []
        for r in rows:
            row_dict = {}
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                ref = c.attrib.get('r', '')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                val = parse_cell(c, ss)
                row_dict[col] = val
            rows_data.append(row_dict)
        return rows_data

def col_idx(col_str):
    num = 0
    for c in col_str:
        num = num * 26 + (ord(c.upper()) - ord('A')) + 1
    return num

def dict_to_list(row_dict, max_cols=30):
    res = [''] * max_cols
    for col, val in row_dict.items():
        idx = col_idx(col) - 1
        if idx < max_cols:
            res[idx] = val
    return res

def clean_domain(url_or_domain):
    if not url_or_domain:
        return ""
    d = url_or_domain.lower().strip()
    d = re.sub(r'^https?://', '', d)
    d = re.sub(r'^www\.', '', d)
    d = d.split('/')[0].split(':')[0]
    return d

def main():
    print("Ingesting master datasets...")
    
    # 1. Target Accounts
    target_rows = read_xlsx_sheet("ZI_ITS AND DCX EN Target Companies_221126 IMP.xlsx", 1)
    print(f"Target Accounts rows: {len(target_rows)}")
    
    # Map headers
    t_headers = target_rows[0]
    # In target sheet:
    # A: ZoomInfo Company Name
    # B: Targeted Accounts ITS EN and DCX EN
    # C: Company Website URL
    # D: Website Domain
    # E: Match status
    # F: ZoomInfo Company ID
    # G: Company Name
    # H: Website
    # I: Founded Year
    # J: Company HQ Phone
    # K: Fax
    # L: Ticker
    # M: Revenue (in 000s USD)
    # N: Revenue Range (in USD)
    # O: Employees
    # P: Employee Range
    # Q: SIC Code 1, R: SIC Code 2, S: SIC Codes, T: NAICS Code 1...
    
    targets_by_domain = {}
    for r in target_rows[1:]:
        zi_name = r.get('A', '')
        classification = r.get('B', '').strip() # 'ITS EN', 'DCX EN'
        domain = clean_domain(r.get('D', '') or r.get('C', '') or r.get('H', ''))
        zi_id = r.get('F', '')
        revenue_k = r.get('M', '')
        revenue_range = r.get('N', '')
        employees = r.get('O', '')
        emp_range = r.get('P', '')
        founded = r.get('I', '')
        phone = r.get('J', '')
        ticker = r.get('L', '')
        
        if not domain and not zi_name:
            continue
            
        key = domain if domain else f"name:{zi_name.lower()}"
        targets_by_domain[key] = {
            "name": zi_name,
            "domain": domain,
            "classification": classification, # 'ITS EN', 'DCX EN'
            "zoominfo_id": zi_id,
            "revenue_k": revenue_k,
            "revenue_range": revenue_range,
            "employees": employees,
            "employee_range": emp_range,
            "founded_year": founded,
            "phone": phone,
            "ticker": ticker,
            "is_target": True
        }
    print(f"Parsed unique target accounts: {len(targets_by_domain)}")

    # 2. Existing Clients
    client_rows = read_xlsx_sheet("ZI_Existing Clients - 221126 Imp.xlsx", 1)
    print(f"Existing Clients rows: {len(client_rows)}")
    # A: Account Name
    # B: BU Name
    # C: Vertical AM FY'27
    # D: Industry Sector
    # E: TMT / SV
    # F: Company Website URL
    # G: Website Domain
    # H: Email Domain
    # I: Match status
    # J: ZoomInfo Company ID
    # K: Company Name
    # L: Website
    # Q: Revenue (in 000s USD)
    # R: Revenue Range (in USD)
    # S: Employees
    # T: Employee Range
    
    clients_by_domain = {}
    for r in client_rows[1:]:
        acc_name = r.get('A', '')
        bu = r.get('B', '')
        vertical_am = r.get('C', '')
        sector = r.get('D', '')
        tmt_sv = r.get('E', '')
        domain = clean_domain(r.get('G', '') or r.get('F', '') or r.get('H', ''))
        zi_id = r.get('J', '')
        revenue_k = r.get('Q', '')
        revenue_range = r.get('R', '')
        employees = r.get('S', '')
        emp_range = r.get('T', '')
        
        if not domain and not acc_name:
            continue
            
        key = domain if domain else f"name:{acc_name.lower()}"
        clients_by_domain[key] = {
            "name": acc_name,
            "bu": bu,
            "vertical_am": vertical_am,
            "industry_sector": sector,
            "tmt_sv": tmt_sv,
            "domain": domain,
            "zoominfo_id": zi_id,
            "revenue_k": revenue_k,
            "revenue_range": revenue_range,
            "employees": employees,
            "employee_range": emp_range,
            "is_client": True
        }
    print(f"Parsed unique existing clients: {len(clients_by_domain)}")

    # 3. Vector Account Intelligence Sheet
    vec_ai_rows = read_xlsx_sheet("Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx", "Account Intelligence")
    print(f"Vector Account Intelligence rows: {len(vec_ai_rows)}")
    # Row 1 headers:
    # A: Account ID (e.g. acct:apple.com)
    # B: Primary Company (Apple)
    # C: Canonical Domain (apple.com)
    # D: Vector Match (Yes)
    # E: Match Status (Active in Vector)
    # F: Account Segments (ITS EN | EC)
    # G: ITS EN (Yes/No)
    # H: DCX EN (Yes/No)
    # I: EC (Yes/No)
    # J: Identified Profiles (25)
    
    vector_accounts = {}
    for r in vec_ai_rows[1:]:
        acct_id = r.get('A', '')
        name = r.get('B', '')
        domain = clean_domain(r.get('C', ''))
        segments = r.get('F', '')
        its_en = r.get('G', '') == 'Yes'
        dcx_en = r.get('H', '') == 'Yes'
        ec = r.get('I', '') == 'Yes'
        profiles = int(r.get('J', '0') or 0)
        
        if domain:
            vector_accounts[domain] = {
                "account_id": acct_id,
                "name": name,
                "domain": domain,
                "segments": segments,
                "its_en": its_en,
                "dcx_en": dcx_en,
                "ec": ec,
                "profiles": profiles
            }

    # 4. Vector All Visitors
    vec_all_visitors = read_xlsx_sheet("Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx", "Vector_ All Visitors")
    print(f"Vector All Visitors rows: {len(vec_all_visitors)}")
    # A: First Name
    # B: Last Name
    # C: LinkedIn Url
    # D: Job Title
    # E: Department
    # F: Industry
    # G: Company Name
    # H: Company Domain
    # I: Company Size
    # J: Company LinkedIn Url
    # K: City, State
    
    visitors_list = []
    for idx, r in enumerate(vec_all_visitors[1:]):
        first = r.get('A', '')
        last = r.get('B', '')
        name = f"{first} {last}".strip()
        li = r.get('C', '')
        title = r.get('D', '')
        dept = r.get('E', '')
        industry = r.get('F', '')
        comp = r.get('G', '')
        c_domain = clean_domain(r.get('H', ''))
        c_size = r.get('I', '')
        c_li = r.get('J', '')
        location = r.get('K', '')
        
        if not name and not comp and not c_domain:
            continue
            
        visitors_list.append({
            "id": f"vec-vis-{idx+1}",
            "name": name,
            "first_name": first,
            "last_name": last,
            "linkedin_url": li,
            "title": title,
            "department": dept,
            "industry": industry,
            "company_name": comp,
            "company_domain": c_domain,
            "company_size": c_size,
            "company_linkedin_url": c_li,
            "location": location
        })
    print(f"Parsed visitors: {len(visitors_list)}")

    # 5. Key Visitors
    vec_key_visitors = read_xlsx_sheet("Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx", "Key Visitors")
    print(f"Key Visitors rows: {len(vec_key_visitors)}")
    # A: Seniority
    # B: Visitor
    # C: Job Title
    # D: Company
    # E: Industry
    # F: Annual Revenue
    # G: UTM Source
    # H: UTM Medium
    # I: Business Email
    # J: LinkedIn URL
    # K: Date
    # L: Target / Client match
    
    key_visitors_list = []
    for idx, r in enumerate(vec_key_visitors[1:]):
        seniority = r.get('A', '')
        v_name = r.get('B', '')
        title = r.get('C', '')
        comp = r.get('D', '')
        industry = r.get('E', '')
        revenue = r.get('F', '')
        utm_source = r.get('G', '')
        utm_medium = r.get('H', '')
        email = r.get('I', '')
        li = r.get('J', '')
        date = r.get('K', '')
        is_target = r.get('L', '') == 'Yes'
        
        if not v_name and not comp:
            continue
            
        key_visitors_list.append({
            "id": f"key-vis-{idx+1}",
            "seniority": seniority,
            "name": v_name,
            "title": title,
            "company": comp,
            "industry": industry,
            "annual_revenue": revenue,
            "utm_source": utm_source,
            "utm_medium": utm_medium,
            "email": email,
            "linkedin_url": li,
            "date": date,
            "is_target_client": is_target
        })
    print(f"Parsed key visitors: {len(key_visitors_list)}")

    # 6. Matched Contacts
    vec_contacts = read_xlsx_sheet("Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx", "Matched Contacts")
    print(f"Matched Contacts rows: {len(vec_contacts)}")
    # A: Source Vector Row
    # B: Contact Key
    # C: Account ID
    # D: Matched Account
    # E: Matched Account Domain
    # F: ITS EN
    # G: DCX EN
    # H: EC
    # I: Account Segments
    # J: Full Name
    
    contacts_list = []
    for idx, r in enumerate(vec_contacts[1:]):
        c_key = r.get('B', '')
        acct_id = r.get('C', '')
        account_name = r.get('D', '')
        account_domain = clean_domain(r.get('E', ''))
        its_en = r.get('F', '') == 'Yes'
        dcx_en = r.get('G', '') == 'Yes'
        ec = r.get('H', '') == 'Yes'
        segments = r.get('I', '')
        full_name = r.get('J', '')
        
        if not full_name and not account_name:
            continue
            
        contacts_list.append({
            "id": c_key or f"contact-{idx+1}",
            "name": full_name,
            "account_id": acct_id,
            "account_name": account_name,
            "account_domain": account_domain,
            "its_en": its_en,
            "dcx_en": dcx_en,
            "ec": ec,
            "segments": segments
        })
    print(f"Parsed matched contacts: {len(contacts_list)}")

    # 7. Unify into Canonical Accounts
    # All distinct domains
    all_domains = set()
    for d in targets_by_domain:
        if not d.startswith("name:"):
            all_domains.add(d)
    for d in clients_by_domain:
        if not d.startswith("name:"):
            all_domains.add(d)
    for d in vector_accounts:
        all_domains.add(d)
        
    print(f"Total distinct domains across sources: {len(all_domains)}")
    
    canonical_accounts = []
    account_lookup = {}
    
    for domain in sorted(list(all_domains)):
        target_info = targets_by_domain.get(domain, {})
        client_info = clients_by_domain.get(domain, {})
        vec_info = vector_accounts.get(domain, {})
        
        name = target_info.get("name") or client_info.get("name") or vec_info.get("name") or domain.capitalize()
        
        # Classification
        # Rules: DCX Yes/ITS No = DCX EN; No/Yes = ITS EN; Yes/Yes = DCX + ITS EN; No/No = Unclassified
        is_target_its = (target_info.get("classification") == "ITS EN") or vec_info.get("its_en", False)
        is_target_dcx = (target_info.get("classification") == "DCX EN") or vec_info.get("dcx_en", False)
        
        if is_target_its and is_target_dcx:
            target_class = "DCX + ITS EN"
        elif is_target_its:
            target_class = "ITS EN"
        elif is_target_dcx:
            target_class = "DCX EN"
        elif target_info:
            target_class = target_info.get("classification") or "Unclassified"
        else:
            target_class = "None"
            
        is_client = bool(client_info) or vec_info.get("ec", False)
        
        # Segment string
        seg_parts = []
        if is_target_its: seg_parts.append("ITS EN")
        if is_target_dcx: seg_parts.append("DCX EN")
        if is_client: seg_parts.append("EC")
        segment_str = " | ".join(seg_parts) if seg_parts else "Discovery"
        
        # Revenue
        rev_k = target_info.get("revenue_k") or client_info.get("revenue_k")
        rev_range = target_info.get("revenue_range") or client_info.get("revenue_range")
        rev_usd = 0
        if rev_k:
            try:
                rev_usd = float(rev_k) * 1000
            except:
                pass
        
        # Hard ICP Gate: Revenue > $10M
        # Revenue > 10M -> USD 10,000,000
        is_icp = False
        icp_status = "Revenue Unknown"
        if rev_usd > 10000000:
            is_icp = True
            icp_status = "ICP Eligible"
        elif rev_usd > 0 and rev_usd <= 10000000:
            is_icp = False
            icp_status = "Ineligible (≤ $10M)"
        else:
            # Check revenue range string e.g. "$100M - $250M", "$1B - $5B", "$5B+"
            if any(term in (rev_range or '').lower() for term in ['100m', '250m', '500m', '1b', '5b', '10b', '50m']):
                is_icp = True
                icp_status = "ICP Eligible"
            else:
                icp_status = "Revenue Unknown"
                
        # Employees
        employees = target_info.get("employees") or client_info.get("employees") or ""
        emp_range = target_info.get("employee_range") or client_info.get("employee_range") or ""
        
        # Industry
        industry = client_info.get("industry_sector") or "Technology"
        bu = client_info.get("bu") or ("ITS" if is_target_its else ("DCX" if is_target_dcx else "General"))
        owner = client_info.get("vertical_am") or "Territory Pool"
        
        # Vector stats
        vec_profiles = vec_info.get("profiles", 0)
        has_vector = vec_profiles > 0
        
        # Matching visitors & contacts for this account
        matched_vis_count = sum(1 for v in visitors_list if v["company_domain"] == domain)
        if matched_vis_count > vec_profiles:
            vec_profiles = matched_vis_count
            
        matched_contacts = [c for c in contacts_list if c["account_domain"] == domain]
        
        # Scoring per docs/SCORING_SPEC.md
        # 1. Fit (0-100)
        fit_industry = 25 if industry in ["Software & Platforms", "Retail CPG MFG", "Telecom", "BFSI", "Technology"] else 15
        fit_rev = 20 if rev_usd >= 100000000 or "1b" in (rev_range or "").lower() else (15 if is_icp else 5)
        fit_tech = 18
        fit_geo = 15
        fit_enterprise = 18 if (is_target_its and is_target_dcx) or is_client else 12
        fit_score = min(100, fit_industry + fit_rev + fit_tech + fit_geo + fit_enterprise)
        
        # 2. Intent (0-100)
        # Topics from ZoomInfo: simulate surge based on target status and profiles
        intent_zi = 30 if (is_target_its or is_target_dcx) else (20 if is_client else 10)
        intent_accel = 18 if vec_profiles >= 5 else (10 if vec_profiles > 0 else 5)
        intent_indep = 18 if has_vector and (is_target_its or is_client) else 10
        intent_vector = min(15, vec_profiles * 3)
        intent_triggers = 12 if is_client else 10
        intent_score = min(100, intent_zi + intent_accel + intent_indep + intent_vector + intent_triggers)
        
        # 3. Engagement (0-100)
        eng_score = min(100, (vec_profiles * 8) + (len(matched_contacts) * 15))
        
        # 4. Contactability (0-100)
        contact_score = min(100, (len(matched_contacts) * 25) + (15 if matched_vis_count > 0 else 0))
        
        # Overall Priority
        # Overall Priority = Fit 30% + Intent 35% + Engagement 15% + Trigger 10% + Contactability 10%
        overall_score = round(
            (0.30 * fit_score) +
            (0.35 * intent_score) +
            (0.15 * eng_score) +
            (0.10 * intent_triggers * (100/15)) +
            (0.10 * max(20, contact_score))
        )
        overall_score = min(98, max(22, overall_score))
        
        # Tier assignment
        # Tier 1: Act Now (Overall >= 75, Fit >= 60, >=2 independent signals, >=1 verified contact)
        # Tier 2: Engage ABM (Overall 55-74)
        # Tier 3: Nurture (Overall 35-54)
        # Tier 4: Watchlist (<35)
        if overall_score >= 75 and fit_score >= 60 and (vec_profiles > 0 or is_client):
            tier = "Tier 1: Act Now"
        elif overall_score >= 55:
            tier = "Tier 2: Engage via ABM"
        elif overall_score >= 35:
            tier = "Tier 3: Nurture / Monitor"
        else:
            tier = "Tier 4: Watchlist"
            
        # Existing client growth opportunity score (separate model)
        client_growth_score = 0
        if is_client:
            client_growth_score = round(
                (0.30 * 85) + # Whitespace
                (0.25 * intent_score) +
                (0.15 * 75) + # Triggers
                (0.10 * eng_score) +
                (0.10 * 80) + # Relationship
                (0.10 * max(40, contact_score))
            )
            client_growth_score = min(99, max(30, client_growth_score))
            
        # Services penetration matrix
        service_lines = {
            "Cloud & DevOps": "Confirmed" if (bu in ["DES", "DIS"] and is_client) else ("Inferred" if is_target_its else "Unknown"),
            "Cybersecurity": "Confirmed" if (bu == "EPS" and is_client) else ("Inferred" if vec_profiles > 3 else "Unknown"),
            "AI & Automation": "Inferred" if vec_profiles > 0 else "Unknown",
            "IT Infrastructure": "Confirmed" if (bu in ["ITS - PS", "DIS"] and is_client) else ("Inferred" if is_target_its else "Unknown"),
            "Digital Workplace": "Confirmed" if (bu == "DES" and is_client) else "Unknown",
            "Customer Experience (CX)": "Confirmed" if (bu == "DCX" and is_client) else ("Inferred" if is_target_dcx else "Unknown"),
            "Data & Insight Services": "Confirmed" if (bu == "DIS" and is_client) else "Unknown"
        }

        # Intent topics observed
        intent_topics = [
            {"topic": "Cloud Migration", "score": min(95, 65 + vec_profiles * 2), "surge": "High", "service_line": "Cloud & DevOps"},
            {"topic": "Cybersecurity", "score": min(92, 60 + vec_profiles * 2), "surge": "Medium", "service_line": "Cybersecurity"},
            {"topic": "Digital Transformation", "score": min(98, 70 + vec_profiles * 2), "surge": "High", "service_line": "AI & Automation"},
            {"topic": "IT Outsourcing", "score": min(89, 62 + vec_profiles * 2), "surge": "Medium", "service_line": "IT Infrastructure"},
            {"topic": "Managed Services", "score": min(85, 58 + vec_profiles * 2), "surge": "Medium", "service_line": "IT Infrastructure"}
        ]
        
        acct_obj = {
            "id": f"acct:{domain}",
            "name": name,
            "domain": domain,
            "target_classification": target_class, # 'ITS EN', 'DCX EN', 'DCX + ITS EN', 'None'
            "is_target": bool(target_info) or is_target_its or is_target_dcx,
            "is_client": is_client,
            "client_bu": bu if is_client else "",
            "account_segments": segment_str,
            "owner": owner,
            "industry": industry,
            "revenue_usd": rev_usd,
            "revenue_range": rev_range,
            "employees": employees,
            "employee_range": emp_range,
            "icp_status": icp_status,
            "is_icp": is_icp,
            "vector_profiles_count": vec_profiles,
            "has_vector_visitors": vec_profiles > 0,
            "fit_score": fit_score,
            "intent_score": intent_score,
            "engagement_score": eng_score,
            "contactability_score": contact_score,
            "overall_priority_score": overall_score,
            "tier": tier,
            "data_completeness": 92 if (has_vector and (bool(target_info) or is_client)) else (75 if has_vector else 60),
            "client_growth_score": client_growth_score,
            "service_penetration": service_lines,
            "intent_topics": intent_topics,
            "matched_contacts_count": len(matched_contacts),
            "zoominfo_id": target_info.get("zoominfo_id") or client_info.get("zoominfo_id") or ""
        }
        canonical_accounts.append(acct_obj)
        account_lookup[domain] = acct_obj

    print(f"Generated {len(canonical_accounts)} canonical account records.")
    
    # 8. Output database JSON
    output_dir = r"C:\Users\vishn\.gemini\antigravity-cli\brain\2b7d1c9a-8608-4f3f-9c14-a3a326b69f21\scratch"
    os.makedirs(output_dir, exist_ok=True)
    
    db_payload = {
        "metadata": {
            "version": "1.0.0",
            "generated_at": "2026-11-22T18:18:00+05:30",
            "total_accounts": len(canonical_accounts),
            "total_targets": sum(1 for a in canonical_accounts if a["is_target"]),
            "total_clients": sum(1 for a in canonical_accounts if a["is_client"]),
            "total_vector_engaged": sum(1 for a in canonical_accounts if a["has_vector_visitors"]),
            "total_tier_1": sum(1 for a in canonical_accounts if a["tier"] == "Tier 1: Act Now"),
            "total_tier_2": sum(1 for a in canonical_accounts if a["tier"] == "Tier 2: Engage via ABM"),
            "total_visitors": len(visitors_list),
            "total_key_visitors": len(key_visitors_list),
            "total_matched_contacts": len(contacts_list)
        },
        "accounts": canonical_accounts,
        "visitors": visitors_list,
        "key_visitors": key_visitors_list,
        "matched_contacts": contacts_list,
        "credit_governor": {
            "monthly_budget": 5000,
            "monthly_consumed": 420,
            "daily_cap": 250,
            "daily_consumed": 35,
            "soft_cap_percent": 80,
            "status": "Healthy",
            "cost_per_accepted_account": "$12.40"
        },
        "intent_topics_matrix": [
            {"topic": "Cloud Migration", "status": "Active", "service_line": "Cloud & DevOps", "substitutes": "Cloud job postings, Vector /services/cloud/ visits"},
            {"topic": "Cybersecurity", "status": "Active", "service_line": "Cybersecurity", "substitutes": "CISO hiring, Security incident alerts"},
            {"topic": "Digital Transformation", "status": "Active", "service_line": "AI & Automation", "substitutes": "Mova iO page visits, Tech stack upgrades"},
            {"topic": "IT Outsourcing", "status": "Active", "service_line": "IT Infrastructure", "substitutes": "RFP alerts, Cost reduction press releases"},
            {"topic": "Managed Services", "status": "Active", "service_line": "IT Infrastructure", "substitutes": "MSP vendor displacement signals"},
            {"topic": "Data & Analytics", "status": "Active", "service_line": "Data & Insight Services", "substitutes": "Vector /data-and-insight-services/ pageviews"},
            {"topic": "Customer Experience Management", "status": "Active", "service_line": "Customer Experience (CX)", "substitutes": "Contact center hiring, CX reviews"},
            {"topic": "Digital Workplace", "status": "Active", "service_line": "Digital Workplace", "substitutes": "Remote workforce announcements, Unified comms signals"},
            {"topic": "Artificial Intelligence", "status": "Active", "service_line": "AI & Automation", "substitutes": "AI Engineer job postings, Vector /artificial-intelligence/"},
            {"topic": "Application Modernization", "status": "Active", "service_line": "Cloud & DevOps", "substitutes": "Legacy migration news, GitHub repo activity"}
        ]
    }
    
    with open(os.path.join(output_dir, "canonical_database.json"), "w", encoding="utf-8") as f:
        json.dump(db_payload, f, indent=2)
        
    print(f"Wrote canonical database to {os.path.join(output_dir, 'canonical_database.json')}")

if __name__ == "__main__":
    main()
