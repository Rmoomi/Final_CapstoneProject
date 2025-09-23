import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // ✅ allow access from outside
    allowedHosts: [
      "e1c298485261.ngrok-free.app", // ✅ your ngrok domain
    ],
    port: 5173,
  },
});
