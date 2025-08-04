import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/utils";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateLinkBtn(props: { campaignId: string }) {
  const [link, setLink] = useState<string>("https://example.com");
  const [open, setOpen] = useState<boolean>(false);

  const createCampaignLinkQC = useQueryClient();
  const createCampaignLink = useMutation({
    mutationFn: (data: { url: string }) =>
      axiosInstance.post(`/campaign/${props.campaignId}/url`, data),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "New url created successfully",
      });
      setLink("");
      setOpen(false);
      createCampaignLinkQC.invalidateQueries({
        queryKey: ["campaignLink", props.campaignId],
      });
    },
    onError: (error) => {
      toast({
        variant: "default",
        title: "❌ Failed to create new url!",
      });
      console.log("Error: ", error);
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createCampaignLink.mutateAsync({ url: link });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-gray-950">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle>Create link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.currentTarget.value)}
                className="col-span-3 dark:bg-gray-900"
                disabled={createCampaignLink.isPending}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={createCampaignLink.isPending}>
              {createCampaignLink.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLinkBtn;
