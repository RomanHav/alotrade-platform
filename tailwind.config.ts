// tailwind.config.ts
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

export default {
    darkMode: "class", // ✅ строка, без массива
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: { extend: {} },
    plugins: [animate],
} satisfies Config
