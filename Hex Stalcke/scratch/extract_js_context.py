import re

def find_context(file_path, pattern, context_size=500):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(pattern, content)
            if match:
                start = max(0, match.start() - context_size)
                end = min(len(content), match.end() + context_size)
                print(f"Match found at index {match.start()}")
                print("Context:")
                print(content[start:end])
            else:
                print("No match found.")
    except Exception as e:
        print(f"Error: {e}")

file_path = r'c:\Users\VINI DEV\Desktop\FERRAMENTA\Hex Stalcke\generated_site\assets\index-Bw2DDPhx.js'
find_context(file_path, r'domainInfo')
