import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                'ping-once': 'ping-once 1s ease-in-out forwards',
            },
            keyframes: {
                'ping-once': {
                    '0%': {opacity: '1', transform: 'scale(1)'},
                    '50%': {opacity: '0.5', transform: 'scale(1.25)'},
                    '100%': {opacity: '0', transform: 'scale(1.5)'},
                },
            }
        },
    },
    plugins: [],
};
export default config;
