import base64

def xor_decrypt(data, key):
    return bytes([b ^ key[i % len(key)] for i, b in enumerate(data)])

blob = 'Q0NlQ0NlQ0NlQ0NlIjMlwEcSZmdh1We0UmetRGMxNzQhl2Y1QVcWNHa2l0Qz1UaaVHVx9kUCJTJjRWSzsUahZ0dRlzQYN1THpmRYJnUahkNwZDODVVVSNGNydHVMJ0UKhXUjZ2UzY2d3YDZYNEdhpmUkhDWCJTJZZFdXplWYJzanRTQoF3TopEVUBTVMhTVGpmTGJTJYJmVjNkQyUCc2kETY1kYGJTJ4kXMkxkMjR2QFZkMlElSEZ3az5mardWWElmNOd3ZQNETKp3RHl3cDJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw'
decoded = base64.b64decode(blob)

# Chave provável se começar com '{"'
# C ^ { = 0x43 ^ 0x7b = 0x38 (56)
# C ^ " = 0x43 ^ 0x22 = 0x61 (97)
# e ^ d = 0x65 ^ 0x64 = 0x01 (1)

found = False
for key_len in range(1, 10):
    # Tenta chaves comuns baseadas em repetições
    key = []
    for i in range(key_len):
        # Aqui a gente chute a chave baseada em frequências ou marcadores
        key.append(decoded[i] ^ ord('{"domainInfo"'[i]))
    
    dec = xor_decrypt(decoded, key)
    if b'domainInfo' in dec or b'apiUrl' in dec:
        print(f"Chave encontrada! Tamanho {key_len}: {key}")
        print(f"Resultado: {dec[:200]}")
        found = True
        break

if not found:
    print("Chave não encontrada pelos métodos automáticos.")
