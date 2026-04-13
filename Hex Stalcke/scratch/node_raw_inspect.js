const blob = "=Q0NlQ0NlQ0NlQ0NlIjMlkmZwlXRah1T1IUM5RWT3FEeadjSyYjeWhEOGF1SxJjaBVXONRHWzw2YGJTJPB3dIRTTIh2RPV0YBJkMl00aSlVSxMnU3tWSQBjTVhXVntmVIpXVvpEUL5mM4J0bhFla29mNBVHNWF3bBNXTzkkWzkGU0JEOFZTTGJTJv1WRpRVSBJUVyYWO2kmQyUScXdjT5oHSGB1SUVWQWdHOq9UOxpGRn5kRyUyaLRVWKNkb4IHWtxEdpJXUGJTJMhmewl2VQJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw";

const decryptRaw = (t) => {
    try {
        const reversed = t.split("").reverse().join("");
        // In node, use Buffer for base64
        // The leading '=' becomes a trailing '=' in the reversed string, which is correct base64 padding.
        const decoded = Buffer.from(reversed.replace(/^=/, ''), 'base64');
        return decoded;
    } catch (a) {
        return "Error: " + a.message;
    }
};

const bytes = decryptRaw(blob);
console.log("Decoded size:", bytes.length);
console.log("First 100 bytes (hex):", bytes.toString('hex', 0, 100));
console.log("First 100 bytes (utf8):", bytes.toString('utf8', 0, 100).replace(/[^\x20-\x7E]/g, '.'));
