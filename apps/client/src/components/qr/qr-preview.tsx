import QRCode from "react-qrcode-logo";
import { cn } from "@/lib/utils";
import type { QRConfig } from "./types";

export function QRCardPreview({
  shortLink,
  config,
  className,
}: {
  shortLink: string;
  config: QRConfig;
  className?: string;
}) {
  const {
    size = 192,
    qrStyle = "dots",
    fgColor = "#000000",
    bgColor = "#ffffff",
    quietZone = 8,
    eyeRadius = 8,
    ecLevel = "M",
    showLogo = true,
    logoImage = "/shortwave_logo.png",
    logoWidth = 40,
    logoHeight = 40,
    removeQrCodeBehindLogo = true,
  } = config || {};

  return (
    <div
      id="qr-card"
      className={cn(
        "relative mx-auto flex w-full min-w-0 max-w-sm flex-col items-center gap-4 overflow-hidden rounded-[1.75rem]",
        "border border-border bg-[radial-gradient(circle_at_top,rgba(31,127,92,0.08),transparent_55%),var(--card)] p-5 text-card-foreground shadow-sm sm:p-7 sm:gap-5",
        className,
      )}
    >
      {/* brand */}
      <div className="flex items-center gap-2.5">
        <img
          src="/shortwave_logo.png"
          alt="Shortwave logo"
          className="size-11 rounded-xl shadow-xs"
        />
        <div className="text-left">
          <p className="text-base font-semibold tracking-[-0.01em]">Shortwave</p>
          <p className="text-xs text-muted-foreground">Scan to open</p>
        </div>
      </div>

      {/* QR area */}
      <div
        className="flex min-w-0 max-w-full items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-background p-4 shadow-inner"
        style={{ height: size + 32, width: size + 32 }}
      >
        <QRCode
          value={shortLink}
          size={size}
          {...(showLogo
            ? {
                logoImage,
                logoWidth,
                logoHeight,
                removeQrCodeBehindLogo: removeQrCodeBehindLogo,
                logoOpacity: 1,
              }
            : {})}
          quietZone={quietZone}
          qrStyle={qrStyle}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          eyeRadius={eyeRadius as any}
          fgColor={fgColor}
          bgColor={bgColor}
          ecLevel={ecLevel}
          id="shortlink-qr"
        />
      </div>

      {/* copy/link info */}
      <div className="w-full text-center">
        <p className="text-sm font-medium text-foreground">Scan to open this link</p>
        <p className="mt-1 max-w-[18rem] break-all text-xs text-muted-foreground">
          {shortLink}
        </p>
      </div>

      {/* subtle badge */}
      <span
        className="absolute right-3 top-3 rounded-full border border-teal-600/20 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 shadow-sm
                   dark:bg-teal-900/20 dark:text-teal-300"
      >
        QR
      </span>
    </div>
  );
}
