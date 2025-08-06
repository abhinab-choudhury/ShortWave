import ChangeProfilePicForm from "@/components/ChangeProfilePicForm";
import ChangeUsernameForm from "@/components/ChangeUsernameForm";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 justify-center bg-gray-50 dark:bg-slate-900 py-10 px-4 overflow-y-scroll">
      <div className="w-full space-y-10">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white border-b pb-6">
          Settings
        </h1>

        {/* Profile Info Section */}
        <section className="border border-gray-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-800 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Profile Information
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-8">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  This is your display name used across the platform.
                </p>
                <input
                  type="text"
                  value={user?.name || ""}
                  disabled
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-slate-700 rounded-md px-4 py-2 cursor-not-allowed"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  This email is linked to your account. You cannot change it
                  from here.
                </p>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-slate-700 rounded-md px-4 py-2 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex-1 flex justify-center items-start">
              {user?.profilePic ? (
                <img
                  src={user?.profilePic}
                  alt="Profile"
                  className="rounded-xl dark:bg-slate-700 shadow-md max-w-xs w-full object-cover transition-transform duration-300 ease-in-out"
                />
              ) : (
                <div className="grid place-content-center border border-black border-dotted p-14 rounded-2xl">
                  <User className="h-28 w-28 rounded-full shadow-none object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Change Username Section */}
        <section className="border border-gray-200 dark:border-slate-800 rounded-lg p-6 bg-white dark:bg-slate-800 shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
            Account Settings
          </h2>

          <div className="flex flex-col gap-4 md:flex-row">
            {/* Change Username */}
            <ChangeUsernameForm />

            {/* Profile Pic Upload */}
            <ChangeProfilePicForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
