/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(0, 0%, 100%)",
                foreground: "hsl(0, 0%, 3.9%)",
                primary: "hsl(0, 0%, 9%)",
                secondary: "hsl(0, 0%, 96.1%)",
                muted: "hsl(0, 0%, 96.1%)",
                accent: "hsl(0, 0%, 96.1%)",
                destructive: "hsl(0, 84.2%, 60.2%)",
                border: "hsl(0, 0%, 89.8%)",
                input: "hsl(0, 0%, 89.8%)",
            },
            borderRadius: {
                DEFAULT: "0.5rem",
            },
        },
    },
    plugins: [],
};
