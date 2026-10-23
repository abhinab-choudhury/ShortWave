import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { hapticTap } from "@/lib/platform";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ReloadBtn() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    setIsRefreshing(true);
    await hapticTap();
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["campaignLink"] }),
      queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] }),
      queryClient.invalidateQueries({ queryKey: ["recentLinks"] }),
    ]);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isRefreshing}
      className="gap-2"
      aria-label="Refresh analytics"
    >
      <RefreshCw
        className={cn("size-4", isRefreshing && "animate-spin")}
        aria-hidden="true"
      />
      Refresh
    </Button>
  );
}
