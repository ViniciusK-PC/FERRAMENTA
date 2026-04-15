import re
import json

def extract_strings(filepath):
    content = open(filepath, 'r', encoding='utf-8').read()
    # Find all strings that look like headers or keys
    patterns = [
        r'"[A-Za-z0-9_-]*Token"',
        r'"[A-Za-z0-9_-]*Key"',
        r'"Authorization"',
        r'"X-[A-Za-z0-9-]*"',
        r'token\s*:\s*"([^"]+)"',
        r'apiKey\s*:\s*"([^"]+)"'
    ]
    
    found = set()
    for p in patterns:
        items = re.findall(p, content, re.IGNORECASE)
        for item in items:
            if isinstance(item, tuple):
                found.add(item[0])
            else:
                found.add(item)
                
    return list(found)

js_files = ['generated_site/assets/index-Bw2DDPhx.js']
results = {}
for h in js_files:
    results[h] = extract_strings(h)

print(json.dumps(results, indent=2))
