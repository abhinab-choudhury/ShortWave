export type QRConfig = {
  size?: number
  qrStyle?: "dots" | "squares" | "fluid"
  fgColor?: string
  bgColor?: string
  quietZone?: number
  eyeRadius?: number | number[]
  ecLevel?: "L" | "M" | "Q" | "H"
  showLogo?: boolean
  logoImage?: string
  logoWidth?: number
  logoHeight?: number
  removeQrCodeBehindLogo?: boolean
}
