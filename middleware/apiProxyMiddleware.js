import axios from "axios";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
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

const methodGuard = (req, res, method) => {
  if (req.method === method) {
    return false;
  }

  sendJson(res, 405, { status: false, message: "Method not allowed." });
  return true;
};

const handleProxyError = (res, error, message) => {
  sendJson(
    res,
    error.response?.status || 500,
    error.response?.data || {
      status: false,
      message: error.message || message,
    }
  );
};

const registerApiProxyRoutes = (middlewares, apiTargetUrl) => {
  middlewares.use("/api/ManageAccount/login", async (req, res) => {
      if (methodGuard(req, res, "POST")) {
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
  });

  middlewares.use("/api/ManageAccount/forgot-password", async (req, res) => {
      if (methodGuard(req, res, "POST")) {
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
  });

  middlewares.use("/api/ManageBankDashboard/process/dashboard", async (req, res) => {
      if (methodGuard(req, res, "GET")) {
        return;
      }

      try {
        const requestUrl = new URL(req.url, "http://localhost");
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
  });
};

export const apiProxyMiddleware = (apiTargetUrl) => ({
  name: "api-proxy-middleware",
  configureServer(server) {
    registerApiProxyRoutes(server.middlewares, apiTargetUrl);
  },
  configurePreviewServer(server) {
    registerApiProxyRoutes(server.middlewares, apiTargetUrl);
  },
});
