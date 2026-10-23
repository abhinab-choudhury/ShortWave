import { useState } from "react";
import { CalendarRange, Link2, Pencil } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
        from_date: data.from_date ? new Date(`${data.from_date}T00:00:00`).toISOString() : null,
        to_date: data.to_date ? new Date(`${data.to_date}T23:59:59`).toISOString() : null,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      toast({ title: "Link updated", description: "Your changes are live." });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaignLink", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentLinks"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Couldn't update link",
        description:
          error?.response?.data?.message || "Please check the details and try again.",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (fromDate && toDate && fromDate > toDate) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "Start date must be before or equal to end date.",
      });
      return;
    }
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
          className="size-9 rounded-full transition-colors hover:bg-accent"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="grid">
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Link2 className="size-4" aria-hidden="true" />
            </div>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-lg tracking-[-0.01em]">
                Edit short link
              </DialogTitle>
              <DialogDescription>
                Fine-tune where it goes, when it's available, and its status.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-5 px-6 py-5">
            <div className="grid gap-2">
              <Label htmlFor={`destination-${link.short_url}`}>Destination URL</Label>
              <Input
                id={`destination-${link.short_url}`}
                type="url"
                required
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.currentTarget.value)}
                disabled={updateLink.isPending}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Short path: <span className="font-mono">{link.short_url}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CalendarRange className="size-4 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">Availability window</p>
                  <p className="text-xs text-muted-foreground">
                    Leave blank to keep it available anytime.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor={`from-${link.short_url}`}>Start date</Label>
                  <Input
                    id={`from-${link.short_url}`}
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.currentTarget.value)}
                    disabled={updateLink.isPending}
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`to-${link.short_url}`}>End date</Label>
                  <Input
                    id={`to-${link.short_url}`}
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.currentTarget.value)}
                    disabled={updateLink.isPending}
                    className={cn("h-10", fromDate && toDate && fromDate > toDate && "border-destructive")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3.5">
              <div className="grid gap-0.5">
                <Label htmlFor={`active-${link.short_url}`}>Link status</Label>
                <p className="text-xs text-muted-foreground">
                  {isActive ? "Redirects are enabled" : "Redirects are paused"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  id={`active-${link.short_url}`}
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={updateLink.isPending}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={updateLink.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateLink.isPending} className="min-w-[120px]">
              {updateLink.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
