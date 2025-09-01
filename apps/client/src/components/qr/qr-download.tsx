import html2canvas from "html2canvas-pro"

export async function downloadNodeAsPng(
  node: HTMLElement,
  opts?: { filename?: string; backgroundColor?: string | null; scale?: number },
) {
  const {
    filename = "qr-card.png",
    backgroundColor = "#ffffff",
    scale = Math.max(2, window.devicePixelRatio || 1),
  } = opts || {}
  const canvas = await html2canvas(node, {
    scale,
    useCORS: true,
    backgroundColor,
  })
  const dataUrl = canvas.toDataURL("image/png", 1.0)
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}
