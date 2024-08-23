/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        black: ["dana-black", "sans-serif"],
        bold: ["dana-bold", "sans-serif"],
        medium: ["dana-medium", "sans-serif"],
        light: ["dana-light", "sans-serif"],
      },
      boxShadow: {
        "custom-inset": "inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF",
        "custom-inset-hover":
          "inset 1px 1px 2px #BABECC, inset -1px -1px 5px #f7f7f7",
      },
    },
  },
  plugins: [],
};
