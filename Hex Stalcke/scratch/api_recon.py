import requests
import json
import time

TARGET_API = "https://api2.ycyd123.com"
TENANT_ID = 5199116

COMMON_ENDPOINTS = [
    "/api/v1/domain/info",
    "/api/v1/config/site",
    "/api/v1/user/check-login",
    "/api/v1/auth/login",
    "/api/v1/system/health",
    "/index/info/domainInfo",
    "/api/v1/tenant/config",
    "/api/admin/login",
    "/api/manage/login"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "X-Device-Type": "web",
    "X-Request-Source": "main",
    "X-Client-Version": "1.0.0"
}

def scan_api():
    print(f"[*] Starting API Recon on {TARGET_API}")
    results = []
    
    for ep in COMMON_ENDPOINTS:
        url = f"{TARGET_API}{ep}"
        try:
            # Try with TenantID if possible as a parameter or header
            params = {"tenantId": TENANT_ID}
            resp = requests.get(url, headers=HEADERS, params=params, timeout=10)
            
            status = resp.status_code
            size = len(resp.content)
            
            print(f"[{status}] {ep} (Size: {size})")
            
            if status == 200:
                try:
                    data = resp.json()
                    results.append({"path": ep, "data": data})
                    print(f"  [!] Found interesting data in {ep}")
                except:
                    results.append({"path": ep, "raw": resp.text[:200]})
        except Exception as e:
            print(f"[ERROR] {ep}: {str(e)}")
            
        time.sleep(1) # Stealth

    # Save findings
    with open("scratch/api_recon_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    scan_api()
