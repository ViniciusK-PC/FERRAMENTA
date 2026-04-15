import re
import json

def extract_api_paths(filepath):
    try:
        content = open(filepath, 'r', encoding='utf-8').read()
        # Find strings starting with /api/ or /v1/
        paths = re.findall(r'"(/[a-zA-Z0-9_/.-]+)"', content)
        apipaths = [p for p in paths if '/api/' in p or '/v1/' in p or '/index/' in p]
        
        # Find tRPC procedures like "user.getProfile"
        # tRPC procedures are usually object.method
        procedures = re.findall(r'"([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)"', content)
        # Filter for likely procedures (avoid domains, filenames)
        filtered_procs = [p for p in procedures if '.' in p and not any(p.endswith(ext) for ext in ['.js','.css','.png','.jpg','.svg','.map'])]
        
        return {
            "paths": sorted(list(set(apipaths))),
            "procedures": sorted(list(set(filtered_procs)))
        }
    except Exception as e:
        return {"error": str(e)}

js_files = ['generated_site/assets/index-Bw2DDPhx.js']
all_paths = {}
for f in js_files:
    all_paths[f] = extract_api_paths(f)

print(json.dumps(all_paths, indent=2))
