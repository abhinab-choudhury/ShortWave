import { useState } from "react";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/utils";
import { toast } from "./ui/use-toast";

export function EditCampaignBtn({
  campaignId,
  name,
  description,
}: {
  campaignId: string;
  name: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [campaignName, setCampaignName] = useState(name);
  const [campaignDescription, setCampaignDescription] = useState(
    description || "",
  );

  const queryClient = useQueryClient();
  const updateCampaign = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      axiosInstance.patch(`/campaign/${campaignId}`, data),
    onSuccess: () => {
      toast({ title: "Campaign updated", description: "Changes saved." });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaignLink", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentLinks"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Couldn't update campaign",
        description: "Please try again.",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateCampaign.mutateAsync({
      name: campaignName,
      description: campaignDescription,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl tracking-[-0.01em]">
              Edit campaign
            </DialogTitle>
            <DialogDescription>
              Update the campaign name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Campaign name</Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(event) => setCampaignName(event.currentTarget.value)}
                required
                disabled={updateCampaign.isPending}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-desc">Description</Label>
              <Textarea
                id="campaign-desc"
                className="min-h-24 resize-none"
                value={campaignDescription}
                onChange={(event) =>
                  setCampaignDescription(event.currentTarget.value)
                }
                disabled={updateCampaign.isPending}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateCampaign.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateCampaign.isPending}>
              {updateCampaign.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
