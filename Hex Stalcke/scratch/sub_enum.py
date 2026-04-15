import requests
import socket

domain = "ycyd123.com"
subs = ["api", "api2", "api-br", "admin", "manage", "m", "v1", "test", "dev", "upload", "static", "img", "cdn"]

print(f"[*] Enumerating subdomains for {domain}")
for s in subs:
    target = f"{s}.{domain}"
    try:
        ip = socket.gethostbyname(target)
        print(f"[+] Found: {target} ({ip})")
        # Check if it's reachable via HTTP
        h = {"User-Agent": "Mozilla/5.0"}
        try:
            r = requests.get(f"https://{target}", headers=h, timeout=5)
            print(f"    - HTTP Support: {r.status_code}")
        except:
            print(f"    - HTTP Support: No")
    except:
        pass
