import re
import os
import urllib.parse

filepath = r"c:\Users\VINI DEV\Desktop\FERRAMENTA\Hex Stalcke\generated_site\assets\index-Bw2DDPhx.js"

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's decode unicode escapes \xXX or \uXXXX just for searching
decoded_content = content.encode('utf-8').decode('unicode_escape', errors='ignore')

targets = ['__APP_CONFIG__', 'domainInfo', 'APP_CONFIG', 'reverse', 'parse']
results = []

for target in targets:
    # Find all occurrences of target
    positions = [m.start() for m in re.finditer(re.escape(target), decoded_content, re.IGNORECASE)]
    if positions:
        print(f"Found {target} at {len(positions)} locations.")
        # Only print first occurrence context
        pos = positions[0]
        start = max(0, pos - 200)
        end = min(len(decoded_content), pos + 200)
        print(f"Context for '{target}':\n{decoded_content[start:end]}\n{'-'*50}")
    else:
        print(f"Target '{target}' NOT found anywhere.")

