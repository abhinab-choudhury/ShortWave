import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { DeleteIcon } from "lucide-react";
import { axiosInstance } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AlertDeleteBtn(props: { campaignId: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const deleteCampaignQC = useQueryClient();
  const deleteCampaign = useMutation({
    mutationFn: () => axiosInstance.delete(`/campaign/${props.campaignId}`),
    onSuccess: () => {
      navigate("/dashboard");
      deleteCampaignQC.invalidateQueries({
        queryKey: ["recentLinks", "dashboardStats", "campaigns"],
      });
    },
    onError: (error) => {
      toast({
        variant: "default",
        description: "❌ Failed to delete the Campaign!",
      });
      console.log("Error: ", error);
    },
  });
  const handleDelete = async () => {
    await deleteCampaign.mutateAsync();
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={deleteCampaign.isPaused}
          variant="destructive"
          className="text-white"
        >
          <DeleteIcon className="mr-2 w-4.5 h-4.5" />
          {deleteCampaign.isPaused ? "Deleting..." : "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            links and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="border-red-700 bg-red-500 hover:bg-red-600 hover:border-red-800 text-white"
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDeleteBtn;
