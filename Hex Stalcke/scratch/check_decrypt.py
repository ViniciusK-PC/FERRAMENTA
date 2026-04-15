import requests

r = requests.get("http://127.0.0.1:8888/local", timeout=10)
html = r.text

print("domainInfo is encrypted blob:", '"domainInfo":"=' in html)
print("domainInfo is decrypted JSON:", '"domainInfo":{' in html)
print("tenantInfo is encrypted blob:", '"tenantInfo":"=' in html)  
print("tenantInfo is decrypted JSON:", '"tenantInfo":{' in html)
print("channelInfo is encrypted blob:", '"channelInfo":"=' in html)
print("channelInfo is decrypted JSON:", '"channelInfo":{' in html)
print("agencyConfig is encrypted blob:", '"agencyConfig":"=' in html)
print("agencyConfig is decrypted JSON:", '"agencyConfig":{' in html)
print("apiUrl points to mock:", "api/mock" in html)
print("apiUrl still points to real:", "ycyd123" in html)
