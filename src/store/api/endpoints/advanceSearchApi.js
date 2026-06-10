import { apiSlice } from "../baseApi";

export const advanceSearchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvanceSearch: builder.mutation({
      query: (body) => ({
        url: "/ManageAdvanceSearch/advance-search",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdvanceSearchMutation } = advanceSearchApi;
