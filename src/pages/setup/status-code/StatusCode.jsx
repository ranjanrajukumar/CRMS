import {
  Check,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ToggleLeft,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import AppLayout from "../../../layouts/AppLayout";
import { useGetProcessesQuery } from "../../../store/api/endpoints/processApi";
import {
  useCreateDispositionStatusMutation,
  useDeleteDispositionStatusMutation,
  useGetDispositionStatusesQuery,
  useLazyGetDispositionStatusQuery,
  useUpdateDispositionStatusMutation,
} from "../../../store/api/endpoints/dispositionStatusApi";

const columns = ["Status", "SubStatus", "Bank Name", "Status", "Action"];

const emptyForm = {
  status: "",
  subStatus: "",
  portfolio: "",
  isActive: true,
};

const pageSizeOptions = [10, 25, 50, 100];

const getRequestError = (error, fallback) =>
  typeof error === "string"
    ? error
    : error?.data?.message || error?.error || fallback;

const toPayload = (status) => ({
  id: status.id,
  status: status.status.trim(),
  subStatus: status.subStatus.trim(),
  bankName: status.portfolio.trim(),
  portfolio: status.portfolio.trim(),
  portfolioName: status.portfolio.trim(),
  isActive: Boolean(status.isActive),
});

const isActiveStatus = (value) => {
  if (value === false || value === 0) {
    return false;
  }

  return !["inactive", "deactive", "disabled", "false", "0", "no"].includes(
    String(value ?? "active").trim().toLowerCase()
  );
};

const getVisiblePages = (currentPage, totalPages) => {
  const pages = new Set([1, totalPages]);

  for (let pageNumber = currentPage - 2; pageNumber <= currentPage + 2; pageNumber += 1) {
    if (pageNumber > 1 && pageNumber < totalPages) {
      pages.add(pageNumber);
    }
  }

  return Array.from(pages)
    .sort((first, second) => first - second)
    .reduce((items, pageNumber, index, sortedPages) => {
      if (index > 0 && pageNumber - sortedPages[index - 1] > 1) {
        items.push("ellipsis");
      }

      items.push(pageNumber);
      return items;
    }, []);
};

function StatusCode() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingStatusId, setTogglingStatusId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const start = (page - 1) * pageSize;

  const {
    data = { rows: [], total: 0 },
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDispositionStatusesQuery({
    start,
    length: pageSize,
    searchData: debouncedSearch,
  });
  const { data: processes = [] } = useGetProcessesQuery();
  const [getStatusById] = useLazyGetDispositionStatusQuery();
  const [createStatus, { isLoading: isCreating }] = useCreateDispositionStatusMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateDispositionStatusMutation();
  const [deleteStatus, { isLoading: isDeleting }] = useDeleteDispositionStatusMutation();

  const rows = useMemo(() => data.rows || [], [data.rows]);
  const totalRows = data.total || 0;
  const loading = isLoading || isFetching;
  const saving = isCreating || isUpdating;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const errorMessage = getRequestError(error, "");
  const pageStart = totalRows === 0 ? 0 : start + 1;
  const pageEnd = Math.min(start + rows.length, totalRows);

  const paginationLabel = useMemo(() => {
    if (totalRows === 0) {
      return "Showing 0 entries";
    }

    return `Showing ${pageStart} to ${pageEnd} of ${totalRows} entries`;
  }, [pageEnd, pageStart, totalRows]);

  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages),
    [page, totalPages]
  );
  const userPortfolio = userDetails?.product || "";

  const statusOptions = useMemo(() => {
    const values = rows.map((item) => item.status).filter(Boolean);

    if (editingStatus?.status) {
      values.push(editingStatus.status);
    }

    return Array.from(new Set(values));
  }, [editingStatus, rows]);

  const portfolioOptions = useMemo(() => {
    const values = [
      userPortfolio,
      ...rows.map((item) => item.bankName),
      ...processes.map((item) => item.companyName || item.process),
    ].filter(Boolean);

    if (editingStatus?.bankName) {
      values.push(editingStatus.bankName);
    }

    return Array.from(new Set(values));
  }, [editingStatus, processes, rows, userPortfolio]);

  const openCreateForm = () => {
    setEditingStatus(null);
    setFormData({
      ...emptyForm,
      status: statusOptions[0] || "",
      portfolio: userPortfolio || portfolioOptions[0] || "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = async (status) => {
    setEditingStatus(status);
    setFormData({
      ...emptyForm,
      ...status,
      portfolio: status.bankName || "",
      isActive: isActiveStatus(status.isActive),
    });
    setIsFormOpen(true);

    try {
      const latestStatus = await getStatusById(status.id).unwrap();
      setEditingStatus(latestStatus);
      setFormData({
        ...emptyForm,
        ...latestStatus,
        portfolio: latestStatus.bankName || "",
        isActive: isActiveStatus(latestStatus.isActive),
      });
    } catch {
      // Keep editing the row data when the detail endpoint is unavailable.
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStatus(null);
    setFormData(emptyForm);
  };

  const handleFieldChange = (event) => {
    const { checked, name, type, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.status.trim() || !formData.subStatus.trim() || !formData.portfolio.trim()) {
      toast.error("Status, sub-status, and portfolio are required");
      return;
    }

    try {
      if (editingStatus) {
        await updateStatus({
          ...toPayload({ ...editingStatus, ...formData }),
          id: editingStatus.id,
        }).unwrap();
        toast.success("Status code updated");
      } else {
        await createStatus(toPayload(formData)).unwrap();
        toast.success("Status code created");
      }

      closeForm();
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Request failed"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteStatus(deleteTarget.id).unwrap();
      toast.success("Status code deleted");
      setDeleteTarget(null);
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Delete failed"));
    }
  };

  const toggleActive = async (status) => {
    if (togglingStatusId === status.id) {
      return;
    }

    const nextActive = !isActiveStatus(status.isActive);

    try {
      setTogglingStatusId(status.id);
      await updateStatus({
        ...toPayload({ ...status, portfolio: status.bankName || "", isActive: nextActive }),
        id: status.id,
      }).unwrap();
      toast.success(nextActive ? "Status code activated" : "Status code deactivated", {
        id: `status-code-${status.id}`,
      });
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Status update failed"), {
        id: `status-code-${status.id}`,
      });
    } finally {
      setTogglingStatusId(null);
    }
  };

  useEffect(() => {
    if (!isFormOpen && !deleteTarget) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isFormOpen) {
          closeForm();
        }

        setDeleteTarget(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteTarget, isFormOpen]);

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Setup / Masters
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Status Code
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <Plus size={15} />
            Add Status
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Disposition Statuses
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Browse status codes with API pagination and search
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Show
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-normal outline-none transition focus:border-indigo-500 focus:bg-white"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-64"
              />
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-slate-200">
          <div className="max-h-[720px] overflow-auto">
            <table className="w-full min-w-[1080px]">
              <thead className="sticky top-0 z-10 bg-teal-700">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold text-white"
                    >
                      <span className="flex items-center justify-between gap-3">
                        {column}
                        <span className="text-[10px] text-cyan-100">^v</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading &&
                  Array.from({ length: pageSize }).map((_, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column} className="px-4 py-3">
                          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  rows.map((status) => {
                    const active = isActiveStatus(status.isActive);

                    return (
                      <tr key={status.id} className="transition-all hover:bg-slate-50">
                        <td className="bg-slate-50 px-4 py-4 text-xs font-medium uppercase text-slate-700">
                          {status.status || "-"}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-700">
                          {status.subStatus || "-"}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-700">
                          {status.bankName || "-"}
                        </td>
                        <td className="px-4 py-4">
                          {active ? (
                            <Check size={16} className="text-green-500" strokeWidth={3} />
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="Edit status"
                              onClick={() => openEditForm(status)}
                              className="grid h-7 w-7 place-items-center rounded-md text-blue-600 transition hover:bg-blue-50"
                            >
                              <Pencil size={14} />
                            </button>
                            <span className="text-slate-400">|</span>
                            <button
                              type="button"
                              title="Delete status"
                              onClick={() => setDeleteTarget(status)}
                              className="grid h-7 w-7 place-items-center rounded-md text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                            <span className="text-slate-400">|</span>
                            <button
                              type="button"
                              title={active ? "Deactivate status" : "Activate status"}
                              disabled={togglingStatusId === status.id}
                              onClick={() => toggleActive(status)}
                              className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ToggleLeft size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-xs font-medium text-slate-500"
                    >
                      No status codes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>{paginationLabel}</span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              className="h-8 rounded-md px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {visiblePages.map((pageItem, index) =>
              pageItem === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="grid h-8 min-w-8 place-items-center px-2 text-slate-500"
                >
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={pageItem}
                  onClick={() => setPage(pageItem)}
                  disabled={loading}
                  className={`grid h-8 min-w-8 place-items-center rounded-md px-3 text-xs font-medium transition ${
                    page === pageItem
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-600 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {pageItem}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages || loading}
              className="h-8 rounded-md px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-code-form-title"
            className="w-full max-w-5xl overflow-hidden rounded-md bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 id="status-code-form-title" className="text-base font-bold text-slate-900">
                {editingStatus ? "Edit Status Code" : "Add Status Code"}
              </h2>
              <button
                type="button"
                title="Close"
                onClick={closeForm}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-5 px-4 py-4 lg:grid-cols-3">
              <label className="text-xs font-medium text-slate-700">
                Status <span className="text-red-500">*</span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-600"
                >
                  <option value="">--Select Status--</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-medium text-slate-700">
                Substatus <span className="text-red-500">*</span>
                <input
                  name="subStatus"
                  value={formData.subStatus}
                  onChange={handleFieldChange}
                  placeholder="Sub Status"
                  required
                  className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600"
                />
              </label>

              <label className="text-xs font-medium text-slate-700">
                Portfolio <span className="text-red-500">*</span>
                <select
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-600"
                >
                  <option value="">--Select Portfolio--</option>
                  {portfolioOptions.map((portfolio) => (
                    <option key={portfolio} value={portfolio}>
                      {portfolio}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
              <button
                type="button"
                onClick={closeForm}
                className="h-8 bg-red-500 px-3 text-xs font-semibold text-white transition hover:bg-red-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-8 bg-teal-700 px-4 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-md bg-white p-4 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Delete Status Code</h2>
            <p className="mt-2 text-xs text-slate-600">
              Delete {deleteTarget.subStatus || deleteTarget.status || "this status code"}?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default StatusCode;
