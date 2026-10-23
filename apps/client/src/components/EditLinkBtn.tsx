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
import { Switch } from "@/components/ui/switch";
import { axiosInstance } from "@/lib/utils";
import { toast } from "./ui/use-toast";

export interface EditableLink {
  original_url: string;
  short_url: string;
  from_date?: string | null;
  to_date?: string | null;
  is_active?: boolean;
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function EditLinkBtn({
  campaignId,
  link,
}: {
  campaignId: string;
  link: EditableLink;
}) {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(link.original_url);
  const [fromDate, setFromDate] = useState(toDateInput(link.from_date));
  const [toDate, setToDate] = useState(toDateInput(link.to_date));
  const [isActive, setIsActive] = useState(link.is_active !== false);

  const queryClient = useQueryClient();
  const updateLink = useMutation({
    mutationFn: (data: {
      original_url: string;
      from_date: string | null;
      to_date: string | null;
      is_active: boolean;
    }) =>
      axiosInstance.patch(`/url/${link.short_url}`, {
        original_url: data.original_url,
        from_date: data.from_date ? new Date(data.from_date).toISOString() : null,
        to_date: data.to_date ? new Date(data.to_date).toISOString() : null,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      toast({ title: "Link updated", description: "Your changes are live." });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaignLink", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentLinks"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Couldn't update link",
        description: "Please check the details and try again.",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateLink.mutateAsync({
      original_url: originalUrl,
      from_date: fromDate || null,
      to_date: toDate || null,
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit link"
          title="Edit link"
          className="size-9 rounded-full"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl tracking-[-0.01em]">
              Edit link
            </DialogTitle>
            <DialogDescription>
              Update the destination, schedule, or temporarily disable this
              short link.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`destination-${link.short_url}`}>
                Destination URL
              </Label>
              <Input
                id={`destination-${link.short_url}`}
                type="url"
                required
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.currentTarget.value)}
                disabled={updateLink.isPending}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`from-${link.short_url}`}>
                  Available from
                </Label>
                <Input
                  id={`from-${link.short_url}`}
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.currentTarget.value)}
                  disabled={updateLink.isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`to-${link.short_url}`}>Available until</Label>
                <Input
                  id={`to-${link.short_url}`}
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.currentTarget.value)}
                  disabled={updateLink.isPending}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3">
              <div className="grid gap-0.5">
                <Label htmlFor={`active-${link.short_url}`}>Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive links stop redirecting immediately.
                </p>
              </div>
              <Switch
                id={`active-${link.short_url}`}
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={updateLink.isPending}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={updateLink.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLink.isPending}>
              {updateLink.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
