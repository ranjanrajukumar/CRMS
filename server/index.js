import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  handleApiProxyRequest,
  sendJson,
} from "./middleware/apiProxyHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const apiTargetUrl =
  process.env.VITE_API_TARGET_URL || "https://demo.learnerssacademy.com/api";
const port = process.env.PORT || 4173;

const mimeTypes = {
  ".css": "text/css",
  ".gif": "image/gif",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const serveStaticFile = async (res, requestUrl) => {
  const requestedPath = decodeURIComponent(requestUrl.pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const filePath = path.resolve(distDir, relativePath);
  const safePath = filePath.startsWith(distDir) ? filePath : path.join(distDir, "index.html");
  const targetPath = existsSync(safePath) ? safePath : path.join(distDir, "index.html");

  try {
    const fileStat = await stat(targetPath);

    if (!fileStat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const extension = path.extname(targetPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    createReadStream(targetPath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
};

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    const handled = await handleApiProxyRequest(req, res, apiTargetUrl);

    if (!handled) {
      sendJson(res, 404, { status: false, message: "API route not found." });
    }

    return;
  }

  await serveStaticFile(res, requestUrl);
});

server.listen(port, () => {
  console.log(`CRMS server running on port ${port}`);
});
