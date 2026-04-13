#!/usr/bin/env python3
"""
Hex Stalcke Frontend Generator - Intelligence Module
Clones a target website: downloads HTML, CSS, JS, images and reconstructs locally.
"""
import sys
import io

# Force UTF-8 stdout/stderr on Windows to avoid UnicodeEncodeError with emojis
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
import argparse
import json
import requests
from bs4 import BeautifulSoup
import os
import re
import shutil
from urllib.parse import urljoin, urlparse

# Color codes (terminal mode only)
RED     = "\033[1;31m"
GREEN   = "\033[1;32m"
YELLOW  = "\033[1;33m"
WHITE   = "\033[1;37m"
CYAN    = "\033[1;36m"
RESET   = "\033[0m"


def log(message, json_mode=False):
    """Print to stderr when in json_mode so stdout stays clean for JSON"""
    if json_mode:
        print(message, file=sys.stderr)
    else:
        print(message)


def generate_frontend(url, json_mode=False):
    """Clones the website at URL: downloads all assets and saves locally."""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        output_dir = os.path.join(base_dir, "..", "generated_site")
        assets_dir = os.path.join(output_dir, "assets")

        # Clean previous clone
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        os.makedirs(assets_dir)

        log(f"{CYAN}[*] Iniciando Clonagem Avançada de: {url}{RESET}", json_mode)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        }

        response = requests.get(url, headers=headers, timeout=20, allow_redirects=True)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        title = soup.title.string.strip() if soup.title and soup.title.string else "Site Clonado"
        downloaded_count = 0

        # --- Download and localize all assets ---
        tags_to_fix = [
            ('img', 'src'),
            ('link', 'href'),
            ('script', 'src'),
            ('source', 'src'),
            ('video', 'src'),
            ('video', 'poster'),
            ('audio', 'src'),
            ('input', 'src'),  # image inputs
        ]

        log(f"{YELLOW}[*] Baixando recursos (CSS, JS, imagens)...{RESET}", json_mode)

        for tag_name, attr in tags_to_fix:
            for tag in soup.find_all(tag_name, **{attr: True}):
                original_url = tag[attr]
                if not original_url or original_url.startswith('data:'):
                    continue

                full_asset_url = urljoin(url, original_url)
                parsed = urlparse(full_asset_url)
                asset_name = os.path.basename(parsed.path)

                if not asset_name or asset_name == '/':
                    # Generate a name from the hash
                    ext = ".css" if tag_name == "link" else ".js" if tag_name == "script" else ".dat"
                    asset_name = f"resource_{abs(hash(full_asset_url))}{ext}"

                # Sanitize
                asset_name = re.sub(r'[^\w\.\-]', '_', asset_name)
                # Avoid collisions
                if os.path.exists(os.path.join(assets_dir, asset_name)):
                    name, ext = os.path.splitext(asset_name)
                    asset_name = f"{name}_{abs(hash(full_asset_url)) % 9999}{ext}"

                local_path = os.path.join(assets_dir, asset_name)

                try:
                    asset_res = requests.get(full_asset_url, headers=headers, timeout=10)
                    if asset_res.status_code == 200:
                        with open(local_path, 'wb') as f:
                            f.write(asset_res.content)
                        tag[attr] = f"assets/{asset_name}"
                        downloaded_count += 1
                except Exception:
                    # Keep original URL on failure
                    continue

        # --- Also handle inline CSS background-image URLs in <style> tags ---
        for style_tag in soup.find_all('style'):
            if style_tag.string:
                css_text = style_tag.string
                urls_in_css = re.findall(r'url\(["\']?(https?://[^"\')\s]+)["\']?\)', css_text)
                for css_url in urls_in_css:
                    asset_name = os.path.basename(urlparse(css_url).path)
                    if not asset_name:
                        asset_name = f"bg_{abs(hash(css_url)) % 99999}.png"
                    asset_name = re.sub(r'[^\w\.\-]', '_', asset_name)
                    local_path = os.path.join(assets_dir, asset_name)
                    try:
                        r = requests.get(css_url, headers=headers, timeout=10)
                        if r.status_code == 200:
                            with open(local_path, 'wb') as f:
                                f.write(r.content)
                            css_text = css_text.replace(css_url, f"assets/{asset_name}")
                            downloaded_count += 1
                    except Exception:
                        pass
                style_tag.string = css_text

        # --- Write the final HTML ---
        log(f"{YELLOW}[*] Gerando HTML final com {downloaded_count} recursos locais...{RESET}", json_mode)
        html_content = soup.prettify()

        index_path = os.path.join(output_dir, "index.html")
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        # Save the source URL for the proxy
        with open(os.path.join(output_dir, ".source_url"), "w", encoding="utf-8") as f:
            f.write(url)

        log(f"{GREEN}[+] Clonagem concluída! {downloaded_count} assets baixados.{RESET}", json_mode)
        log(f"{WHITE}[+] Saída: {os.path.abspath(output_dir)}{RESET}", json_mode)

        # Build a preview of the code (first 3000 chars)
        code_preview = html_content[:3000]

        stdout_report = (
            f"[+] Site Clonado: {url}\n"
            f"[+] Titulo: {title}\n"
            f"[+] Assets baixados: {downloaded_count}\n"
            f"[+] Local: {os.path.abspath(output_dir)}\n"
            f"\n--- [ PREVIEW DO CODIGO FONTE ] ---\n\n"
            f"{code_preview}\n\n"
            f"... (arquivo completo em generated_site/index.html)"
        )

        result = {
            "success": True,
            "title": title,
            "files": ["index.html", "assets/"],
            "url": url,
            "assets_downloaded": downloaded_count,
            "output_path": os.path.abspath(output_dir),
            "stdout": stdout_report
        }
        return result

    except Exception as e:
        log(f"{RED}[!] Erro Crítico: {str(e)}{RESET}", json_mode)
        return {"success": False, "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Hex Frontend Generator - Site Cloner")
    parser.add_argument("url", help="URL do site para clonar")
    parser.add_argument("--output", default="generated_site", help="Diretório de saída")
    parser.add_argument("--json", action="store_true", dest="json_mode",
                        help="Retorna saída em JSON estruturado (para uso pela API)")
    args = parser.parse_args()

    result = generate_frontend(args.url, json_mode=args.json_mode)

    if args.json_mode:
        # ONLY JSON goes to stdout — all other output went to stderr
        print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
