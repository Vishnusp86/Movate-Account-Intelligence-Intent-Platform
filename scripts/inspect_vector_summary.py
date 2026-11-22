import zipfile
import xml.etree.ElementTree as ET

def parse_cell(c, ss):
    t = c.attrib.get('t')
    ref = c.attrib.get('r', '')
    # Check for direct value
    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
    # Check for inline string
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
    return ref, val

def inspect_vector_summary():
    filename = "Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx"
    with zipfile.ZipFile(filename, "r") as z:
        ss = []
        if "xl/sharedStrings.xml" in z.namelist():
            tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                texts = [t.text for t in si.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t") if t.text]
                ss.append("".join(texts))
        
        wb_tree = ET.fromstring(z.read("xl/workbook.xml"))
        sheets = wb_tree.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet")
        
        for idx, s in enumerate(sheets):
            sheet_name = s.attrib["name"]
            xml_name = f"xl/worksheets/sheet{idx+1}.xml"
            if xml_name not in z.namelist():
                continue
            s_tree = ET.fromstring(z.read(xml_name))
            rows = s_tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row")
            print(f"\n=======================================================")
            print(f"SHEET [{idx+1}]: {sheet_name} (Total rows: {len(rows)})")
            print(f"=======================================================")
            
            # Find first non-empty row or check first 5 rows
            for r in rows[:6]:
                row_num = r.attrib.get('r', '?')
                cells = [parse_cell(c, ss) for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')]
                cells = [(ref, val) for ref, val in cells if val]
                if cells:
                    print(f"  Row {row_num}: {cells[:10]}")

if __name__ == "__main__":
    inspect_vector_summary()
