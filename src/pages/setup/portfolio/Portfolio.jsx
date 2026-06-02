import {
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AppLayout from "../../../layouts/AppLayout";
import {
  useCreateProcessMutation,
  useDeleteProcessMutation,
  useGetProcessesQuery,
  useLazyGetProcessQuery,
  useUpdateProcessMutation,
} from "../../../store/api/endpoints/processApi";

const columns = [
  "SNo",
  "Portfolio",
  "Company",
  "Contact Person",
  "Contact Number",
  "Country",
  "Postal Code",
  "Status",
  "Action",
];

const emptyForm = {
  process: "",
  companyName: "",
  contactPersonal: "",
  contactNumber: "",
  emailId: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  isActive: true,
};

const getRequestError = (error, fallback) =>
  typeof error === "string"
    ? error
    : error?.data?.message || error?.error || fallback;

const isActiveProcess = (value) => {
  if (value === false || value === 0) {
    return false;
  }

  return !["inactive", "deactive", "disabled", "false", "0", "no"].includes(
    String(value ?? "active").trim().toLowerCase()
  );
};

const toPayload = (process) => ({
  id: process.id,
  process: process.process.trim(),
  companyName: process.companyName.trim(),
  contactPersonal: process.contactPersonal.trim(),
  contactNumber: process.contactNumber.trim(),
  emailId: process.emailId.trim(),
  city: process.city.trim(),
  state: process.state.trim(),
  country: process.country.trim(),
  postalCode: process.postalCode.trim(),
  isActive: Boolean(process.isActive),
  createdDate: process.createdDate || null,
});

function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingProcessId, setTogglingProcessId] = useState(null);

  const {
    data: processes = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProcessesQuery();
  const [getProcessById] = useLazyGetProcessQuery();
  const [createProcess, { isLoading: isCreating }] = useCreateProcessMutation();
  const [updateProcess, { isLoading: isUpdating }] = useUpdateProcessMutation();
  const [deleteProcess, { isLoading: isDeleting }] = useDeleteProcessMutation();

  const loading = isLoading || isFetching;
  const saving = isCreating || isUpdating;
  const errorMessage = getRequestError(error, "");

  const filteredProcesses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return processes;
    }

    return processes.filter((process) =>
      [
        process.process,
        process.companyName,
        process.contactPersonal,
        process.contactNumber,
        process.emailId,
        process.city,
        process.state,
        process.country,
        process.postalCode,
      ].some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [processes, searchTerm]);

  const openCreateForm = () => {
    setEditingProcess(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = async (process) => {
    setEditingProcess(process);
    setFormData({
      ...emptyForm,
      ...process,
      isActive: isActiveProcess(process.isActive),
    });
    setIsFormOpen(true);

    try {
      const latestProcess = await getProcessById(process.id).unwrap();
      setEditingProcess(latestProcess);
      setFormData({
        ...emptyForm,
        ...latestProcess,
        isActive: isActiveProcess(latestProcess.isActive),
      });
    } catch {
      // Keep editing row data when the detail endpoint returns a different shape.
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProcess(null);
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

    if (
      !formData.process.trim() ||
      !formData.companyName.trim() ||
      !formData.contactPersonal.trim()
    ) {
      toast.error("Portfolio, company, and contact person are required");
      return;
    }

    try {
      if (editingProcess) {
        await updateProcess({
          ...toPayload({ ...editingProcess, ...formData }),
          id: editingProcess.id,
        }).unwrap();
        toast.success("Portfolio updated");
      } else {
        await createProcess(toPayload(formData)).unwrap();
        toast.success("Portfolio created");
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
      await deleteProcess(deleteTarget.id).unwrap();
      toast.success("Portfolio deleted");
      setDeleteTarget(null);
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Delete failed"));
    }
  };

  const toggleActive = async (process) => {
    if (togglingProcessId === process.id) {
      return;
    }

    const nextActive = !isActiveProcess(process.isActive);

    try {
      setTogglingProcessId(process.id);
      await updateProcess({
        ...toPayload({ ...process, isActive: nextActive }),
        id: process.id,
      }).unwrap();
      toast.success(nextActive ? "Portfolio activated" : "Portfolio deactivated", {
        id: `portfolio-status-${process.id}`,
      });
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Status update failed"), {
        id: `portfolio-status-${process.id}`,
      });
    } finally {
      setTogglingProcessId(null);
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
            Portfolio/Bank
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
            Add Portfolio
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
              Portfolio Banks
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage portfolios, companies, contacts, and active status
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
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

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <div className="max-h-[928px] overflow-auto">
            <table className="w-full min-w-[1120px]">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column} className="px-4 py-3">
                          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!loading &&
                  filteredProcesses.map((process, index) => {
                    const active = isActiveProcess(process.isActive);
                    const isToggling = togglingProcessId === process.id;

                    return (
                      <tr key={process.id} className="transition-all hover:bg-slate-50">
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="theme-avatar-gradient flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md">
                              {String(process.process || process.companyName || "P")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-slate-800">
                                {process.process || "-"}
                              </h4>
                              <p className="text-xs text-slate-500">
                                Portfolio ID: PF-{String(process.id).padStart(4, "0")}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {process.companyName || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {process.contactPersonal || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {process.contactNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {process.country || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {process.postalCode || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                active ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <span className="text-xs font-medium text-slate-700">
                              {active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="Edit portfolio"
                              onClick={() => openEditForm(process)}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title="Delete portfolio"
                              onClick={() => setDeleteTarget(process)}
                              className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              type="button"
                              title={active ? "Deactivate portfolio" : "Activate portfolio"}
                              disabled={isToggling}
                              onClick={() => toggleActive(process)}
                              className={`relative h-4 w-8 rounded-full transition ${
                                active ? "bg-blue-500" : "bg-slate-300"
                              } ${isToggling ? "cursor-not-allowed opacity-60" : ""}`}
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

                {!loading && filteredProcesses.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-xs font-medium text-slate-500"
                    >
                      No portfolios found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
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
            aria-labelledby="portfolio-form-title"
            className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-5xl sm:rounded-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <h2 id="portfolio-form-title" className="text-base font-bold text-slate-900">
                {editingProcess ? "Edit Portfolio" : "Add Portfolio"}
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

            <div className="grid flex-1 gap-3 overflow-y-auto px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
              <label className="text-xs font-semibold text-slate-700">
                Portfolio <span className="text-red-500">*</span>
                <input
                  name="process"
                  value={formData.process}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Company <span className="text-red-500">*</span>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Contact Person <span className="text-red-500">*</span>
                <input
                  name="contactPersonal"
                  value={formData.contactPersonal}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Contact Number
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Email
                <input
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleFieldChange}
                  type="email"
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                City
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                State
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Country
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Postal Code
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFieldChange}
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                />
                Active
              </label>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
              <button
                type="button"
                onClick={closeForm}
                className="h-10 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:h-auto sm:py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:py-2"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-sm rounded-md bg-white p-4 shadow-xl">
            <h2 className="text-base font-bold text-slate-900">Delete Portfolio</h2>
            <p className="mt-2 text-xs text-slate-600">
              Delete {deleteTarget.process || deleteTarget.companyName || "this portfolio"}?
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

export default Portfolio;
