import { useState, useEffect } from "react";
import { useReduxAuth } from "../hooks/useReduxAuth.js";
import { useDispatch } from "react-redux";
import { clearError } from "../features/authSlice.js";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, isLoading, error, updateProfile, updatePassword, uploadAvatar } = useReduxAuth();

  const [profileData, setProfileData] = useState({ fullname: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000";
    return `${API_BASE}${path}`;
  };

  useEffect(() => {
    if (user) {
      setProfileData({ fullname: user.fullname || "", email: user.email || "" });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setProfileSuccess(false);
    const result = await updateProfile(profileData.fullname, profileData.email);
    if (!result.error) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setPasswordSuccess(false);
    const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (!result.error) {
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    dispatch(clearError());
    
    const formData = new FormData();
    formData.append("avatar", file);

    await uploadAvatar(formData);
    setAvatarUploading(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-200">
          {user?.avatar ? (
            <img src={getAvatarUrl(user.avatar)} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
              {user?.fullname?.charAt(0)?.toUpperCase()}
            </div>
          )}
          {avatarUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{user?.fullname || "Profile Settings"}</h1>
          <p className="mt-1 text-sm text-slate-600">Update your photo and personal details.</p>
          <div className="mt-3 flex items-center gap-3">
            <label className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              Change Picture
              <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleAvatarChange} disabled={avatarUploading} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
          <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input
                value={profileData.fullname}
                onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email Address</span>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                required
              />
            </label>

            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {profileSuccess && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Profile updated successfully!</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Current Password</span>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">New Password</span>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400 focus:outline-none"
                required
              />
            </label>

            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {passwordSuccess && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Password changed successfully!</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
