import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { hapticTap } from "@/lib/platform";

export default function ReloadBtn() {
  const queryClient = useQueryClient();

  const handleClick = async () => {
    await hapticTap();
    await queryClient.invalidateQueries({ queryKey: ["campaignLink"] });
    await queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    await queryClient.invalidateQueries({ queryKey: ["recentLinks"] });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-2"
      aria-label="Refresh analytics"
    >
      <RefreshCw className="size-4" />
      Refresh
    </Button>
  );
}
