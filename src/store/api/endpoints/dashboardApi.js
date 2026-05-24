import { normalizeDashboardCards } from "../../../utils/dashboardUtils";
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
  }),
});

export const { useGetDashboardCardsQuery } = dashboardApi;
