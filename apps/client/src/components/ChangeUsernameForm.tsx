import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/utils";
import { toast } from "./ui/use-toast";

export default function ChangeUsernameForm() {
  const [username, setUsername] = useState<string>();

  const updateUsernameQC = useQueryClient();
  const updateUsername = useMutation({
    mutationFn: () => axiosInstance.post("/user/change-username", { username }),
    onSuccess: () => {
      updateUsernameQC.invalidateQueries({
        queryKey: ["me"],
      });
      setUsername("");
      toast({
        variant: "default",
        title: "✅ Updated username successfully",
      });
    },
    onError: () => {
      setUsername("");
      toast({
        variant: "default",
        title: "❌ Failed to update username",
      });
    },
  });
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUsername.mutateAsync();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 w-full md:w-[50%]">
      {/* Username */}
      <div className="md:flex-col md:items-start">
        <div className="md:w-4/6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 my-2">
            This is your unique profile identifier. You can change it, but be
            cautious as links may break.
          </p>
        </div>
        <div className="mt-2 md:mt-0 md:w-7/8">
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            placeholder="Enter new username"
            className="w-full bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-slate-700 rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="md:flex md:justify-start">
        <Button
          disabled={updateUsername.isPending}
          variant="default"
          type="submit"
        >
          {updateUsername.isPending ? "updating..." : "Update Username"}
        </Button>
      </div>
    </form>
  );
}
