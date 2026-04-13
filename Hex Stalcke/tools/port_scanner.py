#!/usr/bin/env python3
import socket
import argparse
import sys

# Color codes (Hex Stalcke Theme)
HACKER_RED = "\033[31m"
HACKER_GREEN = "\033[32m"
BRIGHT_WHITE = "\033[1;37m"
RESET = "\033[0m"

PORTS = [21, 22, 23, 25, 53, 80, 111, 135, 139, 443, 3389, 8080, 8443]

def scan(ip: str) -> None:
    print(f"{BRIGHT_WHITE}[+] Iniciando varredura rápida de portas em: {ip}{RESET}")
    count = 0
    
    # Header formatado para o Terminal do Núcleo
    print(f"{BRIGHT_WHITE}┌{'─'*35}┐{RESET}")
    print(f"{BRIGHT_WHITE}│ {HACKER_RED}PORTA{RESET}    {HACKER_RED}ESTADO{RESET}          {HACKER_RED}PROTO{RESET}    {BRIGHT_WHITE}│{RESET}")
    
    for port in PORTS:
        try:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.settimeout(0.2)
            code = client.connect_ex((ip, port))
            
            if code == 0:
                service = "Unknown"
                try:
                    service = socket.getservbyport(port)
                except:
                    pass
                
                print(f"{BRIGHT_WHITE}│ {port:<8} {HACKER_GREEN}OPEN{RESET}            {service:<8} {BRIGHT_WHITE}│{RESET}")
                count += 1
            client.close()
        except:
            continue
            
    print(f"{BRIGHT_WHITE}└{'─'*35}┘{RESET}")
    print(f"\n{BRIGHT_WHITE}[+] Varredura concluída! {HACKER_GREEN}{count}{RESET} portas abertas encontradas.{RESET}")

def main() -> None:
    parser = argparse.ArgumentParser(description="Hex Port Scanner - Fast Recon Module")
    parser.add_argument("target", help="Target IP or Domain")
    args = parser.parse_args()

    target = args.target
    # Remove protocol if present
    if '://' in target:
        target = target.split('://')[1].split('/')[0]
    
    try:
        # Resolva o domínio para IP se necessário
        ip = socket.gethostbyname(target)
        scan(ip)
    except socket.gaierror:
        print(f"{HACKER_RED}[!] Erro: Não foi possível resolver o host {target}{RESET}")
    except Exception as e:
        print(f"{HACKER_RED}[!] Erro inesperado: {str(e)}{RESET}")

if __name__ == '__main__':
    main()
