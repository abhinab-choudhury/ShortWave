import QRCode from "react-qrcode-logo"
import { cn } from "@/lib/utils"
import type { QRConfig } from "./types"

export function QRCardPreview({
  shortLink,
  config,
  className,
}: {
  shortLink: string
  config: QRConfig
  className?: string
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
  } = config || {}

  return (
    <div
      id="qr-card"
      className={cn(
        "relative mx-auto flex w-full max-w-sm flex-col items-center gap-4 overflow-hidden rounded-xl",
        "border border-border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      {/* brand */}
      <div className="flex items-center gap-2">
        <img src="/shortwave_logo.png" alt="Shortwave logo" className="h-10 w-10 rounded" />
        <span className="text-lg font-semibold tracking-tight">Shortwave</span>
      </div>

      {/* QR area */}
      <div
        className="flex items-center justify-center rounded-lg bg-muted p-3 ring-1 ring-border"
        style={{ height: size + 16, width: size + 16 }}
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
        <h5 className="text-base font-semibold text-foreground">Scan this QR Code</h5>
        <p className="mt-1 text-sm text-muted-foreground">
          <a
            href={shortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-foreground underline-offset-4 hover:underline"
          >
            {shortLink}
          </a>
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
  )
}
