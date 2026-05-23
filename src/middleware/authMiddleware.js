import {
  clearAuthSession,
  getAuthToken,
  isTokenExpired,
} from "../features/auth/authUtils";

const isAuthEndpoint = (url) => url?.includes("/ManageAccount/");

const redirectToLogin = () => {
  clearAuthSession();
  window.location.replace("/");
};

export const attachAuthMiddleware = (apiClient) => {
  apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();

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
