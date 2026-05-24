import { apiSlice } from "../baseApi";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: "/ManageAccount/login",
        method: "POST",
        body: {
          userName: loginData.userName,
          password: loginData.password,
        },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (forgotData) => ({
        url: "/ManageAccount/forgot-password",
        method: "POST",
        body: {
          userName: forgotData.userName,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useForgotPasswordMutation } = authApi;
