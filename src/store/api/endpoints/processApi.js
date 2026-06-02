import { apiSlice } from "../baseApi";
import { getApiErrorMessage } from "../utils/errorUtils";

const getProcessItems = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  return [];
};

const normalizeProcess = (item, index) => ({
  id: item.id ?? index,
  process: item.process || "",
  companyName: item.companyName || "",
  contactPersonal: item.contactPersonal || "",
  contactNumber: item.contactNumber || "",
  emailId: item.emailId || "",
  city: item.city || "",
  state: item.state || "",
  country: item.country || "",
  postalCode: item.postalCode || "",
  isActive: Boolean(item.isActive),
  createdDate: item.createdDate || null,
});

export const processApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProcesses: builder.query({
      query: () => ({
        url: "/ManageProcess/process",
      }),
      transformResponse: (response) =>
        getProcessItems(response).map(normalizeProcess),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Process", id })),
              { type: "Process", id: "LIST" },
            ]
          : [{ type: "Process", id: "LIST" }],
    }),
    getProcess: builder.query({
      query: (id) => ({
        url: `/ManageProcess/user/${id}`,
      }),
      transformResponse: (response) =>
        normalizeProcess(response?.data || response, 0),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: (_result, _error, id) => [{ type: "Process", id }],
    }),
    createProcess: builder.mutation({
      query: (body) => ({
        url: "/ManageProcess/createProcess",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: [{ type: "Process", id: "LIST" }],
    }),
    updateProcess: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ManageProcess/update-process/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Process", id },
        { type: "Process", id: "LIST" },
      ],
    }),
    deleteProcess: builder.mutation({
      query: (id) => ({
        url: `/ManageProcess/delete-process/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "Process", id },
        { type: "Process", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateProcessMutation,
  useDeleteProcessMutation,
  useLazyGetProcessQuery,
  useGetProcessesQuery,
  useUpdateProcessMutation,
} = processApi;
