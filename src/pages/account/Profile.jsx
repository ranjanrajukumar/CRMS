import { useState } from "react";
import { Check, Moon, Sun } from "lucide-react";

import AppLayout from "../../layouts/AppLayout";
import { useTheme } from "../../hooks/useTheme";
import {
  getUserDetails,
  resolveUploadedFileUrl,
} from "../../utils/auth/authUtils";

function ProfileContent() {
  const userDetails = getUserDetails();
  const { colorTheme, setColorTheme, theme, setTheme } = useTheme();
  const [showProfileImage, setShowProfileImage] = useState(true);
  const [showCoverImage, setShowCoverImage] = useState(true);
  const displayName = userDetails?.fullName || userDetails?.userName || "Admin User";
  const profileImageUrl = resolveUploadedFileUrl(userDetails?.profilePhotoPath);
  const coverImageUrl = resolveUploadedFileUrl(userDetails?.profileCoverPhotoPath);

  const fields = [
    ["Full Name", userDetails?.fullName],
    ["Username", userDetails?.userName],
    ["Role", userDetails?.userRole],
    ["Mobile", userDetails?.mobile],
    ["Email", userDetails?.email],
    ["Product", userDetails?.product],
    ["Mapped To", userDetails?.mapto],
  ];
  const themeOptions = [
    {
      description: "Bright interface for daytime work.",
      icon: Sun,
      label: "Light",
      value: "light",
    },
    {
      description: "Lower glare interface for dim spaces.",
      icon: Moon,
      label: "Dark",
      value: "dark",
    },
  ];
  const colorOptions = [
    { label: "Blue", swatch: "#2563eb", value: "blue" },
    { label: "Emerald", swatch: "#059669", value: "emerald" },
    { label: "Rose", swatch: "#e11d48", value: "rose" },
    { label: "Amber", swatch: "#d97706", value: "amber" },
  ];

  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Profile</h1>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative h-40 bg-gradient-to-r from-blue-700 to-indigo-700">
          {coverImageUrl && showCoverImage && (
            <img
              src={coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setShowCoverImage(false)}
            />
          )}
          <div className="absolute inset-0 bg-slate-950/20" />
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-4 border-white bg-blue-600 text-2xl font-bold text-white shadow-md">
                {profileImageUrl && showProfileImage ? (
                  <img
                    src={profileImageUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={() => setShowProfileImage(false)}
                  />
                ) : (
                  displayName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-slate-950">
                  {displayName}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {userDetails?.userRole || "Administrator"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fields.map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                  {value || "-"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Theme</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Choose how the CRMS workspace looks on this device.
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {theme} mode
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {themeOptions.map(({ description, icon: Icon, label, value }) => {
                const isSelected = theme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`flex min-h-24 items-center justify-between gap-4 rounded-lg border p-4 text-left transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-white"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${
                          isSelected ? "bg-blue-600 text-white" : "bg-white text-slate-600"
                        }`}
                      >
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">{label}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {description}
                        </span>
                      </span>
                    </span>
                    {isSelected && <Check size={18} className="shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-950">Color Theme</h4>
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {colorTheme}
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                {colorOptions.map(({ label, swatch, value }) => {
                  const isSelected = colorTheme === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setColorTheme(value)}
                      className={`flex h-14 items-center justify-between rounded-lg border px-3 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-white"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-5 w-5 shrink-0 rounded-full ring-1 ring-slate-200"
                          style={{ backgroundColor: swatch }}
                        />
                        <span className="truncate">{label}</span>
                      </span>
                      {isSelected && <Check size={16} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Profile() {
  return (
    <AppLayout>
      <ProfileContent />
    </AppLayout>
  );
}

export default Profile;
