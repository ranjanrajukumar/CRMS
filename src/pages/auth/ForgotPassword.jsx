import { useState } from "react";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../../store/api/endpoints/authApi";

function ForgotPassword({ initialUserName = "", onClose }) {
  const [userName, setUserName] = useState(initialUserName);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const closePopup = () => {
    if (isLoading) return;

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({
        userName: userName.trim(),
      }).unwrap();

      if (response.status === false) {
        toast.error(response.message || "Forgot password request failed");
        return;
      }

      toast.success(
        response.message || "Password reset request sent successfully",
      );
      onClose();
    } catch (error) {
      console.log(error);

      toast.error(
        error?.data?.message || error?.error || "Forgot password request failed",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Account Recovery
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Forgot Password
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Enter your username to request a password reset.
            </p>
          </div>

          <button
            type="button"
            onClick={closePopup}
            disabled={isLoading}
            className="rounded-full px-3 py-1 text-2xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close forgot password popup"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Username
            </label>

            <input
              type="text"
              name="forgotUserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePopup}
              disabled={isLoading}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
