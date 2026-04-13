const blob = "=Q0NlQ0NlQ0NlQ0NlIjMlkmZwlXRah1T1IUM5RWT3FEeadjSyYjeWhEOGF1SxJjaBVXONRHWzw2YGJTJPB3dIRTTIh2RPV0YBJkMl00aSlVSxMnU3tWSQBjTVhXVntmVIpXVvpEUL5mM4J0bhFla29mNBVHNWF3bBNXTzkkWzkGU0JEOFZTTGJTJv1WRpRVSBJUVyYWO2kmQyUScXdjT5oHSGB1SUVWQWdHOq9UOxpGRn5kRyUyaLRVWKNkb4IHWtxEdpJXUGJTJMhmewl2VQJjMlE0MlIjMlcWYsZmMyUyQyUCR3USZ1JHdBNTJyITJul2ZvxUZu9GaQxWah1WR39GbsFmMyUyQyUSZ1JHdBNTJyITJslWYtVUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUSZu9GaQV2ZuFGaDd3bsxWYyITJDJTJlVnc0F0MlIjMlQmcvd3czFGU0V2czFUZn5WYoN0dvxGbhJjMlMkMlUWdyRXQzUiMyUCZy92dzNXYQV2ZuFGaDJXZzV1dvxGbhJjMlI0NlE0MlIjMlcWam52bD5Wan9GbyITJDJTJEdTJEVTJyITJSJUL0BnMyUiQ1USQzUiMyUSZnFWdn5WYMBHchJjMlMkMlIjMlcmbw5SMwYVZsBnc1BlclJWbBFDd19Wehx0XEBVZnJXYoNWZyZkMlIXZuRnchBVZnJXYoNWZyZkMl02bj5yMyEDZiNmYuM3YpBXLzl3ctQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJjlGUyVmb0JXYQRnbl1WehBnMyUyQyUiMyUyZuBnLnxGaGJTJxcjMxcTM3ADOwQzNxYkMl02bj5yMyEDZiNmYuMXdtQWYvxGc1ZkMlYkMlE0MlMHc0RHayITJBNTJyITJvd2bMVGdpNnMyUyQyUiMyUyZuBnLvd2bsZkMlMTN0EDN0cDM4ADN3EjRyUSbvNmLzITMkJ2Yi5yc11CZh9GbwVnRyUiRyUSQzUycwRHdoJjMlE0MlIjMl42bjlEcwFmMyUyQyUiMyUSbvNmL1VHZkJjMlE0MlIjMlUWbh5UZ0l2cyITJCdTJBNTJyITJ0NXaMdWam52bjJjMlMkMlQ0NlQ0NlIjMlcmbw5Sd1RGZGJTJwIzMwkTO0ADN1QzNxYkMlIzcGJTJt92YuMjMxQmYjJmLzVXLkF2bsBXdGJTJGJTJBNTJzBHd0hmMyUSQzUiMyUSZnFWbpJjMlMkMlIjMl4ybpJXMBVyMDVibvlGbp1GMyUybtlGezIUJzMUJyBHMyUybwITJlNXLl5mcvRHMyUSZwITJzNjQlMzQl4GMyUSYw";

const decrypt = (t) => {
    if (!t || typeof t !== "string") return null;
    try {
        // Remove ANY leading '=' if it exists, or just use it as is
        // In the HTML script, the string is "=Q0Nl..."
        // But if I reverse it, it's "...l0NQ="
        const reversed = t.split("").reverse().join("");
        
        // Use Buffer for atob in node
        const decoded = Buffer.from(reversed, 'base64').toString('binary');
        
        // decodeURIComponent
        const urlDecoded = decodeURIComponent(decoded);
        return JSON.parse(urlDecoded);
    } catch (a) {
        return "Error: " + a.message;
    }
};

console.log(JSON.stringify(decrypt(blob), null, 2));
