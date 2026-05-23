import {
  clearAuthSession,
  getAuthToken,
  isTokenExpired,
} from "../features/auth/authUtils";

const isAuthEndpoint = (url) => url?.includes("/ManageAccount/");
const methodsWithBody = new Set(["post", "put", "patch"]);

const removeContentTypeHeader = (headers) => {
  if (typeof headers.delete === "function") {
    headers.delete("Content-Type");
    headers.delete("content-type");
    return;
  }

  delete headers["Content-Type"];
  delete headers["content-type"];
};

const redirectToLogin = () => {
  clearAuthSession();
  window.location.replace("/");
};

export const attachAuthMiddleware = (apiClient) => {
  apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    const method = config.method?.toLowerCase();

    if (methodsWithBody.has(method) && config.data) {
      config.headers["Content-Type"] = "application/json";
    } else {
      removeContentTypeHeader(config.headers);
    }

    if (token && !isAuthEndpoint(config.url)) {
      if (isTokenExpired(token)) {
        redirectToLogin();
        return Promise.reject(new Error("Session expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (!isAuthEndpoint(error.config?.url) && (status === 401 || status === 403)) {
        redirectToLogin();
      }

      return Promise.reject(error);
    }
  );
};
