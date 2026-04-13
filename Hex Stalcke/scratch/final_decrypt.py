import base64
import urllib.parse
import json

def decrypt_platform_blob(blob):
    if not blob or not isinstance(blob, str):
        return None
    try:
        # 1. Reverse the string
        # Handle the leading '=' - in the JS, it's just part of the string.
        # But wait, usually the '=' is at the end. 
        # If it's at the start, when reversed it will be at the end.
        reversed_blob = blob[::-1]
        
        # 2. Base64 decode
        # Need to fix padding just in case
        missing_padding = len(reversed_blob) % 4
        if missing_padding:
            reversed_blob += '=' * (4 - missing_padding)
            
        decoded_bytes = base64.b64decode(reversed_blob)
        
        # 3. URL decode
        decoded_str = decoded_bytes.decode('utf-8')
        url_decoded = urllib.parse.unquote(decoded_str)
        
        # 4. JSON parse
        return json.loads(url_decoded)
    except Exception as e:
        return f"Error: {e}"

# The full blob provided by the user
blob = "=Q0NlQ0NlQ0NlQ0NlIjMlkmZwlXRah1T1IUM5RWT3FEeadjSyYjeWhEOGF1SxJjaBVXONRHWzw2YGJTJPB3dIRTTIh2RPV0YBJkMl00aSlVSxMnU3tWSQBjTVhXVntmVIpXVvpEUL5mM4J0bhFla29mNBVHNWF3bBNXTzkkWzkGU0JEOFZTTGJTJv1WRpRVSBJUVyYWO2kmQyUScXdjT5oHSGB1SUVWQWdHOq9UOxpGRn5kRyUyaLRVWKNkb4IHWtxEdpJXUGJTJMhmewl2VQJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw"

result = decrypt_platform_blob(blob)
print(json.dumps(result, indent=2))
