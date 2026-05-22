import axios from "axios";
import {
  clearAuthSession,
  getAuthToken,
  isTokenExpired,
} from "../features/auth/authUtils";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  const isAuthEndpoint = config.url?.includes("/ManageAccount/");

  if (token && !isAuthEndpoint) {
    if (isTokenExpired(token)) {
      clearAuthSession();
      window.location.replace("/");
      return Promise.reject(new Error("Session expired"));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint = error.config?.url?.includes("/ManageAccount/");

    if (!isAuthEndpoint && (status === 401 || status === 403)) {
      clearAuthSession();
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default API;
