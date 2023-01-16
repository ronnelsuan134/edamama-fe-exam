/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        `components/**/*.{vue,js}`,
        `layouts/**/*.vue`,
        `pages/**/*.vue`,
        `plugins/**/*.{js,ts}`,
    ],
    theme: {
        extend: {
            colors: {
                ghostWhite: '#E4F9F7',
                lightGreen: '#1FC6B8',
                green: '#00847A',
                darkGreen: '#00675D',
                lightOrange: '#DA8F00',
                lightRed: '##E1877B',
                red: '#EB606B',
            }
        },
    },
    plugins: [],
}