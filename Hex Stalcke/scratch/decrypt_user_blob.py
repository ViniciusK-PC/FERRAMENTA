import base64, urllib.parse, json

blob = 'Q0NlQ0NlQ0NlQ0NlIjMlwEcSZmdh1We0UmetRGMxNzQhl2Y1QVcWNHa2l0Qz1UaaVHVx9kUCJTJjRWSzsUahZ0dRlzQYN1THpmRYJnUahkNwZDODVVVSNGNydHVMJ0UKhXUjZ2UzY2d3YDZYNEdhpmUkhDWCJTJZZFdXplWYJzanRTQoF3TopEVUBTVMhTVGpmTGJTJYJmVjNkQyUCc2kETY1kYGJTJ4kXMkxkMjR2QFZkMlElSEZ3az5mardWWElmNOd3ZQNETKp3RHl3cDJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw'

try:
    # Passo 1: Inverter
    rev = blob[::-1]
    # Passo 2: Padding Base64
    rev_padded = rev + '=' * (-len(rev) % 4)
    # Passo 3: Decode Base64
    decoded_b64 = base64.b64decode(rev_padded)
    # Passo 4: URL Decode
    url_decoded = urllib.parse.unquote(decoded_b64.decode('utf-8', errors='replace'))
    
    with open('c:/Users/VINI DEV/Desktop/FERRAMENTA/Hex Stalcke/scratch/raw_decrypted.txt', 'w', encoding='utf-8') as f:
        f.write(url_decoded)
    print("Sucesso! Texto bruto salvo em raw_decrypted.txt")
except Exception as e:
    print(f"Erro: {str(e)}")
