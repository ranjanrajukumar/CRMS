import {
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
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
    setIsFormOpen(true);
    setEditingUser(user);
    setFormData({ ...emptyForm, ...user, password: "" });
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

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Setup
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Manage User
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          <Plus size={17} />
          Add User
        </button>
      </div>

      {errorMessage && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="rounded-3xl bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Team Members
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage users, roles, processes, and access status
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white md:w-72"
              />
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <div className="max-h-[928px] overflow-auto">
          <table className="w-full min-w-[1280px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
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
                      <td key={column} className="px-6 py-5">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
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
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md">
                            {String(user.full_name || user.user_name || "U")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h4 className="font-semibold text-slate-800">
                              {user.full_name || "-"}
                            </h4>
                            <p className="text-xs text-slate-500">
                              User ID: USR-{String(user.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.user_name || "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            roleStyles[user.user_role] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.user_role || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        {user.process || "-"}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.tl || "-"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              active ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          title="Reset password endpoint is not available"
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-300"
                          disabled
                        >
                          <RotateCcw size={16} />
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Edit user"
                            onClick={() => openEditForm(user)}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            title="Delete user"
                            onClick={() => setDeleteTarget(user)}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            type="button"
                            title={active ? "Deactivate user" : "Activate user"}
                            disabled={isToggling}
                            onClick={() => toggleActive(user)}
                            className={`relative h-5 w-10 rounded-full transition ${
                              active ? "bg-blue-500" : "bg-slate-300"
                            } ${isToggling ? "cursor-not-allowed opacity-60" : ""}`}
                          >
                            <span
                              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                                active ? "left-5" : "left-0.5"
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
                    className="px-6 py-10 text-center text-sm font-medium text-slate-500"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl rounded-md bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <button
                type="button"
                title="Close"
                onClick={closeForm}
                className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm font-semibold text-slate-700">
                Name
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                User Name
                <input
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Password
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleFieldChange}
                  required={!editingUser}
                  type="password"
                  placeholder={editingUser ? "Leave blank to keep current" : ""}
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Role
                <select
                  name="user_role"
                  value={formData.user_role}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Process
                <select
                  name="process"
                  value={formData.process}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Select process</option>
                  {processOptions.map((process) => (
                    <option key={process} value={process}>
                      {process}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Team Leader
                <input
                  name="tl"
                  value={formData.tl}
                  onChange={handleFieldChange}
                  required
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Mobile
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFieldChange}
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  type="email"
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFieldChange}
                  className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Delete User</h2>
            <p className="mt-2 text-sm text-slate-600">
              Delete {deleteTarget.full_name || deleteTarget.user_name || "this user"}?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
