export const TOKEN_KEY = "token";
export const USER_DETAILS_KEY = "userDetails";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthSession = ({ token, userDetails }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (userDetails) {
    localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(userDetails));
  }
};

export const getUserDetails = () => {
  const userDetails = localStorage.getItem(USER_DETAILS_KEY);

  if (!userDetails) {
    return null;
  }

  try {
    return JSON.parse(userDetails);
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DETAILS_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_DETAILS_KEY);
};

export const resolveUploadedFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (/^https?:\/\//i.test(filePath)) {
    return filePath;
  }

  const targetUrl = import.meta.env.VITE_API_TARGET_URL;

  if (!targetUrl) {
    return filePath;
  }

  try {
    return `${new URL(targetUrl).origin}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  } catch {
    return filePath;
  }
};

export const getTokenPayload = (token = getAuthToken()) => {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token = getAuthToken()) => {
  if (!token) {
    return true;
  }

  const payload = getTokenPayload(token);

  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
};

export const hasValidSession = () => {
  const token = getAuthToken();

  if (!token || isTokenExpired(token)) {
    clearAuthSession();
    return false;
  }

  return true;
};

export const logout = () => {
  clearAuthSession();
};
