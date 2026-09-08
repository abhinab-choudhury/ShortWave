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
import type { QRConfig } from "./qr/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function QRCard({
  shortLink,
  config,
}: {
  shortLink: string;
  config?: QRConfig;
}) {
  return <QRCardPreview shortLink={shortLink} config={config ?? {}} />;
}

export function QRCardBtn(props: { shortLink: string }) {
  const { shortLink } = props;

  const [qrStyle, setQrStyle] = useState<"dots" | "squares" | "fluid">("dots");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(192);
  const [quietZone, setQuietZone] = useState(8);
  const [eyeRadius, setEyeRadius] = useState(8);
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");

  const [showLogo, setShowLogo] = useState(true);
  const [logoUrl, setLogoUrl] = useState("/shortwave_logo.png");
  const [logoSize, setLogoSize] = useState(40);
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
    [
      size,
      qrStyle,
      fgColor,
      bgColor,
      quietZone,
      eyeRadius,
      ecLevel,
      showLogo,
      logoUrl,
      logoSize,
    ],
  );

  const handleDownload = async () => {
    const element = document.getElementById("qr-card");
    if (!element) return;
    await downloadNodeAsPng(element, {
      filename: "qr-card.png",
      backgroundColor: exportBgWhite ? "#ffffff" : null,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent px-2 py-2 transition active:scale-95"
          aria-label="Open QR card"
        >
          <QrCode
            className="h-4 w-4 text-muted-foreground"
            aria-hidden={true}
          />
          <span className="ml-2 hidden text-sm md:inline sr-only">QR</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-x-hidden overflow-y-auto p-0 sm:max-h-[90vh] sm:max-w-6xl sm:p-6 max-sm:inset-x-0 max-sm:top-0 max-sm:h-dvh max-sm:w-full max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none">
        <DialogHeader className="px-4 pr-12 pt-4 sm:px-0 sm:pt-0">
          <DialogTitle className="tracking-tight">QR Card</DialogTitle>
          <DialogDescription>
            Customize the QR code and download a high-quality image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 px-4 pt-4 pb-0 sm:px-0 sm:pt-3 sm:pb-0 md:grid-cols-2 md:gap-6">
          <div className="order-1 md:sticky md:top-0 md:order-2 md:self-start">
            <QRCardPreview
              shortLink={`${import.meta.env.VITE_SERVER_URL}/${shortLink}`}
              config={config}
            />
          </div>

          <div className="order-2 md:order-1">
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
                if (partial.quietZone !== undefined)
                  setQuietZone(partial.quietZone);
                if (partial.eyeRadius !== undefined)
                  setEyeRadius(partial.eyeRadius as number);
                if (partial.ecLevel) setEcLevel(partial.ecLevel);
                if (partial.showLogo !== undefined)
                  setShowLogo(partial.showLogo);
                if (partial.logoImage !== undefined)
                  setLogoUrl(partial.logoImage);
                if (partial.logoWidth !== undefined)
                  setLogoSize(partial.logoWidth);
                if (partial.logoHeight !== undefined)
                  setLogoSize(partial.logoHeight);
              }}
            />

            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
              <div className="grid gap-0.5">
                <Label htmlFor="export-bg" className="text-sm font-medium">
                  White background
                </Label>
                <p className="text-xs text-muted-foreground">
                  Cleaner PNG when exported.
                </p>
              </div>
              <Switch
                id="export-bg"
                checked={exportBgWhite}
                onCheckedChange={setExportBgWhite}
                aria-label="Toggle white background in export"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 z-10 gap-2 border-t border-border bg-white px-4 py-3 dark:bg-gray-950 sm:px-0 sm:py-4 max-sm:flex-row max-sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={handleDownload}
            variant="default"
            className="gap-2"
            aria-label="Download QR card as PNG"
          >
            <Download className="h-4 w-4" aria-hidden={true} />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
