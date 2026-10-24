import { NextFunction, Request, Response } from "express";
import { waitUntil } from "@vercel/functions";
import { getRedirectTarget } from "../services/url.services";
import ApiError from "../utils/api-error-handling";
import { recordClickInBuffer } from "../utils/redis-helpers";

/**
 * @desc   Redirect handler with analytics
 * @route  GET /:shortCode
 */
export async function handleRedirect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.method === "POST") {
    return next(new ApiError(405, "POST method not allowed"));
  }

  const shortCode = req.params.shortCode as string;
  if (!shortCode) {
    return next(new ApiError(400, "ShortCode Not Provided"));
  }

  try {
    const target = await getRedirectTarget(shortCode.toString());
    if (!target.ok) {
      const messages: Record<typeof target.reason, string> = {
        not_found: "Short URL Not Found",
        inactive: "This short link is currently inactive",
        not_started: "This short link is not active yet",
        expired: "This short link has expired",
      };
      return next(new ApiError(target.reason === "not_found" ? 404 : 410, messages[target.reason]));
    }

    const longUrl = target.url;
    console.log(`[Redirect] ${shortCode} → ${longUrl}`);

    // 302 (not 301): the browser has to come back for every visit, otherwise
    // the clicks would be cached and the analytics would stay empty.
    res.redirect(302, longUrl);

    // Count the click only after the response is on the wire: the analytics
    // write must never add latency to the redirect. waitUntil keeps the
    // function alive until the write is done.
    const clickWrite = recordClickInBuffer(req, shortCode).catch((error) =>
      console.error("[Click] failed to record:", error),
    );
    waitUntil(clickWrite);
  } catch (error: any) {
    console.error("[Redirect Error]", error);
    return next(new ApiError(500, "Internal Server Error", error));
  }
}
