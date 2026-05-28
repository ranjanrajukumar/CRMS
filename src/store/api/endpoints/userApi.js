import { apiSlice } from "../baseApi";
import { getApiErrorMessage } from "../utils/errorUtils";

const getUserItems = (payload) => {
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

const normalizeStatus = (status) => {
  if (status === false || status === 0) {
    return "Inactive";
  }

  if (status === true || status === 1) {
    return "Active";
  }

  const normalized = String(status ?? "Active").trim();

  return normalized || "Active";
};

const normalizeUser = (item, index) => ({
  id: item.id ?? item.userId ?? index,
  full_name: item.full_name || item.fullName || item.name || "",
  mobile: item.mobile || item.contactNumber || "",
  email: item.email || item.emailId || "",
  user_name: item.user_name || item.userName || item.username || "",
  password: item.password || "",
  user_role: item.user_role || item.userRole || item.role || "",
  status: normalizeStatus(item.status ?? item.userStatus),
  cdate: item.cdate || item.createdDate || null,
  process: item.process || "",
  tl: item.tl || item.teamLeader || item.teamLead || item.manager || "",
  profilePhotoPath: item.profilePhotoPath || null,
  profileCoverPhotoPath: item.profileCoverPhotoPath || null,
});

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getManagedUsers: builder.query({
      query: () => ({
        url: "/ManageUsers/users",
      }),
      transformResponse: (response) => getUserItems(response).map(normalizeUser),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    createManagedUser: builder.mutation({
      query: (body) => ({
        url: "/ManageUsers/crateUser",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateManagedUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ManageUsers/update-user/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted({ id, ...body }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData("getManagedUsers", undefined, (draft) => {
              const user = draft.find((item) => item.id === id);

              if (user) {
                Object.assign(user, normalizeUser({ ...user, ...body }, 0));
              }
            })
          );
        } catch {
          // The mutation error is handled by the calling component.
        }
      },
      transformErrorResponse: (response) => getApiErrorMessage(response),
    }),
    deleteManagedUser: builder.mutation({
      query: (id) => ({
        url: `/ManageUsers/delete-user/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateManagedUserMutation,
  useDeleteManagedUserMutation,
  useGetManagedUsersQuery,
  useUpdateManagedUserMutation,
} = userApi;
