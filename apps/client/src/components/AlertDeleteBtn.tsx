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

function AlertDeleteBtn(props: { campaignId: string }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(
        `/campaign/${props.campaignId!}`,
      );
      if (response.status == 204) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast({
        variant: "destructive",
        description: "Failed to delete the Campaign!",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isDeleting}
          variant="destructive"
          className="text-white"
        >
          <DeleteIcon className="mr-2 w-4.5 h-4.5" />
          {isDeleting ? "Deleting..." : "Delete"}
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
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDeleteBtn;
