import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../store/api/endpoints/authApi";
import { setAuthSession } from "../../utils/auth/authUtils";
import { setCredentials } from "../../store/slices/authSlice";
import ForgotPassword from "./ForgotPassword";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData).unwrap();

      if (response.status) {
        setAuthSession({
          token: response.token,
          userDetails: response.userDetails,
        });
        dispatch(setCredentials({ userDetails: response.userDetails }));

        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.data?.message || error?.error || "Login Failed");
    }
  };

  const openForgotPopup = () => {
    setShowForgotPopup(true);
  };

  return (
    <div className="h-dvh overflow-hidden bg-slate-100 lg:min-h-screen lg:overflow-auto">
      <Toaster />

      <main className="grid h-full grid-cols-1 lg:min-h-screen lg:grid-cols-2">

        {/* Left Side Image */}
        <section className="relative hidden lg:block">
          <img
            src="/images/login-bg.png"
            alt="CRMS Login"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-slate-900/60" />

          <div className="relative z-10 flex h-full items-center justify-center p-10 text-white">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold leading-tight">
                Collection CRM Management System
              </h1>

              <p className="mt-6 text-lg text-slate-200">
                Manage customers, collections, payments, reports,
                and business analytics in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side Login */}
        <section className="flex min-h-0 items-center justify-center px-4 py-4 sm:px-8 lg:px-12 lg:py-10">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-8 lg:rounded-2xl">

            {/* Logo */}
            <div className="mb-4 flex justify-center sm:mb-6">
              <img
                src="/images/logo.jpeg"
                alt="Logo"
                className="h-14 w-14 object-contain sm:h-20 sm:w-20"
              />
            </div>

            {/* Heading */}
            <div className="mb-5 text-center sm:mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
                Welcome Back
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-3xl">
                CRMS Login
              </h2>

              <p className="mt-1 text-sm text-slate-500 sm:mt-2">
                Please login to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

              {/* Username */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 sm:mb-2 sm:text-base">
                  Username
                </label>

                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:p-3"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 sm:mb-2 sm:text-base">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-14 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:p-3 sm:pr-14"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-2.5 text-sm font-medium text-blue-600 sm:top-3"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between gap-3 text-sm">

                <label className="flex min-w-0 items-center gap-2 text-slate-600">
                  <input type="checkbox" />

                  Remember Me
                </label>

                <button
                  type="button"
                  onClick={openForgotPopup}
                  className="shrink-0 font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 sm:p-3"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-sm text-slate-500 sm:mt-8">
              © 2026 CRMS. All rights reserved.
            </div>

          </div>
        </section>
      </main>

      {showForgotPopup && (
        <ForgotPassword
          initialUserName={formData.userName}
          onClose={() => setShowForgotPopup(false)}
        />
      )}
    </div>
  );
}

export default Login;
