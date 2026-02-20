// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// ✅ Auto Build ID: changes every time you run `npm run build`
// Shows up in the app so you can confirm tablet + PC are identical.
const BUILD_ID = new Date().toISOString();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Keep your normal file patterns
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,webmanifest}"],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],

  // ✅ Inject a build-time constant into your code
  define: {
  __BUILD_ID__: JSON.stringify(new Date().toISOString()),
},
});