const blob = 'Q0NlQ0NlQ0NlQ0NlIjMlwEcSZmdh1We0UmetRGMxNzQhl2Y1QVcWNHa2l0Qz1UaaVHVx9kUCJTJjRWSzsUahZ0dRlzQYN1THpmRYJnUahkNwZDODVVVSNGNydHVMJ0UKhXUjZ2UzY2d3YDZYNEdhpmUkhDWCJTJZZFdXplWYJzanRTQoF3TopEVUBTVMhTVGpmTGJTJYJmVjNkQyUCc2kETY1kYGJTJ4kXMkxkMjR2QFZkMlElSEZ3az5mardWWElmNOd3ZQNETKp3RHl3cDJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw';

try {
    const reversed = blob.split("").reverse().join("");
    const decodedB64 = Buffer.from(reversed, 'base64').toString('binary');
    const result = decodeURIComponent(escape(decodedB64));
    console.log("--- RESULTA DO DECODIFICADO ---");
    console.log(result);
} catch (e) {
    console.log("Erro ao decodificar:", e.message);
    
    // Tenta fallback se der erro de URI
    try {
        const reversed = blob.split("").reverse().join("");
        const decodedB64 = Buffer.from(reversed, 'base64').toString('binary');
        console.log("--- RESULTADO BRUTO (BINARY) ---");
        console.log(decodedB64.substring(0, 500));
    } catch (e2) {
        console.log("Falha total.");
    }
}
