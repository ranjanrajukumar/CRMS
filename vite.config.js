import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { apiProxyMiddleware } from "./middleware/apiProxyMiddleware.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTargetUrl =
    env.VITE_API_TARGET_URL || "https://demo.learnerssacademy.com/api";

  return {
    build: {
      rollupOptions: {
        input: path.posix.normalize("index.html"),
      },
    },
    plugins: [apiProxyMiddleware(apiTargetUrl), react()],
  };
});
