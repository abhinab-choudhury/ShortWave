import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { QRCardPreview } from "./qr/qr-preview";
import { QRConfigurator } from "./qr/qr-configurator";
import { downloadNodeAsPng } from "./qr/qr-download";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getShortLinkUrl, hapticTap, shareOrDownloadDataUrl } from "@/lib/platform";
import { isNative } from "@/lib/platform";
import html2canvas from "html2canvas-pro";

export function QRCardBtn(props: { shortLink: string }) {
  const { shortLink } = props;
  const fullLink = getShortLinkUrl(shortLink);

  const [qrStyle, setQrStyle] = useState<"dots" | "squares" | "fluid">("dots");
  const [fgColor, setFgColor] = useState("#1f7f5c");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(224);
  const [quietZone, setQuietZone] = useState(10);
  const [eyeRadius, setEyeRadius] = useState(10);
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");

  const [showLogo, setShowLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState("/shortwave_logo.png");
  const [logoSize, setLogoSize] = useState(44);
  const [exportBgWhite, setExportBgWhite] = useState(true);

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
  );

  const handleDownload = async () => {
    await hapticTap();
    const element = document.getElementById("qr-card");
    if (!element) return;

    if (isNative()) {
      const canvas = await html2canvas(element, {
        scale: Math.max(3, window.devicePixelRatio || 1),
        useCORS: true,
        backgroundColor: exportBgWhite ? "#ffffff" : null,
      });
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      await shareOrDownloadDataUrl(dataUrl, `shortwave-${shortLink}.png`);
      return;
    }

    await downloadNodeAsPng(element, {
      filename: `shortwave-${shortLink}.png`,
      backgroundColor: exportBgWhite ? "#ffffff" : null,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Open QR card"
        >
          <QrCode className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95dvh] overflow-y-auto p-0 sm:max-w-5xl">
        <DialogHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle>QR card</DialogTitle>
          <DialogDescription>
            Tweak the look, then download or share the card.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 px-5 pb-2 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="md:sticky md:top-6 md:self-start">
            <QRCardPreview shortLink={fullLink} config={config} />
          </div>

          <div className="space-y-6">
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
                if (partial.qrStyle) setQrStyle(partial.qrStyle);
                if (partial.fgColor) setFgColor(partial.fgColor);
                if (partial.bgColor) setBgColor(partial.bgColor);
                if (partial.size !== undefined) setSize(partial.size);
                if (partial.quietZone !== undefined) setQuietZone(partial.quietZone);
                if (partial.eyeRadius !== undefined) setEyeRadius(partial.eyeRadius as number);
                if (partial.ecLevel) setEcLevel(partial.ecLevel);
                if (partial.showLogo !== undefined) setShowLogo(partial.showLogo);
                if (partial.logoImage !== undefined) setLogoUrl(partial.logoImage);
                if (partial.logoWidth !== undefined) setLogoSize(partial.logoWidth);
                if (partial.logoHeight !== undefined) setLogoSize(partial.logoHeight);
              }}
            />

            <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
              <div className="space-y-0.5">
                <Label htmlFor="export-bg">White background</Label>
                <p className="text-sm text-muted-foreground">
                  Cleaner PNG for documents and slides.
                </p>
              </div>
              <Switch
                id="export-bg"
                checked={exportBgWhite}
                onCheckedChange={setExportBgWhite}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border px-5 py-4 sm:px-6">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="size-4" aria-hidden="true" />
            {isNative() ? "Share or save" : "Download PNG"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QRCardPreview } from "./qr/qr-preview";
