import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qrcode-logo";
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
import html2canvas from "html2canvas-pro";

export function QRCard({ shortLink }: { shortLink: string }) {
  return (
    <div className="relative m-6 flex w-full max-w-xs mx-auto flex-col items-center overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#ffffff] dark:border-[#030712] dark:bg-[#101828] shadow-lg p-6">
      <div className="flex flex-col align-middle items-center justify-center mb-3">
        <img src="/shortwave_logo.png" className="w-10 h-10" />
        <span className="text-lg font-bold">Shortwave</span>
      </div>
      <div className="flex h-52 w-52 items-center justify-center rounded-xl bg-[#f9fafb] p-4">
        <QRCode
          value={shortLink}
          size={180}
          logoImage="https://short-wave.vercel.app/shortwave_logo.png"
          logoWidth={40}
          logoHeight={40}
          logoOpacity={1}
          removeQrCodeBehindLogo={true}
          quietZone={10}
          qrStyle="dots"
          eyeRadius={8}
          fgColor="#000000"
          bgColor="#ffffff"
          id="shortlink-qr"
        />
      </div>

      <div className="mt-6 w-full text-center">
        <h5 className="text-lg font-semibold text-[#1d293d] dark:text-[#ffffff]">
          Scan this QR Code
        </h5>
        <p className="mt-1 text-sm text-[#62748e]">
          <a
            href={shortLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-light text-[#000000] dark:text-[#ffffff]"
          >
            {shortLink}
          </a>
        </p>
      </div>

      <span
        className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full
                   text-[#0b4f4a] dark:text-[#cbfbf1]
                   bg-[#96f7e4] dark:bg-[#14b8a633]
                   border border-[#46ecd5] dark:border-[#0f766e80]
                   backdrop-blur-md shadow-sm"
      >
        QR
      </span>
    </div>
  );
}

export function QRCardBtn(props: { shortLink: string }) {
  const { shortLink } = props;
  const handleDownload = async () => {
    const element = document.getElementById("qr-card")!;
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio * 2,
      useCORS: true,
      backgroundColor: null,
    });

    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = "qr-card.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="p-2 cursor-pointer active:scale-95 active:bg-accent/40 transition"
        >
          <QrCode className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Card</DialogTitle>
          <DialogDescription>
            Anyone who has this QR will be able to view this.
          </DialogDescription>
        </DialogHeader>

        <div id="qr-card" className="w-full mx-auto">
          <QRCard
            shortLink={`${import.meta.env.VITE_SERVER_URL}/${shortLink}`}
          />
        </div>

        <DialogFooter className="sm:justify-start gap-2">
          <DialogClose asChild>
            <Button type="button" variant="destructive" className="text-white">
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={handleDownload}
            variant={"secondary"}
            className="flex gap-2 align-middle items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
