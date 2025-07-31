import { Request } from "express";
import { getClientIp } from "request-ip";
import { parseUserAgent } from "../utils/parse-ua";
import { getClickById } from "./click.service";

export async function handleAnalytics(
  req: Request,
  urlId: string,
  userId: string,
): Promise<void> {
  const ip = getClientIp(req) || "unknown-ip";

  // Parse device info
  const { device, os, browser } = parseUserAgent(
    req.headers["user-agent"] || "",
  );

  let click = await getClickById(urlId);
  if (!click) {
    // const clickLogId = await createClickLog();
  }
}
