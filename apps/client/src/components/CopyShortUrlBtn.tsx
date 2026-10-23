import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import { copyText, getShortLinkUrl, hapticTap } from "@/lib/platform";

type CopyShortUrlBtnProps = {
  shortLink: string;
  className?: string;
  onCopy?: (value: string) => void;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export function CopyShortUrlBtn({
  shortLink,
  className,
  onCopy,
  variant = "ghost",
  size = "icon",
}: CopyShortUrlBtnProps) {
  const [copied, setCopied] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!shortLink || isCopying) return;
    setIsCopying(true);
    try {
      const value = getShortLinkUrl(shortLink);
      await copyText(value);
      await hapticTap();
      setCopied(true);
      onCopy?.(shortLink);
      toast({
        title: "Copied",
        description: "Short link copied to clipboard.",
        duration: 1400,
      });
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Try copying the link manually.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      disabled={!shortLink || isCopying}
      aria-busy={isCopying}
      aria-label={copied ? "Copied short link" : "Copy short link"}
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
    >
      {isCopying ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export default CopyShortUrlBtn;
