import zipfile
import xml.etree.ElementTree as ET

def analyze_file(filename):
    print("=" * 60)
    print("FILE:", filename)
    print("=" * 60)
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
            print(f"\n--- Sheet [{idx+1}]: '{sheet_name}' (Total rows: {len(rows)}) ---")
            
            for r_idx, r in enumerate(rows[:5]):
                vals = []
                for c in r.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                    t = c.attrib.get("t")
                    v = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                    if v is not None and v.text is not None:
                        if t == "s":
                            val = ss[int(v.text)] if int(v.text) < len(ss) else ""
                        else:
                            val = v.text
                    else:
                        val = ""
                    vals.append(val)
                non_empty = [v for v in vals if v.strip()]
                print(f"  Row {r_idx+1} ({len(non_empty)} cols): {non_empty[:12]}")

if __name__ == "__main__":
    for f in [
        "ZI_ITS AND DCX EN Target Companies_221126 IMP.xlsx",
        "ZI_Existing Clients - 221126 Imp.xlsx",
        "Vector_Summary_22_Nov_2026_Account_Intelligence_EN_EC (1).xlsx"
    ]:
        analyze_file(f)
