import axios from "axios";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
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

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("error", reject);

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });

const handleProxyError = (res, error, fallbackMessage) => {
  sendJson(
    res,
    error.response?.status || 500,
    error.response?.data || {
      status: false,
      message: error.message || fallbackMessage,
    }
  );
};

const requireMethod = (req, res, method) => {
  if (req.method === method) {
    return true;
  }

  sendJson(res, 405, { status: false, message: "Method not allowed." });
  return false;
};

const proxyApiRequest = async (req, res, requestUrl) => {
  if (requestUrl.pathname === "/api/ManageAccount/login") {
    if (!requireMethod(req, res, "POST")) {
      return;
    }

    try {
      const requestBody = await readJsonBody(req);
      const apiResponse = await axios.post(
        `${apiTargetUrl}/ManageAccount/login`,
        {
          userName: requestBody.userName,
          password: requestBody.password,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Login proxy request failed.");
    }

    return;
  }

  if (requestUrl.pathname === "/api/ManageAccount/forgot-password") {
    if (!requireMethod(req, res, "POST")) {
      return;
    }

    try {
      const requestBody = await readJsonBody(req);
      const apiResponse = await axios.post(
        `${apiTargetUrl}/ManageAccount/forgot-password`,
        {
          userName: requestBody.userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Forgot password proxy request failed.");
    }

    return;
  }

  if (requestUrl.pathname === "/api/ManageBankDashboard/process/dashboard") {
    if (!requireMethod(req, res, "GET")) {
      return;
    }

    try {
      const payload = {
        userType: requestUrl.searchParams.get("userType") || "admin",
        userName: requestUrl.searchParams.get("userName") || "",
      };

      const apiResponse = await axios.request({
        method: "GET",
        url: `${apiTargetUrl}/ManageBankDashboard/process/dashboard`,
        data: payload,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(req.headers.authorization
            ? { Authorization: req.headers.authorization }
            : {}),
        },
      });

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Dashboard proxy request failed.");
    }

    return;
  }

  sendJson(res, 404, { status: false, message: "API route not found." });
};

const serveStaticFile = async (req, res, requestUrl) => {
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
    await proxyApiRequest(req, res, requestUrl);
    return;
  }

  await serveStaticFile(req, res, requestUrl);
});

server.listen(port, () => {
  console.log(`CRMS server running on port ${port}`);
});
