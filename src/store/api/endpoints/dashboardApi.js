import {
  normalizeDashboardCards,
  normalizeDashboardUsers,
  normalizeTodayFollowups,
} from "../../../utils/dashboardUtils";
import { apiSlice } from "../baseApi";
import { getApiErrorMessage } from "../utils/errorUtils";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCards: builder.query({
      query: ({ userType, userName }) => ({
        url: "/ManageBankDashboard/process/dashboard",
        params: {
          userType,
          userName,
        },
      }),
      transformResponse: normalizeDashboardCards,
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: ["Dashboard"],
    }),
    getTodayFollowups: builder.query({
      query: ({ userType, userName }) => ({
        url: "/ManageBankDashboard/customer/followup/list/dashboard",
        params: {
          userType,
          userName,
        },
      }),
      transformResponse: normalizeTodayFollowups,
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: ["Dashboard"],
    }),
    getDashboardUsers: builder.query({
      query: ({ userType, userName }) => ({
        url: "/ManageBankDashboard/users/list/dashboard",
        params: {
          userType,
          userName,
        },
      }),
      transformResponse: normalizeDashboardUsers,
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardCardsQuery,
  useGetDashboardUsersQuery,
  useGetTodayFollowupsQuery,
} = dashboardApi;
