import {
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AppLayout from "../../../layouts/AppLayout";
import { useGetProcessesQuery } from "../../../store/api/endpoints/processApi";
import {
  useCreateManagedUserMutation,
  useDeleteManagedUserMutation,
  useGetManagedUsersQuery,
  useUpdateManagedUserMutation,
} from "../../../store/api/endpoints/userApi";

const emptyForm = {
  full_name: "",
  mobile: "",
  email: "",
  user_name: "",
  password: "",
  user_role: "Agent",
  status: "Active",
  process: "",
  tl: "",
};

const columns = [
  "Name",
  "User Name",
  "Role",
  "Process",
  "Team Leader",
  "Status",
  "Reset Password",
  "Action",
];

const userRoles = ["Admin", "TL", "Agent", "admin"];

const roleStyles = {
  Admin: "bg-violet-100 text-violet-700",
  TL: "bg-amber-100 text-amber-700",
  Agent: "bg-cyan-100 text-cyan-700",
  admin: "bg-violet-100 text-violet-700",
};

const isActiveUser = (status) =>
  ["active", "true", "1", "yes"].includes(String(status).trim().toLowerCase());

const normalizeDisplayStatus = (status) =>
  isActiveUser(status) ? "Active" : "Inactive";

const inactiveUserMessage = "Inactive users cannot be edited or deleted";

const getRequestError = (error, fallback) =>
  typeof error === "string"
    ? error
    : error?.data?.message || error?.error || fallback;

function toPayload(user) {
  return {
    id: user.id,
    full_name: user.full_name.trim(),
    mobile: user.mobile.trim() || null,
    email: user.email.trim() || null,
    user_name: user.user_name.trim(),
    password: user.password.trim() || null,
    user_role: user.user_role.trim(),
    status: normalizeDisplayStatus(user.status),
    cdate: user.cdate || null,
    process: user.process.trim(),
    tl: user.tl.trim(),
    profilePhotoPath: user.profilePhotoPath || null,
    profileCoverPhotoPath: user.profileCoverPhotoPath || null,
  };
}

function ManageUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);

  const {
    data: users = [],
    isLoading,
    isFetching,
    error,
  } = useGetManagedUsersQuery();
  const { data: processes = [] } = useGetProcessesQuery();
  const [createUser, { isLoading: isCreating }] = useCreateManagedUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateManagedUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteManagedUserMutation();

  const loading = isLoading || isFetching;
  const saving = isCreating || isUpdating;
  const errorMessage = getRequestError(error, "");

  const processOptions = useMemo(
    () =>
      Array.from(
        new Set(processes.map((item) => item.process).filter(Boolean))
      ),
    [processes]
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [
        user.full_name,
        user.user_name,
        user.user_role,
        user.process,
        user.tl,
        user.status,
      ].some((value) => String(value).toLowerCase().includes(normalizedSearch))
    );
  }, [searchTerm, users]);

  const openCreateForm = () => {
    setIsFormOpen(true);
    setEditingUser(null);
    setFormData({
      ...emptyForm,
      process: processOptions[0] || "",
    });
  };

  const openEditForm = (user) => {
    if (!isActiveUser(user.status)) {
      toast.error(inactiveUserMessage, { id: `inactive-action-${user.id}` });
      return;
    }

    setIsFormOpen(true);
    setEditingUser(user);
    setFormData({ ...emptyForm, ...user, password: "" });
  };

  const openDeleteConfirm = (user) => {
    if (!isActiveUser(user.status)) {
      toast.error(inactiveUserMessage, { id: `inactive-action-${user.id}` });
      return;
    }

    setDeleteTarget(user);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData(emptyForm);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.full_name.trim() || !formData.user_name.trim()) {
      toast.error("Name and user name are required");
      return;
    }

    if (!formData.process.trim() || !formData.tl.trim() || !formData.user_role.trim()) {
      toast.error("Role, process, and team leader are required");
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (editingUser && !isActiveUser(editingUser.status)) {
      toast.error(inactiveUserMessage, { id: `inactive-action-${editingUser.id}` });
      closeForm();
      return;
    }

    try {
      if (editingUser) {
        await updateUser({
          ...toPayload({ ...editingUser, ...formData }),
          id: editingUser.id,
        }).unwrap();
        toast.success("User updated");
      } else {
        await createUser(toPayload(formData)).unwrap();
        toast.success("User created");
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

    if (!isActiveUser(deleteTarget.status)) {
      toast.error(inactiveUserMessage, { id: `inactive-action-${deleteTarget.id}` });
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteUser(deleteTarget.id).unwrap();
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Delete failed"));
    }
  };

  const toggleActive = async (user) => {
    if (togglingUserId === user.id) {
      return;
    }

    const nextStatus = isActiveUser(user.status) ? "Inactive" : "Active";

    try {
      setTogglingUserId(user.id);
      await updateUser({
        ...toPayload({ ...user, status: nextStatus }),
        id: user.id,
      }).unwrap();
      toast.success(nextStatus === "Active" ? "User activated" : "User deactivated", {
        id: `user-status-${user.id}`,
      });
    } catch (requestError) {
      toast.error(getRequestError(requestError, "Status update failed"), {
        id: `user-status-${user.id}`,
      });
    } finally {
      setTogglingUserId(null);
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

        if (deleteTarget) {
          setDeleteTarget(null);
        }
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
            Manage User
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          <Plus size={15} />
          Add User
        </button>
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
              Team Members
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage users, roles, processes, and access status
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
                filteredUsers.map((user) => {
                  const active = isActiveUser(user.status);
                  const isToggling = togglingUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-all hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-md">
                            {String(user.full_name || user.user_name || "U")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-800">
                              {user.full_name || "-"}
                            </h4>
                            <p className="text-xs text-slate-500">
                              User ID: USR-{String(user.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {user.user_name || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            roleStyles[user.user_role] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.user_role || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">
                        {user.process || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {user.tl || "-"}
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
                        <button
                          type="button"
                          title="Reset password endpoint is not available"
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-300"
                          disabled
                        >
                          <RotateCcw size={14} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title={active ? "Edit user" : inactiveUserMessage}
                            onClick={() => openEditForm(user)}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                              active
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                                : "bg-slate-50 text-slate-300"
                            }`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            title={active ? "Delete user" : inactiveUserMessage}
                            onClick={() => openDeleteConfirm(user)}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                              active
                                ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800"
                                : "bg-slate-50 text-slate-300"
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            type="button"
                            title={active ? "Deactivate user" : "Activate user"}
                            disabled={isToggling}
                            onClick={() => toggleActive(user)}
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

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-xs font-medium text-slate-500"
                  >
                    No users found.
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
            aria-labelledby="user-form-title"
            className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <h2 id="user-form-title" className="text-base font-bold text-slate-900">
                {editingUser ? "Edit User" : "Add User"}
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
                Name
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                User Name
                <input
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Password
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleFieldChange}
                  required={!editingUser}
                  type="password"
                  placeholder={editingUser ? "Leave blank to keep current" : ""}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Role
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Process
                <select
                  name="process"
                  value={formData.process}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Select process</option>
                  {processOptions.map((process) => (
                    <option key={process} value={process}>
                      {process}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Team Leader
                <input
                  name="tl"
                  value={formData.tl}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Mobile
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  type="email"
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-xs font-semibold text-slate-700">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
            <h2 className="text-base font-bold text-slate-900">Delete User</h2>
            <p className="mt-2 text-xs text-slate-600">
              Delete {deleteTarget.full_name || deleteTarget.user_name || "this user"}?
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

export default ManageUser;
