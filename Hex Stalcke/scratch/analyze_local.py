import requests, re

r = requests.get("http://127.0.0.1:8888/local", timeout=10)
html = r.text

# Check base tag
base = re.findall(r'<base[^>]+>', html)
print("Base tags:", base)

# Check body for app mount point
body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
if body_match:
    body = body_match.group(1)
    # Remove all script content
    clean = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL).strip()
    print("Body HTML (no scripts):")
    print(clean[:500] if clean else "(EMPTY - no mount point!)")
else:
    print("No body tag found!")

# Check if module scripts point correctly
modules = re.findall(r'<script[^>]*type="module"[^>]*>', html)
print("\nModule scripts:", modules)

# Test if main JS is accessible
test_url = "http://127.0.0.1:8888/assets/index-Bw2DDPhx_7896.js"
try:
    jr = requests.get(test_url, timeout=5)
    print(f"\nMain JS accessible: {jr.status_code} ({len(jr.content)//1024}KB)")
except Exception as e:
    print(f"\nMain JS FAILED: {e}")
