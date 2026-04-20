import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteCompression from "vite-plugin-compression";
import checker from "vite-plugin-checker";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),

      // TypeScript + ESLint checker
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "src/**/*.{ts,tsx}"',
          useFlatConfig: true,
        },
      }),

      // Gzip compression for production build
      viteCompression({
        algorithm: "gzip",
        ext: ".gz",
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/lib": path.resolve(__dirname, "./src/lib"),
        "@/assets": path.resolve(__dirname, "./src/assets"),
      },
    },

    server: {
      port: 5173,
      open: true,
      strictPort: true,
    },

    preview: {
      port: 4173,
      open: true,
    },

    css: {
      devSourcemap: true,
    },

    build: {
      target: "esnext",
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      esbuild: {
        drop: ["console", "debugger"],
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "react";
              if (id.includes("@radix-ui")) return "radix";
              if (id.includes("axios") || id.includes("lodash")) return "vendor";
            }
          }
        },
      },
    },

    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});