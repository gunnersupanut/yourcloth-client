import { text } from "stream/consumers";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        logoxl: ["3.5rem", { lineHeight: "1.1", fontWeight: "800" }],
        h1xl: [
          "36px",
          {
            lineHeight: "1.2",
            fontWeight: "800",
          },
        ],

        h2xl: ["32px", { lineHeight: "1.25", fontWeight: "700" }],

        h3xl: ["24px", { lineHeight: "1.3", fontWeight: "500" }],

        bodyxl: ["16px", { lineHeight: "1.5" }], // หรือ "24px"

        button: ["16px", { lineHeight: "1.2", fontWeight: "700" }],

        cardtitleprimary: ["14px", { lineHeight: "1.4", fontWeight: "700" }],
        cardtitlesecondary: ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        ui: [
          "12px",
          {
            lineHeight: "16px",
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
        // --- User Colors (ม่วง-เหลือง) ---
        primary: "#684C6B",
        secondary: "#FFCD02",
        tertiary: "#B39EB5",
        quaternary: "#D8D8D8",
        text_inverse: "#FFFFFF",
        text_primary: "#000000",
        text_secondary: "#999999",
        // ---  Admin Colors (น้ำเงิน-เหลือง) ---
        "admin-primary": "#1E3A8A", // Blue 900
        "admin-secondary": "#FFCD02", // เหลืองเดิม
        "admin-bg": "#0F172A", // Slate 900
        "admin-card": "#1E293B", // Slate 800
      },
    },
    boxShadow: {
      custommain: "5px 5px 5px 2px rgba(0, 0, 0, 0.25)",
      custombutton: "2px 2px 5px 0px rgba(0, 0, 0, 0.25)",
    },
  },
  plugins: [],
};
