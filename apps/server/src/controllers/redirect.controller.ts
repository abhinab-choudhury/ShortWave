import { NextFunction, Request, Response } from "express";
import { waitUntil } from "@vercel/functions";
import { getLongUrlHandler } from "../services/url.services";
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
    const longUrl = await getLongUrlHandler(shortCode.toString());
    if (!longUrl) {
      return next(new ApiError(404, "Short URL Not Found"));
    }

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
    await clickWrite;
  } catch (error: any) {
    console.error("[Redirect Error]", error);
    return next(new ApiError(500, "Internal Server Error", error));
  }
}
