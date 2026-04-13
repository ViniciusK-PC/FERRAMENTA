#!/usr/bin/env python3
import requests
import argparse
from urllib.parse import urljoin
import sys

# Color codes (using unified Hex Stalcke reddish theme)
HACKER_RED = "\033[38;5;196m"
BRIGHT_WHITE = "\033[97m"
TERMINAL_GRAY = "\033[38;5;240m"
RESET = "\033[0m"

default_dir = [
    "/admin", "/login", "/dashboard", "/wp-admin", "/administrator",
    "/backup", "/config", "/config.php", "/.env", "/phpinfo.php",
    "/images", "/uploads", "/files", "/assets", "/static",
    "/robots.txt", "/sitemap.xml", "/.git", "/.htaccess",
    "/server-status", "/api", "/v1", "/admin.php", "/panel", "/phpmyadmin"
]

def main():
    parser = argparse.ArgumentParser(description="Hex Scanner - Directory Discovery Module")
    parser.add_argument("url", help="Target URL (ex: http://example.com)")
    parser.add_argument("-w", "--wordlist", help="Custom wordlist")
    parser.add_argument("-t", "--timeout", type=int, default=5, help="Timeout in seconds")
    args = parser.parse_args()

    base_url = args.url.rstrip('/')
    if not base_url.startswith('http'):
        base_url = 'http://' + base_url

    if args.wordlist:
        try:
            with open(args.wordlist, 'r', encoding='utf-8') as f:
                paths = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            print(f"{TERMINAL_GRAY}[INFO] Using custom wordlist: {args.wordlist} ({len(paths)} paths){RESET}")
        except FileNotFoundError:
            print(f"{HACKER_RED}[ERROR] Wordlist '{args.wordlist}' not found!{RESET}")
            return
    else:
        paths = default_dir
        print(f"{TERMINAL_GRAY}[INFO] Using {len(paths)} built-in discovery paths{RESET}")

    print(f"{BRIGHT_WHITE}[+] Scanning Target: {base_url}{RESET}")
    print(f"{'STATUS':<8} {'SIZE':<7} | URL")
    print(f"{BRIGHT_WHITE}┌{'─'*70}┐{RESET}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (HexStalcke; ReconBot/1.0)'
    }

    count = 0

    for path in paths:
        if not path.startswith('/'):
            path = '/' + path

        full_url = urljoin(base_url + '/', path)

        try:
            resp = requests.get(
                full_url,
                timeout=args.timeout,
                allow_redirects=False,
                headers=headers
            )

            # Highlighting interesting status codes
            if resp.status_code in [200, 301, 302, 403]:
                color = HACKER_RED if resp.status_code == 200 else TERMINAL_GRAY
                tamanho = len(resp.content)
                print(f"│ {color}{resp.status_code:<8}{tamanho:<7}{RESET} │ {full_url}")
                count += 1

        except requests.exceptions.RequestException:
            continue  

    print(f"{BRIGHT_WHITE}└{'─'*70}┘{RESET}")
    print(f"\n{BRIGHT_WHITE}[+] Mission Completed! Found ({count}) sensitive entry points.{RESET}")

if __name__ == "__main__":
    main()
