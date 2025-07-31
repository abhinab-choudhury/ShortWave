import { UAParser } from "ua-parser-js";

export function parseUserAgent(userAgent: string) {
  const parse = new UAParser(userAgent);
  const result = parse.getResult();

  const device = result.device || "Unknown";
  const os = result.os || "Unknown";
  const browser = result.browser || "Unknown";

  return { device, os, browser };
}
