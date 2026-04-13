const blob = "=Q0NlQ0NlQ0NlQ0NlIjMlkmZwlXRah1T1IUM5RWT3FEeadjSyYjeWhEOGF1SxJjaBVXONRHWzw2YGJTJPB3dIRTTIh2RPV0YBJkMl00aSlVSxMnU3tWSQBjTVhXVntmVIpXVvpEUL5mM4J0bhFla29mNBVHNWF3bBNXTzkkWzkGU0JEOFZTTGJTJv1WRpRVSBJUVyYWO2kmQyUScXdjT5oHSGB1SUVWQWdHOq9UOxpGRn5kRyUyaLRVWKNkb4IHWtxEdpJXUGJTJMhmewl2VQJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw";

const reversed = blob.split("").reverse().join("");
const decoded = Buffer.from(reversed.replace(/^=/, ''), 'base64');

console.log("Brute forcing 1-byte XOR...");
for (let i = 0; i < 256; i++) {
    const xored = Buffer.alloc(decoded.length);
    for (let j = 0; j < decoded.length; j++) {
        xored[j] = decoded[j] ^ i;
    }
    const str = xored.toString('utf8');
    if (str.includes('{"') || str.includes('result') || str.includes('http')) {
        console.log(`Found match with XOR key: 0x${i.toString(16)} (${i})`);
        console.log("Full Decoded Content:");
        console.log(str);
        break;
    }
}
