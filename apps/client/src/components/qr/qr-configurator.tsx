import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { QRConfig } from "./types";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </Label>
  );
}

export function QRConfigurator({
  values,
  onChange,
}: {
  values: Required<
    Pick<
      QRConfig,
      | "qrStyle"
      | "fgColor"
      | "bgColor"
      | "size"
      | "quietZone"
      | "eyeRadius"
      | "ecLevel"
      | "showLogo"
      | "logoImage"
      | "logoWidth"
    >
  >;
  onChange: (partial: Partial<QRConfig>) => void;
}) {
  const v = values;
  const set = (partial: Partial<QRConfig>) => onChange(partial);

  return (
    <div className="grid gap-5">
      {/* colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2 min-w-0">
          <SectionLabel>Foreground</SectionLabel>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              id="fg-color"
              type="color"
              value={v.fgColor}
              onChange={(e) => set({ fgColor: e.target.value })}
              className="h-9 w-10 shrink-0 p-1"
              aria-label="Foreground color"
            />
            <Input
              value={v.fgColor}
              onChange={(e) => set({ fgColor: e.target.value })}
              className="h-9 min-w-0"
              aria-label="Foreground hex"
            />
          </div>
        </div>
        <div className="grid gap-2 min-w-0">
          <SectionLabel>Background</SectionLabel>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              id="bg-color"
              type="color"
              value={v.bgColor}
              onChange={(e) => set({ bgColor: e.target.value })}
              className="h-9 w-10 shrink-0 p-1"
              aria-label="Background color"
            />
            <Input
              value={v.bgColor}
              onChange={(e) => set({ bgColor: e.target.value })}
              className="h-9 min-w-0"
              aria-label="Background hex"
            />
          </div>
        </div>
      </div>

      {/* style */}
      <div className="grid gap-2">
        <SectionLabel>Style</SectionLabel>
        <Select
          value={v.qrStyle}
          onValueChange={(val: "dots" | "squares" | "fluid") =>
            set({ qrStyle: val })
          }
        >
          <SelectTrigger id="qr-style" className="w-full shadow-2xs">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dots">Dots</SelectItem>
            <SelectItem value="squares">Squares</SelectItem>
            <SelectItem value="fluid">Fluid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* size + error correction */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <SectionLabel>Size ({v.size}px)</SectionLabel>
          <Slider
            value={[v.size]}
            min={128}
            max={288}
            step={8}
            onValueChange={([val]) => set({ size: val })}
          />
        </div>
        <div className="grid gap-2">
          <SectionLabel>Error correction</SectionLabel>
          <Select
            value={v.ecLevel}
            onValueChange={(val: "L" | "M" | "Q" | "H") => set({ ecLevel: val })}
          >
            <SelectTrigger id="ec-level" className="w-full shadow-2xs">
              <SelectValue placeholder="Select EC level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">L (7%)</SelectItem>
              <SelectItem value="M">M (15%)</SelectItem>
              <SelectItem value="Q">Q (25%)</SelectItem>
              <SelectItem value="H">H (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* quiet zone + eye radius */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <SectionLabel>Quiet zone ({v.quietZone}px)</SectionLabel>
          <Slider
            value={[v.quietZone]}
            min={0}
            max={24}
            step={1}
            onValueChange={([val]) => set({ quietZone: val })}
          />
        </div>
        <div className="grid gap-2">
          <SectionLabel>Eye radius ({v.eyeRadius as number}px)</SectionLabel>
          <Slider
            value={[v.eyeRadius as number]}
            min={0}
            max={10}
            step={1}
            onValueChange={([val]) => set({ eyeRadius: val })}
          />
        </div>
      </div>

      {/* center logo */}
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-0.5">
          <Label htmlFor="center-logo" className="text-sm font-medium">
            Center logo
          </Label>
          <p className="text-xs text-muted-foreground">
            Place the brand mark in the QR.
          </p>
        </div>
        <Switch
          id="center-logo"
          checked={!!v.showLogo}
          onCheckedChange={(checked) => set({ showLogo: checked })}
        />
      </div>

      {v.showLogo && (
        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <SectionLabel>Logo URL</SectionLabel>
            <Input
              id="logo-url"
              type="url"
              value={v.logoImage}
              onChange={(e) => set({ logoImage: e.target.value })}
              placeholder="/shortwave_logo.png"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <SectionLabel>Logo size ({v.logoWidth}px)</SectionLabel>
            <Slider
              value={[v.logoWidth]}
              min={16}
              max={72}
              step={2}
              onValueChange={([val]) => set({ logoWidth: val, logoHeight: val })}
            />
          </div>
        </div>
      )}
    </div>
  );
}