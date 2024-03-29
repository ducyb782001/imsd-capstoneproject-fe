const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", ...defaultTheme.fontFamily.sans],
        // nameCard: ["BanqueRegular", ...defaultTheme.fontFamily.sans],
        // nameCardBold: ["BanqueBold", ...defaultTheme.fontFamily.sans],
        // army: ["UTM-NguyenHa", ...defaultTheme.fontFamily.sans],
        // card: ["Burbank-Big-Condensed", ...defaultTheme.fontFamily.sans],
        // tomorrow: ["Tomorrow", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...defaultTheme.colors,
        background: "#F6F5FA",
        primary: "#6A44D2",
        primaryLight: "#522DB9",
        primaryDark: "#402390",
        gray: "#7F7F7F",
        secondary: "#7F7F7F",
        grayDark: "#373737",
        grayLight: "#D6DDE8",
        // secondary: "#7e0e42",
        blue: "#3388F7",
        blueDark: "#3388F730",
        grayBorder: "#EFEAFA",
        successBtn: "#04CC89",
        cancelBtn: "#ED5B55",
        greenDark: "#029F6B",
        cancelDark: "#B4294E",
        dangerous: "#E92837",
      },
      textColor: {
        // gray: "#777692",
        // orange: "#F38A00",
      },
      gridTemplateColumns: {
        2080: "20fr 80fr",
        2575: "25fr 75fr",
        46: "4fr 6fr",
        37: "3fr 7fr",
        3961: "39fr 61fr",
        5545: "55fr 45fr",
        433: "4fr 3fr 3fr",
        157015: "15fr 70fr 15fr",
        6535: "65fr 35fr",
        3367: "33fr 66fr",
        8020: "80fr 20fr",
        40202020: "40fr 20fr 20fr 20fr",
        602020: "60fr 20fr 20fr",
        7525: "75fr 25fr",
        73: "70fr 30fr",
        454510: "45fr 45fr 10fr",
        502030: "50fr 20fr 30fr",
      },
      fontSize: {
        fontSize10px: "10px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-question-mark")],
}
