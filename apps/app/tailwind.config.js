/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#080C0A",
          secondary: "#203A2E",
          tertiary: "#43795A",
          quaternary: "#F0FDF4",
          quinary: "#83CC8C",
        },
      },
    },
  },
  plugins: [],
};
