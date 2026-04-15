import re, os

html_path = r"c:\Users\VINI DEV\Desktop\FERRAMENTA\Hex Stalcke\generated_site\index.html"
assets_dir = r"c:\Users\VINI DEV\Desktop\FERRAMENTA\Hex Stalcke\generated_site\assets"

with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Find all asset references
refs = re.findall(r'(?:src|href)="(assets/[^"]+)"', html)
actual_files = set(os.listdir(assets_dir))

print("=== Asset References in HTML ===")
for ref in refs:
    fname = ref.replace("assets/", "")
    exists = fname in actual_files
    status = "OK" if exists else "MISSING!"
    print(f"  {status:8s} {ref}")

print(f"\n=== Files on disk NOT referenced ===")
referenced = set(r.replace("assets/", "") for r in refs)
for f in sorted(actual_files):
    if f not in referenced:
        print(f"  EXTRA    assets/{f}")
