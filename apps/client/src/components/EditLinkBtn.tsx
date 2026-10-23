import { useState } from "react";
import { CalendarRange, Link2, Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type DateRange } from "react-day-picker";
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
import { LinkDateRangePicker } from "./LinkDateRangePicker";

export interface EditableLink {
  original_url: string;
  short_url: string;
  from_date?: string | null;
  to_date?: string | null;
  is_active?: boolean;
}

function toDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    link.from_date || link.to_date
      ? { from: toDate(link.from_date), to: toDate(link.to_date) }
      : undefined,
  );
  const [isActive, setIsActive] = useState(link.is_active !== false);

  const queryClient = useQueryClient();
  const updateLink = useMutation({
    mutationFn: (data: {
      original_url: string;
      from_date: Date | null;
      to_date: Date | null;
      is_active: boolean;
    }) =>
      axiosInstance.patch(`/url/${link.short_url}`, {
        original_url: data.original_url,
        from_date: data.from_date ? new Date(data.from_date.setHours(0, 0, 0, 0)).toISOString() : null,
        to_date: data.to_date ? new Date(data.to_date.setHours(23, 59, 59, 999)).toISOString() : null,
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
    if (dateRange?.from && dateRange?.to && dateRange.from > dateRange.to) {
      toast({
        variant: "destructive",
        title: "Invalid date range",
        description: "Start date must be before or equal to end date.",
      });
      return;
    }
    await updateLink.mutateAsync({
      original_url: originalUrl,
      from_date: dateRange?.from ? new Date(dateRange.from) : null,
      to_date: dateRange?.to ? new Date(dateRange.to) : null,
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
              <LinkDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                disabled={updateLink.isPending}
              />
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
