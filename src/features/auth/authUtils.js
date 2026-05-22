export const TOKEN_KEY = "token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
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
