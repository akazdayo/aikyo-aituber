import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
    return {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    server: {
      port: Number(env.VITE_DEV_SERVER_PORT) || 5173,
      host: env.VITE_DEV_SERVER_HOST ?? "0.0.0.0",
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
