import { axiosInstance } from "@/lib/utils";
import { useState } from "react";
import { toast } from "./ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateCampaign() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const createCampaignQC = useQueryClient();
  const createCampaign = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      axiosInstance.post("/campaign", data),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "New event created successfully",
      });
      setName("");
      setDescription("");
      setOpen(false);
      createCampaignQC.invalidateQueries({ queryKey: ["recentLinks"] });
      createCampaignQC.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error) => {
      toast({
        variant: "default",
        title: "❌ Failed to create a new event!!!!",
      });
      console.log("Error : ", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createCampaign.mutateAsync({ name, description });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="dark:bg-gray-700">
          <PlusCircle className="dark:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign, where you group all your related links.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="campaign_name">Name</Label>
              <Input
                id="campaign_name"
                name="name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </div>
            <div className="grid gap-3 mb-3">
              <Label htmlFor="campaign_description">Description</Label>
              <Textarea
                className="h-20 resize-none"
                id="campaign_description"
                name="description"
                onChange={(event) => setDescription(event.currentTarget.value)}
                value={description}
                disabled={createCampaign.isPaused}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={createCampaign.isPending}>
              {createCampaign.isPaused ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
