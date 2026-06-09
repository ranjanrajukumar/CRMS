import { apiSlice } from "../baseApi";
import { getApiErrorMessage } from "../utils/errorUtils";

const getStatusItems = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

const getStatusItem = (payload) => {
  if (Array.isArray(payload)) {
    return payload[0] || {};
  }

  if (Array.isArray(payload?.data)) {
    return payload.data[0] || {};
  }

  if (Array.isArray(payload?.result)) {
    return payload.result[0] || {};
  }

  if (Array.isArray(payload?.items)) {
    return payload.items[0] || {};
  }

  return payload?.data || payload?.result || payload?.item || payload || {};
};

const getStatusTotal = (payload, fallback) =>
  Number(
    payload?.recordsFiltered ??
      payload?.recordsTotal ??
      payload?.totalRecords ??
      payload?.totalCount ??
      payload?.count ??
      fallback
  ) || 0;

const normalizeStatus = (item, index) => ({
  id:
    item.id ??
    item.statusId ??
    item.dispositionStatusId ??
    item.dispositionId ??
    index,
  status:
    item.status ||
    item.Status ||
    item.disposition1 ||
    item.dispositionStatus ||
    item.disposition ||
    item.mainStatus ||
    "",
  subStatus:
    item.subStatus ||
    item.SubStatus ||
    item.substatus ||
    item.subdisposition ||
    item.dispositionSubStatus ||
    item.dispositionName ||
    item.statusName ||
    item.name ||
    "",
  bankName:
    item.bankName ||
    item.BankName ||
    item.bank_name ||
    item.bank ||
    item.clientName ||
    item.product ||
    item.portfolioName ||
    "",
  isActive:
    item.isActive ??
    item.IsActive ??
    item.active ??
    item.statusFlag ??
    item.is_active ??
    true,
});

export const dispositionStatusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDispositionStatuses: builder.query({
      query: ({ start = 0, length = 10, searchData = "" } = {}) => ({
        url: "/ManageDispositionStatus/GetAllStatus",
        params: {
          start,
          length,
          searchData,
        },
      }),
      transformResponse: (response) => {
        const items = getStatusItems(response);

        return {
          rows: items.map(normalizeStatus),
          total: getStatusTotal(response, items.length),
        };
      },
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map(({ id }) => ({ type: "DispositionStatus", id })),
              { type: "DispositionStatus", id: "LIST" },
            ]
          : [{ type: "DispositionStatus", id: "LIST" }],
    }),
    getDispositionStatus: builder.query({
      query: (id) => ({
        url: `/ManageDispositionStatus/status/${id}`,
      }),
      transformResponse: (response) => normalizeStatus(getStatusItem(response), 0),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      providesTags: (_result, _error, id) => [{ type: "DispositionStatus", id }],
    }),
    createDispositionStatus: builder.mutation({
      query: (body) => ({
        url: "/ManageDispositionStatus/create-status",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: [{ type: "DispositionStatus", id: "LIST" }],
    }),
    updateDispositionStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ManageDispositionStatus/update-status/${id}`,
        method: "PUT",
        body,
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DispositionStatus", id },
        { type: "DispositionStatus", id: "LIST" },
      ],
    }),
    deleteDispositionStatus: builder.mutation({
      query: (id) => ({
        url: `/ManageDispositionStatus/delete-process/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response) => getApiErrorMessage(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "DispositionStatus", id },
        { type: "DispositionStatus", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateDispositionStatusMutation,
  useDeleteDispositionStatusMutation,
  useGetDispositionStatusesQuery,
  useLazyGetDispositionStatusQuery,
  useUpdateDispositionStatusMutation,
} = dispositionStatusApi;
