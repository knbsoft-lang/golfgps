import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Auto-update service worker
      registerType: "autoUpdate",

      // Enable PWA behavior during dev (important for testing)
      devOptions: {
        enabled: true,
      },

      // Static assets copied as-is
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],

      // Web App Manifest
      manifest: {
        name: "Golf GPS",
        short_name: "Golf GPS",
        description: "Offline golf hole viewer with GPS",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // Offline caching
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,jpg,jpeg,webp,ico,json}"
        ],

        runtimeCaching: [
          {
            // Cache all hole images + course assets
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/GolfCorses/"),
            handler: "CacheFirst",
            options: {
              cacheName: "golf-hole-images",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});