import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                ftx: {
                    obsidian: "#131313",
                    black: "#0e0e0e",
                    surface: "#1f1f1f",
                    "surface-high": "#2a2a2a",
                    "surface-highest": "#353535",
                    lime: "#a4d65e",
                    "lime-bright": "#bff377",
                    "lime-neon": "#bfff00",
                    silver: "#c6c6c6",
                    "silver-bright": "#e3e2e2",
                    "silver-muted": "#8d9380",
                    outline: "#434939",
                },
            },
            fontFamily: {
                ethnocentric: ["var(--font-ethnocentric)", "Ethnocentric", "sans-serif"],
                heading: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
                body: ["var(--font-hanken-grotesk)", "Hanken Grotesk", "Inter", "sans-serif"],
                mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
                arabic: ["var(--font-noto-sans-arabic)", "Noto Sans Arabic", "sans-serif"],
            },
            backgroundImage: {
                "honeycomb-pattern": "url('/images/honeycomb.svg')",
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
            boxShadow: {
                "lime-glow": "0 0 20px rgba(164, 214, 94, 0.25)",
                "lime-glow-lg": "0 0 35px rgba(191, 243, 119, 0.35)",
            },
        },
    },
    plugins: [],
};
export default config;
