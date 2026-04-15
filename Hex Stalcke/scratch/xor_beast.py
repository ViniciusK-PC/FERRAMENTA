import base64

blob = 'Q0NlQ0NlQ0NlQ0NlIjMlwEcSZmdh1We0UmetRGMxNzQhl2Y1QVcWNHa2l0Qz1UaaVHVx9kUCJTJjRWSzsUahZ0dRlzQYN1THpmRYJnUahkNwZDODVVVSNGNydHVMJ0UKhXUjZ2UzY2d3YDZYNEdhpmUkhDWCJTJZZFdXplWYJzanRTQoF3TopEVUBTVMhTVGpmTGJTJYJmVjNkQyUCc2kETY1kYGJTJ4kXMkxkMjR2QFZkMlElSEZ3az5mardWWElmNOd3ZQNETKp3RHl3cDJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw'
decoded = base64.b64decode(blob)

# O JSON com certeza começa com '{"'
# decoded[0] ^ key[0] = '{' (123)
# decoded[1] ^ key[1] = '"' (34)

k0 = decoded[0] ^ 123
k1 = decoded[1] ^ 34

print(f"Buscando chave... (k0={k0}, k1={k1})")

for k2 in range(256):
    key = [k0, k1, k2]
    res = "".join([chr(decoded[i] ^ key[i % 3]) for i in range(min(50, len(decoded)))])
    if "result" in res or "domainInfo" in res or "data" in res:
        print(f"CHAVE ENCONTRADA: {key}")
        full_res = "".join([chr(b ^ key[i % 3]) for i, b in enumerate(decoded)])
        with open('c:/Users/VINI DEV/Desktop/FERRAMENTA/Hex Stalcke/scratch/final_intelligence.json', 'w', encoding='utf-8') as f:
            f.write(full_res)
        print("Sucesso! Resultado salvo em final_intelligence.json")
        break
