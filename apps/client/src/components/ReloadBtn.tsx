import { IconReload } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import axios from "axios";

export default function ReloadBtn() {
  const handleReload = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cron/flush`
      );

      if (res.status === 200) {
        toast({
          variant: "default",
          title: "Refresh Successfully!!",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to refresh",
      });
      console.error(err);
    }
  };

  return (
    <Button
      variant={"secondary"}
      onClick={handleReload}
      className="gap-2 dark:bg-teal-800 dark:border-teal-950"
    >
      <IconReload />
      Reload
    </Button>
  );
}
