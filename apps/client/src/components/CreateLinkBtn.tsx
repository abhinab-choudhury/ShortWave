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

function CreateLinkBtn(props: { campaignId: string }) {
  const [link, setLink] = useState<string>("https://example.com");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSending(true);
      const response = await axiosInstance.post(
        `/campaign/${props.campaignId}/url`,
        {
          url: link,
        },
      );

      if (response.status === 201) {
        toast({
          variant: "default",
          title: "New url created successfully",
        });
        setOpen(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast({
        variant: "destructive",
        title: "Failed to create new url!",
        description: "Please check the URL and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="col-span-3"
                disabled={isSending}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" disabled={isSending}>
              {isSending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLinkBtn;
