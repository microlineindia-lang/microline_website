import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import sitemap from "vite-plugin-sitemap";

/* =========================================
   WEBSITE URL
========================================= */

const SITE_URL = "https://www.microlineindia.in";

/* =========================================
   STATIC ROUTES
   Add ALL important pages here
========================================= */

const staticRoutes = [
  "/",
  "/about",
  "/products",
  "/services",
  "/applications",
  "/achievements",
  "/resources",
  "/contact",
];

/* =========================================
   VITE CONFIG
========================================= */

export default defineConfig({
  plugins: [
    react(),

    /* =========================================
       AUTOMATIC SITEMAP GENERATION
    ========================================= */

    sitemap({
      hostname: SITE_URL,

      dynamicRoutes: staticRoutes,

      /* =========================================
         Robots.txt generation
      ========================================= */

      generateRobotsTxt: true,

      robots: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],

      /* =========================================
         Sitemap metadata
      ========================================= */

      changefreq: "weekly",

      priority: 0.9,

      lastmod: new Date(),

      /* =========================================
         Exclude unnecessary routes
      ========================================= */

      exclude: [
        "/admin",
        "/dashboard",
        "/login",
        "/private",
        "/404",
      ],
    }),
  ],

  /* =========================================
     PATH ALIASES
  ========================================= */

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      "@components": path.resolve(
        __dirname,
        "./src/components",
      ),

      "@pages": path.resolve(
        __dirname,
        "./src/pages",
      ),

      "@styles": path.resolve(
        __dirname,
        "./src/styles",
      ),

      "@assets": path.resolve(
        __dirname,
        "./src/assets",
      ),

      "@utils": path.resolve(
        __dirname,
        "./src/utils",
      ),

      "@hooks": path.resolve(
        __dirname,
        "./src/hooks",
      ),

      "@services": path.resolve(
        __dirname,
        "./src/services",
      ),
    },
  },

  /* =========================================
     DEVELOPMENT SERVER
  ========================================= */

  server: {
    port: 3000,

    open: true,

    strictPort: true,

    headers: {
      /* Security Headers */

      "X-Content-Type-Options": "nosniff",

      "X-Frame-Options": "DENY",

      "Referrer-Policy":
        "strict-origin-when-cross-origin",

      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=()",

      "Cross-Origin-Opener-Policy": "same-origin",

      "Cross-Origin-Resource-Policy": "same-origin",

      /* Legacy protection */

      "X-XSS-Protection": "1; mode=block",
    },
  },

  /* =========================================
     PREVIEW SERVER
  ========================================= */

  preview: {
    port: 4173,

    strictPort: true,
  },

  /* =========================================
     BUILD CONFIGURATION
  ========================================= */

  build: {
    target: "es2018",

    outDir: "dist",

    assetsDir: "assets",

    sourcemap: false,

    cssCodeSplit: true,

    reportCompressedSize: true,

    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        /* =========================================
           ENTERPRISE CHUNK SPLITTING
        ========================================= */

        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React ecosystem
          if (
            id.includes("/react/") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react-vendor";
          }

          // UI libraries
          if (
            id.includes("framer-motion") ||
            id.includes("lucide-react") ||
            id.includes("react-helmet-async")
          ) {
            return "ui-vendor";
          }

          // Utility libraries
          if (
            id.includes("axios") ||
            id.includes("lodash") ||
            id.includes("date-fns")
          ) {
            return "utils-vendor";
          }

          // Remaining packages
          return "vendor";
        },

        /* =========================================
           CLEAN FILE NAMING
        ========================================= */

        chunkFileNames:
          "assets/js/[name]-[hash].js",

        entryFileNames:
          "assets/js/[name]-[hash].js",

        assetFileNames: (assetInfo) => {
          const ext =
            assetInfo.name?.split(".").pop() || "";

          if (
            /png|jpe?g|svg|gif|webp|avif/i.test(ext)
          ) {
            return "assets/images/[name]-[hash][extname]";
          }

          if (/css/i.test(ext)) {
            return "assets/css/[name]-[hash][extname]";
          }

          if (
            /woff2?|ttf|otf/i.test(ext)
          ) {
            return "assets/fonts/[name]-[hash][extname]";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  /* =========================================
     OPTIMIZATION
  ========================================= */

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-helmet-async",
    ],
  },

  /* =========================================
     CSS
  ========================================= */

  css: {
    devSourcemap: false,
  },
});