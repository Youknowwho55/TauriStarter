/** @format */
import { defineConfig, loadEnv } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), "");

  const host = process.env.TAURI_DEV_HOST;

  return {
    plugins: [sveltekit(), tailwindcss()],
    // Expose env variables to your app if needed
    define: {
      "process.env": env,
    },
    // Vite options tailored for Tauri development
    clearScreen: false, // prevent vite from obscuring rust errors
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
