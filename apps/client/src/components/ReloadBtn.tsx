import { IconReload } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ReloadBtn() {
  const queryClient = useQueryClient();
  const [isPressed, setIsPressed] = useState(false);

  const refersh = useMutation({
    mutationFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/cron/flush`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["campaignLink"]});
      toast({
        variant: "default",
        title: "Refreshed Successfully!!",
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Failed to refresh",
      });
      console.error(err);
    },
  });

  const handleClick = () => {
    setIsPressed(true);
    refersh.mutate(undefined, {
      onSettled: () => setIsPressed(false), 
    });
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className={`gap-2 dark:bg-teal-800 dark:border-teal-950 ${
        isPressed ? "scale-95 opacity-80" : "transition-all duration-150"
      }`}
      disabled={refersh.isPending}
    >
      <IconReload className={refersh.isPending ? "animate-spin" : ""} />
      {refersh.isPending ? "Reloading..." : "Reload"}
    </Button>
  );
}
