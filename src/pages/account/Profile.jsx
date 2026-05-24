import { useState } from "react";

import AppLayout from "../../layouts/AppLayout";
import {
  getUserDetails,
  resolveUploadedFileUrl,
} from "../../utils/auth/authUtils";

function Profile() {
  const userDetails = getUserDetails();
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

  return (
    <AppLayout>
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
        </div>
      </section>
    </AppLayout>
  );
}

export default Profile;
