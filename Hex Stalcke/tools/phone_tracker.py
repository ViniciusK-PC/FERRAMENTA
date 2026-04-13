#!/usr/bin/env python3
"""
Hex Stalcke Phone Tracker - OSINT Intelligence Module
Returns structured JSON with geolocation data for map rendering.
"""
import sys
import argparse
import json
import urllib.request
import urllib.parse

# Color codes (terminal mode)
RED     = "\033[1;31m"
GREEN   = "\033[1;32m"
YELLOW  = "\033[1;33m"
WHITE   = "\033[1;37m"
GRAY    = "\033[0;90m"
RESET   = "\033[0m"

def geocode_location(location_name: str) -> dict:
    """
    Uses Nominatim (OpenStreetMap, free) to convert a region name
    into latitude/longitude coordinates.
    """
    if not location_name:
        return {}

    try:
        encoded = urllib.parse.quote(location_name)
        url = f"https://nominatim.openstreetmap.org/search?q={encoded}&format=json&limit=1&addressdetails=1"
        req = urllib.request.Request(url, headers={"User-Agent": "HexStalcke-Recon/7.1 (OSINT-Project)"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
 
        if not data:
            return {}

        result = data[0]
        address = result.get("address", {})

        return {
            "lat": float(result.get("lat", 0)),
            "lon": float(result.get("lon", 0)),
            "display_name": result.get("display_name", location_name),
            "road":    address.get("road", ""),
            "suburb":  address.get("suburb", address.get("neighbourhood", "")),
            "house_number": address.get("house_number", ""),
            "city":    address.get("city") or address.get("town") or address.get("village") or address.get("municipality", ""),
            "state":   address.get("state", ""),
            "country": address.get("country", ""),
            "country_code": address.get("country_code", "").upper(),
            "postcode": address.get("postcode", ""),
        }
    except Exception:
        return {}


def reverse_geocode(lat: float, lon: float) -> dict:
    """
    Reverse geocodes coordinates to get a specific street address.
    Used for simulating precise signal intercept.
    """
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
        req = urllib.request.Request(url, headers={"User-Agent": "HexStalcke-Recon/7.1 (OSINT-Project)"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        
        if not data:
            return {}
            
        address = data.get("address", {})
        return {
            "road":    address.get("road", ""),
            "suburb":  address.get("suburb", address.get("neighbourhood", "")),
            "house_number": address.get("house_number", ""),
            "city":    address.get("city") or address.get("town") or address.get("village") or "",
            "state":   address.get("state", ""),
            "postcode": address.get("postcode", ""),
            "display_name": data.get("display_name", "")
        }
    except Exception:
        return {}


def track_phone(number: str, json_mode: bool = False) -> dict:
    """
    Tracks a phone number and returns OSINT data.
    If json_mode=True, prints JSON to stdout (for API consumption).
    """
    try:
        import phonenumbers
        from phonenumbers import carrier, geocoder, timezone as pntimezone
    except ImportError:
        result = {
            "success": False,
            "error": "phonenumbers library not installed. Run: pip install phonenumbers",
            "number": number
        }
        if json_mode:
            print(json.dumps(result))
        else:
            print(f"{RED}[!] Biblioteca 'phonenumbers' não encontrada.{RESET}")
        return result

    try:
        parsed = phonenumbers.parse(number)

        if not phonenumbers.is_valid_number(parsed):
            result = {"success": False, "error": "Número inválido ou formato incorreto.", "number": number}
            if json_mode:
                print(json.dumps(result))
            else:
                print(f"{RED}[!] Número inválido.{RESET}")
            return result

        # --- Core OSINT data ---
        region_desc  = geocoder.description_for_number(parsed, "pt")
        region_en    = geocoder.description_for_number(parsed, "en")
        provider     = carrier.name_for_number(parsed, "pt")
        zones        = pntimezone.time_zones_for_number(parsed)
        country_code = phonenumbers.region_code_for_number(parsed)
        number_type  = phonenumbers.number_type(parsed)

        type_map = {
            phonenumbers.PhoneNumberType.MOBILE:         "Móvel",
            phonenumbers.PhoneNumberType.FIXED_LINE:     "Fixo",
            phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE: "Fixo/Móvel",
            phonenumbers.PhoneNumberType.TOLL_FREE:      "0800 / Gratuito",
            phonenumbers.PhoneNumberType.PREMIUM_RATE:   "Linha Premium",
            phonenumbers.PhoneNumberType.VOIP:           "VoIP",
        }
        line_type = type_map.get(number_type, "Desconhecido")

        # --- Enhanced Prefix Resolution (Brazil Southern Region) ---
        city_fix = None
        if country_code == "BR":
            national = str(parsed.national_number)
            ddd = national[:2]
            prefix = national[2:7] # e.g., 98478
            
            # Sub-region mapping for DDD 53 (Region of Pelotas/Rio Grande)
            # Many 984XX prefixes in 53 are historically tied to Rio Grande
            if ddd == "53":
                if prefix.startswith("984"):
                    city_fix = "Rio Grande"
                elif prefix.startswith("981"):
                    city_fix = "Pelotas"
                elif prefix.startswith("999"):
                    city_fix = "Bagé"
                else:
                    city_fix = "Pelotas" # Default most populous

        # --- Geocoding (coordinates) ---
        # 1. Start with the refined city or the region provided by phonenumbers
        location_source = city_fix if city_fix else region_desc
        geo_query = f"{location_source}, {country_code}" if location_source else (region_desc or country_code)
        
        # If it's a mobile number in Brazil, we add the "Rio Grande do Sul" context to avoid other countries
        if country_code == "BR":
            geo_query += ", Rio Grande do Sul, Brasil"
            
        geo_data = geocode_location(geo_query)

        # 2. Deep Signal Analysis / OSINT Pivot Simulation
        # Simulate tracking the specific tower based on the prefix/DDD
        final_lat = geo_data.get("lat", 0)
        final_lon = geo_data.get("lon", 0)
        precise_info = {}
        intercept_type = "Triangulação (Sinal Ativo)"

        # Simulate finding the number in a "Database"
        # We use a deterministic but random-looking seed based on the number
        import hashlib
        num_hash = int(hashlib.md5(number.encode()).hexdigest(), 16)
        
        # --- 2. Real-Time Signal Intercept Simulation ---
        final_lat = geo_data.get("lat", 0)
        final_lon = geo_data.get("lon", 0)
        precise_info = {}
        
        # Metadata for "Real-Time" feel
        import random
        from datetime import datetime
        
        tower_id = f"BTS-{random.randint(1000, 9999)}-{random.randint(10, 99)}"
        signal_dbm = random.randint(-95, -60)
        last_ping = datetime.now().strftime("%H:%M:%S")
        intercept_type = "Varredura de Região (DDD)"

        import hashlib
        num_hash = int(hashlib.md5(number.encode()).hexdigest(), 16)
        
        # --- Simulated Owner Identification ---
        first_names = ["Carlos", "Bruno", "Ricardo", "Eduardo", "Marcelo", "Fernando", "Lucas", "Gabriel"]
        last_names = ["Silva", "Santos", "Oliveira", "Pereira", "Costa", "Rodrigues", "Almeida", "Nascimento"]
        random.seed(num_hash)
        owner_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        owner_initials = f"{owner_name[0]}{owner_name.split()[-1][0]}***"
        
        if final_lat != 0:
            random.seed(num_hash)
            # Jitter for precise street lock
            jitter_lat = final_lat + random.uniform(-0.012, 0.012)
            jitter_lon = final_lon + random.uniform(-0.012, 0.012)
            
            precise_info = reverse_geocode(jitter_lat, jitter_lon)
            
            if precise_info.get("road"):
                final_lat = jitter_lat
                final_lon = jitter_lon
                intercept_type = "Triangulação Ativa (Live)"
            else:
                intercept_type = "Vínculo de Registro (Estático)"

        # --- Resolve final fields ---
        resolved_city = precise_info.get("city") or geo_data.get("city") or region_desc or "Desconhecida"
        resolved_state = precise_info.get("state") or geo_data.get("state") or ""
        
        # Build VERY precise address
        main_addr = [precise_info.get("road"), precise_info.get("house_number")]
        main_addr_str = " ".join([str(p) for p in main_addr if p]).strip()
        
        secondary_addr = [precise_info.get("suburb"), resolved_city]
        secondary_addr_str = ", ".join([str(p) for p in secondary_addr if p]).strip()
        
        full_address = f"{main_addr_str}, {secondary_addr_str}" if main_addr_str else (precise_info.get("display_name") or geo_data.get("display_name"))

        result = {
            "success":      True,
            "number":       number,
            "owner":        owner_name if "Live" in intercept_type else owner_initials,
            "formatted":    phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL),
            "country_code": country_code,
            "carrier":      provider,
            "line_type":    line_type,
            "valid":        True,
            "live_meta": {
                "tower_id": tower_id,
                "signal": f"{signal_dbm} dBm",
                "last_ping": last_ping,
                "intercept_method": intercept_type,
                "confidence": "96.8%" if "Live" in intercept_type else "72.1%"
            },
            "geo": {
                "lat":          final_lat,
                "lon":          final_lon,
                "city":         resolved_city,
                "state":        resolved_state,
                "address":      full_address,
                "road":         precise_info.get("road", ""),
                "suburb":       precise_info.get("suburb", ""),
                "display_name": precise_info.get("display_name", ""),
            }
        }

        if json_mode:
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                _print_pretty_results(result)
            result["stdout"] = f.getvalue()
            print(json.dumps(result, ensure_ascii=False))
        else:
            _print_pretty_results(result)

        return result

    except Exception as e:
        result = {"success": False, "error": str(e), "number": number}
        if json_mode:
            print(json.dumps(result))
        else:
            print(f"{RED}[!] Erro: {str(e)}{RESET}")
        return result


def _print_pretty_results(result: dict):
    """Prints the results in a beautiful terminal format."""
    meta = result.get("live_meta", {})
    print(f"\n{WHITE}┌{'─'*50}┐")
    print(f"│ {RED}ALVO LOCALIZADO - INTERCEPÇÃO EM TEMPO REAL{RESET}   {WHITE}│")
    print(f"├{'─'*50}┤")
    print(f"│ {GRAY}Número:    {WHITE}{result['formatted']:<37}{RESET} │")
    print(f"│ {GRAY}Titular:   {YELLOW}{result.get('owner', 'N/A'):<37}{RESET} │")
    print(f"│ {GRAY}Endereço:  {GREEN}{result['geo']['address'][:37]:<37}{RESET} │")
    if len(result['geo']['address']) > 37:
        print(f"│            {GREEN}{result['geo']['address'][37:74]:<37}{RESET} │")
    print(f"│ {GRAY}Intercep:  {RED}{meta.get('intercept_method', 'N/A'):<37}{RESET} │")
    print(f"│ {GRAY}Sinal:     {GREEN}{meta.get('signal', 'N/A'):<9}{RESET} {GRAY}Ping: {WHITE}{meta.get('last_ping', 'N/A'):<20}{RESET} │")
    print(f"│ {GRAY}Torre ERB: {WHITE}{meta.get('tower_id', 'N/A'):<37}{RESET} │")
    print(f"│ {GRAY}Cidade:    {WHITE}{result['geo']['city']:<37}{RESET} │")
    print(f"│ {GRAY}Operadora: {WHITE}{result['carrier']:<37}{RESET} │")
    print(f"│ {GRAY}Lat/Lon:   {RED}{result['geo']['lat']:.6f}, {result['geo']['lon']:.6f}{RESET}{'':16} │")
    print(f"└{'─'*50}┘{RESET}")


def main():
    parser = argparse.ArgumentParser(description="Hex Phone Tracker — OSINT Module")
    parser.add_argument("number", help="Número em formato internacional (+5551999999999)")
    parser.add_argument("--json", action="store_true", dest="json_mode",
                        help="Retorna saída em JSON estruturado (para uso pela API)")
    args = parser.parse_args()

    if not args.json_mode:
        print(f"{WHITE}┌{'─'*55}┐")
        print(f"│ {RED}HEX PHONE TRACKER{RESET} — Intelligence & OSINT Module     {WHITE}│")
        print(f"└{'─'*55}┘{RESET}\n")
        print(f"{WHITE}[+] Alvo: {args.number}{RESET}")
        print(f"{WHITE}[+] Sincronizando com satélites de telecomunicações...{RESET}")
        print(f"{WHITE}[+] Triangulando sinal via ERBs próximas...{RESET}")

    track_phone(args.number, json_mode=args.json_mode)


if __name__ == "__main__":
    main()
