import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  clearAuthSession,
  getAuthToken,
  isTokenExpired,
} from "../../utils/auth/authUtils";

const redirectToLogin = () => {
  if (window.location.pathname === "/") {
    return;
  }

  window.history.replaceState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { endpoint }) => {
    headers.set("Accept", "*/*");

    if (endpoint !== "login" && endpoint !== "forgotPassword") {
      const token = getAuthToken();

      if (token) {
        if (isTokenExpired(token)) {
          clearAuthSession();
          redirectToLogin();
          return headers;
        }

        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
});

const baseQueryWithAuthRedirect = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    api.endpoint !== "login" &&
    api.endpoint !== "forgotPassword" &&
    [401, 403].includes(result.error.status)
  ) {
    clearAuthSession();
    redirectToLogin();
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthRedirect,
  tagTypes: ["Dashboard", "DispositionStatus", "Process", "User"],
  endpoints: () => ({}),
});
