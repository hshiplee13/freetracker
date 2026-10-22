/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                ink: '#1c1b19',
                paper: '#fbfaf7',
                moss: '#3f5b4d',
                clay: '#b4693e',
            },
            fontFamily: {
                display: ["'Fraunces'", "serif"],
                body: ["'Inter'", "sans-sefi"],
            },
        },
    },
    plugins: [],
};