import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { FileIcon, User } from "lucide-react";

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
            <form className="space-y-6 w-full md:w-[50%]">
              {/* Username */}
              <div className="md:flex-col md:items-start">
                <div className="md:w-4/6">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 my-2">
                    This is your unique profile identifier. You can change it,
                    but be cautious as links may break.
                  </p>
                </div>
                <div className="mt-2 md:mt-0 md:w-7/8">
                  <input
                    type="text"
                    placeholder="Enter new username"
                    className="w-full bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-slate-700 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="md:flex md:justify-start">
                <Button variant="default" type="submit">
                  Update Username
                </Button>
              </div>
            </form>
            {/* Profile Pic Upload */}
            <form className="space-y-6 w-full md:w-[50%]">
              {/* Username */}
              <div className="md:flex-col md:items-start">
                <div className="md:w-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Picture
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload your desired profile picture.
                  </p>
                </div>
                <div className="mt-2 md:my-3 md:w-full">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
                    <FileIcon className="w-12 h-12" />
                    <span className="text-sm font-medium text-gray-500">
                      Drag and drop a file or click to browse
                    </span>
                    <span className="text-xs text-gray-500">Images only</span>
                  </div>
                  <div className="space-y-2 text-sm my-4">
                    <Label htmlFor="file" className="text-sm font-medium">
                      File
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      placeholder="File"
                      accept="image/*"
                      className="dark:bg-slate-700"
                    />
                  </div>
                  {/* Save button */}
                  <Button size="lg">Upload</Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
