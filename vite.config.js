import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { handleApiProxyRequest } from "./middleware/apiProxyHandler.js";

const apiProxyPlugin = (apiTargetUrl) => ({
  name: "api-proxy",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(req.url, "http://localhost");

      if (!requestUrl.pathname.startsWith("/api/")) {
        next();
        return;
      }

      const handled = await handleApiProxyRequest(req, res, apiTargetUrl);

      if (!handled) {
        next();
      }
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestUrl = new URL(req.url, "http://localhost");

      if (!requestUrl.pathname.startsWith("/api/")) {
        next();
        return;
      }

      const handled = await handleApiProxyRequest(req, res, apiTargetUrl);

      if (!handled) {
        next();
      }
    });
  },
});

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
    plugins: [apiProxyPlugin(apiTargetUrl), react()],
  };
});
