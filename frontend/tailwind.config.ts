import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // 青（ボタン・見出し）
        accent: "#10b981", // 緑（成功・通知）
        warning: "#f59e0b", // 黄色（注意）
        danger: "#ef4444", // 赤（エラー）
      },
      fontFamily: {
        sans: ['"Segoe UI"', "sans-serif"],
      },
      boxShadow: {
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
