import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AppLayout from "../../../layouts/AppLayout";
import { useGetProcessesQuery } from "../../../store/api/endpoints/processApi";
import {
  useCreateDispositionStatusMutation,
  useDeleteDispositionStatusMutation,
  useGetDispositionStatusesQuery,
  useLazyGetDispositionStatusQuery,
  useUpdateDispositionStatusMutation,
} from "../../../store/api/endpoints/dispositionStatusApi";

const columns = ["S.No", "Status", "SubStatus", "Bank Name", "Status", "Action"];

const emptyForm = {
  status: "",
  subStatus: "",
  portfolio: "",
  isActive: true,
};

const pageSizeOptions = [10, 25, 50, 100];

const themePrimaryButtonClass =
  "bg-[var(--theme-primary-700)] hover:bg-[var(--theme-primary-800)]";
const themeIconButtonClass =
  "bg-[var(--theme-primary-50)] text-[var(--theme-primary-600)] hover:bg-[var(--theme-primary-50)] hover:text-[var(--theme-primary-800)]";

const getRequestError = (error, fallback) =>
  typeof error === "string"
    ? error
    : error?.data?.errors
      ? Object.values(error.data.errors).flat().join(" ")
      : error?.data?.message || error?.data?.title || error?.error || fallback;

const toPayload = (status) => ({
  id: status.id,
  disposition1: status.status.trim(),
  status: status.status.trim(),
  subdisposition: status.subStatus.trim(),
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

function StatusCode() {
  const { t } = useTranslation();
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
  const totalRecords = data.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const fromRecord = totalRecords === 0 ? 0 : start + 1;
  const toRecord = Math.min(start + rows.length, totalRecords);
  const loading = isLoading || isFetching;
  const saving = isCreating || isUpdating;
  const errorMessage = getRequestError(error, "");
  const userPortfolio = userDetails?.product || "";
  const translateText = (text, options = {}) =>
    t(`appText.${text}`, { defaultValue: text, ...options });

  const pageNumbers = useMemo(() => {
    const firstPage = Math.max(1, currentPage - 2);
    const lastPage = Math.min(totalPages, firstPage + 4);
    const adjustedFirstPage = Math.max(1, lastPage - 4);

    return Array.from(
      { length: lastPage - adjustedFirstPage + 1 },
      (_, index) => adjustedFirstPage + index
    );
  }, [currentPage, totalPages]);

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
      toast.error(translateText("Status, sub-status, and portfolio are required"));
      return;
    }

    try {
      if (editingStatus) {
        await updateStatus({
          ...toPayload({ ...editingStatus, ...formData }),
          id: editingStatus.id,
        }).unwrap();
        toast.success(translateText("Status code updated"));
      } else {
        await createStatus(toPayload(formData)).unwrap();
        toast.success(translateText("Status code created"));
      }

      closeForm();
    } catch (requestError) {
      toast.error(getRequestError(requestError, translateText("Request failed")));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteStatus(deleteTarget.id).unwrap();
      toast.success(translateText("Status code deleted"));
      setDeleteTarget(null);
    } catch (requestError) {
      toast.error(getRequestError(requestError, translateText("Delete failed")));
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
      toast.success(
        translateText(nextActive ? "Status code activated" : "Status code deactivated"),
        {
          id: `status-code-${status.id}`,
        }
      );
    } catch (requestError) {
      toast.error(getRequestError(requestError, translateText("Status update failed")), {
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
            {translateText("Setup / Masters")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {translateText("Status Code")}
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
            {translateText("Refresh")}
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold text-white shadow-sm transition ${themePrimaryButtonClass}`}
          >
            <Plus size={15} />
            {translateText("Add Status")}
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
              {translateText("Disposition Statuses")}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {translateText("Browse status codes with API pagination and search")}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              {translateText("Show")}
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
                placeholder={translateText("Search...")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-64"
              />
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="max-h-[720px] overflow-auto">
            <table className="w-full min-w-[1080px]">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={`${column}-${index}`}
                      className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {translateText(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading &&
                  Array.from({ length: pageSize }).map((_, index) => (
                    <tr key={index}>
                      {columns.map((column, columnIndex) => (
                        <td key={`${column}-${columnIndex}`} className="px-4 py-3">
                          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  rows.map((status, index) => {
                    const active = isActiveStatus(status.isActive);

                    return (
                      <tr key={status.id} className="transition-all hover:bg-slate-50">
                        <td className="px-4 py-3 text-xs font-semibold text-slate-600">
                          {start + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase text-cyan-700">
                            {translateText(status.status || "-")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700">
                          {translateText(status.subStatus || "-")}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {translateText(status.bankName || "-")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                active ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <span className="text-xs font-medium text-slate-700">
                              {translateText(active ? "Active" : "Inactive")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title={translateText("Edit status")}
                              onClick={() => openEditForm(status)}
                              className={`grid h-8 w-8 place-items-center rounded-lg transition ${themeIconButtonClass}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title={translateText("Delete status")}
                              onClick={() => setDeleteTarget(status)}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              type="button"
                              title={translateText(
                                active ? "Deactivate status" : "Activate status"
                              )}
                              disabled={togglingStatusId === status.id}
                              onClick={() => toggleActive(status)}
                              className={`relative h-4 w-8 rounded-full transition ${
                                active ? "bg-[var(--theme-primary-500)]" : "bg-slate-300"
                              } ${
                                togglingStatusId === status.id
                                  ? "cursor-not-allowed opacity-60"
                                  : ""
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${
                                  active ? "left-4" : "left-0.5"
                                }`}
                              />
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
                      {translateText("No status codes found.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            {translateText("Showing")} {fromRecord} {translateText("to")} {toRecord}{" "}
            {translateText("of")} {totalRecords} {translateText("entries")}
          </p>

          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1 || loading}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={translateText("Previous")}
            >
              <ChevronLeft size={15} />
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                disabled={loading}
                className={`h-8 min-w-8 rounded-md px-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  pageNumber === currentPage
                    ? "bg-[var(--theme-primary-700)] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages || loading}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={translateText("Next")}
            >
              <ChevronRight size={15} />
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
                {translateText(editingStatus ? "Edit Status Code" : "Add Status Code")}
              </h2>
              <button
                type="button"
                title={translateText("Close")}
                onClick={closeForm}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-5 px-4 py-4 lg:grid-cols-3">
              <label className="text-xs font-medium text-slate-700">
                {translateText("Status")} <span className="text-red-500">*</span>
                <input
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  list="disposition-status-options"
                  placeholder={translateText("Disposition Status")}
                  required
                  className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-600"
                />
                <datalist id="disposition-status-options">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </datalist>
              </label>

              <label className="text-xs font-medium text-slate-700">
                {translateText("Substatus")} <span className="text-red-500">*</span>
                <input
                  name="subStatus"
                  value={formData.subStatus}
                  onChange={handleFieldChange}
                  placeholder={translateText("Sub Status")}
                  required
                  className="mt-1 h-8 w-full border border-slate-300 px-2 text-xs font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600"
                />
              </label>

              <label className="text-xs font-medium text-slate-700">
                {translateText("Portfolio")} <span className="text-red-500">*</span>
                <select
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-8 w-full border border-slate-300 bg-white px-2 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-600"
                >
                  <option value="">{translateText("--Select Portfolio--")}</option>
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
                {translateText("Cancel")}
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`h-8 px-4 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${themePrimaryButtonClass}`}
              >
                {translateText(saving ? "Submitting..." : "Submit")}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-md bg-white p-4 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">
              {translateText("Delete Status Code")}
            </h2>
            <p className="mt-2 text-xs text-slate-600">
              {translateText("Delete {{name}}?", {
                name: deleteTarget.subStatus || deleteTarget.status || "this status code",
              })}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {translateText("Cancel")}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {translateText(isDeleting ? "Deleting..." : "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default StatusCode;
