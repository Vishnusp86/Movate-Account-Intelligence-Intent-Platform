import zipfile
import xml.etree.ElementTree as ET
from collections import Counter

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
    return val

def read_sheet(filename, sheet_idx=1):
    with zipfile.ZipFile(filename, "r") as z:
        ss = []
        if "xl/sharedStrings.xml" in z.namelist():
            tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                texts = [t.text for t in si.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t") if t.text]
                ss.append("".join(texts))
        
        xml_name = f"xl/worksheets/sheet{sheet_idx}.xml"
        s_tree = ET.fromstring(z.read(xml_name))
        rows = s_tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")
        
        data = []
        for r in rows:
            row_dict = {}
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                ref = c.attrib.get('r', '')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                val = parse_cell(c, ss)
                row_dict[col] = val
            data.append(row_dict)
        return data

# Analyze Target accounts
target_data = read_sheet("ZI_ITS AND DCX EN Target Companies_221126 IMP.xlsx", 1)
print(f"Target accounts total rows: {len(target_data)}")
if target_data:
    headers = target_data[0]
    print("Target Headers:", list(headers.values())[:10])
    target_classifications = Counter([r.get('B', '') for r in target_data[1:]])
    print("Target Classifications (Col B):", target_classifications)
    match_status = Counter([r.get('E', '') for r in target_data[1:]])
    print("Target Match Status (Col E):", match_status)

# Analyze Existing clients
client_data = read_sheet("ZI_Existing Clients - 221126 Imp.xlsx", 1)
print(f"\nExisting Clients total rows: {len(client_data)}")
if client_data:
    headers = client_data[0]
    print("Client Headers:", list(headers.values())[:10])
    bus = Counter([r.get('B', '') for r in client_data[1:]])
    print("Client BUs (Col B):", bus)
    sectors = Counter([r.get('D', '') for r in client_data[1:]])
    print("Client Sectors (Col D):", sectors.most_common(5))
    match_status = Counter([r.get('I', '') for r in client_data[1:]])
    print("Client Match Status (Col I):", match_status)

# Analyze Vector Account Intelligence
vec_ai_data = read_sheet("Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx", 1)
print(f"\nVector Account Intelligence total rows: {len(vec_ai_data)}")
if vec_ai_data:
    headers = vec_ai_data[0]
    print("Vector AI Headers:", list(headers.values())[:10])
    segments = Counter([r.get('F', '') for r in vec_ai_data[1:]])
    print("Vector Segments (Col F):", segments)
    its = Counter([r.get('G', '') for r in vec_ai_data[1:]])
    print("Vector ITS EN (Col G):", its)
    dcx = Counter([r.get('H', '') for r in vec_ai_data[1:]])
    print("Vector DCX EN (Col H):", dcx)
    ec = Counter([r.get('I', '') for r in vec_ai_data[1:]])
    print("Vector EC (Col I):", ec)
