import { Download, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMemo, useState } from "react"
import { QRCardPreview } from "./qr/qr-preview"
import { QRConfigurator } from "./qr/qr-configurator"
import { downloadNodeAsPng } from "./qr/qr-download"
import type { QRConfig } from "./qr/types"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function QRCard({ shortLink, config }: { shortLink: string; config?: QRConfig }) {
  return <QRCardPreview shortLink={shortLink} config={config ?? {}} />
}

export function QRCardBtn(props: { shortLink: string }) {
  const { shortLink } = props

  const [qrStyle, setQrStyle] = useState<"dots" | "squares" | "fluid">("dots")
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [size, setSize] = useState(192)
  const [quietZone, setQuietZone] = useState(8)
  const [eyeRadius, setEyeRadius] = useState(8)
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M")

  const [showLogo, setShowLogo] = useState(true)
  const [logoUrl, setLogoUrl] = useState("/shortwave_logo.png")
  const [logoSize, setLogoSize] = useState(40)
  const [exportBgWhite, setExportBgWhite] = useState(true)

  const config = useMemo(
    () => ({
      size,
      qrStyle,
      fgColor,
      bgColor,
      quietZone,
      eyeRadius,
      ecLevel,
      showLogo,
      logoImage: logoUrl,
      logoWidth: logoSize,
      logoHeight: logoSize,
      removeQrCodeBehindLogo: true,
    }),
    [size, qrStyle, fgColor, bgColor, quietZone, eyeRadius, ecLevel, showLogo, logoUrl, logoSize],
  )

  const handleDownload = async () => {
    const element = document.getElementById("qr-card")
    if (!element) return
    await downloadNodeAsPng(element, {
      filename: "qr-card.png",
      backgroundColor: exportBgWhite ? "#ffffff" : null,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent px-2 py-2 transition active:scale-95"
          aria-label="Open QR card"
        >
          <QrCode className="h-4 w-4 text-muted-foreground" aria-hidden={true} />
          <span className="ml-2 hidden text-sm md:inline sr-only">QR</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[95vw] overflow-y-auto sm:max-w-6xl sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="tracking-tight">QR Card</DialogTitle>
          <DialogDescription>Customize the QR code and download a high-quality image.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[380px,1fr]">
          <div className="order-2 rounded-lg border border-border p-4 md:order-2 md:p-5">
            <QRConfigurator
              values={{
                qrStyle,
                fgColor,
                bgColor,
                size,
                quietZone,
                eyeRadius,
                ecLevel,
                showLogo,
                logoImage: logoUrl,
                logoWidth: logoSize,
              }}
              onChange={(partial) => {
                if (partial.qrStyle) setQrStyle(partial.qrStyle)
                if (partial.fgColor) setFgColor(partial.fgColor)
                if (partial.bgColor) setBgColor(partial.bgColor)
                if (partial.size !== undefined) setSize(partial.size)
                if (partial.quietZone !== undefined) setQuietZone(partial.quietZone)
                if (partial.eyeRadius !== undefined) setEyeRadius(partial.eyeRadius as number)
                if (partial.ecLevel) setEcLevel(partial.ecLevel)
                if (partial.showLogo !== undefined) setShowLogo(partial.showLogo)
                if (partial.logoImage !== undefined) setLogoUrl(partial.logoImage)
                if (partial.logoWidth !== undefined) setLogoSize(partial.logoWidth)
                if (partial.logoHeight !== undefined) setLogoSize(partial.logoHeight)
              }}
            />

            <div className="mt-4 flex items-center justify-between rounded-md border border-border p-3">
              <div className="grid gap-1">
                <Label htmlFor="export-bg" className="text-sm font-medium">
                  Export background
                </Label>
                <p className="text-xs text-muted-foreground">Use a white background for a cleaner PNG.</p>
              </div>
              <Switch
                id="export-bg"
                checked={exportBgWhite}
                onCheckedChange={setExportBgWhite}
                aria-label="Toggle white background in export"
              />
            </div>
          </div>

          <div className="order-1 flex items-start justify-center md:order-1">
            <div className="w-full max-w-md self-start md:sticky md:top-4 md:max-w-lg lg:max-w-xl">
              <QRCardPreview shortLink={`${import.meta.env.VITE_SERVER_URL}/${shortLink}`} config={config} />
              <p className="mt-3 text-center text-xs text-muted-foreground">Preview updates live</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>

          <Button onClick={handleDownload} variant="default" className="gap-2" aria-label="Download QR card as PNG">
            <Download className="h-4 w-4" aria-hidden={true} />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
