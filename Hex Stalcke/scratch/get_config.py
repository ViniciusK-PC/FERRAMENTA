import re
import base64
import urllib.parse
import json

def decrypt(t):
    if not t: return None
    try:
        rev = t[::-1]
        while len(rev) % 4 != 0: rev += '='
        dec = base64.b64decode(rev).decode('utf-8')
        return json.loads(urllib.parse.unquote(dec))
    except Exception as e:
        return str(e)

content = open('generated_site/index.html', 'r', encoding='utf-8').read()
match = re.search(r'domainInfo":"(.*?)"', content)
if match:
    blob = match.group(1)
    print(f"Blob: {blob[:50]}...")
    decoded = decrypt(blob)
    print("\nDecoded Domain Info:")
    print(json.dumps(decoded, indent=2))
else:
    print("domainInfo not found")
