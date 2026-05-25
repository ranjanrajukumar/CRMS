import axios from "axios";

export const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-CRMS-Proxy", "true");
  res.end(JSON.stringify(payload));
};

export const readJsonBody = (req) =>
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

const requireMethod = (req, res, method) => {
  if (req.method === method) {
    return true;
  }

  sendJson(res, 405, { status: false, message: "Method not allowed." });
  return false;
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

const getAuthorizationHeader = (req) => {
  const authorization = req.headers.authorization || req.headers.Authorization;

  return authorization ? { Authorization: authorization } : {};
};

export const handleApiProxyRequest = async (req, res, apiTargetUrl) => {
  const requestUrl = new URL(req.url, "http://localhost");
  const apiPath = requestUrl.pathname.replace(/\/+$/, "").toLowerCase();

  if (apiPath === "/api/manageaccount/login") {
    if (!requireMethod(req, res, "POST")) {
      return true;
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

    return true;
  }

  if (apiPath === "/api/manageaccount/forgot-password") {
    if (!requireMethod(req, res, "POST")) {
      return true;
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

    return true;
  }

  if (apiPath === "/api/managebankdashboard/process/dashboard") {
    if (!requireMethod(req, res, "GET")) {
      return true;
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
          ...getAuthorizationHeader(req),
        },
      });

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Dashboard proxy request failed.");
    }

    return true;
  }

  if (apiPath === "/api/managebankdashboard/customer/followup/list/dashboard") {
    if (!requireMethod(req, res, "GET")) {
      return true;
    }

    try {
      const payload = {
        userType: requestUrl.searchParams.get("userType") || "admin",
        userName: requestUrl.searchParams.get("userName") || "",
      };

      const apiResponse = await axios.request({
        method: "GET",
        url: `${apiTargetUrl}/ManageBankDashboard/customer/followup/list/dashboard`,
        data: payload,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...getAuthorizationHeader(req),
        },
      });

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Follow-up dashboard proxy request failed.");
    }

    return true;
  }

  if (apiPath === "/api/managebankdashboard/users/list/dashboard") {
    if (!requireMethod(req, res, "GET")) {
      return true;
    }

    try {
      const payload = {
        userType: requestUrl.searchParams.get("userType") || "admin",
        userName: requestUrl.searchParams.get("userName") || "",
      };

      const apiResponse = await axios.request({
        method: "GET",
        url: `${apiTargetUrl}/ManageBankDashboard/users/list/dashboard`,
        data: payload,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...getAuthorizationHeader(req),
        },
      });

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Users dashboard proxy request failed.");
    }

    return true;
  }

  if (apiPath === "/api/managebankdashboard/portfolio/count/dashboard") {
    if (!requireMethod(req, res, "GET")) {
      return true;
    }

    try {
      const payload = {
        userType: requestUrl.searchParams.get("userType") || "admin",
        userName: requestUrl.searchParams.get("userName") || "",
        portfolioName: requestUrl.searchParams.get("portfolioName") || "",
      };

      const apiResponse = await axios.request({
        method: "GET",
        url: `${apiTargetUrl}/ManageBankDashboard/portfolio/Count/dashboard`,
        data: payload,
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...getAuthorizationHeader(req),
        },
      });

      sendJson(res, apiResponse.status, apiResponse.data);
    } catch (error) {
      handleProxyError(res, error, "Portfolio count dashboard proxy request failed.");
    }

    return true;
  }

  return false;
};
