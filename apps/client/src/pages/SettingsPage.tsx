import ChangeProfilePicForm from "@/components/ChangeProfilePicForm";
import ChangeUsernameForm from "@/components/ChangeUsernameForm";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 justify-center bg-slate-50/50 dark:bg-slate-950 py-8 px-4 md:px-8 overflow-y-scroll scrollbar-slim">
      <div className="w-full max-w-4xl space-y-8">
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Manage your account and preferences</p>
        </div>

        {/* Profile Info Section */}
        <section className="border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Profile Information</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Your display name across the platform.</p>
                <input type="text" value={user?.name || ""} disabled className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 cursor-not-allowed text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Linked to your account. Cannot be changed.</p>
                <input type="email" value={user?.email} disabled className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 cursor-not-allowed text-sm" />
              </div>
            </div>
            <div className="flex-1 flex justify-center items-start">
              {user?.profilePic ? (
                <img src={user?.profilePic} alt="Profile" className="rounded-2xl ring-4 ring-slate-100 dark:ring-slate-800 shadow-md max-w-xs w-full object-cover" />
              ) : (
                <div className="grid place-content-center border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <User className="h-24 w-24 text-slate-300 dark:text-slate-600" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Account Settings Section */}
        <section className="border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Account Settings</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <ChangeUsernameForm />
            <ChangeProfilePicForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
