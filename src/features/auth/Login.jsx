import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authService";
import { TOKEN_KEY } from "./authUtils";
import ForgotPassword from "./ForgotPassword";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      if (response.status) {
        localStorage.setItem(TOKEN_KEY, response.token);

        toast.success("Login Successful");

        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);

      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const openForgotPopup = () => {
    setShowForgotPopup(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster />

      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

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
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.jpeg"
                alt="Logo"
                className="h-20 w-20 object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Welcome Back
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                CRMS Login
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please login to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Username
                </label>

                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 pr-14 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-3 text-sm font-medium text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" />

                  Remember Me
                </label>

                <button
                  type="button"
                  onClick={openForgotPopup}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500">
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
