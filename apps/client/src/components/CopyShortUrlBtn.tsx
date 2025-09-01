import * as React from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "./ui/use-toast"

type CopyShortUrlBtnProps = {
  shortLink: string
  className?: string
  onCopy?: (value: string) => void
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
}

export function CopyShortUrlBtn({
  shortLink,
  className,
  onCopy,
  variant = "outline",
  size = "sm",
}: CopyShortUrlBtnProps) {
  const [copied, setCopied] = React.useState(false)
  const [isCopying, setIsCopying] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    if (!shortLink || isCopying) return
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(`${import.meta.env.VITE_SERVER_URL}/${shortLink}`)
      setCopied(true)
      onCopy?.(shortLink)
      toast({
        title: "Copied",
        description: "Short link copied to your clipboard.",
        duration: 1400,
      })
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1200)
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleCopy}
      disabled={!shortLink || isCopying}
      aria-busy={isCopying}
      aria-label={copied ? "Copied" : "Copy short link"}
      variant={variant}
      size={size}
      className={cn("p-2 cursor-pointer active:scale-95 active:bg-accent/40 transition", className)}
    >
      {isCopying ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
      ) : copied ? (
        <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      )}
      <span className="text-sm font-medium leading-6 sr-only">{isCopying ? "Copying..." : copied ? "Copied" : "Copy"}</span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Short link copied to clipboard" : "Copy short link"}
      </span>
    </Button>
  )
}

export default CopyShortUrlBtn
