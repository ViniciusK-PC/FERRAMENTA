import base64

data = "=Q0NlQ0NlQ0NlQ0NlIjMlkmZwlXRah1T1IUM5RWT3FEeadjSyYjeWhEOGF1SxJjaBVXONRHWzw2YGJTJPB3dIRTTIh2RPV0YBJkMl00aSlVSxMnU3tWSQBjTVhXVntmVIpXVvpEUL5mM4J0bhFla29mNBVHNWF3bBNXTzkkWzkGU0JEOFZTTGJTJv1WRpRVSBJUVyYWO2kmQyUScXdjT5oHSGB1SUVWQWdHOq9UOxpGRn5kRyUyaLRVWKNkb4IHWtxEdpJXUGJTJMhmewl2VQJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw"

# Try simple character replacement if it's not base64
# But wait, Base64 is more likely.
# Let's try ATBASH on the decoded characters.
try:
    decoded = base64.b64decode(data.lstrip('=') + "==")
    
    # ATBASH for bytes
    atbash = bytes([255 - b for b in decoded])
    print("ATBASH decoded (first 100):")
    print("".join([chr(b) if 32 <= b <= 126 else "." for b in atbash])[:100])
    
    # Simple Shift
    for s in range(1, 10):
        shifted = bytes([(b + s) % 256 for b in decoded])
        res = "".join([chr(b) if 32 <= b <= 126 else "." for b in shifted])
        if "http" in res or "domain" in res:
             print(f"Shift {s} found potential keyword!")
             print(res[:100])
except:
     pass
