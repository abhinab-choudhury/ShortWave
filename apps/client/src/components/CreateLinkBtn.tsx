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
        <Button
          variant="default"
          size="sm"
          className="gap-2"
        >
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl tracking-[-0.01em]">Create short link</DialogTitle>
            <DialogDescription>
              Paste a long URL to generate a trackable short link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="link">Destination URL</Label>
            <Input
              id="link"
              type="url"
              required
              placeholder="https://example.com/your-long-url"
              value={link}
              onChange={(e) => setLink(e.currentTarget.value)}
              disabled={createCampaignLink.isPending}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={createCampaignLink.isPending}>
              {createCampaignLink.isPending ? "Creating..." : "Create link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLinkBtn;
