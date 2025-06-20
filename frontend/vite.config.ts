import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/auth": "http://localhost:8000",
      "/mail": "http://localhost:8000",
      "/reply": "http://localhost:8000",
      "/voice": "http://localhost:8000",
      "/gpt": "http://localhost:8000",
      "/emotion": "http://localhost:8000",
      "/drafts": "http://localhost:8000",
      "/user": "http://localhost:8000",
      "/kotori-diary": "http://localhost:8000",
    },
  },
});
