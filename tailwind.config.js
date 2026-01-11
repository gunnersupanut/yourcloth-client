import { text } from "stream/consumers";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        logoxl: "3.5rem",
        h1xl: [
          "36px",
          {
            fontWeight: "800",
          },
        ],
        h2xl: ["32px", { fontWeight: "700" }],
        h3xl: ["24px", { fontWeight: "500" }],
        bodyxl: "16px",
        button: ["16px", { fontWeight: "700" }],
        cardtitleprimary: ["14px", { fontWeight: "700" }],
        cardtitlesecondary: ["14px", { fontWeight: "500" }],
        ui: [
          "12px",
          {
            fontWeight: "500",
          },
        ],
      },
      fontFamily: {
        // Kanit ค่าเริ่มต้น
        kanit: ["Kanit", "sans-serif"],
        // สร้างชื่อ logo
        logo: ['"Asap Condensed"', "sans-serif"],
      },
      colors: {
        primary: "#684C6B",
        secondary: "#FFCD02",
        tertiary: "#B39EB5",
        quaternary: "#D8D8D8",
        text_inverse: "#FFFFFF",
        text_primary: "#000000",
        text_secondary: "#999999",
      },
    },
    boxShadow: {
      custommain: "5px 5px 5px 2px rgba(0, 0, 0, 0.25)", 
      custombutton: "2px 2px 5px 0px rgba(0, 0, 0, 0.25)", 
    },
  },
  plugins: [],
};
