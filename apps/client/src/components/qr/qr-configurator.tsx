import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { QRConfig } from "./types"

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
  >
  onChange: (partial: Partial<QRConfig>) => void
}) {
  const v = values
  const set = (partial: Partial<QRConfig>) => onChange(partial)

  return (
    <div className="grid gap-2">
      {/* style */}
      <div className="grid gap-2">
        <Label htmlFor="qr-style">Style</Label>
        <Select value={v.qrStyle} onValueChange={(val: "dots" | "squares" | "fluid") => set({ qrStyle: val })}>
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

      {/* colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fg-color">Foreground</Label>
          <div className="flex items-center gap-2">
            <Input
              id="fg-color"
              type="color"
              value={v.fgColor}
              onChange={(e) => set({ fgColor: e.target.value })}
              className="h-9 w-12 p-1"
              aria-label="Foreground color"
            />
            <Input
              value={v.fgColor}
              onChange={(e) => set({ fgColor: e.target.value })}
              className="h-9"
              aria-label="Foreground hex"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bg-color">Background</Label>
          <div className="flex items-center gap-2">
            <Input
              id="bg-color"
              type="color"
              value={v.bgColor}
              onChange={(e) => set({ bgColor: e.target.value })}
              className="h-9 w-12 p-1"
              aria-label="Background color"
            />
            <Input
              value={v.bgColor}
              onChange={(e) => set({ bgColor: e.target.value })}
              className="h-9"
              aria-label="Background hex"
            />
          </div>
        </div>
      </div>

      {/* size */}
      <div className="grid gap-2">
        <Label>Size ({v.size}px)</Label>
        <Slider value={[v.size]} min={128} max={288} step={8} onValueChange={([val]) => set({ size: val })} />
      </div>

      {/* quiet zone + eye radius */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Quiet zone ({v.quietZone}px)</Label>
          <Slider value={[v.quietZone]} min={0} max={24} step={1} onValueChange={([val]) => set({ quietZone: val })} />
        </div>
        <div className="grid gap-2">
          <Label>Eye radius ({v.eyeRadius as number}px)</Label>
          <Slider
            value={[v.eyeRadius as number]}
            min={0}
            max={10}
            step={1}
            onValueChange={([val]) => set({ eyeRadius: val })}
          />
        </div>
      </div>

      {/* error correction */}
      <div className="grid gap-2">
        <Label htmlFor="ec-level">Error correction</Label>
        <Select value={v.ecLevel} onValueChange={(val: "L" | "M" | "Q" | "H") => set({ ecLevel: val })}>
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

      {/* center logo */}
      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <div className="grid gap-1">
          <Label htmlFor="center-logo">Center logo</Label>
          <p className="text-xs text-muted-foreground">Show your logo in the middle of the QR.</p>
        </div>
        <Switch id="center-logo" checked={!!v.showLogo} onCheckedChange={(checked) => set({ showLogo: checked })} />
      </div>

      {v.showLogo && (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              type="url"
              value={v.logoImage}
              onChange={(e) => set({ logoImage: e.target.value })}
              placeholder="/shortwave_logo.png"
            />
          </div>
          <div className="grid gap-2">
            <Label>Logo size ({v.logoWidth}px)</Label>
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
  )
}
