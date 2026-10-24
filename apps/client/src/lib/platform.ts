import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { Clipboard } from "@capacitor/clipboard";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Share } from "@capacitor/share";

export const isNative = () => Capacitor.isNativePlatform();

export async function hapticTap() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptics are best-effort.
  }
}

export async function hapticSuccess() {
  if (!isNative()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Haptics are best-effort.
  }
}

export async function copyText(value: string) {
  if (isNative()) {
    await Clipboard.write({ string: value });
  } else {
    await navigator.clipboard.writeText(value);
  }
  await hapticTap();
}

export async function openExternal(url: string) {
  if (isNative()) {
    await Browser.open({ url });
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function shareOrDownloadDataUrl(
  dataUrl: string,
  filename: string,
) {
  if (isNative()) {
    const base64 = dataUrl.split(",")[1];
    if (!base64) throw new Error("Unable to read the generated image.");

    const saved = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
    });

    await Share.share({
      title: "Shortwave QR code",
      text: "Scan this QR code to open the short link.",
      url: saved.uri,
      dialogTitle: "Share QR code",
    });
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

export function getShortLinkUrl(shortUrl: string) {
  const baseUrl = (import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");
  return `${baseUrl}/${shortUrl.replace(/^\//, "")}`;
}
