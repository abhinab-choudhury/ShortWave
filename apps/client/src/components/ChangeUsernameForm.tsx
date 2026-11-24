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
          <label className="text-sm font-medium text-foreground">
            Username
          </label>
          <p className="text-sm text-muted-foreground my-2">
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
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
